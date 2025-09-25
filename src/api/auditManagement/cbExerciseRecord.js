import request from '@/utils/request.js'
// 列表
export function adminList(data) {
    return request({
        url: '/stock/cb/admin/list',
        method: 'get',
        params: data
    })
}