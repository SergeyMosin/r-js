# r-js API Reference

r-js is a **state-first, data-driven mini framework** that binds plain JavaScript objects to the DOM using attributes and text nodes. It favors **simplicity, predictability, and runtime performance** over abstraction.

---

## 1. Core API

### `R(root, initialState, create?)`

Initializes an r-js application.

```js
const state = R(rootElement, initialState, (state, $r) => {
  // optional initialization logic
})
```

---

### Parameters

| Name           | Type                             | Description                                                     |
| -------------- | -------------------------------- | --------------------------------------------------------------- |
| `root`         | `HTMLElement`                    | Application root element                                       |
| `initialState` | `Object`                         | Initial state object                                        |
| `create`       | `(state, $r) => void` (optional) | Initialization hook used to extend `$r` or add props to `state` |

---

### Returns

* **`Proxy<Object>`** — reactive state object

### JSDoc for `R`

```js
/**
 * @callback R
 * @template {Record<string, any>} T
 * @param {Element} elm
 * @param {T} state
 * @param {(state: T, $r: any) => void} [create]
 * @returns {T}
 */
```

### TypeScript declaration for `R`

```TypeScript
declare function R<T extends Record<string, any>>(
  elm: Element,
  state: T,
  create?: (state: T, $r: any) => void
): T;
```

---

### Notes

* All state mutations are **reactive**
* DOM updates are **synchronous and deterministic**
* `$r` is a **runtime-owned global utility object**
* `$r` can **be extended** inside the `create` function
* Components receive **scoped copies** of `$r` and can further extend it

---

## 2. Template Expressions

### Interpolation

```html
{{ expression }}
```
Expressions are evaluated as **plain JavaScript functions**

⚠ **No sanitization is performed**

### Variable Names

Variables whose names begin with an `_`(underscore) are special and **non-reactive** , these variables are **not** looked up in the state object.

```html
{{ someArray.reduce((_acc, _val) => _acc + _val, 0) }}
```
In the example above `_acc` and `_val` are localized variables. If params/vars to the `reduce` function were not prefixed with `_`(underscore), this expression would throw an error, because `r-js` would look for the vars in the state object (reactive scope).

---

## 3. Directives (HTML Attributes)

### `data-on:*` — Event Listener

```html
<button data-on:click="{{count++}}">
<button data-on.async:click="{{await fn()}}">
<button data-on:custom="{{someVar = $evt.detail}}">
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
<input data-m.num.lazy="{{num}}"/>
```

#### Supported Inputs

* `input`, `textarea`
* `checkbox` (single / array)
* `radio`
* `select` (single / multiple)

#### Model Modifiers

| Modifier | Description                                  | Supported Inputs              |
| -------- | -------------------------------------------- | ----------------------------- |
| `.num`   | Cast input value to a number                 | `input`, `textarea`, `select` |
| `.lazy`  | Bind to `change` event  (instead of `input`) | `input`, `textarea`           |

`.num` modifier is best effort or fail to `0` (except `empty strings`).

| Input Value     | Result     |
| --------------- | ---------- |
| `''`            | `''`       |
| `'0.0'`         | `0`        |
| `'.5'`          | `0.5`      |
| `'123.000'`     | `123`      |
| `'123.0001'`    | `123.0001` |
| `'000123.0001'` | `123.0001` |
| `'10px'`        | `0`        |
| `'abc'`         | `0`        |

---

### `data-if` / `data-elif` / `data-else` — Conditional Rendering

```html
<div data-if="{{condition}}">...</div>
<div data-elif="{{otherCondition}}">...</div>
<div data-else>...</div>
```

* Elements are **removed from the DOM** when `condition` is false
* `data-else` / `data-elif` must be **next siblings**

---

### `data-f` — List Rendering (`for` loop)

```html
<div data-f="{{arr => item, index}}">
```

#### Syntax

```
{{ array => alias [, index] }}
```

* Alias is **read-write**
* Array mutations are reactive
* Works on native elements **and components**
* When used on components, the alias is **auto-injected** into component scope
* If `data-if` is used on the same element, it is evaluated **before** `data-f`

#### `data-f.start` & `data-f.len` — Partial List Rendering (fast index filter)

```html
<!-- renders 3 items from the array starting at index 2 -->
<div data-f="{{arr=>item,index}}" data-f.start="2" data-f.len="3">
  {{index}}. {{item}}
</div>
```

#### `data-f.key` — use an item's prop(key) for equality check
```html
<!-- ex: arr=[{id:1,value:'a'},{id:2,value:'b'},{id:3,value:'c'}] -->
<div data-f="{{arr=>item}}" data-f.key="id">
  {{item.value}}
</div>
```

---

### `data-pr:*` — Component Props (Read-Only)

```html
<r-comp data-pr:text="{{text}}">
```

* Props are **locked**
* Deep state props are also locked
* Child → parent mutation is blocked
* Can be used to force a **one-way data flow** 

