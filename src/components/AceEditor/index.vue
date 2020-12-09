<template>
    <div style="width: 100%; height: 100%; position: relative">
        <VueAceEditor
            :height="height"
            :width="width"
            v-model="content"
            :options="editorOptions"
            :lang="lang"
            :theme="theme"
            @init="editorInit"
        >
        </VueAceEditor>
        <span v-if="showFormatBtn" class="format-btn" @click.prevent="formatValue"
        >格式化</span
        >
    </div>
</template>

<script>
    import VueAceEditor from 'vue2-ace-editor';
    
    export default {
        name: 'AceEditor',
        model: {
            prop: 'value',
            event: 'valueChange',
        },
        props: {
            value: {
                type: String,
            },
            showFormatBtn: {
                type: Boolean,
                default: false,
            },
            lang: {
                type: String,
                default: 'json',
            },
            theme: {
                type: String,
                default: 'monokai',
            },
            fontSize: {
                type: Number,
                default: 16,
            },
            width: {
                type: [String, Number],
                default: '100%',
            },
            height: {
                type: [String, Number],
                default: '100%',
            },
            
            className: {
                type: String,
                default: 'vue-ace-editor',
            },
            options: {
                type: Object,
                default: () => ({}),
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            completeData: {
                type: Array,
                default: undefined,
            },
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
            };
            
            return {
                editorOptions: {...defaultOptions, ...this.options},
                editor: undefined,
                session: undefined,
            };
        },
        computed: {
            content: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('valueChange', value);
                },
            },
        },
        methods: {
            editorInit(editor) {
                require(`brace/ext/language_tools`);
                require(`brace/mode/${this.lang}`);
                // require(`brace/snippets/${this.lang}`);
                require(`@/utils/mock-snippets`);
                require(`brace/theme/${this.theme}`);
                this.editor = editor;
                this.session = editor.getSession();
                
                this.editor.setFontSize(this.fontSize);
                this.editor.setReadOnly(this.readonly);
                
                if (this.completeData) {
                    this.setCompleteData(this.completeData);
                }
            },
            onChange(edit) {
                this.$emit('valueChange', edit.getValue());
            },
            formatValue() {
                try {
                    const json = JSON.parse(this.value);
                    this.session.setValue(JSON.stringify(json, null, 4));
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        this.$message.error('抱歉！您的 JSON 数据格式有误，请检查');
                    } else {
                        console.error(e);
                    }
                }
            },
            setCompleteData(data) {
                const ace = require('brace');
                ace.acequire('ace/ext/language_tools').addCompleter({
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        return callback(null, data);
                    },
                });
            },
        },
    };
</script>

<!--suppress SpellCheckingInspection -->
<style scoped lang="scss">
    .format-btn {
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
        
        &:hover {
            background-color: rgb(255, 255, 255, 0.3);
        }
    }
    
    ::v-deep {
        .ace-monokai {
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            ::-webkit-scrollbar-track {
                border-radius: 3px;
                background: rgba(31, 31, 31, 0.5);
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
            }
            
            ::-webkit-scrollbar-thumb {
                border-radius: 3px;
                background: rgba(184, 184, 184, 0.5);
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
            }
        }
    }
</style>
