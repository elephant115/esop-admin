<template>
  <div>
    <head-title tite="计划配置"></head-title>
    <div class="padding">
      <el-card>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form ref="ruleFormRef" inline :model="data.form" label-width="120px">
              <el-form-item label="名称">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.name"
                  style="width: 214px;"
                />
              </el-form-item>
              <el-form-item label="计划类型">
                <el-select v-model="data.form.planType" clearable placeholder="请选择">
                  <el-option label="员工持股计划" :value="1" />
                  <el-option label="消费赠股计划" :value="2" />
                  <!-- <el-option label="股票质押借贷" :value="3" />
                  <el-option label="扩资扩容计划" :value="4" />-->
                </el-select>
              </el-form-item>
              <el-form-item label="权益类型">
                <el-select v-model="data.form.equityType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in data.equityList"
                    :key="item.id"
                    :label="item.equityName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否第二次考核">
                <el-select v-model="data.form.secondAssessment" clearable placeholder="请选择">
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="data.form.status" clearable placeholder="请选择">
                  <el-option label="暂停" :value="0" />
                  <el-option label="运行" :value="1" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-button @click="reset">重置</el-button>
            <el-button @click="inquire()" type="primary">查询</el-button>
            <!-- <el-button @click="inquireMoney()" type="primary">查询金额</el-button> -->
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mt-15">
        <div class="text-center">
          <span>金额总数：{{data.money}}</span>
          <el-button v-if="data.operation == 1" @click="showDialog" type="primary">新增</el-button>
        </div>
        <el-table v-loading="data.tableLoading" :data="data.tableData" style="width: 100%;">
          <el-table-column show-overflow-tooltip prop="name" label="名称" />
          <el-table-column show-overflow-tooltip prop="id" label="计划id" />
          <el-table-column show-overflow-tooltip prop="introduction" label="简介" />
          <el-table-column show-overflow-tooltip min-width="100" prop="totalAmount" label="金额" />
          <el-table-column show-overflow-tooltip prop="planType" label="计划类型">
            <template v-slot="{ row }">
              {{
              row.planType == 1
              ? '员工持股计划'
              : row.planType == 2
              ? '消费赠股计划'
              : row.planType == 3
              ? '股票质押借贷'
              : row.planType == 4
              ? '扩资扩容计划'
              : row.planType
              }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="equityType" label="权益类型">
            <template v-slot="{ row }">{{ equityType(row.equityType) }}</template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beginAttributionDate"
            label="开始授予时间"
            min-width="140"
          >
            <template v-slot="{ row }">
              {{
              row.beginAttributionDate
              ? proxy.$filters
              .dayjs(row.beginAttributionDate)
              .format('YYYY-MM-DD')
              : ''
              }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="attributionPeriod" label="归属周期" />
          <el-table-column show-overflow-tooltip prop="attributionLockPeriod" label="归属锁定期" />
          <el-table-column
            show-overflow-tooltip
            prop="immediateAttributionRatio"
            label="立即归属比例"
            min-width="140"
          />
          <el-table-column show-overflow-tooltip prop="attributionCount" label="归属次数" />
          <el-table-column
            show-overflow-tooltip
            prop="secondAssessment"
            label="是否第二次考核"
            min-widthwidth="140"
          >
            <template v-slot="{ row }">{{ row.secondAssessment == 1 ? '是' : '否' }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="validityDate" label="有效期">
            <template v-slot="{ row }">
              {{
              row.validityDate
              ? proxy.$filters.dayjs(row.validityDate).format('YYYY-MM-DD')
              : ''
              }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbMode" label="债转股方式">
            <template v-slot="{ row }">{{ row.cbMode == 1 ? 'PSU' : '可以股票' }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="状态">
            <template v-slot="{ row }">{{ row.status == 0 ? '暂停' : '运行' }}</template>
          </el-table-column>
          <el-table-column v-if="data.operation == 1" fixed="right" width="200px" label="操作">
            <template v-slot="{ row }">
              <el-button link @click="modification(row)">修改</el-button>
              <el-button type="danger" link @click="remove(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog v-model="data.dialogVisible" :title="data.title" width="50%">
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.addForm"
        :rules="data.rules"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input clearable placeholder="请输入" v-model="data.addForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简介" prop="introduction">
              <el-input clearable placeholder="请输入" v-model="data.addForm.introduction" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划类型" prop="planType">
              <el-select v-model="data.addForm.planType" clearable placeholder="请选择" class="w-100">
                <el-option label="员工持股计划" :value="1" />
                <el-option label="消费赠股计划" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益类型" prop="equityType">
              <el-select
                v-model="data.addForm.equityType"
                clearable
                placeholder="请选择"
                class="w-100"
              >
                <el-option
                  v-for="item in data.equityList"
                  :key="item.id"
                  :label="item.equityName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="data.addForm.equityType == 4">
            <el-form-item label="债转股方式" prop="cbMode">
              <el-select v-model="data.addForm.cbMode" clearable placeholder="请选择" class="w-100">
                <el-option label="PSU" :value="1" />
                <el-option label="可以股票" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属周期" prop="attributionPeriod">
              <el-input clearable placeholder="请输入" v-model="data.addForm.attributionPeriod">
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属锁定期" prop="attributionLockPeriod">
              <el-input clearable placeholder="请输入" v-model="data.addForm.attributionLockPeriod">
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="立即归属比例" prop="immediateAttributionRatio">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.immediateAttributionRatio"
                type="number"
                @blur="blurImmediateAttributionRatio"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="归属次数(归属周期 除以 归属次数 的余数不为 0 , 并且 归属周期 要大于 归属次数)"
              prop="attributionCount"
            >
              <el-input clearable placeholder="请输入" v-model="data.addForm.attributionCount">
                <template #append>次</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要二次考核" prop="secondAssessment">
              <el-select
                v-model="data.addForm.secondAssessment"
                clearable
                placeholder="请选择"
                class="w-100"
              >
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划有效期" prop="validityDate">
              <el-date-picker
                v-model="data.addForm.validityDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始授予时间" prop="beginAttributionDate">
              <el-date-picker
                v-model="data.addForm.beginAttributionDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低换股金额" prop="lowTransfer">
              <el-input clearable placeholder="请输入" v-model="data.addForm.lowTransfer" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="data.addForm.status" clearable placeholder="请选择" class="w-100">
                <el-option label="运行" :value="1" />
                <el-option label="暂停" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button :loading="data.addLoading" type="primary" @click="addData">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  reactive,
  nextTick,
  getCurrentInstance
} from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import {
  adminList,
  adminDeleteById,
  adminSave,
  adminUpdate,
  equityList,
  statistics
} from '@/api/planManagement/planAllocation'
import { ElMessage, ElMessageBox } from 'element-plus'
const ruleFormRef = ref(null)
const formRef = ref(null)
const { proxy } = getCurrentInstance()
const data = reactive({
  form: {},
  tableData: [],
  title: '',
  addForm: {},
  addLoading: false,
  tableLoading: false,
  equityList: [],
  immediateAttributionRatio: '',
  money: 0,
  operation: localStorage.getItem('operation') || 0,
  rules: {
    name: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    introduction: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    planType: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    equityType: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    attributionPeriod: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    secondAssessment: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    attributionLockPeriod: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    immediateAttributionRatio: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    attributionCount: [
      {
        required: false,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    validityDate: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ]
  },
  total: 0
})
onMounted(() => {
  inquireMoney()
  equityList({}).then((res) => {
    console.log(res)
    data.equityList = res.data.data.data
  })
})
const reset = () => {
  data.form = {}
}
const inquireMoney = () => {
  console.log(213)
  statistics({
    planId: data.form.planType
  }).then((res) => {
    console.log(res)
    data.money = res.data.data.data.data
  })
}
const showDialog = () => {
  data.title = '新增'
  data.dialogVisible = true
  nextTick(() => {
    data.addForm = {}
    formRef.value.resetFields()
  })
}
const equityType = (row) => {
  let name = ''
  data.equityList.forEach((item) => {
    if (item.id == row) {
      name = item.equityName
    }
  })
  return name
}
const blurImmediateAttributionRatio = () => {
  data.addForm.immediateAttributionRatio = data.immediateAttributionRatio
  if (parseFloat(data.immediateAttributionRatio) > 100) {
    data.immediateAttributionRatio = ''
    ElMessage({
      type: 'error',
      message: '比例不能大于,请重新输入'
    })
  }
}
const inquire = (num) => {
  data.tableLoading = true
  adminList(data.form)
    .then((res) => {
      console.log(res)
      data.tableData = res.data.data.data
    })
    .finally(() => (data.tableLoading = false))
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    if (data.addForm.equityType !== 4) {
      data.addForm.cbMode = ''
    }
    data.addForm.immediateAttributionRatio =
      parseFloat(data.immediateAttributionRatio) / 100
    if (data.title === '新增') {
      adminSave(data.addForm)
        .then((res) => {
          console.log(res)
          if (res.data.data.code == -1) {
            return ElMessage({
              type: 'error',
              message: res.data.data.message
            })
          }
          ElMessage({
            type: 'success',
            message: res.data.data.message
          })
          inquire()
          data.dialogVisible = false
        })
        .finally(() => (data.addLoading = false))
    } else {
      adminUpdate(data.addForm)
        .then((res) => {
          if (res.data.data.code == -1) {
            return ElMessage({
              type: 'error',
              message: res.data.data.message
            })
          }
          ElMessage({
            type: 'success',
            message: res.data.data.message
          })
          inquire()
          data.dialogVisible = false
        })
        .finally(() => (data.addLoading = false))
    }
  })
}
const modification = (row) => {
  data.title = '修改'
  data.dialogVisible = true
  data.addForm = row
}
const remove = (row) => {
  ElMessageBox.confirm('是否确认删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminDeleteById({ id: row.id }).then((res) => {
      console.log(res)
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      inquire()
    })
  })
}

inquire()
</script>

<style lang="scss" scoped>
.text-center {
  // text-align: right;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
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
.w-100 {
  width: 100%;
}
</style>
