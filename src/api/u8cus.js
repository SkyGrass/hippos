import request from '@/utils/request'

export function fetchU8CusList(data) {
    return request({
        url: '/u8cus/getallu8cuslist',
        method: 'post',
        data
    })
}