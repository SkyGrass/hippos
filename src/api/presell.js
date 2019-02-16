import request from '@/utils/request'

export function getPreSellBillNo() {
    return request({
        url: '/presell/getpresellbillno',
        method: 'post'
    })
}
export function savePreSell(data) {
    return request({
        url: '/presell/savePreSell',
        method: 'post',
        data
    })
}


export function getPreSellList(data) {
    return request({
        url: '/presell/getpreselllist',
        method: 'post',
        data
    })
}

export function getPreSellInfo(data) {
    return request({
        url: '/presell/getpresellinfo',
        method: 'post',
        data
    })
}
