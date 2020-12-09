<template>
    <div class="box">
        <div class='left'>
            <AceEditor
                v-model="leftValue"
                :options="{
                        showLineNumbers: true,
                        showGutter: true
                    }"
                showFormatBtn
            />
        </div>
        <div class="middle">
            <el-button type="primary" icon="el-icon-arrow-right" size="mini" title="转换" @click="convert"></el-button>
            
            <div class="resize" title="拖动改变左右宽度">
                ⋮
            </div>
        </div>
        <div class='right'>
            <AceEditor
                v-model="rightValue"
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(39, 40, 34, 0.5)"
                :options="{
                        showLineNumbers: true,
                        showGutter: true,
                        highlightActiveLine: false
                    }"
                :readonly="true"
            />
        </div>
    </div>
</template>

<script>
    import AceEditor from '@/components/AceEditor'
    import {testMockData} from '@/api/mock'
    
    export default {
        name: 'MockTemplate',
        components: {AceEditor},
        data() {
            return {
                leftValue: JSON.stringify({
                    'code|1': [200, 201, 204],
                    'data': {
                        'name': '@cname',
                        'age|18-30': 18
                    }
                }, null, 4),
                rightValue: JSON.stringify({
                    'code': 201,
                    'data': {
                        'age': 28,
                        'name': '康娜'
                    }
                }, null, 4),
                loading: false
            }
        },
        created(){
            const storageData = window.localStorage.getItem('data')
            if (storageData){
                this.leftValue = storageData
            }
        
        },
        mounted() {
            this.dragControllerDiv();
        },
        watch:{
            leftValue(newValue){
                window.localStorage.setItem('data', newValue)
            }
        },
        methods: {
            convert() {
                try {
                    JSON.parse(this.leftValue)
                }catch (e) {
                    if (e.name === 'SyntaxError') {
                        this.$message.error('抱歉！您的 JSON 数据格式有误，请检查');
                    } else {
                        console.log(e);
                    }
                    return
                }
                this.loading = true
                testMockData({response: this.leftValue, url: ''}).then((res) => {
                    this.rightValue = JSON.stringify(res.response, null, 4)
                }).catch()
                
                this.loading = false
            },
            
            dragControllerDiv() {
                const resize = document.getElementsByClassName('resize')
                const left = document.getElementsByClassName('left')
                const mid = document.getElementsByClassName('right')
                const box = document.getElementsByClassName('box')
                for (let i = 0; i < resize.length; i++) {
                    // 鼠标按下事件
                    resize[i].onmousedown = function (e) {
                        const startX = e.clientX
                        // 鼠标拖动事件
                        document.onmousemove = function (e) {
                            resize[i].left = startX;
                            const endX = e.clientX
                            let moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
                            const maxT = box[i].clientWidth - resize[i].offsetWidth  // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
                            if (moveLen < 150) moveLen = 150; // 左边区域的最小宽度为150px
                            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px
                            resize[i].style.left = moveLen; // 设置左侧区域的宽度
                            for (let j = 0; j < left.length; j++) {
                                left[j].style.width = (moveLen / document.body.clientWidth) * 100 + '%';
                                mid[j].style.width = ((box[i].clientWidth - moveLen) / document.body.clientWidth - 0.008) * 100 + '%';
                            }
                        };
                        // 鼠标松开事件
                        document.onmouseup = function (evt) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                        };
                        resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                        return false;
                    };
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .box {
        width: 100%;
        margin: 0 10px 10px 10px;
        display: flex;
        justify-content: space-between;
        
        .middle {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 45px;
            margin: 0 10px;
            
            .el-button {
                margin-top: 50px;
                margin-bottom: 10px;
            }
            
            .resize {
                flex-grow: 1;
                display: flex;
                width: 100%;
                cursor: col-resize;
                font-size: 2rem;
                justify-content: center;
                align-items: center;
                
                &:hover {
                    background-color: #d9d9d9;
                }
            }
        }
        
        .left {
            width: 100%;
        }
        
        .right {
            width: 100%;
            
            ::v-deep {
                /*去除 AceEditor 光标和括号高亮*/
                .ace_cursor {
                    opacity: 0;
                }
                
                .ace_bracket {
                    border: none;
                }
            }
        }
    }
</style>
