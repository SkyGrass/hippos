<template>
  <div class="app-container">

    <!--<el-tag style="margin-bottom:20px;">-->
    <!--<a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>-->
    <!--</el-tag>-->

    <tree-table :data="data" :columns="columns" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
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
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="message(scope.row)">Meta</el-button>
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

  export default {
    name: 'CustomTreeTableDemo',
    components: { treeTable },
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        rowclass: 'rowclass',
        // data:
        //   [
        //     {
        //       id: 1,
        //       event: '事件1111',
        //       timeLine: 100,
        //       comment: '无',
        //       children: [
        //         {
        //           id: 2,
        //           event: '事件2',
        //           timeLine: 10,
        //           comment: '无'
        //         },
        //         {
        //           id: 3,
        //           event: '事件3',
        //           timeLine: 90,
        //           comment: '无',
        //           children: [
        //             {
        //               id: 4,
        //               event: '事件4',
        //               timeLine: 5,
        //               comment: '无'
        //             },
        //             {
        //               id: 5,
        //               event: '事件5',
        //               timeLine: 10,
        //               comment: '无'
        //             },
        //             {
        //               id: 6,
        //               event: '事件6',
        //               timeLine: 75,
        //               comment: '无',
        //               children: [
        //                 {
        //                   id: 7,
        //                   event: '事件7',
        //                   timeLine: 50,
        //                   comment: '无',
        //                   children: [
        //                     {
        //                       id: 71,
        //                       event: '事件71',
        //                       timeLine: 25,
        //                       comment: 'xx'
        //                     },
        //                     {
        //                       id: 72,
        //                       event: '事件72',
        //                       timeLine: 5,
        //                       comment: 'xx'
        //                     },
        //                     {
        //                       id: 73,
        //                       event: '事件73',
        //                       timeLine: 20,
        //                       comment: 'xx'
        //                     }
        //                   ]
        //                 },
        //                 {
        //                   id: 8,
        //                   event: '事件8',
        //                   timeLine: 25,
        //                   comment: '无'
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     },
        //     {
        //       id: 11,
        //       event: '事件aa1',
        //       timeLine: 100,
        //       comment: '无',
        //       children: [
        //         {
        //           id: 12,
        //           event: '事件2',
        //           timeLine: 10,
        //           comment: '无'
        //         },
        //         {
        //           id: 13,
        //           event: '事件3',
        //           timeLine: 90,
        //           comment: '无',
        //           children: [
        //             {
        //               id: 14,
        //               event: '事件4',
        //               timeLine: 5,
        //               comment: '无'
        //             },
        //             {
        //               id: 15,
        //               event: '事件5',
        //               timeLine: 10,
        //               comment: '无'
        //             },
        //             {
        //               id: 16,
        //               event: '事件6',
        //               timeLine: 75,
        //               comment: '无',
        //               children: [
        //                 {
        //                   id: 17,
        //                   event: '事件7',
        //                   timeLine: 50,
        //                   comment: '无',
        //                   children: [
        //                     {
        //                       id: 171,
        //                       event: '事件71',
        //                       timeLine: 25,
        //                       comment: 'xx'
        //                     },
        //                     {
        //                       id: 172,
        //                       event: '事件72',
        //                       timeLine: 5,
        //                       comment: 'xx'
        //                     },
        //                     {
        //                       id: 173,
        //                       event: '事件73',
        //                       timeLine: 20,
        //                       comment: 'xx'
        //                     }
        //                   ]
        //                 },
        //                 {
        //                   id: 18,
        //                   event: '事件8',
        //                   timeLine: 25,
        //                   comment: '无'
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ],
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
        data: [{
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
          'children': [{
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
    methods: {
      message(row) {
        this.$message.info(row.event)
      }
    }
  }
</script>

<style>
  .rowclass {
    text-align: center;
  }
</style>
