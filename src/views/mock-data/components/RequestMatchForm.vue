<template>
  <div>
    <el-form-item label="请求匹配规则" prop="url">
      <div class="match-item">
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
        <div class="option-btn">
          <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addRule(-1)"></el-button>
          <el-button type="danger" icon="el-icon-minus" size="mini" circle disabled></el-button>
        </div>
      </div>
    </el-form-item>

    <div class="match-item" v-for="(requestRule, index) in data.formData.request" :key="index">
      <el-input
        v-model="requestRule.key"
        :style="{width: '50%'}"
        :placeholder="requestRule.placeholder ? requestRule.placeholder : 'Key'"
        :disabled="requestRule.disableKeyInput"
      >
        <el-select
          v-model="requestRule.type"
          slot="prepend"
          default-first-option
          @change="handleRuleTypeChange($event, requestRule)"
        >
          <el-option v-for="type in options.types" :key="type" :label="type" :value="type"></el-option>
        </el-select>
      </el-input>

      <el-input placeholder="value" v-model="requestRule.value">
        <el-checkbox
          v-model="requestRule.match_type"
          slot="append"
          :true-label="1"
          :false-label="0"
        >正则匹配
          <el-tooltip class="item" effect="dark" content="勾选则表示 URL 为正则表达式" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-checkbox>
      </el-input>

      <div class="option-btn">
        <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addRule(index)"></el-button>
        <el-button type="danger" icon="el-icon-minus" size="mini" circle @click="removeRule(index)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ConstData from '@/utils/const'


export default {
  name: 'UrlMatchForm',
  props: ['data'],
  data() {
    return {
      options: {
        methods: ConstData.methods,
        types: ConstData.requestBodyType
      }
    }
  },
  methods: {
    addRule(index) {
      this.data.formData.request.splice(index + 1, 0, {type: 'form-data', key: null, value: null, match_type: 0})
    },
    removeRule(index) {
      this.data.formData.request.splice(index, 1)
    },
    handleRuleTypeChange(value, requestRule) {
      if (value === 'GraphQL') {
        requestRule.key = 'Name'
        requestRule.disableKeyInput = true
      } else if (value === 'json') {
        requestRule.placeholder = 'JsonPath'
        requestRule.disableKeyInput = false
      } else {
        requestRule.disableKeyInput = false
        requestRule.placeholder = 'Key'
        requestRule.key = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-select {
  ::v-deep {
    .el-input {
      width: 110px;
    }
  }
}

.match-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .option-btn {
    margin-left: 20px;
    flex-shrink: 0;
  }

  ::v-deep {
    .el-input__inner {
      border-radius: 0;
    }
  }
}

</style>
