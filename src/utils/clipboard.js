import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Vue.prototype.$message({
    message: '复制成功！',
    type: 'success',
    duration: 1500
  })
}

function clipboardError() {
  Vue.prototype.$message({
    message: '复制失败！',
    type: 'warning',
    duration: 1500
  })
}

function clipboardEmpty() {
  Vue.prototype.$message({
    message: '复制失败！内容为空',
    type: 'warning',
    duration: 1500
  })
}

export default function handleClipboard(text, event, success=clipboardSuccess, error=clipboardError) {
  // debugger;
  // const clipboard = new Clipboard(event.target, {
  if (text === '') {
    clipboardEmpty()
  }
  const clipboard = new Clipboard(document.body, {
    text: () => text
  })
  clipboard.on('success', () => {
    success()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    error()
    clipboard.destroy()
  })
  // 下面这不能删，不然要点两次才能复制
  clipboard.onClick(event)
}
