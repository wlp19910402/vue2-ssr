import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store'

Vue.config.productionTip = false

export default function createApp() {
  let router = createRouter()

  // const originalPush = router.prototype.push
  // router.prototype.push = function push(location) {
  //   return originalPush.call(this, location).catch((err) => err)
  // }
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  })
  return { app, router }
}
