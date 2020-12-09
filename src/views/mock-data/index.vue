<template>
    <div class="view-box">
        <div class="container">
            <div class="header">
                <el-page-header @back="goProjectsPage" :content="projectName" />
                
                <div class="header-form">
                    <el-input
                        placeholder="输入关键字搜索"
                        v-model="searchWords"
                        size="mini"
                        @keyup.enter.native="searchMockData"
                        @clear="searchMockData"
                        clearable>
                    </el-input>
                    
                    <el-button
                        size="mini"
                        plain
                        round
                        @click="showCreateDialog"
                    >
                        新增
                    </el-button>
                    <el-button
                        v-if="selections.length > 0"
                        size="mini"
                        type="danger"
                        plain
                        round
                        @click="deleteSelectedMockData"
                    >
                        批量删除
                    </el-button>
                </div>
            </div>
            
            <div class="table">
                <div style="flex-grow: 1; width: 100%; position: relative; margin-bottom: 20px">
                    <div style="position: absolute; width: 100%; height: 100%">
                        <!-- 外层包了2层div解决页面切换重新渲染table时，分页组件会向上抖动现象
                        https://blog.csdn.net/DLGDark/article/details/107785197
                        -->
                        <el-table
                            v-if="showTableComponent"
                            ref="table"
                            :data="tableData"
                            height="100%"
                            row-key="id"
                            lazy
                            :load="loadChildren"
                            :tree-props="{children: 'children', hasChildren: 'has_children'}"
                            :indent="0"
                            @selection-change="selections = $event"
                            @select-all="handleSelectAll"
                        >
                            <el-table-column
                                type="selection"
                                width="45">
                            </el-table-column>
                            
                            <el-table-column
                                width="45">
                            </el-table-column>
                            
                            <el-table-column
                                type="index"
                                width="45">
                            </el-table-column>
                            
                            <el-table-column
                                property="method"
                                label="方法"
                                align="left"
                                width="100">
                                <template slot-scope="scope">
                                    <div :class="['method-tag', 'method-tag--small', scope.row.method.toLowerCase()]">
                                        {{scope.row.method}}
                                    </div>
                                </template>
                            </el-table-column>
                            
                            <el-table-column
                                property="url"
                                header-align="center"
                                label="URL匹配">
                            </el-table-column>
                            
                            <el-table-column
                                property="match_type"
                                align="center"
                                label="匹配模式"
                                width="100">
                                <template slot-scope="scope">
                                    {{scope.row.match_type===1 ? '正则': '包含'}}
                                </template>
                            </el-table-column>
                            
                            <el-table-column
                                property="code"
                                header-align="center"
                                align="center"
                                label="响应码"
                                width="100">
                            </el-table-column>
                            
                            <el-table-column
                                property="description"
                                header-align="center"
                                label="描述">
                            </el-table-column>
                            
                            <el-table-column
                                property="status"
                                align="center"
                                label="是否启用"
                                width="100">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                               size="small" @change="switchStatus(scope.row)($event)"></el-switch>
                                </template>
                            </el-table-column>
                            
                            <el-table-column
                                label="操作"
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" plain
                                               @click="showEditDialog(scope.row)">编辑
                                    </el-button>
                                    <el-button type="success" size="mini" plain
                                               @click="showCopyCreateDialog(scope.row)">复制
                                    </el-button>
                                    <el-button type="danger" size="mini" plain
                                               @click="deleteMockData(scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                
                <el-pagination
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange"
                    :current-page.sync="pagination.page"
                    :page-sizes="pagination.pageSizes"
                    :page-size.sync="pagination.pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="pagination.total">
                </el-pagination>
            </div>
            
            <formDialog
                :data="dialogData || defaultDialogData"
                @close="dialogData.visible = false"
                @success="handleDialogCommitSuccess">
            </formDialog>
        </div>
    
    </div>
</template>

