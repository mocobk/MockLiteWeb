<template>
    <el-dialog v-el-click-modal :title="data.title" :visible.sync="data.visible" @close="clearValidate">
        <el-form :model="data.item" :rules="formRules" ref="commitProjectForm">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="data.item.name"></el-input>
            </el-form-item>
            <el-form-item label="项目描述">
                <el-input type="textarea" :rows="4" v-model="data.item.description" placeholder="请输入项目描述"></el-input>
            </el-form-item>
            <el-form-item label="选择卡片颜色" class="card-color-item">
                <el-color-picker
                    v-model="data.item.color"
                    show-alpha
                    size="small"
                    :predefine="predefineColors">
                </el-color-picker>
            </el-form-item>
        </el-form>
        
        <div slot="footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="commitProjectData">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {addProject, updateProject} from '@/api/mock'
    
    export default {
        name: 'FormDialog',
        props: {
            data: Object,
        },
        data() {
            return {
                predefineColors: [
                    '#407434',
                    '#a12f2f',
                    '#ac5118',
                    '#458994',
                    '#5b4a42',
                    '#9f7d50',
                    '#4e1d4c',
                    '#005aab',
                    '#35363d',
                ],
                formRules: {
                    'name': [
                        {required: true, message: '请输入项目名称', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            closeDialog() {
                this.$emit('close')
            },
            commitProjectData() {
                this.$refs['commitProjectForm'].validate((valid) => {
                    if (valid) {
                        const api = this.data.title === '创建项目' ? addProject : (data) => updateProject(this.data.item.id, data)
                        api(this.data.item).then(() => {
                                this.$emit('success')
                                this.closeDialog()
                            }
                        )
                    }
                });
            },
            clearValidate(){
                this.$refs['commitProjectForm'].clearValidate()
            }
        }
        
    }
</script>

<style scoped lang="scss">
    .card-color-item {
        ::v-deep {
            .el-form-item__content {
                display: flex;
                align-items: center;
                height: 40px;
            }
        }
    }
    
    .el-color-picker {
        ::v-deep {
            .el-color-picker__trigger {
                padding: 0;
                border: none;
                
                .el-color-picker__color {
                    border-radius: 50%;
                    box-sizing: border-box;
                    border-color: rgba(128, 128, 128, 0.3);
                    
                    .el-color-picker__color-inner {
                        border-radius: inherit;
                    }
                }
            }
        }
    }

</style>
