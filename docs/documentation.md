# r-js Documentation

**r-js** is a **state-first, data-driven mini framework**  that connects plain JavaScript objects directly to the DOM using attributes and text interpolations.

No virtual DOM. No build step required. No JSX. Expressions are plain JavaScript.

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <script src="r.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const state = R(document.getElementById("app"), {
        count: 0,
        name: "World"
      });
    });
  </script>
</head>
<body>
  <div id="app" hidden>
    <h1>Hello {{name}}!</h1>
    <p>Count: {{count}}</p>
    <button data-l:click="{{count++}}">Increment</button>
  </div>
</body>
</html>
```

## 1. Initialization – `R(root, initialState, create?)`

```js
const state = R(rootElement, initialStateObject, optionalCreateFn?)
```

- Returns → **reactive Proxy** of your state
- All mutations (`state.xxx = …`, `push`, `splice`, etc.) → automatic DOM updates
- Updates are **synchronous**

**Optional third argument** — initialization function:

```js
R(app, state, (state, $r) => {
  $r.log = console.log.bind(console);
  $r.format = (n) => n.toFixed(2);
  $r.api = { fetchData: async () => { … } };
});
```

## 2. Text Interpolation `{{ expression }}`

Any text node can contain **one or more** `{{ js-expression }}` parts.

```html
<div>Hello {{user.name}}, you have {{items.length}} items.</div>
<div>Price: ${{price * quantity}} ({{(price*quantity).toFixed(2)}})</div>
```

**Important**: expressions are evaluated as plain JS → **no escaping / sanitization**.

## 3. Core Directives

| Directive               | Purpose                                 | Example                                                                  |
| ----------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `data-l:event`          | Event listener                          | `data-l:click="{{count++}}"`<br>`data-l:async:click="{{await fetch()}}"` |
| `data-m`                | Two-way model binding                   | `<input data-m="{{message}}">`                                           |
| `data-if` / `data-else` | Conditional rendering (remove/add)      | `<div data-if="{{show}}">…</div><div data-else>…</div>`                  |
| `data-f`                | List / for-each rendering               | `<li data-f="{{items => item, i}}">{{i+1}}. {{item.name}}</li>`          |
| `data-p:prop`           | Component prop (read-only)              | `<r-card data-p:title="{{post.title}}">`                                 |
| `data-pm:prop`          | Component prop (read-write)             | `<r-input data-pm:value="{{form.name}}">`                                |
| `data-r`                | Register DOM element(proxy) ref on `$r` | `<div data-r="{{$r.modal}}">…</div>`                                     |
| `data-no-refs`          | Block access to global `$r` refs        | `<r-comp data-no-refs>`                                                  |
| `data-h:*`              | Hydrate / extract state from HTML       | `<span data-h.n:text-content="{{count}}">42</span>`                      |
| `data-s:*`              | Attribute Setter (one-way)              | `<button data-s:disabled="{{isDisabled}}">Some Button</button>`          |
| `data-src`              | For dynamic `src` values                | `<img data-src="{{imageUrl}}"/>`                                         |
| `data-exec`             | Execute code before children            | `data-exec="{{status='loading'}}"`                                       |
| `data-err`              | Error boundary                          | `<div data-err="{{error=$err.message}}">{{risky()}}</div>`               |
| `data-shadow`           | Enable Shadow DOM for component         | `<r-comp data-shadow>` or `data-shadow="section"`                        |
| `data-v`                | Render dynamic view object              | `<div data-v="{{currentView}}"></div>`                                   |

### Event Listeners – `data-l:*`

Special variable: `$evt`

```html
<button data-l:click="{{count += $evt.shiftKey ? 10 : 1}}">+1 or +10</button>
```

Async listeners use `data-l.async:*`

### Model Binding – `data-m`

Works on:

- `<input type="text|number|email|…">`
- `<textarea>`
- `<input type="checkbox">` (single + array mode `data-m="{{tags[]}}">`)
- `<input type="radio">`
- `<select>` (single + multiple)

Array checkbox example:

```html
<input type="checkbox" value="js"   data-m="{{skills[]}}"> JS
<input type="checkbox" value="css"  data-m="{{skills[]}}"> CSS
<!-- skills = ["js", "css"] when both checked -->
```

### Conditional – `data-if` / `data-else`

Elements are **physically removed/inserted** from DOM.

```html
<div data-if="{{role === 'admin'}}">
  Admin panel
