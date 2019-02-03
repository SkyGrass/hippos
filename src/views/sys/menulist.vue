<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchword"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <tree-table :data="data" :columns="columns" :eval-func="func" :expand-all="expandAll" border>
      <el-table-column label="模块" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重定向地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.redirect }}</span>
        </template>
      </el-table-column>
      <el-table-column label="侧边栏显示" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.hidden"/>
        </template>
      </el-table-column>
      <el-table-column label="子菜单保持" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.alwaysShow"/>
        </template>
      </el-table-column>
      <el-table-column label="停用" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isclosed"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="handlerEdit(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
/**
   Auth: Lei.j1ang
   Created: 2018/1/19-14:54
   */
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'

import { getAllMenu } from '@/api/menu'

export default {
  name: 'CustomTreeTableDemo',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      rowclass: 'rowclass',
      columns: [
        {
          text: '',
          value: 'meta.title',
          width: 50,
          align: 'center'
        },
        {
          text: '排序',
          value: 'sort',
          width: 50,
          align: 'center'
        }
      ],
      data: [],
      listQuery: {
        searchword: undefined
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    handlerEdit(row) {
      console.log(row)
    },
    getMenus() {
      return getAllMenu().then(response => {
        this.data = response.data
        console.log(this.data)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style>
.rowclass {
  text-align: center;
}
</style>
