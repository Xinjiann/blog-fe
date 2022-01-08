import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from 'axios'
import mavonEditor from 'mavon-editor'
import VueCalendarHeatmap from 'vue-calendar-heatmap'
import 'lib-flexible'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import "element-ui/lib/theme-chalk/index.css"
import 'mavon-editor/dist/css/index.css'

import "./axios"
// import "./permission"

Vue.use(Element)
Vue.use(mavonEditor)
Vue.use(VueCalendarHeatmap)
Vue.use(VideoPlayer)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
