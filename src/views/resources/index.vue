<template>
  <div>
    <head-title tite="规则配置"></head-title>
    <div class="padding">
      <el-card class="mt-15">
        <!-- <div class="text-center">
          <el-button @click="showDialog" type="primary">新增</el-button>
        </div> -->
        <el-table
          v-loading="data.tableLoading"
          :data="data.tableData"
          style="width: 100%;"
        >
          <el-table-column
            show-overflow-tooltip
            prop="destructionFee"
            label="核销手续费"
          />
          <el-table-column
            show-overflow-tooltip
            prop="stockPrice"
            label="股票当前价"
          />
          <el-table-column
            show-overflow-tooltip
            prop="restrictConversion"
            label="限制行权"
          />
          <el-table-column v-if="data.operation == 1" width="200px" label="操作">
            <template v-slot="{ row }">
              <el-button link @click="modification(row)">修改</el-button>
              
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-15 fr mb-15">
          <el-pagination
            v-model:currentPage="data.form.pageNum"
            v-model:page-size="data.form.pageSize"
            :page-sizes="[5, 10, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="inquire"
            @current-change="inquire"
          />
        </div>
      </el-card>
    </div>
    <el-dialog v-model="data.dialogVisible" :title="data.title" width="30%">
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.addForm"
        :rules="data.rules"
      >
        <el-form-item label="核销手续费" prop="destructionFee">
          <el-input v-model="data.addForm.destructionFee" />
        </el-form-item>
        <el-form-item label="股票当前价" prop="stockPrice">
          <el-input v-model="data.addForm.stockPrice" />
        </el-form-item>
        <el-form-item label="限制行权" prop="restrictConversion">
          <el-input v-model="data.addForm.restrictConversion" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button :loading="data.addLoading" type="primary" @click="addData">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import {
  getList,
  systemupdate
} from '@/api/configsys'
// import {
//   getList,
//   systemupdate,
//   getAll,
//   deleteMultiplyingPower
// } from '@/api/configsys'
// import { lever } from '@/api/TaiwanStocks'
import { ElMessage, ElMessageBox } from 'element-plus'
const ruleFormRef = ref(null)
const formRef = ref(null)
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  title: '',
  addForm: {},
  addLoading: false,
  tableLoading: false,
  operation: localStorage.getItem('operation') || 0,
  rules: {
    contractName: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    contractTitle: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    contractContext: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ]
  },
  total: 0
})
onMounted(() => {})
const reset = () => {
  data.form = {
    pageNum: 1,
    pageSize: 10
  }
}
const showDialog = () => {
  data.title = '新增'
  data.addForm = {}
  data.dialogVisible = true
}
const inquire = (num) => {
  if (num == 1) {
    data.form.pageNum = 1
  }
  data.tableLoading = true
  getList()
    .then(res => {
      console.log(res)
      // data.tableLoading = false
      data.tableData = res.data.data
    })
    .finally(() => (data.tableLoading = false))
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    systemupdate(data.addForm)
      .then((res) => {
        if (data.title === '新增') {
          ElMessage({
            type: 'success',
            message: '新增成功'
          })
        } else {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        }
        inquire(1)
        data.dialogVisible = false
      })
      .finally(() => (data.addLoading = false))
  })
}
const modification = (row) => {
  data.title = '修改'
  data.dialogVisible = true
  data.addForm = row
}

inquire()
</script>

<style lang="scss" scoped>
.text-center {
  text-align: right;
}
.mt-15 {
  margin-top: 15px;
}
.fr {
  float: right;
}
.mb-15 {
  margin-bottom: 15px;
}
</style>
