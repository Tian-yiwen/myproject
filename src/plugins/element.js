/* eslint-disable import/no-duplicates */
import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// message必须全局挂载在Vue的原型上
Vue.prototype.$message = Message
