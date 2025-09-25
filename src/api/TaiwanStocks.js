import request from '@/utils/request.js'

export function lever(reqData) {
    return request({
        url: '/tw/stock/tw-stock/lever',
        method: 'get',
        data: reqData
    })
}