# vue-template-promise

[![NPM version](https://img.shields.io/npm/v/vue-template-promise?color=a1b858&label=)](https://www.npmjs.com/package/vue-template-promise)

Template as Promise in Vue. Useful for constructing custom Dialogs, Modals, Toasts, etc.

```html
<script setup lang="ts">
import { useTemplatePromise } from 'vue-template-promise'

const TemplatePromise = useTemplatePromise<'ok' | 'cancel'>()

async function open() {
  console.log('Before')
  const result = await TemplatePromise.start()
  console.log('After', result)
}
</script>

<template>
  <button @click="open">Open</button>
  <TemplatePromise v-slot="{ resolve }">
    <dialog open>
      <button @click="resolve('cancel')">Cancel</button>
      <button @click="resolve('ok')">OK</button>
    </dialog>
  </TemplatePromise>
</template>
```

## Features

- 👨‍💻 **Programmatic** - call your UI as a promise
- 🧩 **Template** - use Vue template to render, not a new DSL
- 🦾 **TypeScript** - full type safety via generic type
- ⚪️ **Renderless** - you take full control of the UI

## Install

```bash
npm i vue-template-promise
```

## Usage

`useTemplatePromise` returns a **Vue Component** that you can directly use in your template with `<script setup>`

```ts
import { useTemplatePromise } from 'vue-template-promise'

const TemplatePromise = useTemplatePromise()
const MyPromise = useTemplatePromise<boolean>() // with generic type
```

In template, use `v-slot` to access the promise and resolve functions.

```html
<template>
  <TemplatePromise v-slot="{ promise, resolve, reject, args }">
    <!-- you can have anything -->
    <button @click="resolve('ok')">OK</button>
  </TemplatePromise>
</template>
```

Rhe slot will not be rendered initially (similar to `v-if="false"`), until you call the `start` method from the component.

```ts
const result = await TemplatePromise.start()
```

Once `resolve` or `reject` is called in the template, the promise will be resolved or rejected, returning the value you passed in. Once resolved, the slot will be removed automatically.

### Passing Arguments

You can pass arguments to the `start` with arguments.

```ts
import { useTemplatePromise } from 'vue-template-promise'

const TemplatePromise = useTemplatePromise<boolean, [string, number]>()
```

```ts
const result = await TemplatePromise.start('hello', 123) // Pr
```

And in the template slot, you can access the arguments via `args` property.

```html
<template>
  <TemplatePromise v-slot="{ args, resolve }">
    <div>{{ args[0] }}</div> <!-- hello -->
    <div>{{ args[1] }}</div> <!-- 123 -->
    <button @click="resolve(true)">OK</button>
  </TemplatePromise>
</template>
```

## Thanks

Thanks to [@johnsoncodehk](https://github.com/johnsoncodehk) for making Volar and the help to make it type safe.

## FAQ

### VueUse?

Probably. I am having this as a separate package to test how this idea works. If it ends up working well, we will consider moving it into VueUse directly.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
