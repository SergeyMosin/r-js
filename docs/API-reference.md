# r-js API Reference

r-js is a **state-first, data-driven mini framework** that binds plain JavaScript objects to the DOM using attributes and text nodes. It favors **simplicity, predictability, and runtime performance** over abstraction.

---

## 1. Core API

### `R(root, initialState, create?)`

Initializes an r-js application.

```js
const state = R(rootElement, initialState, (state, $r) => {
  // initialization logic
})
```

---

### Parameters

| Name           | Type                             | Description                             |
| -------------- | -------------------------------- | --------------------------------------- |
| `root`         | `HTMLElement`                    | Application root boundary               |
| `initialState` | `Object`                         | Reactive state object                   |
| `create`       | `(state, $r) => void` (optional) | Initialization hook used to extend `$r` |

---

### Returns

* **`Proxy<Object>`** — reactive state object

---

### Notes

* All state mutations are **reactive**
* DOM updates are **synchronous and deterministic**
* `$r` is a **runtime-owned global utility object**
* `$r` can **only be extended** inside the `create` function
* Components receive **scoped copies** of `$r`

---

## 2. Template Expressions

### Interpolation

```html
{{ expression }}
```

Expressions are evaluated as **plain JavaScript functions**

⚠ **No sanitization is performed**

---

## 3. Directives (HTML Attributes)

### `data-l:*` — Event Listener

```html
<button data-l:click="{{count++}}">
<button data-l.async:click="{{await fn()}}">
```

#### Special Variables

| Name   | Description         |
| ------ | ------------------- |
| `$evt` | Native event object |

---

### `data-s:*` — Setter for Attributes/Properties

```html
<button data-s:disabled="{{isDisabled}}">Some Button</button>
<div data-s:hidden="{{count<10}}">Count is higher than 9</div>
```

* One-way bind state to Elements's attributes/properties.
* Useful for setting/toggling boolean attributes

---

### `data-m` — Model Binding

```html
<input data-m="{{text}}">
<input type="checkbox" data-m="{{flag}}">
<input type="checkbox" data-m="{{arr[]}}">
```

#### Supported Inputs

* `input`, `textarea`
* `checkbox` (single / array)
* `radio`
* `select` (single / multiple)

---

### `data-if` / `data-else` — Conditional Rendering

```html
<div data-if="{{condition}}"></div>
<div data-else></div>
```

* Elements are **removed from the DOM** when false
* `data-else` must be the **next sibling**

---

### `data-f` — List Rendering (`for` loop)

```html
<div data-f="{{arr => item, index}}">
```

#### Syntax

```
{{ array => alias [, index] }}
```

#### Rules

* Alias is **read-write**
* Array mutations are reactive
* Works on native elements **and components**
* When used on components, the alias is **auto-injected** into component scope

---

### `data-p` — Component Props (Read-Only)

```html
<r-comp data-p:text="{{text}}">
```

* Props are **locked**
* Deep state props are also locked
* Child → parent mutation is blocked

---

### `data-pm` — Component Props (Read-Write)

```html
<r-comp data-pm:text="{{text}}">
```

#### Rules

* Only **single variables** are writable
* Multi-expression props fall back to **read-only**
* Enables child ↔ parent synchronization

---

### `data-r` — Element Reference

```html
<div data-r="{{$r.elm1}}">
```

* Registers element proxy on `$r`
* Scoped per component
* Local(component) refs **shadow** global ones
* Advanced: use `this.__raw` to access the non-proxied DOM element

---

### `data-no-refs`

```html
<r-comp data-no-refs></r-comp>
```

* Blocks access to **global `$r` refs**
* Local `$r` extensions still allowed

---

### `data-h:*` — Hydration / State Extraction

Extracts state from pre-rendered HTML.

```html
<div data-h:text-content="{{text}}">hello</div>
```

#### Type Casting Prefixes

| Prefix | Type    |
| ------ | ------- |
| `.n`   | Number  |
| `.s`   | String  |
| `.b`   | Boolean |

---

### `data-src` — Image (and other elements) Source

Use `data-src` to set the `src` attribute of an element when the value is **dynamic**. This prevents the browser from attempting to fetch an invalid or empty URL before the data is ready.

```html
<img data-src="{{imageUrl}}"/>
```

* Reactivity is automatically transferred to the `src` attribute

---

### `data-exec` — Execution Hook

```html
<div data-exec="{{stateVar='ready'}}">
```

* Executes **before children**
* `this` refers to the DOM element Proxy
* Advanced: use `this.__raw` to access the raw DOM element

#### Async Variant

```html
<div data-exec.async="{{await fn()}}">
```

⚠ **Advanced escape hatch** — use sparingly

---

### `data-err` — Error Boundary

```html
<div data-err="{{error=$err.message}}">
```

#### Special Variable

| Name   | Description         |
| ------ | ------------------- |
| `$err` | Thrown error object |

* Catches sync and async errors
* Async requires `await` or returned Promise
* Supports nesting

---

### `data-shadow` — Shadow DOM

```html
<r-comp data-shadow></r-comp>
```

#### Customize Host (tag|style)

```html
data-shadow="span|display:contents"
```

---

### `data-v` — View Renderer

```html
<div data-v="{{viewObj}}"></div>
```

#### View Object Shape

```js
{
  html: string,
  state: object,
  readOnly?: boolean
}
```

⚠ **Trusted HTML only**
r-js performs **no sanitization**

---

## 4. Components

Components are defined using `<template id="...">` tags and instantiated using the `r-` prefix followed by the template's id.

Example:

```html
<template id="c1">
  <div>
    Text: {{text}}
  </div>
</template>

<r-c1 data-p:text="some text"></r-c1>
```

---

## 5. `$r` Global Object

`$r` is a **runtime-owned utility and ref container**.

### Extending `$r` (Initialization Only)

```js
R(app, state, (state, $r) => {
  $r.log = console.log
  $r.math = Math
})
```

---

### Built-in Methods

#### `$r.emit(name, payload, bubbles=false)`

```js
$r.emit('event-name', data, true)
```

---

#### `$r.watch(expr, callback, immediate=true)`

```js
$r.watch("{{someVar}}", v => {
  console.log(v)
})
```

* Use array `{{ [a, b] }}` for watching multiple vars
* Component-scoped watchers auto-cleanup on destroy

---

### `$r` in Components

* Components receive a **scoped `$r`**
* Global `$r` **cannot be mutated**
* Local `$r` keys may **shadow global ones**

---

## 6. Component Lifecycle API

Defined inside `<template><script></script>`.

### `create(state, refs)`

Called **before DOM insertion**.

```js
function create(state, refs) {}
```

* Modify props
* Add local state
* Extend **local** `$r`

---

### `kill(state, refs)`

Called on **DOM removal**.

```js
function kill(state, refs) {}
```

* Cleanup
* Final mutations allowed

---

## 6. Special Runtime Variables

| Variable | Scope              | Description       |
| -------- | ------------------ | ----------------- |
| `$r`     | global / component | refs & utilities  |
| `$evt`   | event              | Native event      |
| `$err`   | error boundary     | Error object      |
| `this`   | exec               | DOM element proxy |

---

## 8. Security Model (Important)

* Expressions execute as **JavaScript**
* Views (`data-v`) require **trusted HTML**
* No sanitization is performed
* User is responsible for safety

---

### License & Usage

See `COPYRIGHT.txt` for permitted usage and restrictions.
