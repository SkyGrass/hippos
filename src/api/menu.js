import request from '@/utils/request'

export function getMenuByRole(role) {
  const data = {
    role,
  }
  return request({
    url: '/menu/getmenubyrole',
    method: 'post',
    data
  })
}
