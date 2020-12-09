<template>
        <el-input placeholder="请输入 URL 匹配内容" v-model="data.formData.url">
            <el-select
                v-model="data.formData.method"
                slot="prepend"
                default-first-option
            >
                <el-option v-for="method in options.methods" :key="method" :label="method" :value="method"></el-option>
            </el-select>
            <el-checkbox
                v-model="data.formData.match_type"
                slot="append"
                :true-label="1"
                :false-label="0"
            >正则匹配
                <el-tooltip class="item" effect="dark" content="勾选则表示 URL 为正则表达式" placement="top">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-checkbox>
        </el-input>

</template>

<script>
    import ConstData from '@/utils/const'


    export default {
        name: 'UrlMatchForm',
        props: ['data'],
        data(){
            return {
                options: {
                    methods: ConstData.methods
                },
    
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-select {
        ::v-deep{
            .el-input {
                width: 110px;
            }
        }
    }

</style>
