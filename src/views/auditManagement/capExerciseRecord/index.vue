<template>
  <div>
    <head-title tite="CAP行权记录"></head-title>
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
              <el-form-item label="用户关键字">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.contractName"
                />
              </el-form-item>

              <el-form-item label="申请时间">
                <el-date-picker
                  v-model="data.form.title"
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
          <el-table-column show-overflow-tooltip prop="userId" label="申请人" />
          <el-table-column
            show-overflow-tooltip
            prop="buyAmount"
            label="购买数量(股)"
          />
          <el-table-column
            show-overflow-tooltip
            prop="price"
            label="价格(港币计算)"
          />
          <el-table-column
            show-overflow-tooltip
            prop="totalMoney"
            label="金额(港币)"
          />
          <el-table-column
            show-overflow-tooltip
            prop="crateDate"
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
import { adminList } from '@/api/auditManagement/cabExerciseRecord'
const data = reactive({
  form: {
    pageNum: 1,
    pageSize: 10
  },
  tableData: [],
  addForm: {},
  addLoading: false,
  tableLoading: false
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
