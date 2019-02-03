<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="角色编码" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rolecode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.rolename}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否停用" width="80px" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isclosed"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roledescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleCreate()">新增</el-button>
          <el-button type="warning" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" :type="scope.row.isclosed?'success':'danger'"
                     @click="handleDelete(scope.row)">{{scope.row.isclosed?'启用':'停用'}}
          </el-button>
          <el-button size="mini" type="info" plain @click="handleMenu(scope.row)">菜单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog title="菜单" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="角色编码" prop="rolecode">
          <el-input v-model="temp.rolecode" :readonly="dialogStatus=='update'" :disabled="dialogStatus=='update'"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="temp.rolename"/>
        </el-form-item>
        <el-form-item label="是否停用" prop="isclosed">
          <el-checkbox v-model="temp.isclosed"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roledescription">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.roledescription" type="textarea"
                    placeholder="请简述此角色的作用"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormMenu">
      <treeTable :data="data" :columns="columns" :eval-func="func" checkBox expandAll parentChild
                 border readonly
                 :options="{key:'menuId', children:'children'}" @treeTableSelect="getTreeTableSelect">

        <el-table-column label="模块" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
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
            <el-checkbox v-model="scope.row.hidden"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="子菜单保持" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.alwaysShow"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="停用" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isclosed"></el-checkbox>
          </template>
        </el-table-column>
      </treeTable>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认
        </el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, fetchRole, createRole, updateRole, delRole } from '@/api/role'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import treeToArray from './customEval'

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        func: treeToArray,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        temp: {},
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogFormVisible: false,
        dialogFormMenu: false,
        rules: {
          rolecode: [{ required: true, message: '角色编码不可为空', trigger: 'blur' }],
          rolename: [{ required: true, message: '角色名称不可为空', trigger: 'blur' }]
        },
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
        data: [
          {
            'menuId': '3b2a8fd4-054d-41a2-92ed-02272f253c35',
            'metaId': '78ee45f4-fe1e-42e1-943b-c58572e70e60',
            'name': 'UserManage',
            'path': '/user',
            'component': 'layout',
            'redirect': 'nodirect',
            'hidden': false,
            'alwaysShow': true,
            'meta': {
              'menuId': '3b2a8fd4-054d-41a2-92ed-02272f253c35',
              'metaId': '78ee45f4-fe1e-42e1-943b-c58572e70e60',
              'title': '用户管理',
              'icon': 'people',
              'roles': [
                'admin'
              ],
              'rolesdata': 'admin',
              'noCache': true,
              'breadcrumb': true
            },
            'children': [
              {
                'menuId': 'e22c71ca-c156-47d2-b6b0-1c571f31c216',
                'metaId': '182a973e-d9cb-4bcb-ad28-a48f0bade0c3',
                'name': 'UserList',
                'path': '/userlist',
                'component': 'userlist',
                'redirect': '/user/userlist',
                'hidden': false,
                'alwaysShow': true,
                'meta': {
                  'menuId': 'e22c71ca-c156-47d2-b6b0-1c571f31c216',
                  'metaId': '182a973e-d9cb-4bcb-ad28-a48f0bade0c3',
                  'title': '用户列表',
                  'icon': 'peoples',
                  'roles': [
                    'admin'
                  ],
                  'rolesdata': 'admin',
                  'noCache': true,
                  'breadcrumb': true
                },
                'children': null,
                'parentId': '3b2a8fd4-054d-41a2-92ed-02272f253c35',
                'sort': 0,
                'query': null,
                'isclosed': false
              },
              {
                'menuId': 'fc05b62c-9bd0-4127-94fb-358c7fca6fa1',
                'metaId': '65c24ef4-1227-43a7-98f2-20d4e134772d',
                'name': 'RoleList',
                'path': '/rolelist',
                'component': 'rolelist',
                'redirect': '/user/rolelist',
                'hidden': false,
                'alwaysShow': true,
                'meta': {
                  'menuId': 'fc05b62c-9bd0-4127-94fb-358c7fca6fa1',
                  'metaId': '65c24ef4-1227-43a7-98f2-20d4e134772d',
                  'title': '角色列表',
                  'icon': 'people',
                  'roles': [
                    'admin'
                  ],
                  'rolesdata': 'admin',
                  'noCache': true,
                  'breadcrumb': true
                },
                'children': null,
                'parentId': '3b2a8fd4-054d-41a2-92ed-02272f253c35',
                'sort': 1,
                'query': null,
                'isclosed': false
              },
              {
                'menuId': '171389d7-bc2f-4d24-bb5e-c253efc15608',
                'metaId': 'be98d0fc-0022-4d85-9816-5264c690a782',
                'name': 'DealerCustomerMap',
                'path': '/dealercustomermap',
                'component': 'dealercustomermap',
                'redirect': '/user/dealercustomermap',
                'hidden': false,
                'alwaysShow': true,
                'meta': {
                  'menuId': '171389d7-bc2f-4d24-bb5e-c253efc15608',
                  'metaId': 'be98d0fc-0022-4d85-9816-5264c690a782',
                  'title': '经销商绑定客户',
                  'icon': 'table',
                  'roles': [
                    'admin'
                  ],
                  'rolesdata': 'admin',
                  'noCache': true,
                  'breadcrumb': true
                },
                'children': null,
                'parentId': '3b2a8fd4-054d-41a2-92ed-02272f253c35',
                'sort': 2,
                'query': null,
                'isclosed': false
              }
            ],
            'parentId': null,
            'sort': 0,
            'query': null,
            'isclosed': false
          },
          {
            'menuId': 'd56d54ba-df7e-4515-b389-7ca488bc468a',
            'metaId': 'be5837dd-0fcf-4e85-a2d9-a4d9dc2a52ce',
            'name': 'SellManage',
            'path': '/sell',
            'component': 'layout',
            'redirect': 'nodirect',
            'hidden': false,
            'alwaysShow': true,
            'meta': {
              'menuId': 'd56d54ba-df7e-4515-b389-7ca488bc468a',
              'metaId': 'be5837dd-0fcf-4e85-a2d9-a4d9dc2a52ce',
              'title': '销售管理',
              'icon': 'money',
              'roles': [
                'admin'
              ],
              'rolesdata': 'admin',
              'noCache': true,
              'breadcrumb': true
            },
            'children': [{
              'menuId': '68c0c014-9c98-49f6-aa1a-274953d6cbf4',
              'metaId': '01baaf3a-5313-4c6c-be65-3d631eaf7b57',
              'name': 'PreSell',
              'path': '/presell',
              'component': 'presell',
              'redirect': '/sell/presell',
              'hidden': false,
              'alwaysShow': true,
              'meta': {
                'menuId': '68c0c014-9c98-49f6-aa1a-274953d6cbf4',
                'metaId': '01baaf3a-5313-4c6c-be65-3d631eaf7b57',
                'title': '销售预订单',
                'icon': 'form',
                'roles': [
                  'admin'
                ],
                'rolesdata': 'admin',
                'noCache': true,
                'breadcrumb': true
              },
              'children': null,
              'parentId': 'd56d54ba-df7e-4515-b389-7ca488bc468a',
              'sort': 0,
              'query': null,
              'isclosed': false
            },
              {
                'menuId': 'ec7fe523-8ba1-49dc-8d8a-cf5ac0700f8b',
                'metaId': '621997b2-6442-450f-9dbb-15e5b939f245',
                'name': 'PreSellForMonth',
                'path': '/presellformonth',
                'component': 'presell',
                'redirect': '/sell/presellformonth',
                'hidden': false,
                'alwaysShow': true,
                'meta': null,
                'children': null,
                'parentId': 'd56d54ba-df7e-4515-b389-7ca488bc468a',
                'sort': 1,
                'query': '{"type":2}',
                'isclosed': true
              },
              {
                'menuId': '704727c3-c270-4629-9329-abfffbd51122',
                'metaId': 'c3416d69-8802-4b0a-a5b8-6852915773d1',
                'name': 'PreSellList',
                'path': '/preselllist',
                'component': 'preselllist',
                'redirect': '/sell/preselllist',
                'hidden': false,
                'alwaysShow': true,
                'meta': {
                  'menuId': '704727c3-c270-4629-9329-abfffbd51122',
                  'metaId': 'c3416d69-8802-4b0a-a5b8-6852915773d1',
                  'title': '销售预订单列表',
                  'icon': 'list',
                  'roles': [
                    'admin'
                  ],
                  'rolesdata': 'admin',
                  'noCache': true,
                  'breadcrumb': true
                },
                'children': null,
                'parentId': 'd56d54ba-df7e-4515-b389-7ca488bc468a',
                'sort': 2,
                'query': null,
                'isclosed': false
              }
            ],
            'parentId': null,
            'sort': 1,
            'query': null,
            'isclosed': false
          },
          {
            'menuId': 'c17001d8-7ebf-4442-a07c-7f9e5459a839',
            'metaId': 'c4c3df78-5436-4bf3-b19f-2ae6dd9b44e8',
            'name': 'SysManage',
            'path': '/sys',
            'component': 'layout',
            'redirect': 'nodirect',
            'hidden': false,
            'alwaysShow': true,
            'meta': {
              'menuId': 'c17001d8-7ebf-4442-a07c-7f9e5459a839',
              'metaId': 'c4c3df78-5436-4bf3-b19f-2ae6dd9b44e8',
              'title': '系统管理',
              'icon': 'component',
              'roles': [
                'sa'
              ],
              'rolesdata': 'sa',
              'noCache': true,
              'breadcrumb': true
            },
            'children': [{
              'menuId': '3a6e81c5-cdd7-4660-9e72-a0fe20e0bd16',
              'metaId': 'ae62cde4-cb10-4bbe-ae13-08f78720dabc',
              'name': 'MenuList',
              'path': '/menulist',
              'component': 'menulist',
              'redirect': '/user/menusist',
              'hidden': false,
              'alwaysShow': true,
              'meta': {
                'menuId': '3a6e81c5-cdd7-4660-9e72-a0fe20e0bd16',
                'metaId': 'ae62cde4-cb10-4bbe-ae13-08f78720dabc',
                'title': '菜单列表',
                'icon': 'component',
                'roles': [
                  'admin'
                ],
                'rolesdata': 'admin',
                'noCache': true,
                'breadcrumb': true
              },
              'children': null,
              'parentId': 'c17001d8-7ebf-4442-a07c-7f9e5459a839',
              'sort': 0,
              'query': null,
              'isclosed': false
            }],
            'parentId': null,
            'sort': 2,
            'query': null,
            'isclosed': false
          }
        ],
        args: [null, null, 'timeLine']
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        return fetchList().then(response => {
          this.list = response.data.items
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleMenu(row) {
        console.log(row)
        this.dialogFormMenu = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.roleId = parseInt(Math.random() * 100) + 1024 // mock a id
            createRole(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogFormVisible = true
        this.temp = Object.assign({}, row) // copy obj

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateRole(tempData).then(() => {
              for (const v of this.list) {
                if (v.roleId === this.temp.roleId) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        delRole(row).then(() => {
          row.isclosed = !row.isclosed
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      getTreeTableSelect(val) {
        console.log(val)
      }
    }
  }
</script>
