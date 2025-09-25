import request from '@/utils/request.js'
// 合约列表
export function adminList(data) {
    return request({
        url: '/stock/contract/admin/list',
        method: 'post',
        data
    })
}

// 删除列表
export function adminDeleteById(data) {
    return request({
        url: '/stock/contract/admin/deleteById',
        method: 'post',
        data
    })
}

// 新增/修改列表
export function adminSaveOrUpdate(data) {
    return request({
        url: '/stock/contract/admin/saveOrUpdate',
        method: 'post',
        data
    })
}