<template>
    <el-card class="box-card">
        <template #header>
            <div class="title" style="padding-bottom: 20px;font-weight: bold;">APP热更新</div>
            <el-form :model="data.queryParams" ref="queryForm" :inline="true" label-width="100px">
                <el-form-item label="" prop="version">
                    <el-input v-model="data.queryParams.version" placeholder="请输入版本号" clearable />
                </el-form-item>
                <el-form-item label="" prop="type">
                    <el-select v-model="data.queryParams.type" placeholder="请选择类型">
                        <el-option label="apk" value="1" />
                        <el-option label="wgt" value="2" />
                    </el-select>
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
        <!-- </div> -->
        <!-- <div style="padding: 30px 0"> -->

        <el-table :data="data.topics" style="width: 100%; padding: 50px 0">
            <el-table-column type="index" label="序号" width="100" />
            <el-table-column prop="version" label="版本号" ></el-table-column>
            <el-table-column prop="apkUrl" label="APK下载路径" ></el-table-column>
            <el-table-column prop="wgtUrl" label="wgt下载路径" ></el-table-column>
            <el-table-column prop="iosUrl" label="ios下载路径" ></el-table-column>
            <el-table-column prop="describeContent" label="描述" ></el-table-column>
            <el-table-column prop="type" label="类型" >
                <template #default="scope">
                    <div>
                        {{ type(scope.row.type) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" >
                <template #default="scope">
                    <div>
                        {{ status(scope.row.status) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="coverPicture" label="备注" width="150"></el-table-column>
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
            <el-pagination v-show="data.total > 0" :page-size="10" small="small" 
                layout="total, prev, pager, next" :total="data.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
      <el-dialog v-model="data.show" :title="title" width="50%">
        <el-form :model="data.ParamsData" ref="addRuleForm" label-width="100px" :rules="rules">
            <el-form-item label="版本号" prop="version">
                <el-input v-model="data.ParamsData.version" placeholder="请输入版本号" clearable />
            </el-form-item>

            <el-form-item label="分类：" prop="type">
                <el-select v-model="data.ParamsData.type" placeholder="请选择分类">
                    <el-option label="apk" :value="2" />
                    <el-option label="wgt" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="WGT上传：" prop="wgtUrl" v-if="data.ParamsData.type == 3">
                <el-upload class="upload-demo" :action="data.uploadFileUrl" :headers="data.headers" :limit="1"
                    :on-success="uploadFile" :before-upload="verify">
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="APK上传：" prop="apkUrl" v-if="data.ParamsData.type == 2">
                <el-upload class="upload-demo"  :action="proxy.$uploaUrl" :headers="data.headers" :limit="1"
                     :on-success="uploadFile2" :before-upload="verify2">
                    <el-button  type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="更新描述：" prop="describeContent">
                <div style="width: 400px;">
                    <el-input v-model="data.ParamsData.describeContent" placeholder="更新描述" show-word-limit
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
                <el-button @click="data.show = false">取消</el-button>
                <el-button type="primary" @click="updatelist">提交</el-button>
            </div>
        </template>
      </el-dialog>
    </el-card>
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
    onUnmounted,
    getCurrentInstance
} from 'vue'
import {
    versionList, saveOrUpdate,deleteVersion
} from '../../api/app'
const { proxy } = getCurrentInstance()
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/store.js'



/**
 * 数据渲染功能
 */
//声明 数据
const data = reactive({
    // uploadFileUrl: 'http://api-test.wukongsop.cloud/' + "common/upload", // 上传的图片服务器地址
    uploadFileUrl: 'http://8.217.189.134:9328/stock/common/upload', // 上传的图片服务器地址
    headers: {
        Authorization: "Bearer " + getToken(),
    },
    topics: [],
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        version: null,
        type: null,
        status: null

    },
    operation: localStorage.getItem('operation') || 0,
    ParamsData: {
        version: null,
        type: null,
        status: 0,
        describeContent: '',

    },
    show: false,
    total: 0



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
    let res = await versionList(data.queryParams)
    data.topics = res.data.data.data.records
    data.total = res.data.data.data.total
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
    let res = await deleteVersion({ id: item.id })
    if(res.data.code==0){
        ElMessage({
            message: "删除成功",
            type: 'success',
        })
        getlists()
    }else{
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
    data.ParamsData={};
    data.ParamsData.apkUrl="http://120.78.197.41:9090/stock/20220822/b207f19913d44b1b93c21bf17bb36e4f___UNI__479D90D_0822150840.apk"

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
    if (data.ParamsData.type == 2 && isWgt.split(".")[1] != "wgt") {
        ElMessage({
            message: "请上传wgt格式类型文件",
            type: 'error',
        })
        return false;
    }
}
let verify2 = (file) => {
    const isApk = file.name;
    if (data.ParamsData.type == 1 && isApk.split(".")[1] != "apk") {
        ElMessage({
            message: "请上传apk格式类型文件",
            type: 'error',
        })
        return false;
    }
}
let uploadFile = (res) => {
    data.ParamsData.wgtUrl = res.data;
}
let uploadFile2 = (res) => {
    data.ParamsData.apkUrl = res.data;
}
// 选择每页多少条
const handleSizeChange = row => {
  console.log(1111)
  // data.queryParams.pageSize = row
  // data.queryParams.pageNum = 1
  //   getlists()
}

// 点击页面进行跳转
const handleCurrentChange = row => {
    data.queryParams.pageNum = row
    getlists()
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
.el-upload-list{
    width: 380px;
}
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
  