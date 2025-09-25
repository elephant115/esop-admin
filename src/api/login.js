import request from '@/utils/request.js'
// 获取所有信息接入抓取内容展示
export function login(data) {
    return request({
        url: `/stock/user/admin/login`,
        method: 'post',
        data: data
    })
}