import type { DefineComponent, TransitionGroupProps } from 'vue'
import { Fragment, TransitionGroup, defineComponent, h, ref, shallowReactive } from 'vue'

export interface TemplatePromiseProps<Return, Args extends any[] = []> {
  /**
   * The promise instance.
   */
  promise: Promise<Return> | undefined
  /**
   * Resolve the promise.
   */
  resolve: (v: Return | Promise<Return>) => void
  /**
   * Reject the promise.
   */
  reject: (v: any) => void
  /**
   * Arguments passed to TemplatePromise.start()
   */
  args: Args
  /**
   * Indicates if the promise is resolving.
   * When passing another promise to `resolve`, this will be set to `true` until the promise is resolved.
   */
  isResolving: boolean
  /**
   * Options passed to createTemplatePromise()
   */
  options: TemplatePromiseOptions
  /**
   * Unique key for list rendering.
   */
  key: number
}

export interface TemplatePromiseOptions {
  /**
   * Determines if the promise can be called only once at a time.
   *
   * @default false
   */
  singltone?: boolean

  /**
   * Transition props for the promise.
   */
  transition?: TransitionGroupProps
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

export function useTemplatePromise<Return, Args extends any[] = []>(
  options: TemplatePromiseOptions = {},
): TemplatePromise<Return, Args> {
  let index = 0
  const instances = ref<TemplatePromiseProps<Return, Args>[]>([])

  function create(...args: Args) {
    const props = shallowReactive<TemplatePromiseProps<Return, Args>>({
      key: index++,
      args,
      promise: undefined,
      resolve: () => {},
      reject: () => {},
      isResolving: false,
      options,
    })

    instances.value.push(props)

    props.promise = new Promise<Return>((_resolve, _reject) => {
      props.resolve = (v) => {
        props.isResolving = true
        return _resolve(v)
      }
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

  function start(...args: Args) {
    if (options.singltone && instances.value.length > 0)
      return instances.value[0].promise
    return create(...args)
  }

  const component = defineComponent((_, { slots }) => {
    const renderList = () => instances.value.map(props => h(Fragment, { key: props.key }, slots.default?.(props)))
    if (options.transition)
      return () => h(TransitionGroup, options.transition, renderList)
    return renderList
  })

  component.start = start

  return component as any
}
