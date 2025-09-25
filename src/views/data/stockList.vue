<template>
  <div>
    <head-title tite="股票列表"></head-title>
    <div class="padding">
      <el-card>
        <div class="search_container searchArea">
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
              <el-input
                v-model="incomePayData.keyword"
                placeholder="股票名称（或者股票代码）"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onScreeoutMoney()"
                >查询
              </el-button>
              <el-button @click="reset">重置 </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table_container">
          <div>
            <el-table v-loading="loading" :data="tableData" align="center">
              <el-table-column
                prop="market"
                label="证券市场"
                align="left"
                sortable
              >
              </el-table-column>
              <el-table-column
                v-if="statucTable"
                prop="nameZh"
                label="拼音简称"
                align="left"
                sortable
              >
              </el-table-column>
              <el-table-column
                v-else
                el-table-column
                prop="name"
                label="拼音简称"
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
                prop="lotSize"
                label="每手股数"
                align="left"
                v-if="statucTable"
                sortable
              >
              </el-table-column>

              <el-table-column
                v-if="statucTable"
                prop="nameTc"
                label="股票名称（繁体）"
                align="left"
                sortable
              >
              </el-table-column>
              <el-table-column
                v-if="statucTable"
                prop="nameEn"
                label="英文简称"
                align="left"
                sortable
              >
              </el-table-column>
              <el-table-column v-if="data.operation == 1"  prop="" align="center" label="操作" width="380">
                <template v-slot="scope">
                  <el-button link @click="add(1, scope.row)"
                    >查看详情</el-button
                  >
                  <el-button
                    type="primary"
                    link
                    @click="add(2, scope.row)"
                    >新增为系统股票</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
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

          <el-dialog
            :visible.sync="isShows"
            :title="isShowTitle"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
            @close="isShows = false"
          >
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
import { basicInfo, detail, subSymbol, search } from '@/api/money'
import headTitle from '@/components/head/index.vue'
export default {
  data() {
    return {
      append: {
        market: '',
        securityType: '',
        symbol: '',
        nameZh: '',
        nameTc: '',
        nameEn: '',
        enable: 0
      },
      tableData: [],
      operation: localStorage.getItem('operation') || 0,
      tableHeight: 0,
      loading: true,
      idFlag: false,
      isShow: false, // 是否显示资金modal,默认为false
      editid: '',
      rowIds: [],
      isShows: false,
      sortnum: 0,
      addFundDialog: {
        show: false,
        dialogRow: {}
      },
      incomePayData: {
        keyword: '',
        instrument: '',
        page: 1,
        pageSize: 10
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
      securitiesLists: [
        {
          value: '1',
          label: 'HKEX'
        },
        {
          value: '2',
          label: 'US'
        }
      ],
      securityTypelist: [],
      securityType: '',
      securities: '',

      securityTypelists: [],
      securityType: '',
      market: '',
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
      statucTable: true
    }
  },
  components: {
    headTitle
    // SearchItem,
    // AddFundDialog,
    // Pagination
  },
  computed: {},
  mounted() {
    this.name = this.$route.meta.title
    this.getMoneyList()
  },
  methods: {
    addSymbol() {
      addSymbol(this.append).then((res) => {
        console.log(res)
      })
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
    securitiesChange() {
      this.securityType = ''
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
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300
      })
    },
    // 获取资金列表数据
    getMoneyList() {
      if (this.securities && this.securityType) {
        this.incomePayData.instrument =
          this.securities + '|' + this.securityType + '|'
      } else {
        this.incomePayData.instrument = 'HKEX|1|'
      }
      basicInfo(this.incomePayData).then((res) => {
        console.log(res)
        this.tableData = res.data.data.list
        this.pageTotal = res.data.data.totalNum
        this.loading = false
        console.log(this.tableData)
      })
    },
    add(index, scope) {
      if (index == 1) {
        let instrument =
          scope.market + '|' + scope.securityType + '|' + scope.symbol
        detail({
          instrument,
          lang: 'zh-CN'
        }).then((res) => {
            console.log(res);
          this.particulars = res.data.data
        })
        this.isShowTitle = '股票详情'
        this.isShow = true
      } else if (index == 2) {
        subSymbol({
          market: scope.market,
          securityType: scope.securityType,
          symbol: scope.symbol,
          nameZh: scope.nameZh,
          nameTc: scope.nameTc,
          nameEn: scope.nameEn
        }).then((res) => {
          this.$message({
            message: '添加系统股票成功',
            type: 'success'
          })
        })
      }
    },
    newlyAdded(index) {
      this.isShows = true
      if ((index = 2)) {
        this.isShowTitle = '新增股票'
      }
    },
    onScreeoutMoney() {
      const instrument = this.securities + '|' + this.securityType + '|'
      if (this.incomePayData.keyword) {
        this.statucTable = false
        search({
          instrument,
          lang: 'zh-CN',
          keyword: this.incomePayData.keyword,
          page: this.incomePayData.page,
          pageSize: this.incomePayData.pageSize
        }).then((res) => {
          console.log(res);
          this.tableData = res.data.data.list
          this.pageTotal = 1
          // this.loading = false
        })
      } else {
        this.statucTable = true
        this.getMoneyList()
      }
    },
    reset() {
      this.statucTable = true
      this.securities = ''
      this.securityType = ''
      this.incomePayData = {
        keyword: '',
        instrument: '',
        page: 1,
        pageSize: 10
      }
      this.getMoneyList()
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
      this.incomePayData.page = val
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
