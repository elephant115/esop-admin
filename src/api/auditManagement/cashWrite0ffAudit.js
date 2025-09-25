import request from '@/utils/request.js'
// 列表
export function adminList(data) {
    return request({
        url: '/stock/stock/admin/list',
        method: 'get',
        params: data
    })
}

// 审核
export function auditCashVerification(data) {
    return request({
        url: '/stock/auditCashVerification',
        method: 'post',
        data
    })
}