<template>
  <div>
    <head-title tite="现金核销审核"></head-title>
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
              <el-form-item label="账号编号">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.contractName"
                />
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select
                  v-model="data.form.status"
                  clearable
                  placeholder="请选择"
                >
                  <el-option label="未审核" :value="1" />
                  <el-option label="审核成功" :value="2" />
                  <el-option label="审核失败" :value="3" />
                </el-select>
              </el-form-item> </el-form
          ></el-col>
          <el-col :span="6">
            <el-button @click="reset">重置</el-button>
            <el-button @click="inquire(1)" type="primary"
              >查询</el-button
            ></el-col
          >
        </el-row>
      </el-card>
      <el-card class="mt-15">
        <el-table
          v-loading="data.tableLoading"
          :data="data.tableData"
          style="width: 100%;"
        >
          <el-table-column label="序号" type="index" width="70" />
          <el-table-column
            show-overflow-tooltip
            prop="email"
            min-width="150"
            label="邮箱"
          />
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            min-width="150"
            label="手机号"
          />

          <el-table-column
            show-overflow-tooltip
            prop="amount"
            label="核销金额(港币)"
            min-width="140"
          />
          <el-table-column
            show-overflow-tooltip
            prop="fee"
            label="手续费(港币)"
            min-width="140"
          />
          <el-table-column
            show-overflow-tooltip
            prop="realityAmount"
            label="实际到账金额(港币)"
            min-width="150"
          />
          <el-table-column
            show-overflow-tooltip
            prop="cancelAfterVerificationAmount"
            label="核销时账号余额"
            min-width="140"
          />
          <el-table-column
            show-overflow-tooltip
            prop="urgeAmount"
            label="催单次数"
          />
          <el-table-column
            show-overflow-tooltip
            prop="urgeDate"
            label="最近一次催单时间"
            min-width="140"
            ><template v-slot="{ row }">
              {{
                row.urgeDate
                  ? proxy.$filters
                      .dayjs(row.urgeDate)
                      .format('YYYY-MM-DD HH:mm:ss')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createDate"
            label="申请时间"
            min-width="140"
            ><template v-slot="{ row }">
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
            prop="explain"
            label="申请说明"
          />
          <el-table-column
            min-width="100"
            show-overflow-tooltip
            prop="status"
            label="审核状态"
          >
            <template v-slot="{ row }">
              {{
                row.status == 1
                  ? '未审核'
                  : row.status == 2
                  ? '审核成功'
                  : row.status == 3
                  ? '审核失败'
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.id"
            label="审核人"
          />
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.email"
            label="审核人邮箱"
            min-width="150"
          />
          <el-table-column
            show-overflow-tooltip
            prop="stockUser.phone"
            min-width="150"
            label="审核人手机号"
          />
          <el-table-column
            show-overflow-tooltip
            prop="buyAmount"
            label="操作"
            fixed="right"
            width="150"
            v-if="data.operation == 1"
          >
            <template v-slot="{ row }">
              <el-button v-if="row.status == 1" type="primary" link @click="audit(row,2)"
                >通过</el-button
              >
              <el-button v-if="row.status == 1" type="primary" link @click="audit(row,3)"
                >拒绝</el-button
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
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, getCurrentInstance } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import {
  adminList,
  auditCashVerification
} from '@/api/auditManagement/cashWrite0ffAudit'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  addForm: {},
  addLoading: false,
  operation: localStorage.getItem('operation') || 0,
  tableLoading: false
  
})
onMounted(() => {})
const reset = () => {
  data.form = {
    pageNum: 1,
    pageSize: 10
  }
}
const audit = (row,num) => {
  let name = num ==  2 ? '通过' : '拒绝'
  ElMessageBox.confirm(`是否确认${name}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    auditCashVerification({
      id: row.id,
      status: num,
      adminId: row.stockUser.id
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      inquire(1)
    })
  })
}
const inquire = (num) => {
  if (num == 1) {
    data.form.pageNum = 1
  }
  data.tableLoading = true
  adminList(data.form)
    .then((res) => {
      console.log(res)
      data.tableData = res.data.data.data
      data.total = res.data.data.total
    })
    .finally(() => (data.tableLoading = false))
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
