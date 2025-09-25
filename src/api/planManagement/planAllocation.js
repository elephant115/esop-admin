import request from '@/utils/request.js'
// 计划配置列表
export function adminList(data) {
    return request({
        url: '/stock/planConfig/admin/list',
        method: 'post',
        data
    })
}
// 删除列表
export function adminDeleteById(data) {
    return request({
        url: '/stock/planConfig/admin/del',
        method: 'post',
        data
    })
}

// 新增列表
export function adminSave(data) {
    return request({
        url: '/stock/planConfig/admin/save',
        method: 'post',
        data
    })
}

// 修改列表
export function adminUpdate(data) {
    return request({
        url: '/stock/planConfig/admin/update',
        method: 'post',
        data
    })
}

// 获取权益类型
export function equityList(data) {
    return request({
        url: '/stock/equity/admin/list',
        method: 'post',
        data
    })
}

// 查询金额总数
export function statistics(params) {
    return request({
        url: '/stock/planConfig/admin/statistics',
        method: 'get',
        params
    })
}