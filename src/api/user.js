import request from '@/utils/request.js'
// 用户列表
export function userList(data) {
    return request({
        url: `/stock/user/admin/userList`,
        method: 'post',
        data: data
    })
}

export function updateNewsList(data) {
    return request({
        url: `/stock/user/saveOrUpdate`,
        method: 'post',
        data: data
    })
}


export function forbid(data) {
    return request({
        url: '/stock/user/admin/forbid',
        method: 'post',
        data
    })
}

export function getForbid(data) {
    return request({
        url: '/stock/user/admin/getForbid',
        method: 'get',

    })
}
export function forbidLogin(data) {
    return request({
        url: '/stock/user/admin/forbidLogin',
        method: 'post',
        data
    })
}

export function getForbidLoginStatus(data) {
    return request({
        url: '/stock/user/admin/getForbidLoginStatus',
        method: 'get',

    })
}
// 注册
export function register(data) {
    return request({
        url: '/stock/user/register',
        method: 'post',
        data
    })
}
// 批量导入
export function ExcelRegister(data) {
    return request({
        url: '/stock/user/ExcelRegister',
        method: 'post',
        data
    })
}
// 新增普通用户
export function adminRegister(data) {
    return request({
        url: '/stock/user/admin/register',
        method: 'post',
        data
    })
}