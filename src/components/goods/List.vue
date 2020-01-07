<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称"></el-table-column>
        <el-table-column label="商品价格（元）"></el-table-column>
        <el-table-column label="商品重量"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-table-column label="操作"></el-table-column>
        <!-- 修改删除操作的插槽 -->
        <template>
          <!-- 修改 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped></style>
