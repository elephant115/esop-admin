import request from '@/utils/request.js'
// 权益列表
export function equityList(data) {
    return request({
        url: `/stock/equity/admin/list`,
        method: 'post',
        data: data
    })
}
//新建编辑权益
export function saveOrUpdate(data) {
    return request({
        url: `/stock/equity/admin/saveOrUpdate`,
        method: 'post',
        data: data
    })
}

//删除权益
export function deleteById(data) {
    return request({
        url: `/stock/equity/admin/deleteById`,
        method: 'post',
        data: data
    })
}