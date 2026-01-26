"use strict"
import * as types from "./_types.js"
/**
 * SimpleRouter - client-side router
 */
export class SimpleRouter {
    constructor() {
        /**
         * @type {!Array<types.Route>}
         */
        this.routes = []
        /**
         * @type {(types.RTNode|undefined)}
         */
        this.legacyRoot = !!globalThis['URLPattern']
            ? undefined
            : { c: new Map(), h: null, p: null }

        // /**
        //  * @type {EventTarget}
        //  */
        // this._events = new globalThis['EventTarget']()

    }

    /**
     * @param {string} path 
     * @param {Function} handler 
     */
    add(path, handler) {
        if (!this.legacyRoot) {
            this.routes.push({
                // @ts-ignore
                pattern: new globalThis['URLPattern']({ pathname: path }),
                handler,
                score: SimpleRouter._score(path)
            })
            // Re-sort after each add (small apps ok; large → sort once after bulk add)
            this.routes.sort((a, b) =>
                a.score[0] - b.score[0] || a.score[1] - b.score[1]
            )
        } else {
            let node = this.legacyRoot
            for (const segment of path.split('/').filter(Boolean)) {
                const isParam = segment.startsWith(':')
                const key = isParam ? '*' : segment
                if (!node.c.has(key)) {
                    node.c.set(key, {
                        c: new Map(),
                        h: null,
                        p: isParam ? segment.slice(1) : null
                    });
                }
                node = /** @type {types.RTNode} */(node.c.get(key))
            }
            node.h = handler
        }
    }

    /**
     * @param {string} path
     * @returns {Promise}
     */
    async navigate(path) {
        const nav = globalThis['navigation'];
        if (nav?.navigate) {
            return nav.navigate(path).finished
        }

        const match = this._match(path)
        if (!match) return

        history.pushState(null, '', path)
        await match.handler(match.params, match.url)
    }

    init() {
        const nav = globalThis['navigation']
        if (nav?.navigate) {
            // Navigation API mode
            nav.addEventListener('navigate', e => {
                if (!e['canIntercept'] || e['hashChange'] || e['downloadRequest']) return

                const match = this._match(e['destination']['url'])
                if (!match) return

                e['intercept']({
                    ['handler']: async () => {
                        try {
                            await match.handler(match.params, match.url)

                            // this._events.dispatchEvent(new CustomEvent('navigated', { detail: match }))

                        } catch (err) {
                            // this._events.dispatchEvent(new CustomEvent('routeerror', {
                            //     // @ts-ignore
                            //     detail: { message: err?.message || String(err) }
                            // }))
                            // @ts-ignore
                            console.error(err)
                        }
                    }
                })
            })
        } else {
            // Legacy mode: safe link interception + popstate
            document.addEventListener('click', e => {
                if (e.defaultPrevented || e.button !== 0) return

                // TODO: e.target.closest has problems in Shadow DOM, use e.composedPath() instead ???
                // @ts-ignore
                const a = e.target.closest('a')
                if (!a) return

                // Skip modified clicks, downloads, external / special rel links
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
                    a.target || a.hasAttribute('download')) return

                const rel = (a.rel || '').split(/\s+/)
                if (rel.includes('external') || rel.includes('noopener') || rel.includes('noreferrer')) {
                    return
                }

                let u
                try {
                    u = new URL(a.href, location.href);
                } catch {
                    return
                }

                if (u.origin !== location.origin) return

                e.preventDefault()
                this.navigate(u.pathname + u.search + u.hash)
            })

            window.addEventListener('popstate', () => {
                const match = this._match(location.href)
                if (match) match.handler(match.params, match.url)
            })
        }

        // Handle initial route
        const initial = this._match(location.href);
        if (initial) initial.handler(initial.params, initial.url)
    }

    /**
     * @param {string} raw
     * @returns {(types.Match|null)}
     */
    _match(raw) {
        let url
        try {
            url = new URL(raw, location.origin)
        } catch {
            return null // invalid URL
        }

        // Basic DoS protection
        if (url.pathname.length > 1024) return null

        const params = Object.create(null)

        if (!this.legacyRoot) {
            for (const r of this.routes) {
                const match = r.pattern.exec(url)
                if (!match) continue

                try {
                    for (const [key, value] of Object.entries(match.pathname.groups)) {
                        if (value != null) {
                            params[key] = decodeURIComponent(value)
                        }
                    }
                } catch {
                    return null // malformed percent-encoding
                }

                return { handler: r.handler, params, url }
            }
            return null
        }

        let node = this.legacyRoot;
        for (const seg of url.pathname.split('/').filter(Boolean)) {
            if (seg.length > 128) return null;

            if (node.c.has(seg)) {
                node = /** @type {types.RTNode} */(node.c.get(seg))
            } else if (node.c.has('*')) {
                node = /** @type {types.RTNode} */(node.c.get('*'))
                try {
                    // @ts-ignore
                    params[node.p] = decodeURIComponent(seg)
                } catch {
                    return null
                }
            } else {
                return null
            }
        }

        return node.h ? { handler: node.h, params, url } : null
    }

    /**
     * Lower score = higher precedence: fewer params, then longer path
     * @param {string} path
     * @returns {Array<number>}
     */
    static _score(path) {
        const parts = path.split('/').filter(Boolean)
        let params = 0
        for (const p of parts) if (p.startsWith(':')) params++
        return [params, -parts.length]
    }
}
