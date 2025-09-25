<template>
  <div>
    <head-title tite="角色列表"></head-title>
    <div class="padding">
      <el-card class="mt-15">
        <div class="text-center">
          <!-- <el-button @click="showDialog" type="primary">新增</el-button> -->
        </div>
        <el-table v-loading="data.tableLoading" :data="data.tableData" style="width: 100%;">
          <el-table-column show-overflow-tooltip prop="userName" label="角色名称" />
          <!-- <el-table-column show-overflow-tooltip prop="contractTitle" label="角色权限" /> -->
          <el-table-column show-overflow-tooltip prop="type" label="角色描述">
            <template v-slot="{ row }">
              <span>{{row.type == 2 ? '后台管理员' : '普通管理员'}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200px" label="操作">
            <template v-slot="{ row }">
              <el-button link @click="modification(row)">修改权限</el-button>
              <!-- <el-button type="danger" link @click="remove(row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-15 fr mb-15">
          <el-pagination
            v-model:currentPage="data.form.pageNum"
            v-model:page-size="data.form.pageSize"
            :page-sizes="[5,10, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.total"
            @size-change="inquire"
            @current-change="inquire"
          />
        </div>
      </el-card>
    </div>
    <el-dialog v-model="data.dialogVisible" :title="data.title" width="30%">
      <el-form ref="formRef" label-width="100px" :model="data.addForm" :rules="data.rules">
        <el-form-item label="角色权限" prop="contractTitle">
          <el-tree
            ref="treeRef"
            :data="data.jurisdiction"
            show-checkbox
            default-expand-all
            node-key="name"
            highlight-current
            :props="data.defaultProps"
            @node-click="handleNodeClick"
            :default-checked-keys="data.defaultCheckedKeys"
          />
        </el-form-item>
        <el-form-item label="限制">
          <el-switch v-model="data.operation" inline-prompt active-text="是" inactive-text="否" />
        </el-form-item>
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
import { onMounted, ref, reactive, nextTick } from 'vue-demi'
import headTitle from '@/components/head/index.vue'
import { adminUserList, setAuthority } from '@/api/system/role'
import { ElMessage, ElMessageBox } from 'element-plus'
const ruleFormRef = ref(null)
const formRef = ref(null)
const treeRef = ref(null)
import { asyncRoutes } from '@/router'
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
  jurisdiction: asyncRoutes,
  dialogVisible: false,
  arr: [],
  defaultCheckedKeys: [],
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

  defaultProps: {
    children: 'children',
    label: (data, node) => {
      return data.meta.title
    }
  }
})
onMounted(() => {
  console.log(data.jurisdiction)
})
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
  adminUserList(data.form)
    .then((res) => {
      console.log(res)
      data.tableData = res.data.data.data.records
      data.total = res.data.data.data.total
    })
    .finally(() => (data.tableLoading = false))
}
const handleNodeClick = (data) => {
  console.log(data)
}
const addData = () => {
  setAuthority({
    id: data.addForm.id,
    operation: data.operation ? '0' : '1',
    limitsAuthority: JSON.stringify(treeRef.value.getCheckedKeys())
  })
    .then((res) => {
      console.log(res)
      ElMessage({
        type: 'success',
        message: res.data.data.message
      })
      data.dialogVisible = false
      inquire()
    })
    .catch((err) => {
      console.log(err);
    })

  let localRoute = JSON.parse(JSON.stringify(data.jurisdiction)) // 全部路由
  let showRoute = [] // 要展示的路由
  let selectedNode = JSON.parse(JSON.stringify(treeRef.value.getCheckedKeys())) // 选中的节点
  // 如果在第一层父节点的name那么把这块节点全部push到要展示的路由数组里
  localRoute.forEach((item) => {
    treeRef.value.getCheckedKeys().forEach((items) => {
      if (item.name == items) {
        showRoute.push(item)
      }
    })
  })
  // 根据上面存进去的路由循环过滤出一样的name 然后剩下没有父节点的子节点的name
  selectedNode.forEach((item, index) => {
    showRoute.forEach((items) => {
      if (items.name == item) {
        selectedNode = selectedNode.filter((itemss) => itemss != items.name)
      }
      items.children.forEach((itemsss) => {
        selectedNode = selectedNode.filter((itemss) => itemss != itemsss.name)
      })
    })
  })
  // 根据子节点的name去全部路由里面找对应的父节点和子节点push到要展示的路由里面
  selectedNode.forEach((item) => {
    localRoute.forEach((items) => {
      items.children.forEach((itemss) => {
        if (item == itemss.name) {
          // 判断当前要展示的路由里面是否有selectedNode子节点的name
          let flag = true
          showRoute.forEach((itemsss) => {
            if (itemsss.name == items.name) {
              flag = false
            }
          })
          if (flag) {
            // 如果没有获取当前子节点的父节点push到要展示的路由里面
            let localRoute = JSON.parse(JSON.stringify(items))
            // items包含了所有子节点所以要清空
            localRoute.children = []
            localRoute.children.push(itemss)
            // 拿到当前的父子节点push进去
            showRoute.push(localRoute)
          } else {
            // 如果有了在次循环要展示的路由直接push到当前父节点的children里面
            showRoute.forEach((itemsss) => {
              if (itemsss.name == items.name) {
                itemsss.children.push(itemss)
              }
            })
          }
        }
      })
    })
  })
  console.log(showRoute)
}
const modification = (row) => {
  data.title = '修改权限'
  data.dialogVisible = true
  data.addForm = row
  console.log(row.limitsAuthority)
  data.defaultCheckedKeys = row.limitsAuthority
    ? JSON.parse(row.limitsAuthority)
    : []
  data.operation = row.operation == 0 ? true : false
  nextTick(() => {
    treeRef.value.setCheckedKeys(data.defaultCheckedKeys)
  })
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
