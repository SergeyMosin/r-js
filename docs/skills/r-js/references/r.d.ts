export type WatchCallback<V = any> = (value: V) => void;
export type ReadyCallback<S extends Record<string, any> = Record<string, any>> = (
    state: S,
    $r: RContext
) => void;

export interface RContext {
    /**
     * Emit a custom component event
     */
    emit: <P = any>(name: string, payload?: P, bubbles?: boolean) => void;

    /**
     * Watch a reactive expression (e.g. `"{{someVar}}"` or `"{{ [a, b] }}"`)
     * @returns `true` if watch was added, `false` if invalid or already watched
     */
    watch: <V = any>(
        expr: string,
        callback: WatchCallback<V>,
        immediate?: boolean
    ) => boolean;

    /**
     * Remove a previously registered watcher
     * @returns `true` if removed, `false` if not found or already removed
     */
    unwatch: <V = any>(expr: string, callback: WatchCallback<V>) => boolean;

    /**
     * Attach a singleton/reusable template element after `anchorElement`
     * @returns The reactive state proxy for the attached instance
     */
    attach: <S extends Record<string, any> = Record<string, any>>(
        templateId: string,
        anchorElement: Element | null,
        state?: S | null,
        readyCallback?: ReadyCallback<S>
    ) => S;

    /**
     * Detach (remove) a singleton element from the DOM
     * @returns `true` if detached, `false` otherwise
     */
    detach: (templateId: string) => boolean;

    /**
     * Render or update a dynamic view (`<div data-v="$r.myView"></div>`)
     * @returns The reactive state proxy for the view
     */
    updateView: <S extends Record<string, any> = Record<string, any>>(
        viewElement: Element | undefined,
        html: string,
        state?: S,
        readOnly?: boolean,
        readyCallback?: ReadyCallback<S>
    ) => S;

    /**
     * Scoped view elements (e.g. `$r.myView`) and custom utilities
     */
    [key: string]: any;
}

declare function R<T extends Record<string, any>>(
    elm: Element,
    state: T,
    create?: (state: T, $r: RContext) => void
): T;

export default R;