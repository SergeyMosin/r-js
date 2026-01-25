# Quick Start

This guide gets you from **zero → interactive app** in a few minutes.

You only need:

* Basic HTML
* Basic JavaScript
* No build tools

---

### 1. Include r-js

```html
<script src="r.min.js"></script>
```

That’s it.
No bundler. No compile step.

---

### 2. Create an App Root

```html
<div id="app" hidden>
  Hello {{name}}
</div>
```

* `hidden` prevents FOUC
* `{{ }}` is a reactive expression

---

### 3. Initialize State

```html
<script>
  R(document.getElementById('app'), {
    name: 'World'
  })
</script>
```

You now have a reactive app.

---

### 4. Mutate State → DOM Updates

```html
<div id="app" hidden>
  Count: {{count}}
  <button data-l:click="{{count++}}">+</button>
</div>

<script>
  R(document.getElementById('app'), {
    count: 0
  })
</script>
```

* No event handlers
* No setters
* Mutate state directly

---

### 5. Bind Attributes

```html
<div style="color: {{color}}; font-size: {{size}}px">
  Styled Text
</div>

<button data-l:click="{{color='red'}}">Red</button>
<button data-l:click="{{size+=2}}">Bigger</button>
```

State drives **everything**.

---

### 6. Two-Way Input Binding

```html
<input data-m="{{text}}">
<p>You typed: {{text}}</p>
```

* Input → state
* State → input

No glue code required.

---

### 7. Conditional Rendering

```html
<div data-if="{{show}}">
  Visible
</div>
<div data-else>
  Hidden
</div>

<button data-l:click="{{show=!show}}">Toggle</button>
```

* Elements are removed from the DOM when false

---

### 8. List Rendering

```html
<ul>
  <li data-f="{{items => item}}">
    {{item}}
  </li>
</ul>

<button data-l:click="{{items.push('new item')}}">
  Add
</button>
```

Arrays are fully reactive.

---

### 9. Components (Templates)

```html
<template id="counter">
  Count: {{count}}
  <button data-l:click="{{count++}}">+</button>
</template>

<r-counter data-pm:count="{{count}}"></r-counter>
```

* Templates are plain HTML
* Props are explicit
* Two-way binding is opt-in

---

### 10. Component Events

```html
<template id="child">
  <button data-l:click="{{$r.emit('done', 1)}}">Done</button>
</template>

<r-child data-l:done="{{total += $evt.detail}}"></r-child>
```

Use events for **child → parent** communication.

---

### 11. Error Boundaries

```html
<div data-err="{{shownError=$err.message}}">
  {{a / zero}}
</div>
```

Errors are **contained**, not fatal.

---

### 12. Shadow DOM (Optional)

```html
<r-widget data-shadow></r-widget>
```

Use Shadow DOM **when you want style isolation**.

---

### License & Usage

See [COPYRIGHT.txt](./../COPYRIGHT.txt) for permitted usage and restrictions.

