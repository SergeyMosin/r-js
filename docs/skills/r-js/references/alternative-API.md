# r-js Alternative API

The alternative API provides shorter attribute names. The alternative API uses the same r-js runtime concepts, expressions, state model, and component system. The difference is the attribute syntax.

## Standard API to Alternative API Mapping

| Standard API | Alternative API | Description |
|---|---|---|
| `data-on:` | `on:` | Event listener |
| `data-on.async:` | `on.async:` | Asynchronous event listener |
| `data-m` | `model` | Model binding |
| `data-m.num` | `model.num` | Model number modifier |
| `data-m.lazy` | `model.lazy` | Model lazy modifier |
| `data-if` | `if` | Conditional rendering |
| `data-elif` | `elif` | Additional conditional branch |
| `data-else` | `else` | Fallback branch |
| `data-f` | `f` | List rendering |
| `data-f.key` | `f.key` | List key |
| `data-f.start` | `f.start` | Starting list index |
| `data-f.len` | `f.len` | Number of list items |
| `data-can-recurse` | `can-recurse` | Disables template recursion check |
| `data-p:` | `p:` | Read-write property |
| `data-pr:` | `pr:` | Read-only property |
| `data-ps:` | `ps:` | Scoped property initializer |
| `data-wrap:` | `wrap:` | For multi-element templates |
| `data-r` | `ref` | Element reference |
| `data-no-refs:` | `no-refs:` | Block template access to global `$r` |
| `data-h:` | `h:` | Hydration / State Extraction |
| `data-s:` | `s:` | Attribute Setter (one-way) |
| `data-src:` | `r-src:` | For dynamic `src` values  |
| `data-exec` | `exec` | Element execution hook |
| `data-exec.async` | `exec.async` | Asynchronous execution hook |
| `data-err` | `error` | Error boundary |
| `data-shadow:` | `shadow:` | Shadow DOM |
| `data-v` | `view` | Dynamic view rendering |
