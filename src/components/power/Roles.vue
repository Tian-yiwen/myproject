<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogRoles = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.children"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialogRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogRoles"
      width="50%"
      @close="rolesDialogClosed"
    >
      <el-form
        :model="rolesForm"
        ref="rolesFormRef"
        :rules="rolesFormRules"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogRoles"
      width="50%"
      @close="rolesEditClosed"
    >
      <el-form
        :model="editRolesForm"
        ref="editRolesFormRef"
        :rules="editRolesFormRules"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogRoles = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 权限数据
      rightslist: [],
      // 控制添加对话框的显示与隐藏
      addDialogRoles: false,
      // 添加角色表单数据
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加表单的验证规则
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名称在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '角色描述在2~16个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogRoles: false,
      editRolesForm: {},
      // 修改角色的验证规则
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名称在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '角色描述在2~16个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 树形控件属性的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      console.log('p436-25')
    },
    // 监听添加角色关闭重置事件
    rolesDialogClosed() {
      this.$refs.rolesFormRef.resetFields()
    },
    // 点击按钮添加角色
    addRole() {
      this.$refs.rolesFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户的请求
        const { data: res } = await this.$http.post('roles', this.rolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        // 添加完隐藏对话框
        this.addDialogRoles = false
        this.getRolesList()
      })
    },
    // 展示修改角色对话框的信息
    async showEditDialogRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      } else {
        this.editRolesForm = res.data
        this.editDialogRoles = true
      }
    },
    // 监听修改对话框关闭后重置
    rolesEditClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 修改用户信息并提交
    editRole() {
      this.$refs.editRolesFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改角色信息失败！')
        } else {
          this.$message.success('修改角色信息成功！')
        }
        // 修改完后隐藏对话框
        this.editDialogRoles = false
        // 重新获取用户列表数据
        this.getRolesList()
      })
    },
    // 根据id删除对应用户信息
    async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      await this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色信息失败！')
          }
          this.$message({
            type: 'success',
            message: '删除角色信息成功!'
          })
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 根据id删除对应角色权限
    async removeRightById(role, rightId) {
      // 弹框询问用户是否删除数据
      await this.$confirm('此操作将永久取消该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('取消权限失败！')
          }
          this.$message({
            type: 'success',
            message: '取消权限成功!'
          })
          // this.getRolesList() 这里不用这个，防止页面刷新
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      this.setRightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      } else {
        this.rightslist = res.data
      }
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      // 如果node没有children，就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keysStr
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('角色授权失败！')
      } else {
        this.$message.success('角色授权成功！')
      }
      this.setRightDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
