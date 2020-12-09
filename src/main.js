import Vue from 'vue'
// import './plugins/axios'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import './icons'  // 注册 svg-icon 全局组件
import loading from './directives/loading/directive'
import elClickModal from './directives/el-click-modal'

Vue.use(Element)
Vue.use(loading)
Vue.use(elClickModal)


/**
 开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。
 而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。
 此外，有些警告检查还有一些小的运行时开销
 Vue.config.productionTip = false
 生产环境中不进行消息提示
 */
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
