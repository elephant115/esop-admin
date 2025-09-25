<template>
  <div>
    <head-title tite="合约列表"></head-title>
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
              <el-form-item label="类型">
                <el-select
                  v-model="data.form.type"
                  clearable
                  placeholder="请选择"
                >
                  <el-option label="隐私政策" :value="1" />
                  <el-option label="用户协议" :value="2" />
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
        <div class="text-center">
          <el-button v-if="data.operation == 1" @click="showDialog" type="primary">新增</el-button>
        </div>
        <el-table
          v-loading="data.tableLoading"
          :data="data.tableData"
          style="width: 100%;"
        >
          <el-table-column show-overflow-tooltip prop="title" label="标题" />
          <el-table-column show-overflow-tooltip prop="type" label="类型">
            <template v-slot="{ row }">
              {{
                row.type == 1
                  ? '隐私政策'
                  : row.type == 2
                  ? '用户协议'
                  : row.type
              }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="类容" />
          <el-table-column width="200px" v-if="data.operation == 1" label="操作">
            <template v-slot="{ row }">
              <el-button link @click="modification(row)">修改</el-button>
              <el-button type="danger" link @click="remove(row)"
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
    <el-dialog v-model="data.dialogVisible" :title="data.title" width="70%">
      <el-form
        ref="formRef"
        label-width="80px"
        :model="data.addForm"
        :rules="data.rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="data.addForm.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select style="width:100%" v-model="data.addForm.type" clearable placeholder="请选择">
            <el-option label="隐私政策" :value="1" />
            <el-option label="用户协议" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Toolbar
            style="border-bottom: 1px solid #ccc;"
            :editor="editorRef"
            :defaultConfig="data.toolbarConfig"
            :mode="data.mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="data.addForm.content"
            :defaultConfig="data.editorConfig"
            :mode="data.mode"
            @onCreated="handleCreated"
          />
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
import { onMounted, ref, reactive, shallowRef, onBeforeUnmount } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { agreementPage,agreementSaveOrUpdate,adminDelete } from '@/api/regulation/regulation'
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
  total: 0,
  valueHtml: '',
  toolbarConfig: {},
  editorConfig: { placeholder: '请输入内容...' },
  mode: 'default'
})
const editorRef = shallowRef()
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
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
  agreementPage(data.form)
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
    agreementSaveOrUpdate(data.addForm)
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
    adminDelete({ id: row.id }).then((res) => {
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
