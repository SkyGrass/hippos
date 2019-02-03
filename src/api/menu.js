import request from '@/utils/request'

export function getMenuByRole(role) {
  const data = {
    role
  }
  return request({
    url: '/menu/getmenubyrole',
    method: 'post',
    data
  })
}

export function getAllMenu() {
  return request({
    url: '/menu/getallmenu',
    method: 'post'
  })
}
