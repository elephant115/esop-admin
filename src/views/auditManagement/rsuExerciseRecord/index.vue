<template>
  <div>
    <head-title tite="RSU行权记录"></head-title>
    <div class="padding">
      <el-card>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form
              ref="ruleFormRef"
              inline
              :model="data.form"
              label-width="100px"
            >
              <el-form-item label="用户关键字">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.userName"
                />
              </el-form-item>
              <el-form-item label="计划名称">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.planName"
                />
              </el-form-item>

              <el-form-item label="申请时间">
                <el-date-picker
                  v-model="data.time"
                  type="daterange"
                  range-separator="到"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  value-format="YYYY-MM-DD"
                />
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
            prop="userName"
            label="申请人"
          />
          <el-table-column
            show-overflow-tooltip
            prop="planName"
            label="计划名称"
          />

          <el-table-column
            show-overflow-tooltip
            prop="equityNumber"
            label="行权数量(股)"
          />
         
          <el-table-column
            show-overflow-tooltip
            prop="createDate"
            label="申请时间"
          />
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
import { onMounted, ref, reactive } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import { adminList } from '@/api/auditManagement/rsuExerciseRecord'
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  addForm: {},
  addLoading: false,
  tableLoading: false,
  time: []
})
onMounted(() => {})
const reset = () => {
  data.form = {
    pageNum: 1,
    pageSize: 10
  }
}
const inquire = (num) => {
  if (num == 1) {
    data.form.pageNum = 1
  }
  data.tableLoading = true
  if (data.time && data.time.length > 0) {
    data.form.startDate = data.time[0]
    data.form.endDate = data.time[1]
  } else {
    delete data.form.startDate
    delete data.form.endDate
  }
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
