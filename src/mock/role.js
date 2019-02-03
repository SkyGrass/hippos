import { param2Obj } from '@/utils'

const roleList = {
  items: [
    {
      'roleId': '264449bd-f34c-4d00-a998-d3d91cd1ac8f',
      'rolename': '客户',
      'rolecode': 'customer',
      'roledescription': '客户',
      'isclosed': true
    },
    {
      'roleId': '2e58e361-a9ea-4014-90f7-9afde05e9d68',
      'rolename': '经销商',
      'rolecode': 'trader',
      'roledescription': '经销商',
      'isclosed': false
    },
    {
      'roleId': '38e59f0c-f0c7-4ac4-a665-40323574e093',
      'rolename': '销售内勤',
      'rolecode': 'seller',
      'roledescription': '销售内勤',
      'isclosed': false
    },
    {
      'roleId': 'c9271829-86ae-45c5-8eb2-6e65597e8962',
      'rolename': '管理员',
      'rolecode': 'admin',
      'roledescription': '系统管理员',
      'isclosed': false
    },
    {
      'roleId': 'dbc392f8-ee71-4c4b-99b3-136c6ddc1f84',
      'rolename': '系统管理员',
      'rolecode': 'sa',
      'roledescription': '系统管理员',
      'isclosed': false
    }],
  total: 5
}
export default {
  getRoleList: () => {
    return roleList
  },
  getRoleForSelect: () => {
    return roleList.items.filter(f => f.isclosed == 0).map(m => {
      let temp = {}
      temp.key = m.rolecode
      temp.display_name = `${m.rolename}`
      return temp
    })
  },
  createRole: () => ({
    data: 'success'
  }),
  updateRole: () => ({
    data: 'success'
  }),
  delRole: () => ({
    data: 'success'
  })
}
