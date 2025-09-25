<template>
  <div>
    <head-title tite="系统股票列表"></head-title>
    <div class="padding">
      <el-card
        ><div class="search_container searchArea">
          <div style="margin-bottom: 20px;">{{ name }}</div>
          <el-form
            :inline="true"
            :model="search_data"
            :rules="rules"
            ref="search_data"
            class="demo-form-inline search-form"
          >
            <el-form-item label="">
              <el-select
                v-model="securities"
                clearable
                placeholder="证券市场"
                @change="securitiesChange"
              >
                <el-option
                  v-for="item in securitiesList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-select
                v-model="securityType"
                clearable
                placeholder="证券类型"
              >
                <el-option
                  v-for="item in securityTypelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="incomePayData.symbol" placeholder="股票代码">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onScreeoutMoney"
                >查询
              </el-button>
              <el-button @click="reset">重置 </el-button>
              <el-button type="primary" @click="newlyAdded(2)">新增 </el-button>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="success" size ="mini" icon="view">导出Elcel</el-button> -->
            </el-form-item>
          </el-form>
        </div>

        <div class="table_container">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%;"
            align="center"
          >
            <el-table-column
              prop="market"
              label="证卷市场"
              align="left"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="nameTc"
              label="股票名称"
              align="left"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="symbol"
              label="股票代码"
              align="left"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="nameZh"
              label="拼音简称"
              align="left"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="nameEn"
              label="英文简称"
              align="left"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="lotSize"
              label="是否上架"
              align="left"
              sortable
            >
              <template v-slot="scope">
                {{ scope.row.enable == 1 ? '是' : ' 否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="lotSize"
              label="是否新股"
              align="left"
              sortable
            >
              <template v-slot="scope">
                {{ scope.row.isNewshare == 1 ? '是' : '否' }}
              </template>
            </el-table-column>

            <el-table-column
              prop="operation"
              align="center"
              label="操作"
              width="320"
            >
              <template v-slot="scope">
                <el-button link @click="add(1, scope.row)">查看详情</el-button>
                <el-button link @click="add(2, scope.row)">修改</el-button>
                <el-button
                  type="danger"
                  link
                  @click="onBatchDelMoney(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="incomePayData.pageIndex"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="incomePayData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
          >
          </el-pagination>
          <el-dialog title="修改股票名称" v-model="dialogFormVisible">
            <el-form :model="FormVisible">
              <el-form-item label="中文名称" :label-width="formLabelWidth">
                <el-input
                  v-model="FormVisible.nameZh"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="繁体名称" :label-width="formLabelWidth">
                <el-input
                  v-model="FormVisible.nameTc"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="英文名称" :label-width="formLabelWidth">
                <el-input
                  v-model="FormVisible.nameEn"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否上架" :label-width="formLabelWidth">
                <el-switch
                  v-model="FormVisible.enable"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
              <el-form-item label="是否新股" :label-width="formLabelWidth">
                <el-switch
                  v-model="FormVisible.isNewshare"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="affirm">确 定</el-button>
            </div>
          </el-dialog>

          <el-dialog
            v-model="isShow"
            :title="isShowTitle"
            @close="isShow = false"
          >
            <div class="deatil">
              <div>证券市场：{{ particulars.market }}</div>
              <div>证券市场：{{ particulars.securityType }}</div>
              <div>证券代码：{{ particulars.symbol }}</div>
              <div>最新价：{{ particulars.latestPrice }}</div>
              <div>收盘价：{{ particulars.close }}</div>
              <div>开盘价：{{ particulars.open }}</div>
              <div>最⾼价：{{ particulars.high }}</div>
              <div>最低价：{{ particulars.low }}</div>
              <div>成交量：{{ particulars.volume }}</div>
              <div>成价额：{{ particulars.amount }}</div>
              <div>每⼿股数：{{ particulars.lotSize }}</div>
              <div>保留位数：{{ particulars.precision }}</div>

              <div>币种：{{ particulars.currency }}</div>
              <div>证券名称：{{ particulars.name }}</div>
              <div>涨跌幅：{{ particulars.gain }}</div>
              <div>涨跌额：{{ particulars.chg }}</div>
              <div>最新⼀笔交易时间：{{ particulars.latestTime }}</div>
              <div>
                证券状态：{{
                  {
                    1: '正常交易',
                    2: '⾸⽇上市',
                    3: '停牌',
                    4: '除权',
                    5: '除息',
                    6: '临时停牌',
                    7: '熔断',
                    8: '待上市',
                    9: '退市'
                  }[particulars.securityStatus]
                }}
              </div>
              <div>市盈率TTM：{{ particulars.peTtm }}</div>
              <div>市盈率静：{{ particulars.peStatic }}</div>
              <div>市净率：{{ particulars.pb }}</div>
              <div>股息：{{ particulars.dividend }}</div>
              <div>股息率：{{ particulars.dividendRate }}</div>
              <div>振幅：{{ particulars.amplitude }}</div>
              <div>市值：{{ particulars.marketValue }}</div>
              <div>总股本：{{ particulars.totalShares }}</div>
              <div>⾏业板块：{{ particulars.industryPlate }}</div>
              <div>52周最⾼：{{ particulars.high52w }}</div>
              <div>52周最低：{{ particulars.low52w }}</div>
              <div>市盈率动：{{ particulars.peLyr }}</div>
              <div>换⼿率：{{ particulars.turnover }}</div>
              <!-- <div>竞价价格：{{particulars. biddingPrice}}</div>
              <div>竞价涨跌幅：{{particulars. biddingGain}}</div>
              <div>竞价涨跌额：{{particulars. biddingChg}}</div>
              <div>竞价最⾼：{{particulars. biddingHigh}}</div>
              <div>竞价最低：{{particulars. biddingLow}}</div>
              <div>竞价成交量：{{particulars. biddingVolume}}</div>
              <div>竞价成交额：{{particulars. biddingAmount}}</div>
              <div>竞价时间：{{particulars. biddingTime}}</div> -->
            </div>
          </el-dialog>
          <el-dialog v-model="isShows" @close="isShows = false">
            <el-form
              label-width="80px"
              :model="append"
              ref="append"
              style="margin: 10px; width: auto;"
            >
              <el-form-item label="证券市场">
                <el-select
                  v-model="append.market"
                  clearable
                  placeholder="证券市场"
                  @change="securitiesChanges"
                >
                  <el-option
                    v-for="item in securitiesLists"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证券类型">
                <el-select
                  v-model="append.securityType"
                  clearable
                  placeholder="证券类型"
                >
                  <el-option
                    v-for="item in securityTypelists"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="股票代码">
                <el-input
                  v-model="append.symbol"
                  style="width: 70%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="中文名称">
                <el-input
                  v-model="append.nameZh"
                  style="width: 70%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="英文名称">
                <el-input
                  v-model="append.nameEn"
                  style="width: 70%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="繁体名称">
                <el-input
                  v-model="append.nameTc"
                  style="width: 70%;"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否上架">
                <el-switch
                  v-model="append.enable"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
              <el-button type="info" @click="cancel">取消</el-button>
              <el-button type="primary" @click="save">确定</el-button>
            </el-form>
          </el-dialog>
        </div></el-card
      >
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import * as mutils from '@/utils/mUtils'
// import SearchItem from '@/components/searchItem'
// import AddFundDialog from '@/components/addFundDialog'
// import Pagination from '@/components/pagination'
import {
  querySymbol,
  detail,
  subSymbol,
  symbolunbSymbol,
  updateSymbol,
  addSymbol
} from '@/api/money'
import headTitle from '@/components/head/index.vue'
export default {
  data() {
    return {
      value1: false,
      dialogFormVisible: false,
      FormVisible: {},
      formLabelWidth: '120px',
      tableData: [],
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, // 是否显示资金modal,默认为false
      editid: '',
      rowIds: [],
      sortnum: 0,
      addFundDialog: {
        show: false,
        dialogRow: {}
      },
      incomePayData: {
        pageIndex: 1,
        pageSize: 10,
        market: 'HKEX',
        type: '1',
        symbol: null
      },
      pageTotal: 0,
      isShowTitle: '',
      name: '',
      search_data: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      form: {
        username: ''
      },
      form_rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      securitiesList: [
        {
          value: '1',
          label: 'HKEX'
        },
        {
          value: '2',
          label: 'US'
        }
      ],
      securityTypelist: [
        {
          value: '1',
          label: '普通股'
        },
        {
          value: '2',
          label: '指数'
        },
        {
          value: '11',
          label: '论证'
        },
        {
          value: '14',
          label: 'eft'
        }
      ],
      securityType: '普通股',
      securities: 'HKEX',
      statusList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        }
      ],
      statusVal: '',
      particulars: {}, //详情
      append: {
        market: '',
        securityType: '',
        symbol: '',
        nameZh: '',
        nameTc: '',
        nameEn: '',
        enable: 0,
        isNewshare: 0
      },
      securityTypelists: [],
      securityType: '',
      market: '',
      isShows: false,
      securitiesLists: [
        {
          value: '1',
          label: 'HKEX'
        },
        {
          value: '2',
          label: 'US'
        }
      ]
    }
  },
  components: {
    // SearchItem,
    // AddFundDialog,
    // Pagination
    headTitle
  },
  computed: {
    // ...mapGetters(['search'])
  },
  mounted() {
    this.name = this.$route.meta.title
    this.getMoneyList()
  },
  methods: {
    // 是否显示：0：不显示，1：显示
    changedarkPoolTrading(e) {
      if (e == true) {
        this.append.enable = 1
      } else {
        this.append.enable = 0
      }
      if (e == true) {
        this.append.isNewshare = 1
      } else {
        this.append.isNewshare = 0
      }
    },
    securitiesChanges() {
      this.append.securityType = ''
      if (this.append.market == 'HKEX') {
        this.securityTypelists = [
          {
            value: '1',
            label: '普通股'
          },
          {
            value: '2',
            label: '指数'
          },
          {
            value: '11',
            label: '论证'
          },
          {
            value: '14',
            label: 'eft'
          }
        ]
      } else {
        this.securityTypelists = [
          {
            value: '1',
            label: '普通股'
          },
          {
            value: '41',
            label: 'eft'
          }
        ]
      }
    },
    cancel() {
      this.isShows = false
      this.append = {
        market: '',
        securityType: '',
        symbol: '',
        nameZh: '',
        nameTc: '',
        nameEn: '',
        enable: 0
      }
    },
    save() {
      addSymbol(this.append).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getMoneyList()
          this.isShows = false
          this.append = {
            market: '',
            securityType: '',
            symbol: '',
            nameZh: '',
            nameTc: '',
            nameEn: '',
            enable: 0
          }
        }
      })
    },
    newlyAdded(index) {
      this.isShows = true
      if ((index = 2)) {
        this.isShowTitle = '新增股票'
      }
    },
    securitiesChange() {
      // this.securityType = "";
      if (this.securities == 'HKEX') {
        this.securityTypelist = [
          {
            value: '1',
            label: '普通股'
          },
          {
            value: '2',
            label: '指数'
          },
          {
            value: '11',
            label: '论证'
          },
          {
            value: '14',
            label: 'eft'
          }
        ]
      } else {
        this.securityTypelist = [
          {
            value: '1',
            label: '普通股'
          },
          {
            value: '41',
            label: 'eft'
          }
        ]
      }
    },
    setAddress(value) {},
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300
      })
    },
    // 获取资金列表数据
    getMoneyList() {
      querySymbol(this.incomePayData).then((res) => {
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        this.loading = false
      })
    },
    reset() {
      this.securities = ''
      this.incomePayData = {
        pageIndex: 1,
        pageSize: 10,
        market: 'HKEX',
        type: null,
        symbol: null
      }
      this.getMoneyList()
    },
    onScreeoutMoney() {
      this.incomePayData.market = this.securities
      this.getMoneyList()
    },
    add(index, scope) {
      if (index == 1) {
        let instrument =
          scope.market + '|' + scope.securityType + '|' + scope.symbol
        detail({
          instrument,
          lang: 'zh-CN'
        }).then((res) => {
          this.particulars = res.data.data
        })
        this.isShowTitle = '股票详情'
        this.isShow = true
      } else if (index == 2) {
        this.dialogFormVisible = true
        this.FormVisible = scope
      }
    },
    affirm() {
      updateSymbol(this.FormVisible).then((res) => {
        this.$message({
          message: '设置成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getMoneyList()
      })
    },
    // 显示资金弹框
    showAddFundDialog(val) {
      this.$store.commit('SET_DIALOG_TITLE', val)
      this.addFundDialog.show = true
    },
    hideAddFundDialog() {
      this.addFundDialog.show = false
    },
    // 上下分页
    handleCurrentChange(val) {
      this.incomePayData.pageIndex = val
      this.getMoneyList()
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.pageSize = val
      this.getMoneyList()
    },
    getPay(val) {
      if (mutils.isInteger(val)) {
        return -val
      } else {
        return val
      }
    },

    // 编辑操作方法
    onEditMoney(row) {
      this.addFundDialog.dialogRow = { ...row }
      this.showAddFundDialog()
    },
    // 删除数据
    onDeleteMoney(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          removeMoney(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMoneyList()
          })
        })
        .catch(() => {})
    },
    onBatchDelMoney(item) {
      this.$confirm('确认删除记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          symbolunbSymbol(item).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMoneyList()
          })
        })
        .catch(() => {})
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectTable(val, row) {
      this.setSearchBtn(val)
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      val.forEach((item) => {
        this.rowIds.push(item.id)
      })
      this.setSearchBtn(val)
    },
    setSearchBtn(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.deatil {
  display: flex;
  flex-flow: wrap;
  div {
    width: 230px;
    margin: 10px 0;
  }
}
.el-form {
  margin: auto;
}

.search_container {
  margin-bottom: 20px;
}

.btnRight {
  float: right;
  margin-right: 0px !important;
}

.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}

.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}

.el-dialog--small {
  width: 600px !important;
}

.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
