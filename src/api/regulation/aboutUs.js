import request from '@/utils/request.js'
// 列表
export function platformList(data) {
    return request({
        url: '/stock/platform/list',
        method: 'get',
    })
}

// 保存
export function platformUpdate(data) {
    return request({
        url: '/stock/platform/update',
        method: 'post',
        data
    })
}