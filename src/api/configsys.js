import request from '@/utils/request.js'

// 配资设置 > 倍率列表
export function getList(reqData) {
    return request({
        url: '/stock/system/current',
        method: 'post',
        data: reqData
    })
}

export function systemupdate(reqData) {
    return request({
        url: '/stock/system/update',
        method: 'post',
        data: reqData
    })
}



// 配资设置 > 新增/修改倍率列表
export function saveOrUpdate(reqData) {
    return request({
        url: '/stock/multiplyingPower/saveOrUpdate',
        method: 'post',
        data: reqData
    })
}

// 配资设置 > 倍率 > 证券市场列表
export function getAll() {
    return request({
        url: '/stock/securitiesMarket/all',
        method: 'get',
    })
}
// 配资设置 > 删除倍率市场列表
export function deleteMultiplyingPower(ids) {
    return request({
        url: '/stock/multiplyingPower/' + ids,
        method: 'delete',
    })
}

// 配资设置 > 证券市场
export function getSecuritiesMarket(reqData) {
    return request({
        url: '/stock/securitiesMarket/list',
        method: 'post',
        data: reqData
    })
}

// 配资设置 > 新增证券市场
export function saveOrUpdateSecuritiesMarket(reqData) {
    return request({
        url: '/stock/securitiesMarket/saveOrUpdate',
        method: 'post',
        data: reqData
    })
}

// 配资设置 > 删除证券市场
export function deleteSecuritiesMarket(ids) {
    return request({
        url: '/stock/securitiesMarket/' + ids,
        method: 'delete',
    })
}