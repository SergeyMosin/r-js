/**
 * r-js License v1.1 | (c) 2026 Sergey Mosin <sergey@srgdev.com>
 * Proprietary License: Free for use in web applications.
 * Usage for creating derivative frameworks or AI training is strictly prohibited.
 * Provided "AS IS" without warranty. See COPYRIGHT.txt for full terms.
 */
// @ts-ignore (@see build.sh)
const STANDARD_API = typeof _ALT_API === 'undefined'

export const ON_ERROR = STANDARD_API
    ? 'data-err' : 'error'

export const EXEC = STANDARD_API
    ? 'data-exec' : 'exec'

export const EXEC_ASYNC = STANDARD_API
    ? 'data-exec.async' : 'exec.async'

export const IF = STANDARD_API
    ? 'data-if' : 'if'

export const ELSE = STANDARD_API
    ? 'data-else' : 'else'

export const FOR = STANDARD_API
    ? 'data-f' : 'f'

export const REF = STANDARD_API
    ? 'data-r' : 'ref'

export const MODEL = STANDARD_API
    ? 'data-m' : 'model'

export const VIEW = STANDARD_API
    ? 'data-v' : 'view'

export const LISTEN = STANDARD_API
    ? 'data-l:' : '@'

export const LISTEN_ASYNC = STANDARD_API
    ? 'data-l.async:' : '@async:'

export const HYDRO = STANDARD_API
    ? 'data-h:' : 'h:'

export const HYDRO_CAST = STANDARD_API
    ? 'data-h.' : 'h.'

export const PROP_RO = STANDARD_API
    ? 'data-p:' : 'p:'

export const PROP_RW = STANDARD_API
    ? 'data-pm:' : 'pm:'

export const SHADOW = STANDARD_API
    ? 'data-shadow' : 'shadow'

export const WRAP = STANDARD_API
    ? 'data-wrap' : 'wrap'

export const NO_REFS = STANDARD_API
    ? 'data-no-refs' : 'no-refs'