import request from '@/utils/request.js'
// 股票列表
export function basicInfo(data) {
    return request({
        url: "/api/basicInfo",
        method: "post",
        data,
    });
}

// 股票详情
export function detail(data) {
    return request({
        url: "/api/detail",
        method: "post",
        data,
    });
}

// 添加到系统股票
export function subSymbol(data) {
    return request({
        url: "/stock/symbol/subSymbol",
        method: "post",
        data,
    });
}

// 系统股票列表
export function querySymbol(data) {
    return request({
        url: "/stock/symbol/querySymbol",
        method: "post",
        data,
    });
}

// 修改系统股票列表
export function updateSymbol(data) {
    return request({
        url: "/stock/symbol/updateSymbol",
        method: "post",
        data,
    });
}

// 系统股票列表
export function search(data) {
    return request({
        url: "/api/search",
        method: "post",
        data,
    });
}

// 新股市场列表
export function securitiesMarket(params) {
    return request({
        url: "/stock/securitiesMarket/all",
        method: "get",
        params,
    });
}

// 新增新股
export function saveOrUpdate(data) {
    return request({
        url: "/stock/newShare/saveOrUpdate",
        method: "post",
        data,
    });
}

// 获取语言
export function languagelist(params) {
    return request({
        url: "/stock/language/list",
        method: "get",
        params,
    });
}

// 获取新股列表
export function newSharelist(data) {
    return request({
        url: "/stock/newShare/list",
        method: "post",
        data,
    });
}

// 删除新股
export function newSharedelte(params) {
    return request({
        url: `/stock/newShare/delete/${params}`,
        method: "delete",
    });
}

export function symbolunbSymbol(data) {
    return request({
        url: `/stock/symbol/unbSymbol`,
        method: "post",
        data,
    });
}

// 期货列表
export function futuresContractList(data) {
    return request({
        url: `/stock/future-symbol/admin/futuresContractList`,
        method: "post",
        data,
    });
}

// 期货修改
export function adminupload(data) {
    return request({
        url: `/stock/future-symbol/admin/upload`,
        method: "post",
        data,
    });
}

// 查询可新增期货列表
export function futuresListByCode(data) {
    return request({
        url: `/api/tiger/futures/futuresListByCode`,
        method: "post",
        data,
    });
}
// 查询可新增期货列表
export function futureContinuousContract(data) {
    return request({
        url: `/api/tiger/futures/futureContinuousContract`,
        method: "post",
        data,
    });
}

// 新增期货
export function increaseContract(data) {
    return request({
        url: `/stock/future-symbol/admin/increaseContract`,
        method: "post",
        data,
    });
}

//期货类型列表
export function futureTypeList(data) {
    return request({
        url: `/stock/future-type/admin/futureTypeList`,
        method: "post",
        data,
    });
}

//新增期货类型列表
export function addFutureType(data) {
    return request({
        url: `/stock/future-type/admin/addFutureType`,
        method: "post",
        data,
    });
}

//系统期货类型
export function updateFutureType(data) {
    return request({
        url: `/stock/future-type/admin/updateFutureType`,
        method: "post",
        data,
    });
}



// 更新委托配置
export function getMoneyIncomePay(data) {
    return request({
        url: `/stock/entrustConfig/saveOrUpdate`,
        method: "post",
        data,
    });
}


// 委托配置
export function getEntrustConfigList(data) {
    return request({
        url: `/stock/entrustConfig/getEntrustConfigList`,
        method: "post",
        data,
    });
}

// 出金限制
export function currency(data) {
    return request({
        url: `/stock/currency/admin/list`,
        method: "post",
        data,
    });
}

//出金限制修改
export function update(data) {
    return request({
        url: `/stock/currency/update`,
        method: "post",
        data,
    });
}

//新增股票按钮
export function addSymbol(data) {
    return request({
        url: `/stock/symbol/addSymbol`,
        method: "post",
        data,
    });
}