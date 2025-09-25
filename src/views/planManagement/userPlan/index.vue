<template>
  <div>
    <head-title tite="用户计划"></head-title>
    <div class="padding">
      <el-card>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form
              ref="ruleFormRef"
              inline
              :model="data.form"
              label-width="120px"
            >
              <el-form-item label="用户ID">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.userId"
                  type="number"
                />
                <!-- <el-select
                  v-model="data.form.userId"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in data.userArr"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  />
                </el-select>-->
              </el-form-item>
              <el-form-item label="计划ID">
                <el-select
                  v-model="data.form.planId"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in data.planArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.email"
                />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.phone"
                  type="number"
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-button @click="reset">重置</el-button>
            <el-button @click="inquire(1)" type="primary">查询</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mt-15">
        <div class="text-center" v-if="data.operation == 1">
          <div>金额总数: {{ data.totalAmount }}</div>
          <div style="display: flex">
            <el-button @click="showDialog" type="primary">新增</el-button>
            <el-upload
              style="margin-left: 12px"
              class="upload"
              action="#"
              :show-file-list="false"
              :on-change="handleExcel"
              accept="'.xlsx', '.xls'"
              :auto-upload="false"
              :headers="data.headers"
            >
              <el-button type="primary">批量导入计划</el-button>
            </el-upload>
            <el-button
              style="margin-left: 12px"
              @click="
                exportData({
                  stockUser: {}
                })
              "
              type="primary"
              >导出全部计划</el-button
            >
          </div>
        </div>
        <el-table
          v-loading="data.tableLoading"
          :data="data.tableData"
          style="width: 100%"
        >
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.id"
            label="用户Id"
          >
            <!-- <template v-slot="{ row }">
              {{ userId(row.userId) }}
            </template>-->
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="planId"
            label="计划配置ID"
            min-width="100"
          >
            <template v-slot="{ row }">{{ planId(row.planId) }}</template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="number"
            label="计划数量"
            min-width="120"
          >
            <template v-slot="{ row }"
              >{{ row.number
              }}{{ row.jointStatus == 0 ? '（元）' : '（股）' }}</template
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="initialSharePrice"
            label="初始股价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.phone"
            min-width="150"
            label="手机号"
          />
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.email"
            min-width="150"
            label="邮箱"
          />
          <el-table-column
            show-overflow-tooltip
            prop="immediateAttributionAmount"
            label="下次归属数量"
            min-width="130"
          />
          <el-table-column
            show-overflow-tooltip
            prop="alreadyEquityAmount"
            label="已归属"
            min-width="100"
          />
          <el-table-column
            show-overflow-tooltip
            prop="waitEquityAmount"
            label="待归属"
            min-width="100"
          />
          <el-table-column
            show-overflow-tooltip
            prop="createDate"
            label="创建时间"
            min-width="200"
          >
            <template v-slot="{ row }">
              {{
                row.createDate
                  ? proxy.$filters
                      .dayjs(row.createDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="updateDate"
            label="修改时间"
            min-width="200"
          >
            <template v-slot="{ row }">
              {{
                row.updateDate
                  ? proxy.$filters
                      .dayjs(row.updateDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beginDate"
            label="开始时间"
            min-width="200"
          >
            <template v-slot="{ row }">
              {{
                row.beginDate
                  ? proxy.$filters
                      .dayjs(row.beginDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            show-overflow-tooltip
            prop="endDate"
            label="结束时间"
          >
            <template v-slot="{ row }">
              {{
                row.endDate
                  ? proxy.$filters
                      .dayjs(row.endDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="nextDate"
            label="下次时间"
            min-width="200"
          >
            <template v-slot="{ row }">
              {{
                row.nextDate
                  ? proxy.$filters
                      .dayjs(row.nextDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="counter"
            label="已经归属次数"
            min-width="140"
          />
          <el-table-column
            min-width="130"
            show-overflow-tooltip
            prop="status"
            label="状态"
          >
            <template v-slot="{ row }">
              {{
                row.status == 1
                  ? '未审核'
                  : row.status == 2
                  ? '审核通过(运行)'
                  : row.status == 3
                  ? '暂停'
                  : row.status == 4
                  ? '审核失败'
                  : row.status == 5
                  ? '结束'
                  : row.status == 6
                  ? '已删除'
                  : row.status
              }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="data.operation == 1"
            fixed="right"
            width="400px"
            label="操作"
          >
            <template v-slot="{ row }">
              <template v-if="row.status == 1 && row.status !== 6">
                <el-button type="primary" link @click="Audit(row, 2)"
                  >通过</el-button
                >
                <el-button type="primary" link @click="Audit(row, 4)"
                  >拒绝</el-button
                >
              </template>
              <template v-if="row.status == 2 && row.status !== 6">
                <el-button type="primary" link @click="Audit(row, 3)"
                  >暂停</el-button
                >
              </template>
              <template v-if="row.status == 3 && row.status !== 6">
                <el-button type="primary" link @click="Audit(row, 2)"
                  >运行</el-button
                >
              </template>
              <!-- <template
                v-if="
                  (row.planConfig.equityType == 3 &&
                    row.planConfig.planType == 2) ||
                  (row.planConfig.equityType == 1 &&
                    row.planConfig.planType == 1)
                "
              >
                <el-button type="primary" link @click="Audit(row, 2)"
                  >审核
                </el-button>
              </template>-->
              <el-button
                v-if="row.status !== 6"
                type="primary"
                link
                @click="modification(row)"
                >修改</el-button
              >
              <el-button type="primary" link @click="examineConfiguration(row)"
                >查看详情</el-button
              >
              <el-button type="primary" link @click="showPriceDialog(row)"
                >设置股价信息</el-button
              >
              <el-button type="primary" link @click="exportData(row)"
                >导出</el-button
              >
              <el-button
                v-if="row.status !== 6"
                type="danger"
                link
                @click="remove(row)"
                >删除</el-button
              >
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
        <el-form-item label="用户昵称" prop="userId">
          <el-select
            v-model="data.addForm.userId"
            clearable
            filterable
            placeholder="请选择"
            class="w-100"
          >
            <el-option
              v-for="item in data.userArr"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划ID">
          <el-select
            v-model="data.addForm.planId"
            clearable
            placeholder="请选择"
            class="w-100"
          >
            <el-option
              v-for="item in data.planArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="授予金额">
          <el-input
            clearable
            placeholder="请输入"
            type="number"
            v-model="data.addForm.totalAmount"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button :loading="data.addLoading" type="primary" @click="addData"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="data.priceDialogVisible"
      title="设置股价信息"
      width="30%"
    >
      <el-form
        ref="formRefs"
        label-width="80px"
        :model="data.addPriceForm"
        :rules="data.ruless"
      >
        <el-form-item label="股价">
          <el-input
            clearable
            placeholder="请输入"
            type="number"
            v-model="data.addPriceForm.newStockPrice"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.priceDialogVisible = false">取消</el-button>
          <el-button :loading="data.addLoading" type="primary" @click="addPrice"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="data.configurationDialogVisible"
      title="详情信息"
      width="50%"
    >
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.configuration"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简介" prop="introduction">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.introduction"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划类型" prop="planType">
              <el-select
                v-model="data.configuration.planType"
                clearable
                placeholder="请选择"
                class="w-100"
              >
                <el-option label="员工持股计划" :value="1" />
                <el-option label="消费增股计划" :value="2" />
                <el-option label="股票质押借贷" :value="3" />
                <el-option label="扩资扩容计划" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益类型" prop="equityType">
              <el-select
                v-model="data.configuration.equityType"
                clearable
                placeholder="请选择"
                class="w-100"
              >
                <el-option label="CAP" :value="1" />
                <el-option label="PSU" :value="2" />
                <el-option label="OPTION" :value="3" />
                <el-option label="CB" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="data.configuration.equityType == 4">
            <el-form-item label="债转股方式" prop="cbMode">
              <el-select
                v-model="data.configuration.cbMode"
                clearable
                placeholder="请选择"
                class="w-100"
              >
                <el-option label="PSU" :value="1" />
                <el-option label="可以股票" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属周期" prop="attributionPeriod">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.attributionPeriod"
              >
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属锁定期" prop="attributionLockPeriod">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.attributionLockPeriod"
              >
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="立即归属比例" prop="immediateAttributionRatio">
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.immediateAttributionRatio"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="归属次数（每次归属周期,归属比例相同）"
              prop="attributionCount"
            >
              <el-input
                clearable
                placeholder="请输入"
                v-model="data.configuration.attributionCount"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要二次考核" prop="secondAssessment">
              <el-select
                v-model="data.configuration.secondAssessment"
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
                v-model="data.configuration.validityDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始授予时间" prop="beginAttributionDate">
              <el-date-picker
                v-model="data.configuration.beginAttributionDate"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.stockUser"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input clearable v-model="data.stockUser.userName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input clearable v-model="data.stockUser.email" />
            </el-form-item>
          </el-col>
          <el-form-item label="联系电话" prop="phone">
            <el-input class="w-100" clearable v-model="data.stockUser.phone" />
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.configurationDialogVisible = false"
            >取消</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, getCurrentInstance } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import {
  adminList,
  planConfigAdminList,
  userAdminList,
  adminApply,
  adminUpdate,
  adminAudit,
  adminDelete,
  excelApply,
  capPlanTaskDerive,
  joinStockPrice,
  planSum
} from '@/api/planManagement/userPlan'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store/index'
const ruleFormRef = ref(null)
const formRef = ref(null)
const formRefs = ref(null)
const { proxy } = getCurrentInstance()
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  totalAmount: 0,
  title: '',
  addForm: {},
  addLoading: false,
  tableLoading: false,
  configurationDialogVisible: false,
  addPriceForm: {},
  priceDialogVisible: false,
  headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  configuration: {},
  stockUser: {},
  planArr: [],
  userArr: [],
  operation: localStorage.getItem('operation') || 0,
  ruless: {
    newStockPrice: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ]
  },
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
    ],
    planId: [
      {
        required: true,
        message: '请选择',
        trigger: ['change', 'blur']
      }
    ],
    newStockPrice: [
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
  planConfigAdminList({}).then((res) => {
    console.log(res, 'planConfigAdminList')
    data.planArr = res.data.data.data
  })
  userAdminList().then((res) => {
    console.log(res, 'userAdminList')
    data.userArr = res.data.data.data
  })
})
let exportData = (row) => {
  let obj = {
    phone: row.stockUser.phone || '',
    email: row.stockUser.email || '',
    uid: row.userId || '',
    planId: row.planId || ''
  }
  console.log(obj)

  capPlanTaskDerive(obj).then((res) => {
    console.log(res)
    const content = res.data
    const blob = new Blob([content], {
      type: 'application/octet-stream; charset=utf-8'
    })
    if ('download' in document.createElement('a')) {
      //非IE下载
      const a = document.createElement('a') //创建一个a标签
      a.download = '用户计划.xlsx' //指定文件名称
      a.style.display = 'none' //页面隐藏
      a.href = URL.createObjectURL(blob) // href用于下载地址
      document.body.appendChild(a) //插到页面上
      a.click() //通过点击触发
      URL.revokeObjectURL(a.href) //释放URL 对象
      document.body.removeChild(a) //删掉a标签
    }
  })
}
let handleExcel = (file) => {
  let formData = new FormData() //声明一个FormDate对象
  formData.append('file', file.raw) //把文件信息放入对象中
  //调用后台导入的接口
  excelApply(formData)
    .then((res) => {
      console.log(res)
      res.data.data.forEach((item) => {
        let title = '第' + item.data + '行' + ',' + item.message
        ElMessage({
          message: title,
          type: item.status ? 'success' : 'error'
        })
      })
      inquire() // 导入表格之后可以获取导入的数据渲染到页面，此处的方法是获取导入的数据
    })
    .catch((err) => {
      //  console.log(err);
    })
}
const Audit = (row, status) => {
  ElMessageBox.confirm('是否确认此操作', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminAudit({ id: row.id, status }).then((res) => {
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      inquire(1)
    })
  })
}
const userId = (id) => {
  let name = ''
  data.userArr.forEach((item) => {
    if (item.id == id) {
      name = item.userName
    }
  })
  return name
}
const examineConfiguration = (row) => {
  console.log(row)
  data.configuration = row.planConfig
  data.stockUser = row.stockUser
  data.configuration.immediateAttributionRatio =
    parseFloat(data.configuration.immediateAttributionRatio) * 100
  data.configurationDialogVisible = true
}
const examineUser = () => {}
const planId = (id) => {
  let name = ''
  data.planArr.forEach((item) => {
    if (item.id == id) {
      name = item.name
    }
  })
  return name
}
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
const showPriceDialog = (row) => {
  data.addPriceForm = {
    id: row.id
  }
  data.priceDialogVisible = true
}
const inquire = (num) => {
  if (num == 1) {
    data.form.pageNum = 1
  }
  data.tableLoading = true
  adminList(data.form)
    .then((res) => {
      console.log(res)
      data.tableData = res.data.data.data.records
      data.total = res.data.data.data.total
    })
    .finally(() => (data.tableLoading = false))
  planSum(data.form).then((res) => {
    console.log(res)
    data.totalAmount = res.data.data.data
  })
}
const addPrice = () => {
  if (!data.addPriceForm.newStockPrice) {
    return ElMessage({
      type: 'error',
      message: '请输入股价'
    })
  }
  formRefs.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    joinStockPrice(data.addPriceForm)
      .then((res) => {
        ElMessage({
          message: res.data.data.message
        })
        inquire(1)
        data.priceDialogVisible = false
      })
      .finally(() => (data.addLoading = false))
  })
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    data.addForm.totalAmount = parseFloat(data.addForm.totalAmount)
    if (data.title === '新增') {
      adminApply(data.addForm)
        .then((res) => {
          ElMessage({
            message: res.data.data.message
          })
          inquire(1)
          data.dialogVisible = false
        })
        .finally(() => (data.addLoading = false))
    } else {
      adminUpdate(data.addForm)
        .then((res) => {
          console.log(res)
          ElMessage({
            message: res.data.data.data.message
          })
          inquire(1)
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
  console.log(row)
  if (
    data.addForm.alreadyEquityAmount &&
    data.addForm.alreadyEquityAmount !== 0
  ) {
    data.addForm.totalAmount =
      parseFloat(data.addForm.waitEquityAmount) +
      parseFloat(data.addForm.alreadyEquityAmount)
  } else {
    data.addForm.totalAmount = parseFloat(data.addForm.waitEquityAmount)
  }
}
const remove = (row) => {
  ElMessageBox.confirm('是否确认删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      adminDelete({ id: row.id }).then((res) => {
        ElMessage({
          type: 'success',
          message: res.data.data.message
        })
        inquire(1)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

inquire()
</script>

<style lang="scss" scoped>
.text-center {
  display: flex;
  // text-align: right;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.mt-15 {
  margin-top: 15px;
}
.w-100 {
  width: 100%;
}
.fr {
  float: right;
}
.mb-15 {
  margin-bottom: 15px;
}
</style>