</div>
<div data-else>
  Access denied
</div>
```

**Note**: `data-else` must be the immediate next sibling.

### List Rendering – `data-f`

```html
<ul>
  <li data-f="{{todos => todo, idx}}">
    {{idx+1}}. {{todo.title}}
    <button data-l:click="{{todos.splice(idx,1)}}">×</button>
  </li>
</ul>
```

Supports most native array mutations: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.

When used on components → item is **injected read-write** into component scope.

## 4. Components (Templates)

Defined with `<template id="…">` and used with tag `r-xxx`

```html
<template id="greeting">
  <h3>Hello {{name}}!</h3>
  <slot></slot>
</template>

<r-greeting data-p:name="{{user.name}}">
  <small>from r-js</small>
</r-greeting>
```

### Component Features

- Multiple root nodes → use `data-wrap="div"` (or any tag)
- Default props on `<template>` → `data-p:level="beginner"`
- Single `<slot>` supported (default content works)
- Props: `data-p:` (read-only / deep lock), `data-pm:` (two-way, single variable only)
- Events: `$r.emit("save", payload, bubbles?)`
- Catch: `data-l:save="{{savedData = $evt.detail}}"`

**Shadow DOM support**

```html
<r-card data-shadow data-p:title="{{post.title}}"></r-card>
<r-card data-shadow="article|border:1px solid #ccc" …></r-card>
```

## 5. `$r` – Global / Scoped Utility & Refs

- Global extensions only in `R(…, createFn)`
- Scoped (per component) `$r` can shadow globals
- Built-ins:

```js
$r.emit(name, payload?, bubbles?)
$r.watch("{{expr}}", callback, immediate?)
$r.watch("{{ [a,b,c] }}", ([a,b,c]) => …, false)
```

## 6. Component Lifecycle (inside `<script>` in `<template>`)

```js
function create(state, refs) {
  // state → props + local state
  // refs → local $r (can be extended)
}

function kill(state, refs) {
  // cleanup
}
```

## 7. Hydration – `(P)RSE` – Pre-Rendered State Extraction

Server-rendered HTML → extract state on client:

```html
<div data-h:text-content="{{title}}">Welcome to r-js</div>
<div data-h.num:text-content="{{count}}">42</div>
<div data-h.bool:text-content="{{isActive}}">true</div>
```

Prefixes: `.num` (Number), `.str` (String), `.bool` (Boolean)

## 8. Setters (one-way) – `data-s:*`

Bind state to Elements's attributes/properties.

```html
<button id="t1" data-s:disabled="{{disabled}}">Some Button</button>
<div id="t3" data-s:hidden="{{hidden}}">Hidden Div</div>
<div id="t4" data-s:tab-index="{{num+1}}">Some Other Div</div>
```

Most useful for setting/toggling boolean attributes like `disabled`, `hidden`, etc.

## 9. Error Boundaries – `data-err`

```html
<div data-err="{{error = $err.message}}">
  Risky computation: {{1n / 0n}}
</div>
```

Supports nested boundaries and async (`await` or returned Promise).

## 10. Dynamic Views – `data-v`

Ideal for lightweight SPA / router views.

```js
state.currentView = {
  html: `<h1>{{title}}</h1><p>{{body}}</p>`,
  state: { title: "Home", body: "…" },
  readOnly: false           // or true
};
```

```html
<main data-v="{{currentView}}"></main>
```

**Security note**: only use trusted HTML.

## 11. Advanced / Escape Hatches

- `data-exec` / `data-exec.async` – per-element lifecycle
- `data-no-refs` – isolate component from global refs
- Deep state mutations are fully supported
- `$r.watch(…)` for side-effects & computed-like logic

## Security & Responsibility

**r-js performs no sanitization / escaping**.

You must ensure that:

- expressions are trusted
- `data-v` HTML is trusted
