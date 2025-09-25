import request from '@/utils/request.js'
// 列表
export function adminList(data) {
    return request({
        url: '/stock/cap/admin/getCapEquityList',
        method: 'post',
        data
    })
}