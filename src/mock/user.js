import { param2Obj } from '@/utils'

const userList = {
  items: [
    {
      'userId': '67ce696f-efc5-4ae4-8e84-70251572ba7b',
      'name': '经销商孙',
      'username': 'customer1',
      'password': '1234',
      'role': 'trader',
      'isclosed': false,
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'introduction': '我是经销商'
    },
    {
      'userId': '980b73af-4fd6-4196-a5d2-50688446a658',
      'name': '销售赵',
      'username': 'seller1',
      'password': '1234',
      'role': 'seller',
      'isclosed': false,
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'introduction': '我是销售'
    },
    {
      'userId': 'cd3e6811-0da7-4ce5-afe6-8ecd738305d3',
      'name': 'Super Admin',
      'username': 'super',
      'password': '123',
      'role': 'sa',
      'isclosed': false,
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'introduction': '我是系统管理员'
    },
    {
      'userId': 'e9a07cce-d4bf-484c-bf91-4da885156b1a',
      'name': 'Admin',
      'username': 'admin',
      'password': '123',
      'role': 'admin',
      'isclosed': false,
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'introduction': '我是管理员'
    },
    {
      'userId': 'fa199354-9311-4bf6-bfb7-ecd3602ee9dd',
      'name': '客户钱',
      'username': 'customer1',
      'password': '1234',
      'role': 'customer',
      'isclosed': false,
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'introduction': '我是客户'
    }
  ],
  total: 5
}
export default {
  getUserList: (config) => {
    const { body } = config
    console.log(body)
    return userList
  },
  createUser: () => ({
    data: 'success'
  }),
  updateUser: () => ({
    data: 'success'
  }),
  delUser: () => ({
    data: 'success'
  })
}
