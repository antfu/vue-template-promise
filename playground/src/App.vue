<!-- eslint-disable no-console -->
<script setup lang="ts">
import { useTemplatePromise } from '../../src'

const TemplatePromise = useTemplatePromise<'ok' | 'cancel', [string]>()

async function open() {
  console.log('Before')
  const result = await TemplatePromise.start('Hello')
  console.log('After', result)
}
</script>

<template>
  <button @click="open">
    Open
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
