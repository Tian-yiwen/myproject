/* eslint-disable import/no-duplicates */
import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)

Vue.use(MenuItem)
// message必须全局挂载在Vue的原型上
Vue.prototype.$message = Message
