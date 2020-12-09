<template>
    <div class="view-box">
        <div class="container">
            <div class="header">
                <el-page-header @back="goProjectsPage" :content="currentProject.name" />
                
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
                <el-table
                    v-if="showTableComponent"
                    :data="tableData"
                    row-key="id"
                    lazy
                    :load="loadChildren"
                    :tree-props="{children: 'children', hasChildren: 'has_children'}"
                    :indent="0"
                    @selection-change="selections = $event"
                    height="100%"
                    v-el-table-infinite-scroll="loadMore"
                    :infinite-scroll-distance="100"
                >
                    <el-table-column
                        type="selection"
                        width="50">
                    </el-table-column>
    
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>
    
                    <el-table-column
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
                        label="匹配">
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
                                       @click="showEditDialog(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button type="success" size="mini" plain @click="showCopyCreateDialog(scope.row)">复制
                            </el-button>
                            <el-button type="danger" size="mini" plain
                                       @click="deleteMockData(scope.$index, scope.row.id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <formDialog
                :data="dialogData || defaultDialogData"
                @close="dialogData.visible = false"
                @success="commitSuccess">
            </formDialog>
        </div>
    
    </div>
</template>

<script>
    import formDialog from '@/views/mock-data/components/FormDialog'
    import elTableInfiniteScroll from 'el-table-infinite-scroll';
    import {getProjectById, getMockData, getFilterMockData, getMockDataById, putMockData, deleteMockData, batchDeleteMockData} from '@/api/mock'
    
    export default {
        name: 'MockData',
        components: {
            formDialog
        },
        directives: {
            'el-table-infinite-scroll': elTableInfiniteScroll
        },
        data() {
            return {
                currentProject: {},
                searchWords: '',
                tableData: [],
                showTableComponent: true,
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
                    index: undefined
                },
                dialogData: undefined,
                page: 1,
                pageSize: 10,
                totalPage: 1,
                locking: false
            }
        },
        created() {
            getProjectById(this.$route.params.id).then((res) => {
                this.currentProject = res
            })
        },
        methods: {
            goProjectsPage() {
                this.$router.push({name: 'projects'})
            },
            requestMockData() {
                getMockData({
                    page: this.page,
                    page_size: this.pageSize,
                    search_words: this.searchWords.trim() || null,
                    project_id: this.$route.params.id
                }).then(res => {
                    this.tableData = this.tableData.concat(res.data);
                    this.totalPage = res.pages
                    this.page++
                    this.locking = false
                })
            },
            loadMore() {
                if (this.page <= this.totalPage && !this.locking) {
                    this.locking = true  // 请求是异步的，避免同时请求相同页
                    this.requestMockData()
                }
            },
            loadChildren(row, treeNode, resolve){
                getFilterMockData({
                    project_id: this.$route.params.id,
                    method: row.method,
                    url: row.url,
                    match_type: row.match_type,
                    parent_id: row.id,
                }).then(res=>{
                    resolve(res)
                })
            },
            searchMockData() {
                // 这里利用 v-if 实现强制重新渲染 el-table
                // 避免搜索后的列表展开树子节点报错 Error in render: "RangeError: Maximum call stack size exceeded
                // 猜想：同一个 id 的行即渲染到了父节点又渲染到子节点造成
                this.showTableComponent= false
                this.$nextTick(()=>{
                    this.showTableComponent = true
                })
    
                this.page = 1
                this.totalPage = 0  // 避免搜索时同时触发 loadMore
                this.tableData = []
                this.requestMockData()
            },
            commitSuccess() {
                if (this.dialogData.index !== undefined) {
                    // 编辑，更新单个数据
                    getMockDataById(this.dialogData.formData.id).then((res) => {
                        // 响应式更新
                        this.$set(this.tableData, this.dialogData.index, res)
                    })
                } else {
                    // 新增，重置搜索关键字，更新所有数据
                    this.searchWords = ''
                    this.searchMockData()
                }
            },
            showCreateDialog() {
                this.dialogData = {
                    ...this.defaultDialogData,
                    formData: {...this.defaultDialogData.formData},
                    visible: true
                }
            },
            showCopyCreateDialog(data) {
                this.dialogData = {
                    ...this.defaultDialogData,
                    formData: {...data, id: null, status: 1},
                    visible: true
                }
            },
            showEditDialog(index, data) {
                this.dialogData = {
                    title: '编辑',
                    formData: {...data},
                    visible: true,
                    index: index
                }
            },
            switchStatus(data) {
                return (value) => {
                    putMockData(data).then(() => {
                    
                    }).catch(() => {
                        data.status = 1 - value
                    })
                }
            },
            deleteMockData(index, id) {
                console.log(index, id)
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMockData(id).then(() => {
                        this.tableData.splice(index, 1)
                    }).catch()
                })
            },
            deleteSelectedMockData() {
                this.$confirm('是否确认批量删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const ids = selections.map(item=>{
                        return item.id
                    })
                    batchDeleteMockData(ids).then(() => {
                        this.searchMockData()
                    }).catch()
                })
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
                
                .el-table::before {
                    height: 0;
                }
                ::v-deep .el-table__row--level-1{
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
