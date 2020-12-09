<template>
    <VueAceEditor
        :height="height"
        :content="content"
        :options="editorOptions"
        :fontSize='fontSize'
        :lang="lang"
        :className="className"
        :readonly="readonly"
        :theme="theme"
        @onChange="onChange"
        @init="editorInit">
        <span v-if="showFormatBtn" class="format-btn" @click.prevent="formatValue">格式化</span>
    </VueAceEditor>
</template>

<script>
    import VueAceEditor from 'vue2x-ace-editor'
    import ace from "brace";
    
    export default {
        name: 'AceEditor',
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        props: {
            value: {
                type: String,
            },
            showFormatBtn: {
                type: Boolean,
                default: false
            },
            lang: {
                type: String,
                default: 'json'
            },
            theme: {
                type: String,
                default: 'monokai'
            },
            fontSize: {
                type: Number,
                default: 16
            },
            width: {
                type: [String, Number],
                default: '100%'
            },
            height: {
                type: [String, Number],
                default: '100%'
            },
            
            className: {
                type: String,
                default: 'vue-ace-editor'
            },
            options: {
                type: Object,
                default: () => ({})
            },
            readonly: {
                type: Boolean,
                default: false
            },
            completeData: {
                type: Array,
                default: undefined
            }
        },
        components: {VueAceEditor},
        data() {
            const defaultOptions = {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                tabSize: 4,
                showPrintMargin: false,
                showLineNumbers: false,
                showGutter: false,
            }
            
            return {
                editorOptions: {...defaultOptions, ...this.options},
                content: '',
                editor: undefined,
                session: undefined,
            }
        },
        watch: {
            value(newValue){
                this.session.setValue(newValue)
            }
        },

        methods: {
            editorInit(editor) {
                require(`brace/ext/language_tools`)
                require(`brace/mode/${this.lang}`)
                require(`brace/snippets/${this.lang}`)
                require(`brace/theme/${this.theme}`)
                this.editor = editor
                this.session = editor.getSession()
                
                this.$nextTick(() => {
                    this.session.setValue(this.value)
                    // if (this.completeData){
                    //     this.setCompleteData(this.completeData)
                    // }
                })
            },
            onChange(edit) {
                this.$emit('valueChange', edit.getValue())
            },
            formatValue(){
                try {
                    const json = JSON.parse(this.value)
                    this.session.setValue(JSON.stringify(json, null, 4))
                }catch (e) {
                    if (e.name === 'SyntaxError'){
                        this.$message.error('抱歉！暂只支持格式化 JSON 内容')
                    }else {
                        console.log(e)
                    }
                }
            },
            setCompleteData(data) {
                ace.acequire("ace/ext/language_tools").addCompleter({
                    getCompletions: function(editor, session, pos, prefix, callback) {
                        return callback(null, data);
                    }
                });
            },
    
    
        }
    }
</script>

<style scoped lang="scss">
    .format-btn{
        position: absolute;
        z-index: 999;
        font-size: 10px;
        text-align: center;
        width: 60px;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        background-color: rgb(255, 255, 255, 0.1);
        color: #b4b4b4;
        top: 0;
        right: 0;
        &:hover{
            background-color: rgb(255, 255, 255, 0.3);
        }
    }

</style>
