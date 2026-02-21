# r-js

#### A state-first, no-build, standards-based JavaScript mini framework.

* There is No build step
* HTML is the API.
* State is the source of truth.
* if you know HTML and JavaScript, you already know r-js.

---

### Core Principles

* **State-first** – mutate plain JS objects, DOM updates automatically
* **Explicit data flow** – bindings are visible in markup
* **Deterministic updates** – small API, predictable behavior
* **Performance by design** – update only what actually changes

---

### Quick Example

```html
<div id="app" hidden>
  Count: {{count}}
  <button data-l:click="{{count++}}">+</button>
</div>

<script src="r.min.js"></script>
<script>
  R(document.getElementById('app'), {
    count: 0
  });
</script>
```

---

### Features

- Reactive plain objects (deep mutation tracking)
- `{{ expression }}` text interpolation (plain JS)
- Two-way binding with `data-m`
- Event listeners `data-l:click`, `data-l:keyup`, etc.
- Conditional rendering `data-if` / `data-else`
- List rendering `data-f` (with automatic updates on array mutation)
- Lightweight components via `<template id="…">` + `<r-…>`
- Read-only `data-p:` and two-way `data-pm:` props
- Component events via `$r.emit()`
- Shadow DOM support per component
- Error boundaries `data-err`
- Dynamic views `data-v`
- `$r` global + scoped refs & utilities
- `data-exec` / `data-exec.async` per-element hooks
- Component lifecycle: `create()` / `kill()`
- SSR friendly hydration from pre-rendered HTML (`data-h:*`)
- No dependencies
- Router-agnostic

---

### Distribution Notes (release modes)

* `r.min.js` – production build ( smallest size, minimal logging )
* `r.stg.min.js` – staging build ( verbose logging, see [./src/errors.js](./src/errors.js) )
* `r.alt.min.js` – alternative API ( if you don't want to type `data-` prefix, and don't care about HTML validation, see [./src/r-api.js](./src/r-api.js) )
* `r.stg.alt.min.js` – staging build with the alternative API

---

### Documentation

* Quick Start Guide - [./docs/quick-start.md](./docs/quick-start.md)
* Detailed Docs - [./docs/documentation.md](./docs/documentation.md)
* API Reference - [./docs/API-reference.md](./docs/API-reference.md)
  
**Other refs:**
* Error Codes (Production Mode)  - [./src/errors.js](./src/errors.js)
* Alternative API Syntax - [./src/r-api.js](./src/r-api.js)

---

### Size

* Around `32KB` minified (depending on build type)
* ~ `14KB` minified + gzipped

---

### Status

**v0.4.2 - API Testing (closed beta)**

Features are almost locked. List "hydration" is the only feature that is not yet implemented/tested.

---

### Security

- `{{ expressions }}` run as JavaScript functions
- `data-v` HTML is rendered as-is (trusted content only!)
- r-js performs no HTML escaping or sanitization.

---

### License & Usage

### Usage Rights

* Free to use for **personal and commercial projects**
* Intended for **building web applications**

### Restrictions

You may **not**:

* Use r-js code or concepts to create other frameworks
* Train AI systems to generate frameworks based on r-js
* Reuse internal architecture, hooks, or mechanisms for framework development

See COPYRIGHT.txt for full legal restrictions.

---

### Ownership

**© Sergey Mosin** | <srgey@srgdev.com> | www.srgdev.com

All rights reserved.