---

### `data-p:*` — Component Props (Read-Write)

```html
<r-comp data-p:text="{{text}}">
```

* Only **single variables** are writable
* Multi-expression props fall back to **read-only**
* Enables child ↔ parent synchronization (without using `$r.emit()`)

---

### `data-ps:*` — Scoped/local Props

```html
<div data-if="{{condition}}" data-ps:my-var="initial value">
  "myVar" is only available inside of this "if" block: {{myVar}}
</div>
```

* Scoped to the current block (do not affect parent scope)

---

### `data-r` — Element Reference

```html
<div data-r="{{$r.elm1}}">
```

* Registers element proxy on `$r`
* Scoped per component
* Local(component) refs **shadow** global ones
* Advanced: use `this.valueOf()` to access the non-proxied DOM element

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
* in this case `state.text` will be set to "hello", if `state.text` does not exist it will be created automatically. 

#### Type Casting Modifiers

| Modifier | Type    |
| -------- | ------- |
| `.num`   | Number  |
| `.str`   | String  |
| `.bool`  | Boolean |

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
* Advanced: use `this.valueOf()` to access the raw DOM element

#### Async Variant

```html
<div data-exec.async="{{await fn()}}">
```

⚠ **This is an advanced escape hatch** — use sparingly

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

* Works on both regular Element and r-components.

#### Customize Host (tag|style)

```html
data-shadow="span|display:contents"
```

---

### `data-v` — View Renderer

```html
<div data-v="{{$r.myView}}">Default <strong>HTML</strong></div>
```

Used in conjunction with `$r.updateView($r.myView, html, state)` to render/update a view.


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

### `data-wrap` — Multiple root template wrapper

```html
<template id="btn" data-wrap="button">Action: {{text}}</template>

<r-btn data-pr:text="update text"></r-btn>
```

* `r-btn` will be rendered as a `<button>Action: update text</button>` element.

---

## 5. `$r` Global Object

`$r` is a **runtime-owned utility and reference container**. Use it to add functions, constants, and references that can be accessed from HTML markup.

Adding functions to `$r` is preferred over adding them to the `state` object. This is the idiomatic way to extend functionality while keeping `state` clean and focused on data only.

### Extending `$r` (at initialization)

```js
R(app, state, (state, $r) => {
  $r.log = console.log
  $r.math = Math
})
```

### Extending `$r` (per component)

```html
<template id="my-adder">
  <script>
    function create(state, $r){
      $r.add = (a, b) => {
        return a + b
      }
    }
  </script>
  <div>
    Sum: {{$r.add(v, 2)}}
  </div>
</template>

<r-my-adder data-pr:v={{40}}></r-my-adder>
```

---

### Built-in Methods

#### `$r.emit(name, payload, bubbles=false)`

```js
$r.emit('event-name', data, true)
```

---

#### `$r.watch(expr, callback, immediate=true):boolean`

```js
$r.watch("{{someVar}}", v => {
  console.log(v)
})
```

* Use array `{{ [a, b] }}` for watching multiple vars
* Component-scoped watchers auto-cleanup on destroy
* Returns `true` if watch was added, `false` if the expression is invalid or already watched

---

#### `$r.unwatch(expr, callback):boolean`

```js
const watchRemoved = $r.unwatch("{{someVar}}", someCallback)
```
* Returns `true` if un-watch was successful, `false` if couldn't find the watch or the watch was already removed

---

#### `$r.attach(templateId, anchorElement, state, readyCallback?):object`

```js
const stateProxy = $r.attach('some-id', document.getElementById('my_anchor'), {data:'abc'});
```
* Mostly used to manage singleton/re-usable elements like popups, dialogs, etc.
* If `state` is null or undefined the last `state` will be used
* The singleton elements is attached **after** the anchorElement

---

#### `$r.detach(templateId):boolean`

```js
const isDetached = $r.detach('some-id');
```
* Detaches (removes) the singleton element from the DOM
* Returns `true` if the element was detached, `false` otherwise
* Singleton elements are cached so attach/detach cycle is relatively fast

---

#### `$r.updateView($r.viewElement, html, state?, readOnly?, readyCallback?):stateProxy`

```js
const state = $r.updateView($r.myView, 'Hello <em>{{name}}</em>!', {name:'World'});
```
* Used to manage views like `<div data-v="$r.myView"></div>` 

### `$r` in Components

* Components receive a **scoped `$r`**
* Global `$r` **cannot be mutated**
* Local `$r` keys may **shadow global ones**

---

## 6. Component Lifecycle API

Defined inside `<template><script>...</script></template>`.

### `create(state, $r)`

Called **before DOM insertion**.

```js
function create(state, $r) {
  $r.sum = (n) => state.num + n
}
```

* Modify props
* Add local state
* Extend **local** `$r`

---

### `kill(state, $r)`

Called on **DOM removal**.

```js
function kill(state, $r) {}
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
