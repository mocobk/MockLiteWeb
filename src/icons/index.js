import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

let req
if (process.env.NODE_ENV === 'development'){
    req = require.context('./svg-dev', false, /\.svg$/)
} else {
    req = require.context('./svg', false, /\.svg$/)
}


const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
