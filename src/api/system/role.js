import request from '@/utils/request.js'
// 用户列表
export function adminUserList(data,token) {
    return request({
        url: `/stock/user/admin/adminUserList`,
        method: 'post',
        data,
        headers:{
            'token':token
        }
    })
}
// 设置权限
export function setAuthority(data) {
    return request({
        url: `/stock/user/admin/setAuthority`,
        method: 'post',
        data
    })
}
