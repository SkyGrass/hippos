import request from '@/utils/request'

export function getPreSellBillNo() {
    return request({
        url: '/presell/getpresellbillno',
        method: 'post'
    })
}