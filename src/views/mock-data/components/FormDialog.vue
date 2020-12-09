<template>
    <el-dialog v-el-click-modal :title="data.title" width="60%" :visible.sync="data.visible" @close="clearValidate" ref="dialog">
        <el-form :model="data.formData" label-position="top" :rules="formRules" ref="commitMockDataForm">
            <el-form-item label="匹配规则" prop="url">
                <UrlMatchForm :data="data"></UrlMatchForm>
            </el-form-item>
            
            <el-form-item label="响应内容">
                <div class="response">
                    <div class="response-item response-options">
                        <div>
                            <label>HTTP 状态码</label>
                            <el-select
                                v-model="data.formData.code"
                                filterable
                                allow-create
                                size="mini"
                                field="code"
                            >
                                <el-option
                                    v-for="code in options.statusCode"
                                    :key="code"
                                    :label="code"
                                    :value="code">
                                </el-option>
                            </el-select>
                        </div>
                        
                        <div>
                            <label>Content-Type</label>
                            <el-select
                                v-model="data.formData.content_type"
                                filterable
                                allow-create
                                size="mini"
                                field="code"
                            >
                                <el-option
                                    v-for="item in options.contentType"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </div>
                        
                        <div>
                            <label>自定义 Headers</label>
                            <el-checkbox
                                v-model="isAddHeaders"
                            >
                            </el-checkbox>
                        </div>
                    </div>
                    
                    <div v-if="isAddHeaders" class="response-item">
                        <label>Response Header</label>
                        <AceEditor
                            v-model="data.formData.headers"
                            :options="{minLines: 6, maxLines: 12,}"
                            :completeData="codeCompleteData"
                            showFormatBtn
                        />
                    </div>
                    
                    <div class="response-item">
                        <label>Response Body</label>
                        <AceEditor
                            v-model="data.formData.response"
                            :options="{minLines: 6, maxLines: 30,}"
                            showFormatBtn
                        />
                    </div>
                </div>
            </el-form-item>
            
            <el-form-item label="描述">
                <el-input type="textarea" :rows="2" v-model="data.formData.description" placeholder="请输入描述"></el-input>
            </el-form-item>
        
        </el-form>
        
        
        <div slot="footer">
            <div>
                <span style="margin-right: 10px; font-size: 0.8em">是否开启</span>
                <el-switch v-model="data.formData.status" :active-value="1" :inactive-value="0"></el-switch>
            </div>
            <svg-icon icon-class="more"  class="open-panel" title="打开测试面板" @click="testDrawerVisible=true" />
            <div>
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="commitMockData">确 定</el-button>
            </div>
        </div>
        
        <TestDrawer :data="data" :visible="testDrawerVisible" @update:visible="testDrawerVisible = $event"></TestDrawer>
    </el-dialog>
</template>

<script>
    import AceEditor from '@/components/AceEditor'
    import ConstData from '@/utils/const'
    import TestDrawer from '@/views/mock-data/components/TestDrawer'
    import UrlMatchForm from '@/views/mock-data/components/UrlMatchForm'
    import {postMockData, putMockData} from '@/api/mock'
    
    export default {
        name: 'FormDialog',
        components: {
            AceEditor, TestDrawer, UrlMatchForm
        },
        props: {
            data: Object,
        },
        data() {
            return {
                testDrawerVisible: false,
                options: {
                    statusCode: ConstData.statusCode,
                    contentType: ConstData.contentType
                },
                formRules: {
                    'url': {required: true, message: '请输入 URL 匹配规则', trigger: 'blur'}
                },
                isClickModal: false
                
            }
        },
        computed: {
            isAddHeaders: {
                get() {
                    return !!this.data.formData.headers
                },
                set(value) {
                    if (!value) {
                        this.data.formData.headers = null
                    } else {
                        this.data.formData.headers = '{}'
                    }
                }
            }
        },
        
        methods: {
            closeDialog() {
                this.$emit('close')
            },
            commitMockData() {
                this.$refs['commitMockDataForm'].validate((valid) => {
                    if (valid && this.validateHeaders()) {
                        const api = this.data.title === '新增' ? postMockData : putMockData
                        api(this.data.formData).then(() => {
                                this.$emit('success')
                                this.closeDialog()
                            }
                        )
                    }
                });
            },
            clearValidate() {
                this.$refs['commitMockDataForm'].clearValidate()
            },
            validateHeaders(){
                if(this.isAddHeaders){
                    try {
                        JSON.parse(this.data.formData.headers)
                    }catch (e) {
                        this.$message.error('Response Header 仅支持 JSON 数据格式')
                        console.log(e)
                        return false
                    }
                }
                return true
            },
        }
        
    }
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";
    
    ::v-deep {
        .el-dialog__footer {
            color: $--color-info;
            
            div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                .open-panel {
                    cursor: pointer;
                    font-size: 32px;
                    
                    &:hover {
                        color: $--color-primary;
                    }
                }
            }
        }
    }
    
    .el-form {
        .el-form-item {
            ::v-deep {
                .el-form-item__label {
                    font-weight: bold;
                }
            }
        }
        
        .response {
            .response-item {
                margin-top: 10px;
                label {
                    font-weight: lighter;
                }
            }
            .response-item:first-child{
                margin-top: 0;
            }
            
            .response-options {
                display: flex;
                justify-content: space-between;
    
                label {
                    margin-right: 10px;
                }
                
                ::v-deep {
                    .el-input {
                        width: 200px;
                    }
                }
            }
            
        }
    }

</style>
