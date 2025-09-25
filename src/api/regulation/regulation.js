import request from '@/utils/request.js'
// 列表
export function agreementPage(data) {
    return request({
        url: '/stock/agreement/page',
        method: 'post',
        data
    })
}

// 修改
export function agreementSaveOrUpdate(data) {
    return request({
        url: '/stock/agreement/saveOrUpdate',
        method: 'post',
        data
    })
}

// 删除
export function adminDelete(data) {
    return request({
        url: '/stock/agreement/admin/delete',
        method: 'post',
        data
    })
}