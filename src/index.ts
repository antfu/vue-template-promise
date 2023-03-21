import type { DefineComponent } from 'vue'
import { defineComponent, ref, shallowReactive } from 'vue'

export interface TemplatePromiseProps<Return, Args extends any[] = []> {
  key: number
  promise: Promise<Return> | undefined
  resolve: (v: Return) => void
  reject: (v: any) => void
  args: Args
}

export type TemplatePromise<Return, Args extends any[] = []> = DefineComponent<{}> & {
  new(): {
    $slots: {
      default(_: TemplatePromiseProps<Return, Args>): any
    }
  }
} & {
  start: (...args: Args) => Promise<Return>
}

export function useTemplatePromise<Return, Args extends any[] = []>(): TemplatePromise<Return, Args> {
  let index = 0
  const instances = ref<TemplatePromiseProps<Return, Args>[]>([])

  function start(...args: Args) {
    const props = shallowReactive<TemplatePromiseProps<Return, Args>>({
      key: index++,
      args,
      promise: undefined,
      resolve: () => {},
      reject: () => {},
    })

    instances.value.push(props)

    props.promise = new Promise<Return>((_resolve, _reject) => {
      props.resolve = _resolve
      props.reject = _reject
    })
      .finally(() => {
        props.promise = undefined
        const index = instances.value.indexOf(props)
        if (index !== -1)
          instances.value.splice(index, 1)
      })

    return props.promise
  }

  const component = defineComponent((_, { slots }) => {
    return () => instances.value.map(props => slots.default?.(props))
  })

  component.start = start

  return component as any
}
