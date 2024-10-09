import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LeMap: typeof import('../packages/less-write-ui')['LeMap'],
    LeButton: typeof import('../packages/less-write-ui')['LeButton'],
    LeSlider: typeof import('../packages/less-write-ui')['LeSlider'],
  }
}