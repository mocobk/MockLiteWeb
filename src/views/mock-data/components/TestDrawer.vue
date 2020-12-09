<template>
    <el-drawer
        v-el-click-modal
        :visible.sync="show"
        size="50%"
        :with-header="false"
        append-to-body>
        
        <div class="container">
            <div class="title">匹配规则</div>
            <UrlMatchForm :data="data"></UrlMatchForm>
            
            <div class="title">目标 URL</div>
            <el-input placeholder="请输入接口的 URL" v-model="url">
                <el-button class="test-btn" slot="append" @click="runTest">
                    <div v-if="showResultIcon">
                        <i v-if="isMatch" class="el-icon-success" style="color: #67C23A;"></i>
                        <i v-else class="el-icon-error" style="color: #F56C6C;"></i>
                    </div>
                    测试
                </el-button>
            </el-input>
            
            <div class="title">
                返回结果
                <span class="clipboard-btn" @click="copyResult" title="复制">
                    <svg-icon icon-class="clipboard" />
                </span>
            </div>
            
            <el-tabs type="border-card" @tab-click="onTabClick">
                <el-tab-pane label="Body" class="response-content">
                    <AceEditor
                        v-model="response"
                        theme="xcode"
                        lang="json"
                        :options="{highlightActiveLine: false}"
                        :readonly="true" />
                </el-tab-pane>
                
                <el-tab-pane label="Headers" class="response-content">
                    <AceEditor
                        v-model="headers"
                        theme="xcode"
                        lang="json"
                        :options="{highlightActiveLine: false}"
                        :readonly="true" />
                </el-tab-pane>
            </el-tabs>
        </div>
    
    
    </el-drawer>
</template>

<script>
    import AceEditor from '@/components/AceEditor'
    import UrlMatchForm from '@/views/mock-data/components/UrlMatchForm'
    import handleClipboard from '@/utils/clipboard'
    import {testMockData} from '@/api/mock'
    
    export default {
        name: 'TestDrawer',
        props: ['visible', 'data'],
        components: {AceEditor, UrlMatchForm},
        data() {
            return {
                url: '',
                isMatch: true,
                showResultIcon: false,
                headers: '',
                response: '',
                tabContent: ''
            }
        },
        computed: {
            show: {
                get() {
                    return this.visible
                },
                set(value) {
                    this.$emit('update:visible', value)
                }
            }
        },
        methods: {
            copyResult(event) {
                handleClipboard(this.tabContent, event)
            },
            onTabClick(tab, e){
                // bug 可能因为是双层 dialog， tabs v-model 失效，采用监听 tab-click 事件代替
                this.tabContent = tab.label === 'Body' ? this.response : this.headers
            },
            runTest() {
                this.showResultIcon = false
                testMockData({
                    url: this.data.formData.url,
                    match_type: this.data.formData.match_type,
                    content_type: this.data.formData.content_type,
                    headers: this.data.formData.headers,
                    response: this.data.formData.response,
                    target_url: this.url
                }).then((res) => {
                    this.response = JSON.stringify(res.response, null, 4)
                    this.headers = JSON.stringify(res.headers, null, 4)
                    this.isMatch = res.is_match
                    this.showResultIcon = true
                })
            }
            
        }
    }
</script>

<style scoped lang="scss">
    @import "@/styles/variables";
    
    .container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        height: 100%;
        
        .title {
            margin: 30px 0 10px 0;
            font-weight: bold;
            color: $--color-info;
        }
        
        .el-collapse-item {
            ::v-deep{
                .el-collapse-item__header{
                    color: $--color-info;
                }
            }
        }
        
        .test-btn {
            ::v-deep {
                span {
                    display: flex;
                    align-items: center;
                }
            }
        }
        
        .el-tabs {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            box-shadow: none;
            
            ::v-deep {
                .el-tabs__content {
                    flex-grow: 1;
                    height: 100%;
                    padding: 5px;
                    
                    .el-tab-pane {
                        height: 100%;
                        display: flex;
                    }
                }
            }
        }
        
        .response-content {
            flex-grow: 1;
            
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
        
        .clipboard-btn {
            margin-left: 10px;
            cursor: pointer;
            position: relative;
            
            &:hover {
                color: $--color-primary;
            }
            
            &::after {
                position: absolute;
                top: -10px;
                bottom: -10px;
                left: -10px;
                right: -10px;
                content: "";
                
            }
        }
    }

</style>
