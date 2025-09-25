<template>
    <div>
        <el-card class="box-card">
            <template #header>
                <div class="title" style="padding-bottom: 20px;font-weight: bold;">APP热更新</div>
                <el-form :model="data.queryParams" ref="equityName" :inline="true" label-width="100px">
                    <el-form-item label="" prop="version">
                        <el-input v-model="data.queryParams.equityName" placeholder="请输入权益名称" clearable />
                    </el-form-item>
                    <el-form-item label="" prop="status">
                        <el-select v-model="data.queryParams.status" placeholder="请选择状态">
                            <el-option label="禁用" value="1" />
                            <el-option label="启用" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getlists">搜索</el-button>
                        <el-button type="primary" @click="reset()">
                            <el-icon>
                                <Refresh />
                            </el-icon>重置
                        </el-button>
                        <el-button v-if="data.operation == 1" type="primary" @click="add">
                            <el-icon>
                                <Plus />
                            </el-icon>新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>

            <el-table :data="data.topics" style="width: 100%;" >
                <el-table-column type="index" label="序号" width="100" />
                <el-table-column prop="equityName" width="200" label="权益名称"></el-table-column>
                <el-table-column prop="totalQuota" width="200" label="总额度"></el-table-column>
                <el-table-column prop="remainingQuota" width="200" label="剩余额度"></el-table-column>
                <el-table-column prop="equityExplain" width="200" label="权益额度说明"></el-table-column>

                 <el-table-column prop="status" label="是否启用">
                    <template #default="scope">
                        <div>
                            {{ status(scope.row.status) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="data.operation == 1" label="操作" width="150" fixed="right">
                    <template #default="scope">
                        <div style="display:flex">
                            <el-button type="primary" size="small" @click="set(scope.row)">
                                <el-icon>
                                    <Edit />
                                </el-icon>编辑
                            </el-button>
                            <el-button type="danger" size="small" @click="deletelist(scope.row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>删除
                            </el-button>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="demo-pagination-block">
                <el-pagination v-show="data.total > 0" :page-size="10" :small="data.small" 
                    layout="total, prev, pager, next" :total="data.total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>
        <el-dialog v-model="data.show" :title="title" width="50%">
            <el-form :model="data.ParamsData" ref="addRuleForm" label-width="150px" :rules="rules">
                <el-form-item label="权益名称" prop="equityName">
                    <el-input v-model="data.ParamsData.equityName" placeholder="请输入权益名称" clearable />
                </el-form-item>
                <el-form-item label="总额度" prop="equityName">
                    <el-input-number v-model="data.ParamsData.totalQuota" :precision="2" :step="0.1" />
                </el-form-item>
                <el-form-item label="剩余额度" prop="equityName">
                    <el-input-number v-model="data.ParamsData.remainingQuota" :precision="2" :step="0.1" />
                </el-form-item>
                <el-form-item label="权益额度说明：" prop="equityExplain">
                    <div style="width: 400px;">
                        <el-input v-model="data.ParamsData.equityExplain" placeholder="权益额度说明" show-word-limit
                            type="textarea" input-style="height:100px" />
                    </div>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-switch v-model="data.ParamsData.status" active-text="禁用" inactive-text="启用" :active-value="1"
                        :inactive-value="0" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="updatelist">提交</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import {
    unref,
    ref,
    reactive,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted
} from 'vue'
import {
    equityList, saveOrUpdate, deleteById
} from '../../api/equity'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/store.js'


/**
 * 数据渲染功能
 */
//声明 数据
const data = reactive({
    uploadFileUrl: process.env.VUE_APP_BASE_API + "common/upload", // 上传的图片服务器地址
    headers: {
        Authorization: "Bearer " + getToken(),
    },
    topics: [],
    operation: localStorage.getItem('operation') || 0,
    queryParams: {
        equityName: '',
        status: null
    },
    ParamsData: {

    },
    show: false,
    total: 0,
    small: 'small'


})
const addRuleForm = ref(null)
const rules = reactive({
    version: { required: true, message: '请输入版本号1111', trigger: 'blur' },
    type: { required: true, message: '请选择类型11111', trigger: 'blur' }
})
const queryForm = ref(null)
let title = ref('新增APP')
//请求数据
onMounted(async () => {
    getlists()
    conso()
})
//获取新闻列表
let getlists = async () => {
    let res = await equityList(data.queryParams)
    data.topics = res.data.data.data
    // data.total = res.data.data.data.length
    data.total = 0
}
let handleCurrentChange = () => {

}
let handleSizeChange = () => {

}
//新建编辑新闻
let updatelist = async () => {
    // addRuleForm 使用unref
    const form = unref(addRuleForm);
    if (!form) {
        return;
    }
    try {
        await form.validate();
        let res = await saveOrUpdate(data.ParamsData);
        if (res.data.code == 0) {
            data.show = false;
            ElMessage({
                message: '保存成功',
                type: 'success',
            })
        }
    } catch (err) {
        console.log("err===" + err);
    }


}
//删除新闻
let deletelist = async (item) => {
    item
    let res = await deleteById({ id: item.id })
    if (res.data.code == 0) {
        ElMessage({
            message: "删除成功",
            type: 'success',
        })
    } else {
        ElMessage({
            message: res.data.message,
            type: 'error',
        })
    }
}
let conso = () => {
    console.log(data.topics)
}


let reset = () => {
    queryForm.value.resetFields()
}

let add = () => {
    data.show = true
}
let set = (item) => {
    data.show = true;
    data.ParamsData = item;

}
let type = (e) => {
    if (e == 1) {
        return 'apk'
    } else {
        return 'wgt'
    }
}
let status = (e) => {
    if (e == 1) {
        return '禁用'
    } else {
        return '启用'
    }
}
let verify = (file) => {
    const isWgt = file.name;
    if (this.form.type == 1 && isWgt.split(".")[1] != "wgt") {
        ElMessage({
            message: "请上传wgt格式类型文件",
            type: 'error',
        })
        return false;
    }
}
let verify2 = (file) => {
    const isApk = file.name;
    if (ParamsData.type == 2 && isApk.split(".")[1] != "apk") {
        ElMessage({
            message: "请上传apk格式类型文件",
            type: 'error',
        })
        return false;
    }
}
let uploadFile = (res) => {
    ParamsData.wgtUrl = res.data.url;
}
let uploadFile2 = (res) => {
    ParamsData.apkUrl = res.data.url;
}

</script>
  
<style lang="scss" scoped>
.demo-pagination-block {
    display: flex;
    justify-content: center;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
  