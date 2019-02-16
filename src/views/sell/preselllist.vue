<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-input
            v-model="listQuery.searchword"
            placeholder="预订单号"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.status"
            clearable
            placeholder="状态"
            style="width: 90px"
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="listQuery.ccuscode"
            placeholder="客户"
            filterable
            :filter-method="filterCus"
            clearable
            class="filter-item"
            style="width: 200px"
          ></el-select>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >搜索</el-button>
          <el-button
            v-waves
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-download"
            @click="handleExplore"
          >导出</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-date-picker
            class="filter-item"
            v-model="listQuery.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsForDate"
          ></el-date-picker>
          <el-date-picker
            class="filter-item"
            v-model="listQuery.requestdaterange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="到货开始日期"
            end-placeholder="到货结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsForRequestDate"
          ></el-date-picker>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="操作"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            v-permission="['seller']"
            @click="handleAudit(scope.row)"
          >审批</el-button>
          <el-button type="info" size="mini" @click="handleShow(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="销售类型" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FSTName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预订单号" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FBillNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经销商" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FTraderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FBillerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.FStatus | statusFilter">{{ scope.row.FStatusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FVerifierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FVerifierDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="U8单号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FU8BillNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行号" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存货编码" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存货名称" width="240px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存货规格" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvStd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FComInvUnitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FQty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面价" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FPlanPrice }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="含税单价" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税额" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣额" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FDisAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价税合计" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到货日期" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FRequestDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="特价项目" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FProject}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分录备注" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FEntryRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终无税单价" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice2}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终无税金额" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount2}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终含税单价" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice2}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终价税合计" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum2}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getPreSellList } from "@/api/presell";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "preselllist",
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = ["info", "success", "warning", "danger"];
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      statusOptions: [
        {
          key: `0`,
          display_name: `未审批`
        },
        {
          key: `1`,
          display_name: `已审批`
        },
        {
          key: `2`,
          display_name: `生单`
        },
        {
          key: `3`,
          display_name: `关闭`
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        status: "",
        searchword: "",
        ccuscode: "",
        date: [
          `${new Date().getFullYear()}-${new Date().getMonth() +
            1}-${new Date().getDate()}`,
          `${new Date().getFullYear()}-${new Date().getMonth() +
            1}-${new Date().getDate() + 7}`
        ],
        requestdate: []
      },
      pickerOptionsForDate: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptionsForRequestDate: {
        shortcuts: [
          {
            text: "下一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "下一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "下三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getPreSellList(
        Object.assign({}, this.listQuery, {
          role: [...this.$store.getters.roles].shift(),
          biller: this.$store.getters.username
        })
      ).then(response => {
        const { data, state, message } = response.data;
        if (state === `success`) {
          this.list = data.items;
          this.total = data.total;
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    getU8CusList() {
      this.u8cuslistLoading = true;
      fetchU8CusList(this.u8cuslistQuery).then(response => {
        this.u8list = response.data.items;
        this.u8total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.u8cuslistLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleU8Filter() {
      this.u8cuslistQuery.page = 1;
      this.getU8CusList();
    },
    handleExplore() {
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      // this.temp = {};
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    filterCus(value) {
      return "";
      // if (value) {
      //   this.u8List = [...this.u8ListCopy].filter(
      //     f => f.ccuscode.indexOf(value) > -1 || f.ccusname.indexOf(value) > -1
      //   );
      // } else {
      //   this.u8List = [...this.u8ListCopy];
      // }
    },
    handleShow(row) {
      this.$router.push({
        path: `/presell`,
        query: {
          id: row.FID
        }
      });
    },
    handleEdit(row) {},
    handleAudit(row) {}
  }
};
</script>
<style lang='less'>
.filter-item {
  .el-range-input,
  .el-range-separator {
    vertical-align: middle;
    display: inline-block;
    margin-bottom: 10px;
  }
}
</style>

