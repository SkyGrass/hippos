import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/user/getuserlist',
    method: 'post'
  })
}

export function fetchUser(data) {
  return request({
    url: '/user/getuser',
    method: 'post',
    data
  })
}


export function createUser(data) {
  return request({
    url: '/user/createuser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateuser',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/user/deluser',
    method: 'post',
    data
  })
}
