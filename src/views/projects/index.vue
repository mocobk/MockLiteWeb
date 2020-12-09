<template>
    <div class="view-box">
        <div class="search">
            <el-input
                placeholder="请输入关键字"
                v-model="searchWords"
                @keyup.enter.native="searchProjects"
                @clear="searchProjects"
                clearable>
            </el-input>
            <el-button
                class="search-btn"
                icon="el-icon-search"
                circle
                title="搜索"
                @click="searchProjects"
            ></el-button>
        </div>
        
        <div class="cards">
            <el-card class="add" shadow="hover" title="创建项目" @click.native="showCreateDialog">
                <i class="el-icon-plus"></i>
            </el-card>
            
            <el-card v-for="(item, index) in projects" :key="index" shadow="hover" @click.native="goMockData(item)">
                <div slot="header" class="header" :style="getCardStyle(item)">
                    <div class="header-text">{{item.name}}</div>
                    <div class="header-btn">
                        <el-button icon="el-icon-edit-outline" size="mini" circle title="编辑"
                                   @click.stop="showEditDialog(index, item)"></el-button>
                        <el-button icon="el-icon-delete" size="mini" circle title="删除"
                                   @click.stop="deleteProjectData(index, item.id)"></el-button>
                    </div>
                </div>
                <div class="description">
                    {{item.description || '没有描述'}}
                </div>
            </el-card>
            
            <i v-for="i in 3" :key="i - 4" class="el-card-fill"></i>
        </div>
        <formDialog :data="dialogData || defaultDialogData" @close="dialogData.visible = false"
                    @success="commitSuccess"></formDialog>
    </div>
</template>

<script>
    import {getProjects, getProjectById, deleteProject} from '@/api/mock'
    import formDialog from '@/views/projects/FormDialog'
    
    export default {
        name: 'Projects',
        components: {
            formDialog
        },
        data() {
            return {
                searchWords: '',
                projects: [],
                defaultDialogData: {
                    title: '创建项目',
                    item: {id: null, name: '', description: '', color: '#35363d'},
                    visible: false,
                    index: undefined
                },
                dialogData: undefined
            }
        },
        created() {
            this.getProjectsData()
        },
        methods: {
            getProjectsData(params = null) {
                getProjects(params).then(res => {
                    this.projects = res.data
                })
            },
            searchProjects() {
                const params = this.searchWords ? {search_words: this.searchWords} : null
                this.getProjectsData(params)
            },
            getCardStyle(item) {
                if (item.color) {
                    return {'background-color': item.color}
                } else {
                    return {}
                }
            },
            deleteProjectData(index, id) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProject(id).then(() => {
                        this.projects.splice(index, 1)
                    }).catch()
                })
            },
            showCreateDialog() {
                this.dialogData = {...this.defaultDialogData, item: {...this.defaultDialogData.item}, visible: true}
            },
            showEditDialog(index, item) {
                this.dialogData = {
                    title: '编辑项目',
                    item: {...item, color: item.color || this.defaultDialogData.item.color},
                    visible: true,
                    index: index
                }
            },
            commitSuccess() {
                if (this.dialogData.index !== undefined) {
                    // 编辑，更新单个数据
                    getProjectById(this.dialogData.item.id).then((res) => {
                        // 响应式更新
                        this.$set(this.projects, this.dialogData.index, res)
                    })
                } else {
                    // 更新所有数据
                    this.getProjectsData()
                }
            },
            goMockData(project) {
                this.$router.push({name: 'mockData', params: {id: project.id, projectName: project.name}})
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";
    
    .view-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 75vw;
        
        .search {
            .el-input {
                width: 40vw;
                margin: 30px 20px 40px 0;
                
                ::v-deep {
                    .el-input__inner {
                        border-radius: 20px;
                    }
                }
            }
        }
        
        .cards {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
            $card-width: 280px;
            $card-margin: 10px;
            
            .add {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2.5em;
                color: #e5e5e5;
                
                &:hover {
                    color: $--color-primary;
                }
            }
            
            .el-card {
                margin: $card-margin;
                width: $card-width;
                height: 150px;
                
                &:hover {
                    cursor: pointer;
                }
                
                ::v-deep {
                    .el-card__header {
                        padding: 0;
                        border-bottom: none;
                    }
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 20px;
                    background-color: #606266;
                    
                    .header-text {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        color: rgb(255, 255, 255, 0.8);
                    }
                    
                    .header-btn {
                        flex-shrink: 0;
                        
                        button {
                            background-color: rgb(255, 255, 255, 0.2);
                            border: 0;
                            color: rgb(255, 255, 255, 0.8);
                            
                            &:hover {
                                transform: scale(1.2);
                            }
                        }
                    }
                }
                
                .description {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    word-wrap: break-word;
                    word-break: break-all;
                    font-size: 0.85em;
                    color: $--color-info;
                }
                
                
            }
            
            ::v-deep {
                .is-hover-shadow:hover {
                    box-shadow: 0 5px 50px 0 rgba(0, 0, 0, .1);
                }
            }
            
            .el-card-fill {
                margin: 0 $card-margin;
                width: $card-width;
            }
            
        }
    }

</style>
