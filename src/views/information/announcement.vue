<template>
  <div>
    <head-title tite="合约列表"></head-title>
    <div class="padding">
      <!-- <el-card>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form
              ref="ruleFormRef"
              inline
              :model="data.form"
              label-width="120px"
            >
              <el-form-item label="合约名称">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.contractName"
                />
              </el-form-item>
              <el-form-item label="合约标题">
                <el-input
                  clearable
                  placeholder="请输入"
                  v-model="data.form.contractTitle"
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
      </el-card> -->
      <el-card class="mt-15" >
        <div class="text-center" v-if="data.operation == 1">
          <el-button @click="showDialog" type="primary">新增</el-button>
        </div>
        <el-table
          v-loading="data.tableLoading"
          :data="data.tableData"
          style="width: 100%;"
        >
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="消息标题"
          />
          <el-table-column
            show-overflow-tooltip
            prop="summary"
            label="消息摘要"
          />
          <!-- <el-table-column width="200px" label="操作" v-if="data.operation == 1">
            <template v-slot="{ row }">
              <el-button link @click="modification(row)">修改</el-button>
              <el-button type="danger" link @click="remove(row)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <div class="mt-15 fr mb-15">
          <el-pagination
            v-model:currentPage="data.form.pageNum"
            v-model:page-size="data.form.pageSize"
            :page-sizes="[5,10, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="inquire"
            @current-change="inquire"
          />
        </div> -->
      </el-card>
    </div>
    <el-dialog v-model="data.dialogVisible" :title="data.title" width="30%">
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.addForm"
        :rules="data.rules"
      >
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="data.addForm.title" />
        </el-form-item>
        <el-form-item label="消息摘要" prop="summary">
          <el-input v-model="data.addForm.summary" />
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
  messageList,
  adminDeleteById,
  messageSavedMsg
} from '@/api/information'
import { ElMessage, ElMessageBox } from 'element-plus'
const ruleFormRef = ref(null)
const formRef = ref(null)
const data = reactive({
  form: {
    type:2
  },
  tableData: [],
  title: '',
  addForm: {
    type:2
  },
  operation: localStorage.getItem('operation') || 0,
  addLoading: false,
  tableLoading: false,
  rules: {
    title: [
      {
        required: true,
        message: '请输入',
        trigger: ['change', 'blur']
      }
    ],
    summary: [
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
  data.addForm = {
    type:2
  }
  data.dialogVisible = true
}
const inquire = (num) => {
  if (num == 1) {
    data.form.pageNum = 1
  }
  data.tableLoading = true
  messageList(data.form)
    .then((res) => {
      console.log(res)
      data.tableData = res.data.data.data
      data.total = res.data.data.total
    })
    .finally(() => (data.tableLoading = false))
}
const addData = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    data.addLoading = true
    messageSavedMsg(data.addForm)
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
const remove = (row) => {
  ElMessageBox.confirm('是否确认删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then((res) => {
    adminDeleteById({ id: row.id }).then((res) => {
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      inquire(1)
    })
  })
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
