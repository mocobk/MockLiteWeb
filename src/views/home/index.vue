<template>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="header-logo">
                    <img src="../../assets/logo.png" alt="">
                </div>
                <div class="header-menu">
                    <div
                        v-for="(item, index) in menu"
                        :key="index"
                        :class="{'menu-item': true, 'menu-item-active': currentPath.includes(item.path)}"
                        @click="toPath(item.path)"
                    >
                        {{item.title}}
                    </div>
                    <div class="menu-item" title="服务管理面板" @click="openAdmin">
                        <i class="el-icon-news" style="font-weight: 800;line-height: unset;" />
                    </div>
                </div>
            </div>
        </div>
        <div id="main" class="main">
            <router-view />
        </div>
        <div v-if="false" class="footer">
            <div class="footer-content">
                <a
                    v-for="item in footer"
                    :key="item.icon"
                    :href="item.url"
                    target="_blank">
    
                    <el-popover
                        v-if="item.icon === 'wechat'"
                        placement="top"
                        trigger="hover"
                        >
                        <img :src="item.url" style="width: 150px" alt=""/>
                        <svg-icon slot="reference"  :icon-class="item.icon" />
                    </el-popover>
    
                    <svg-icon v-else :icon-class="item.icon" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data(){
            return {
                menu: [
                    {title: '项目', path: '/projects'},
                    {title: '数据模板', path: '/template'},
                    {title: '使用指南', path: '/guide'},
                ],
                footer: [
                    {icon: 'github', url: 'https://github.com/mocobk'},
                    {icon: 'wechat', url: 'http://mocobk.test.upcdn.net/image/2020-8-30-17-33-41.png'},
                    {icon: 'jianshu', url: 'https://www.jianshu.com/u/6157e0d33d02'},
                ]
                
            }
        },
        computed:{
           currentPath(){
               return this.$route.path
           }
        },
        methods: {
            toPath(path){
                this.$router.push({path: path})
            },
            openAdmin(){
                window.open('/admin', '_blank')
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";
    
    .container {
        display: -webkit-flex; /* Safari */
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        .header{
            z-index: 1;
            height: 80px;
            box-shadow: 0 0.5px 10px 0.2px rgba(67, 67, 67, 0.08);
            .header-content{
                width: 85vw;
                height: 100%;
                margin: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .header-logo {
                    img{
                        height: 60px;
                    }
                }
                .header-menu {
                    display: flex;
                    align-items: stretch;
                    height: 100%;
                    .menu-item {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        font-size: 1.3em;
                        color: $--font-color-primary;
                        opacity: 0.5;
                        margin-left: 40px;
                        &:hover {
                            opacity:1;
                        }
                    }
                    .menu-item-active {
                        opacity:1;
                        position: relative;
                        &::after {
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            height: 3px;
                            background: $--color-primary;
                            content: "";
                        }
                    }
                }
                
            }
        }
        .main{
            flex-grow: 1;
            background-color: #F3F3F3;
            display: flex;
            justify-content: center;
        }
        .footer {
            height: 50px;
            box-shadow: 0 -0.5px 10px 0.2px rgba(67, 67, 67, 0.08);
            .footer-content{
                width: 85vw;
                margin: auto;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                svg{
                    height: 20px;
                    width: 20px;
                    cursor: pointer;
                    opacity: 0.5;
                    margin: 0 30px;
                    color: $--font-color-primary;
                    &:hover {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            }
        }
    }

</style>
