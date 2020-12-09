import Vue from 'vue';

let isClickModal = false

export default() => {
    Vue.directive('el-click-modal', {
        /**
         * 对 element-ui 关闭弹框的逻辑优化
         * 问题：Chrome 浏览器中 el-dialog 组件允许点击遮罩关闭弹窗事件的前提下，
         * 鼠标点在弹框上没有放开，然后移出到外面的遮罩上，此时也会触发关闭弹窗事件，
         * 而当我们选择复制弹框里的内容时，很容易就不小心将鼠标移到外面去，导致窗口意外关闭
         */
        bind(el, binding, vnode) {
            const component = vnode.componentInstance
            const modalElement = vnode.componentOptions.tag === 'el-drawer' ? vnode.elm.firstChild : el
            
            el.addEventListener('mousedown', (e) => {
                isClickModal = e.target === modalElement
            })
            
            el.addEventListener('mouseup', (e) => {
                if (e.target === modalElement && isClickModal) {
                    isClickModal = true;
                }
            })
            
            component.handleWrapperClick = () => {
                if ((component.closeOnClickModal || component.wrapperClosable) && isClickModal){
                    component.handleClose()
                }
            }
    
        }
    })
}