<script>
    import formDialog from '@/views/mock-data/components/FormDialog'
    import {
        getProjectById,
        getMockData,
        getFilterMockData,
        getMockDataById,
        putMockData,
        deleteMockData,
        batchDeleteMockData
    } from '@/api/mock'
    
    export default {
        name: 'MockData',
        components: {
            formDialog
        },
        data () {
            return {
                projectName: '',
                searchWords: '',
                tableData: [],
                showTableComponent: true,
                rowChildren: {},
                selectAllStatus: false,
                selections: [],
                defaultDialogData: {
                    title: '新增',
                    formData: {
                        project_id: this.$route.params.id,
                        url: '',
                        method: 'GET',
                        match_type: 0,
                        code: 200,
                        content_type: 'application/json',
                        headers: '',
                        description: '',
                        response: '',
                        status: 1,
                    },
                    visible: false,
                },
                dialogData: undefined,
                pagination: {
                    page: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 50, 100],
                    total: 0
                },
            }
        },
        created () {
            // 从项目页跳转过来，直接取 projectName, 地址访问则请求接口
            if (this.$route.params.projectName){
                this.projectName = this.$route.params.projectName
            } else {
                getProjectById(this.$route.params.id).then((res) => {
                    this.projectName = res.name
                })
            }
            // 优先使用 url 上的分页参数
            this.pagination.page = this.$route.query.page * 1 || this.pagination.page
            this.pagination.pageSize = this.$route.query.pageSize * 1 || this.pagination.pageSize
            
            this.requestMockData()
        },
        methods: {
            goProjectsPage () {
                this.$router.push({ name: 'projects' })
            },
            requestMockData () {
                getMockData({
                    page: this.pagination.page,
                    page_size: this.pagination.pageSize,
                    search_words: this.searchWords.trim() || null,
                    project_id: this.$route.params.id
                }).then(res => {
                    // 这里利用 v-if 实现强制重新渲染 el-table
                    // 避免搜索后的列表展开树子节点报错 Error in render: "RangeError: Maximum call stack size exceeded
                    // 猜想：同一个 id 的行即渲染到了父节点又渲染到子节点造成
                    this.showTableComponent = false
                    this.$nextTick(() => {
                        this.showTableComponent = true
                    })
                    
                    this.tableData = res.data
                    this.pagination.total = res.total
                    // 还原选择状态
                    this.selectAllStatus = false
                    this.selections = []
                })
            },
            searchMockData () {
                this.pagination.page = 1
                this.requestMockData()
            },
            handlePageSizeChange (pageSize) {
                this.$router.replace({ query: { ...this.$route.query, pageSize } })
                this.requestMockData()
            },
            handleCurrentPageChange (page) {
                this.$router.replace({ query: { ...this.$route.query, page } })
                this.requestMockData()
            },
            handleSelectAll (selection) {
                const rowChildrenKeys = Object.keys(this.rowChildren)
                this.selectAllStatus = !this.selectAllStatus
                rowChildrenKeys.forEach(key => {
                    this.rowChildren[key].forEach(row => {
                        this.$refs.table.toggleRowSelection(row, this.selectAllStatus)
                    })
                })
            },
            loadChildren (row, treeNode, resolve) {
                getFilterMockData({
                    project_id: this.$route.params.id,
                    method: row.method,
                    url: row.url,
                    match_type: row.match_type,
                    parent_id: row.id,
                }).then(res => {
                    this.rowChildren[row.id] = res
                    resolve(this.rowChildren[row.id])
                    this.rowChildren[row.id].forEach(row => {
                        this.$refs.table.toggleRowSelection(row, this.selectAllStatus)
                    })
                })
            },
            
            showCreateDialog () {
                this.dialogData = {
                    ...this.defaultDialogData,
                    formData: { ...this.defaultDialogData.formData },
                    visible: true
                }
            },
            showCopyCreateDialog (data) {
                this.dialogData = {
                    ...this.defaultDialogData,
                    formData: { ...data, id: null, status: 1 },
                    visible: true
                }
            },
            showEditDialog (row) {
                this.dialogData = {
                    title: '编辑',
                    formData: { ...row },
                    visible: true,
                    isEdit: true
                }
            },
            findRowIndex (dataArray) {
                // 遍历查找对应 id 的位置
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].id === this.dialogData.formData.id) {
                        return i
                    }
                }
            },
            findParentRowIndex () {
                return this.findRowIndex(this.tableData)
            },
            findChildrenRowIndex () {
                const keys = Object.keys(this.rowChildren)
                for (let i = 0; i < keys.length; i++) {
                    const index = this.findRowIndex(this.rowChildren[keys[i]])
                    if (index !== undefined) {
                        return { key: keys[i], index }
                    }
                }
            },
            handleDialogCommitSuccess () {
                if (this.dialogData.isEdit) {
                    
                    // 编辑，目的只更新单个数据
                    getMockDataById(this.dialogData.formData.id).then((res) => {
                        if (this.dialogData.formData.hasOwnProperty('has_children')) {
                            // 响应式更新
                            res.has_children = this.dialogData.formData.has_children
                            this.$set(this.tableData, this.findParentRowIndex(), res)
                        } else {
                            const { key, index } = this.findChildrenRowIndex()
                            this.$set(this.rowChildren[key], index, res)
                        }
                    })
                } else {
                    // 新增, 更新所有数据
                    this.searchMockData()
                }
            },
            switchStatus (row) {
                const { project_id, method, url, match_type, content_type, status, id } = row
                const data = { project_id, method, url, match_type, content_type, status, id }
                return (value) => {
                    putMockData(data).then(() => {
                    
                    }).catch(() => {
                        row.status = 1 - value
                    })
                }
            },
            deleteMockData (row) {
                // 实现局部删除刷新
                this.dialogData = {
                    formData: { ...row }
                }
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMockData(row.id).then(() => {
                        // 如果删除父节点行，则数据全部刷新
                        // 如果删除子节点行，则局部刷新，删除字节行最后一个，则数据全部刷新
                        if (this.dialogData.formData.hasOwnProperty('has_children')) {
                            this.requestMockData()
                        } else {
                            const { key, index } = this.findChildrenRowIndex()
                            this.rowChildren[key].splice(index, 1)
                            if (this.rowChildren[key].length === 0){
                                this.requestMockData()
                            }
                        }
                    })
                })
            },
            deleteSelectedMockData () {
                this.$confirm('是否确认批量删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const ids = this.selections.map(item => {
                        return item.id
                    })
                    batchDeleteMockData(ids).then(() => {
                        this.requestMockData()
                    }).catch()
                }).catch()
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "@/styles/method-theme.scss";
    @import "@/styles/variables.scss";
    
    .view-box {
        width: 75vw;
        display: flex;
        align-items: stretch;
        
        .container {
            width: 100%;
            margin: 5px 0;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 25px 0 rgba(0, 0, 0, .1);
            display: flex;
            flex-direction: column;
            
            .header {
                display: flex;
                justify-content: space-between;
                
                .el-page-header {
                    display: flex;
                    align-items: center;
                }
                
                .header-form {
                    display: flex;
                    align-items: center;
                    
                    * {
                        margin-left: 20px;
                    }
                    
                    .el-input {
                        ::v-deep {
                            .el-input__inner {
                                border-radius: 14px;
                            }
                        }
                    }
                }
            }
            
            .table {
                margin-top: 20px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                
                
                .el-table::before {
                    height: 0;
                }
                
                ::v-deep .el-table__row--level-1 {
                    background-color: rgba(245, 247, 250, 0.4);
                }
                
                .radio-tag {
                    $radio-tag-color: gray;
                    
                    ::v-deep {
                        .el-radio__inner {
                            border-color: $radio-tag-color;
                            background: #fff;
                            cursor: auto;
                        }
                        
                        .el-radio__label {
                            color: $radio-tag-color;
                            cursor: auto;
                        }
                    }
                }
                
                .el-button {
                    padding: 7px;
                }
            }
        }
        
        ::v-deep {
            .is-always-shadow {
                box-shadow: 0 0 25px 0 rgba(0, 0, 0, .1);
            }
        }
    }


</style>
