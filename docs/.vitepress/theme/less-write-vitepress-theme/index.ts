import type { Theme } from "vitepress";
import { watch } from "vue";
import Layout from "./Layout.vue";
import RainbowAnimationSwitcher from './components/RainbowAnimationSwitcher.vue'
import VPDemo from './components/VPDemo.vue'
import VPApiTyping from './components/VPApiTyping.vue'
import './styles/base.css'

let homePageStyle: HTMLStyleElement | undefined

export default {
  Layout,
  enhanceApp({ app, router }) {
    app.component('RainbowAnimationSwitcher', RainbowAnimationSwitcher)
    app.component('Demo', VPDemo)
    app.component('ApiTyping', VPApiTyping)
    if (typeof window === 'undefined')
      return

    watch(
      () => router.route.data.relativePath,
      () => updateHomePageStyle(location.pathname === '/'),
      { immediate: true },
    )
  },
} satisfies Theme;

if (typeof window !== 'undefined') {
  // detect browser, add to class for conditional styling
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome'))
    document.documentElement.classList.add('browser-chrome')
  else if (browser.includes('firefox'))
    document.documentElement.classList.add('browser-firefox')
  else if (browser.includes('safari'))
    document.documentElement.classList.add('browser-safari')
}

// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle)
      return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  }
  else {
    if (!homePageStyle)
      return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}