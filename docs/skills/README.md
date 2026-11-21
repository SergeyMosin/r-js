# r-js Agent Skill

Portable Agent Skill package for developing with **r-js**.

## Contents

```text
skills/
└── r-js/
    ├── SKILL.md
    ├── references/
    │   ├── API-reference.md
    │   ├── alternative-API.md
    │   ├── documentation.md
    │   └── quick-start.md
    └── examples/
        ├── standard-api/
        │   ├── 01-basic-reactivity.html
        │   ├── 02-model-binding.html
        │   ├── 03-conditional-rendering.html
        │   ├── 04-list-rendering.html
        │   ├── 05-components-and-props.html
        │   ├── 06-component-events.html
        │   ├── 07-watchers.html
        │   ├── 08-hydration.html
        │   ├── 09-error-boundary.html
        │   ├── 10-async-event.html
        │   ├── 11-dynamic-view.html
        │   └── 12-shadow-dom-component.html
        └── alternative-api
            ├── 01-basic-reactivity.html
            ├── 02-model-binding.html
            ├── 03-conditional-rendering.html
            ├── 04-list-rendering.html
            ├── 05-components-and-props.html
            ├── 06-component-events.html
            ├── 07-watchers.html
            ├── 08-hydration.html
            ├── 09-error-boundary.html
            ├── 10-async-event.html
            ├── 11-dynamic-view.html
            └── 12-shadow-dom-component.html
```

## Install

Copy the `skills/r-js` directory into the `skills/` directory used by your agent or project. Keep `references/` and `examples/` alongside `SKILL.md`; the skill links to those files.

The skill follows the Agent Skills layout: a directory named after the skill, with `SKILL.md` containing YAML frontmatter (`name`, `description`) and the instructions. The three supplied r-js documents are included unchanged as references.

## Examples

Each HTML file demonstrates one r-js topic. Standard API example are in `examples/standard-api`, Alternative API examples are in `examples/alternative-api`.
