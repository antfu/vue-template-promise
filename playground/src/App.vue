<!-- eslint-disable no-console -->
<script setup lang="ts">
import { useTemplatePromise } from '../../src'

const TemplatePromise = useTemplatePromise<'ok' | 'cancel', [string]>()

async function open(idx: number) {
  console.log(idx, 'Before')
  const result = await TemplatePromise.start(`Hello ${idx}`)
  console.log(idx, 'After', result)
}
</script>

<template>
  <button @click="open(1)">
    Open 1
  </button>
  <button @click="open(2)">
    Open 2
  </button>
  <button @click="open(1); open(2)">
    Open 1 & 2
  </button>
  <TemplatePromise v-slot="{ resolve, args }">
    <div class="fixed inset-0 bg-black/10 flex items-center">
      <dialog open class="border-gray/10 shadow rounded ma">
        <div>Dialog {{ args[0] }}</div>
        <p>Open console to see logs</p>
        <button @click="resolve('cancel')">
          Cancel
        </button>
        <button @click="resolve('ok')">
          OK
        </button>
      </dialog>
    </div>
  </TemplatePromise>
</template>
