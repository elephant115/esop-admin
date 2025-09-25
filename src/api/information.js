import request from '@/utils/request.js'
// 资讯列表
export function getNewsList(data) {
    return request({
        url: `/stock/journalism/admin/list`,
        method: 'post',
        data: data
    })
}

//编辑,新增新闻
export function updateNewsList(data) {
    return request({
        url: `/stock/journalism/admin/saveOrUpdate`,
        method: 'post',
        data: data
    })
}


//删除新闻
export function deleteNewsList(data) {
    return request({
        url: `/stock/journalism/admin/deleteById`,
        method: 'post',
        data: data
    })
}


//新增公告
export function messageSavedMsg(data) {
    return request({
        url: `/stock/message/savedMsg`,
        method: 'post',
        data
    })
}

//新增公告
export function messageList(data) {
    return request({
        url: `/stock/message/list`,
        method: 'post',
        data
    })
}