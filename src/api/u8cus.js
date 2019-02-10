import request from '@/utils/request'

export function fetchU8CusList(data) {
    return request({
        url: '/u8cus/getallu8cuslist',
        method: 'post',
        data
    })
}
export function fetchU8CusListFromTrader(data) {
    return request({
        url: '/u8cus/getu8cuslistfromtrader',
        method: 'post',
        data
    })
}