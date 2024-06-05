import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LeMap: typeof import('../packages/less-write-ui')['LeMap'],
    useMap: typeof import('../packages/less-write-ui')['useMap'],
    LeButton: typeof import('../packages/less-write-ui')['LeButton'],
  }
}