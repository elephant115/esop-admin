import request from '@/utils/request.js'
// 用户计划列表
export function adminList(data) {
    return request({
        url: '/stock/plan/admin/list',
        method: 'post',
        data
    })
}
// 新增用户计划列表
export function adminApply(data) {
    return request({
        url: '/stock/cap/admin/apply',
        method: 'post',
        data
    })
}
// 修改用户计划列表
export function adminUpdate(data) {
    return request({
        url: '/stock/plan/admin/update',
        method: 'post',
        data
    })
}
// 获取配置接口用于planId
export function planConfigAdminList(data) {
    return request({
        url: '/stock/planConfig/admin/list',
        method: 'post',
        data
    })
}

// 获取userId接口用于userId
export function userAdminList(data) {
    return request({
        url: '/stock/user/admin/list',
        method: 'get',
    })
}

// 审核接口
export function adminAudit(data) {
    return request({
        url: '/stock/plan/admin/audit',
        method: 'post',
        data
    })
}

// 删除接口
export function adminDelete(data) {
    return request({
        url: '/stock/plan/admin/delete',
        method: 'post',
        data
    })
}

// 批量导入
export function excelApply(data) {
    return request({
        url: '/stock/cap/excelApply',
        method: 'post',
        data
    })
}

// 导出计划
export function capPlanTaskDerive(params) {
    return request({
        url: '/stock/plan/capPlanTaskDerive',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob',
        method: 'get',
        params
    })
}

// 设置股价信息
export function joinStockPrice(data) {
    return request({
        url: '/stock/plan/joinStockPrice',
        method: 'post',
        data
    })
}

// 查询金额总数
export function planSum(data) {
    return request({
        url: '/stock/plan/admin/planSum',
        method: 'post',
        data
    })
}