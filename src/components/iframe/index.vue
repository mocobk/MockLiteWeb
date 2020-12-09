<template>
    <iframe :src="src" style="border: 0; overflow-y: scroll" width="100%" ref="iframeContainer"></iframe>
</template>

<script>
    export default {
        name: 'iframeContainer',
        props: ['src'],
        mounted () {
            if (this.$refs.iframeContainer) {
                // 隐藏 iframe 外层的滚动条
                document.firstElementChild.style.overflowY = 'hidden'
                
                const parent = this.$refs.iframeContainer.parentElement
                this.$refs.iframeContainer.height = parent.clientHeight + 'px'
                // 减掉 1px 规避精度丢失导致 iframe 外层出现滚动条
                // this.$refs.iframeContainer.height = parent.clientHeight - 1 + 'px'
                
                // 监听窗口变化
                window.onresize = () => {
                    // 先将 iframe 高度减小到 0，再设置为父节点的高度，否则只能响应从小到大的窗口变化
                    this.$refs.iframeContainer.height = '0'
                    this.$refs.iframeContainer.height = parent.clientHeight + 'px'
                }
                
            }
        },
        destroyed () {
            // 移除窗口改变监听
            window.onresize = null
            // 恢复 iframe 外层的滚动条
            document.firstElementChild.style.overflowY = ''
        }
    
    }
</script>

<style scoped lang="scss">
    .iframe-container {
        overflow-y: visible;
    }

</style>
