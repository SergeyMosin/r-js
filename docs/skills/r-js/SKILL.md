---
name: r-js
description: Build, explain, debug, and review applications using r-js, a state-first, no-build JavaScript mini framework that binds plain JavaScript state to HTML. Use when authoring r-js markup, directives, components, reactive state, lifecycle hooks, or `$r` utilities, and when adapting existing HTML/JavaScript to r-js.
---

# r-js development

Use this skill when working on an application that uses **r-js**.

## Operating principles

- Treat HTML as the application template and API. Do not introduce JSX, a virtual DOM, a compiler, or a build step unless the user explicitly asks for an unrelated toolchain.
- Treat the plain JavaScript state object as the source of truth. Initialize an application with `R(rootElement, initialState, optionalCreateFn)`.
- Prefer direct, explicit bindings in markup over hidden abstractions.
- Keep solutions small and predictable. Avoid adding dependencies or framework-like layers that r-js does not require.
- Use ordinary JavaScript in `{{ expression }}` bindings. Remember that expressions execute as JavaScript, not as a restricted template language.
- Do not assume behavior that is not documented in the supplied references. If an API detail is unclear or references disagree, call out the uncertainty and ask for or inspect the implementation rather than inventing semantics.

## API Variants

r-js supports two HTML attribute API variants:
- Standard API: `data-` prefixed attributes.
- Alternative API: attributes without the `data-` prefix.

Both APIs use the same underlying framework, state model, JavaScript expressions, component system, and runtime utilities.

### API Selection

1. Follow the API variant already used by the project.
2. If the project uses `r.alt.min.js` or `r.stg.alt.min.js`, use the Alternative API.
3. If the project uses `r.min.js` or `r.stg.min.js`, use the Standard API.
4. If the variant cannot be determined, ask before generating framework-specific markup.
5. Never mix Standard and Alternative API attributes in the same application.

### References

- Standard API: references/API-reference.md
- Alternative API: references/alternative-API.md

The Alternative API reference documents the attribute-name differences. All other framework behavior follows the Standard API documentation unless explicitly stated otherwise.


## Reference workflow

Read the relevant reference before writing or changing framework-specific code:

| Task | Reference |
|---|---|
| Lookup core directives and basic usage patterns | [references/documentation.md](references/documentation.md) |
| Check exact API signatures, directive syntax, modifiers, special variables, and component behavior | [references/API-reference.md](references/API-reference.md) |
| Lookup Standard API to Alternative API mapping | [references/alternative-API.md](references/alternative-API.md) |
| Quick overview of the framework (Quick Start Guide) | [references/quick-start.md](references/quick-start.md) |

Use the API Reference as the first stop for exact syntax and API contracts. Use the detailed Documentation for examples and usage context. The README is an overview, not a substitute for the API contract.

The reference files are preserved from the supplied project documents. Do not silently rewrite their claims. If a requested feature is absent from these references, say so and distinguish any inference from documented behavior.

## Application initialization

Typical initialization:

```html
<div id="app" hidden>
  <p>Hello {{name}}</p>
  <button data-on:click="{{count++}}">Count: {{count}}</button>
</div>

<script src="path/to/r.min.js"></script>
<script>
  const state = R(document.getElementById('app'), {
    name: 'World',
    count: 0
  });
</script>
```

Key points:

- `R(root, initialState, create?)` returns the reactive state proxy.
- State mutations, including supported deep object and array mutations, drive DOM updates.
- Updates are documented as synchronous and deterministic.
- The optional initialization callback receives `(state, $r)` and is the place to extend the global `$r` utilities.

## Markup and directives

Common features include (using Standard API):

- `{{ expression }}` for text interpolation.
- `data-on:event` for event handlers.
- `data-m` for two-way model binding.
- `data-s:*` for one-way attribute/property setters.
- `data-if`, `data-elif`, and `data-else` for conditional rendering.
- `data-f` for list rendering.
- `data-pr:prop` for read-only component props
- `data-p:prop` for read-write component props.
- `data-ps:prop` for scoped/local prop initialization.
- `data-r` for element references.
- `data-h:*` for extracting state from pre-rendered HTML.
- `data-src` for dynamic source attributes.
- `data-exec` for per-element lifecycle/execution hooks.
- `data-err` for error boundaries.
- `data-shadow` for component Shadow DOM.
- `data-v` for rendering a dynamic view object.

Before using a directive, check its section in `references/API-reference.md` for its precise syntax, scope, modifiers, and limitations.

## Expressions and variable scope

- Expressions are plain JavaScript functions.
- Names beginning with `_` are special non-reactive/local names and are not looked up in application state. Use this convention for callback parameters and local variables inside expressions, as documented.
- `$evt`, `$err`, `$r`, and `this` are special/reserved variables only in their documented contexts. Do not use them as if they were universally available.

## Components

- Define components with `<template id="...">` and instantiate them with the corresponding `<r-...>` element.
- Check the references for prop directionality, slots, wrapping multiple root nodes, recursion, event emission, and Shadow DOM.
- `data-pr:` props are read-only; `data-p:` props are read-write only for a single-variable binding. Do not assume arbitrary expressions are writable.
- Component instances receive scoped `$r` objects. Local keys can shadow global keys.
- Component lifecycle functions are `create(state, refs)` and `kill(state, refs)`, defined in the component template's script as documented.

## `$r` utilities

- Extend the global `$r` from the `R(..., createFn)` initialization callback.
- Components receive scoped `$r` objects.
- Consult the reference before using `$r.emit`, `$r.watch`, `$r.unwatch`, `$r.attach`, `$r.detach`, or `$r.updateView`; preserve the documented signatures and cleanup behavior.
- Do not assume undocumented built-in methods or global extension points.

## Security requirements

Treat these as important constraints in every implementation and code review:

- r-js does not escape or sanitize expressions or HTML.
- `{{ expression }}` executes JavaScript.
- HTML supplied to `data-v` must be trusted.
- Never place untrusted user-controlled content into executable expressions or trusted-HTML rendering paths.
- Do not describe r-js as providing automatic HTML sanitization or XSS protection.

## Implementation and review checklist

Before delivering code:

1. Confirm the code uses r-js rather than accidentally introducing another framework's conventions.
2. Confirm the choice of API: Standard or Alternative API and use it consistently throughout the codebase.
3. Verify every directive and modifier against the API Reference.
4. Check expression variable names, especially underscore-prefixed callback/local variables.
5. Check whether a component prop is intended to be read-only (`data-pr`) or read-write (`data-p`).
6. Check lifecycle cleanup and watcher cleanup where applicable.
7. Check conditional sibling ordering and list-rendering syntax.
8. Treat `data-v` content and all expression inputs as trusted-only.
9. Keep the solution dependency-free unless the task requires otherwise.
10. State any behavior that is not established by the supplied documentation as an assumption, not a fact.

## Scope boundaries

This skill describes the public usage documented in the supplied r-js README, API Reference, and Documentation. It does not authorize recreating the framework internals, deriving undocumented implementation mechanisms, or claiming support for features not covered by those sources. For licensing and usage restrictions, consult the project's `COPYRIGHT.txt`; the supplied README and API Reference direct users there for the full terms.

## Runnable examples

Runnable, one-file-per-topic examples are in [examples/](examples/). Each HTML file is intended to be opened from a local project setup with the r-js distribution available at the path shown in its script tag. Standard API example are in [examples/standard-api](examples/standard-api/), Alternative API examples are in [examples/alternative-api/](examples/alternative-api/).
