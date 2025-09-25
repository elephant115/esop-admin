import request from '@/utils/request.js'
// 用户列表
export function versionList(data) {
    return request({
        url: `/stock/version/admin/list`,
        method: 'post',
        data: data
    })
}
export function saveOrUpdate(data) {
    return request({
        url: `/stock/version/saveOrUpdate`,
        method: 'post',
        data: data
    })
}

//删除app
export function deleteVersion(data) {
    return request({
        url: `/stock/version/delete`,
        method: 'post',
        data: data
    })
}