<template>
  <div class="app-container">
    <el-form
      inline
      :model="orderForm"
      :rules="rules"
      ref="orderForm"
      label-width="80px"
      class="demo-orderForm"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="单号" prop="FBillNo" required>
            <el-input class="fixitem" v-model="orderForm.FBillNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="日期" prop="FDate" required>
            <el-date-picker
              class="fixitem"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="orderForm.FDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptionsStart"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="经销商" prop="FDealerCode">
            <el-input class="fixitem" v-model="orderForm.FDealerCode" v-bind:disabled="judgeRole()"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="FCustCode" required>
            <el-select
              class="fixitem"
              v-model="orderForm.FCustCode"
              placeholder="请选择客户"
              clearable
              filterable
              :filter-method="filterU8"
            >
              <el-option
                v-for="item in u8List"
                v-bind:key="item.ccuscode"
                :label="item.ccusname"
                :value="item.ccuscode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="销售类型" prop="FSTCode" required>
            <el-select class="fixitem" v-model="orderForm.FSTCode" placeholder="请选择销售类型">
              <el-option
                v-for="item in u8StList"
                v-bind:key="item.cstcode"
                :label="item.cstname"
                :value="item.cstcode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="税率" required prpp="FTaxRate">
            <el-input-number
              class="fixitem"
              v-model="orderForm.FTaxRate"
              :step="1"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制单人" prop="FBillerId">
            <el-input class="fixitem" v-model="orderForm.FBillerId" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="FStatus">
            <el-select class="fixitem" v-model="orderForm.FStatus" disabled>
              <el-option label="未审批" value="0"></el-option>
              <el-option label="审批" value="1"></el-option>
              <el-option label="生单" value="2"></el-option>
              <el-option label="关闭" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-form-item label="备注" prop="Fremark" label-width="0"> -->
          <el-input
            placeholder="请输入预订单的备注"
            style="width:81vw"
            type="textarea"
            v-model="orderForm.Fremark"
          ></el-input>
          <!-- </el-form-item> -->
        </el-col>
      </el-row>
      <el-row v-if="orderForm.FStatus !=='0'">
        <el-col :span="6">
          <el-form-item label="审核人" prop="FVerifier">
            <el-input class="fixitem" v-model="orderForm.FVerifier" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核日期" prop="FVerifyDate">
            <el-date-picker
              class="fixitem"
              disabled
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="orderForm.FVerifyDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="U8单号" prop="FU8BillNo">
            <el-input disabled class="fixitem" v-model="orderForm.FU8BillNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('orderForm')">立即创建</el-button>
        <el-button @click="resetForm('orderForm')">重置</el-button>
      </el-form-item>-->
    </el-form>

    <el-button-group style="margin-top:20px">
      <el-button type="primary" icon="el-icon-plus" @click="addRow">增行</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="clearRow">清空行</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="editForm">编辑订单</el-button>
      <el-button type="primary" icon="el-icon-check" @click="saveForm">保存订单</el-button>
    </el-button-group>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="margin-top:10px"
    >
      <el-table-column align="center" label="行号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            style="width:40px"
            icon="el-icon-delete"
            @click="delRow(scope.$index)"
          ></el-button>
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="mini"
            style="width:40px"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          ></el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            style="width:40px"
            icon="el-icon-edit"
            @click="scope.row.edit=!scope.row.edit"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存货编码" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input
              size="mini"
              placeholder="输入存货编码/名称 回车检索"
              v-model="scope.row.FInvCode"
              class="input-with-select"
              @keyup.enter.native="onSearch"
            >
              <el-button slot="append" icon="el-icon-search" @click="showInvList(scope.$index)"></el-button>
            </el-input>
          </template>
          <span v-else>{{ scope.row.FInvCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="存货名称" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存货规格" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvStd }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvUnitName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input-number
              size="mini"
              v-model="scope.row.FQty"
              @change="handleChange"
              :min="0.1"
              :max="100"
              :step="0.1"
            ></el-input-number>
          </template>
          <span v-else>{{ scope.row.FQty }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="面价" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FPlanPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="含税单价" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="无税单价" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="无税金额" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="税率" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxRate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="税额" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="折扣额" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FDisAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价税合计" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="到货日期" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-date-picker
              size="mini"
              style="width:80%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="scope.row.FRequestDate"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptionsStartForRequest"
            ></el-date-picker>
          </template>
          <span v-else>{{ scope.row.FRequestDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="特价项目" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input type="text" size="mini" placeholder="请输入" v-model="scope.row.FProject"/>
          </template>
          <span v-else>{{ scope.row.FProject }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分录备注" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input type="text" size="mini" placeholder="请输入" v-model="scope.row.FEntryRemark"/>
          </template>
          <span v-else>{{ scope.row.FEntryRemark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终无税单价" width="120" v-if="formStatus==='look'">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终无税金额" width="120" v-if="formStatus==='look'">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终含税单价" width="120" v-if="formStatus==='look'">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终价税合计" width="120" v-if="formStatus==='look'">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum2 }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogInvVisible" title="存货列表" v-el-drag-dialog width="70%">
      <div class="filter-container">
        <el-input
          v-model="listQuery.searchword"
          placeholder="存货编码/存货名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
      </div>
      <el-table
        tooltip-effect="dark"
        v-loading="invListLoading"
        :key="tableKey"
        :data="invList"
        border
        fit
        highlight-current-row
        show-overflow-tooltip
        style="width: 100%;"
      >
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="confirm([scope.row])"
            >选取</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="存货编码" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cinvcode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="存货名称" width="250px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cinvname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cinvstd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计量单位" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ccomunitname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="体积" width="70px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ivolume }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最小订单量" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fminquantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="面价" width="80px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.iuprice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="含税单价" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.iinvnowcost }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="invTotal>0"
        :total="invTotal"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getInvList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInvVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="confirm()">确认</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchU8CusListFromTrader } from "@/api/u8cus";
import { fetchU8StList } from "@/api/u8st";
import { fetchInvList, fetchCusInvList } from "@/api/inv";
import { getPreSellBillNo } from "@/api/presell";
import waves from "@/directive/waves"; // Waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { Calc } from "calc-js";
import { getFirstTime } from "@/utils";
export default {
  name: `presell`,
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      tableKey: 0,
      formStatus: `add`,
      orderForm: {
        FID: "",
        FType: "",
        FBillNo: "",
        FDate: undefined,
        FSTCode: "",
        FCustCode: "",
        FDealerCode: "",
        FTaxRate: 16,
        FBillerId: "",
        FVerifier: "",
        FVerifyDate: "",
        Fremark: "",
        FU8BillNo: "",
        FStatus: "0"
      },
      entryForm: {
        edit: true,
        FEntryID: "",
        FID: "",
        FNo: "1",
        FInvCode: "",
        FInvName: "",
        FInvStd: "",
        FInvUnitCode: "",
        FInvUnitName: "",
        FQty: 0,
        FPlanPrice: "",
        FTaxPrice: "",
        FPrice: "",
        FAmount: "",
        FTaxRate: "",
        FDisAmount: "",
        FSum: "",
        FRequestDate: "",
        FProject: "",
        FEntryRemarke: "",
        FRowState: "",
        FPrice2: "",
        FAmount2: "",
        FTaxPrice2: "",
        FSum2: ""
      },
      rules: {},
      list: [],
      u8List: [],
      u8ListCopy: [],
      u8StList: [],
      invList: [],
      invTotal: 0,
      listLoading: true,
      invListLoading: true,
      dialogInvVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        searchword: undefined,
        ccuscode: undefined
      },
      multipleSelection: [],
      currentRole: "customer",
      currentDate: "",
      currentRow: 0,
      pickerOptionsStart: {
        disabledDate(time) {
          // console.log(time, getLastTime());
          return time.getTime() < getFirstTime().getTime();
        }
      },
      pickerOptionsStartForRequest: {}
    };
  },
  watch: {
    "orderForm.FCustCode": {
      handler: function(nv) {
        this.listQuery.ccuscode = nv;
      }
    },
    "orderForm.FTaxRate": {
      handler: function(nv) {
        this.list.forEach(f => {
          f.FTaxRate = nv;
        });
      }
    },
    "orderForm.FDate": {
      handler: function(nv) {
        this.list.forEach(f => {
          if (new Date(nv).getTime() >= new Date(f.FRequestDate).getTime()) {
            f.FRequestDate = null;
          }
        });
        this.pickerOptionsStartForRequest = {
          disabledDate(time) {
            return time.getTime() <= new Date(nv).getTime();
          }
        };
      }
    }
  },
  methods: {
    getFormEntry() {
      this.listLoading = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(this.orderForm);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    judgeRole() {
      return this.currentRole == "trader";
    },
    filterU8(value) {
      if (value) {
        this.u8List = [...this.u8ListCopy].filter(
          f => f.ccuscode.indexOf(value) > -1 || f.ccusname.indexOf(value) > -1
        );
      } else {
        this.u8List = [...this.u8ListCopy];
      }
    },
    confirmEdit(row) {
      row.edit = false;
      this.$message({
        message: "The title has been edited",
        type: "success"
      });
    },
    choose(item) {
      console.log(item);
    },
    showInvList(row) {
      this.dialogInvVisible = !this.dialogInvVisible;
      this.getInvList(row);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getInvList();
    },
    onSearch() {
      fetchInvList(this.listQuery).then(response => {
        const { items } = response.data;
        const _data = [Object.assign({}, items.shift())];
        this.confirm(_data);
      });
    },
    getInvList(row) {
      this.invListLoading = true;
      this.currentRow = row;
      fetchInvList(this.listQuery).then(response => {
        this.invList = response.data.items;
        this.invTotal = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.invListLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    confirm(data) {
      const selected = data //|| [...this.multipleSelection];
      // console.log(selected);
      if (selected.length > 0) {
        selected.forEach((f, i) => {
          // const lastRowNo = this.addRow();
          // console.log(lastRowNo)
          // this.currentRow = lastRowNo;
          this.list[this.currentRow].FInvCode = selected[i].cinvcode;
          this.list[this.currentRow].FInvName = selected[i].cinvname;
          this.list[this.currentRow].FInvStd = selected[i].cinvstd;
          this.list[this.currentRow].FInvUnitCode = selected[i].ccomunitcode;
          this.list[this.currentRow].FInvUnitName = selected[i].ccomunitname;
          this.list[this.currentRow].FQty = selected[i].fminquantity;
          this.list[this.currentRow].FPlanPrice = selected[i].iuprice; //面价:从存货价格表中取
          this.list[this.currentRow].FPlanPrice = selected[i].iuprice; //面价:从存货价格表中取
          this.list[this.currentRow].FTaxPrice = selected[i].iinvnowcost; //含税单价:默认从客户价格表中取，没有就取面价 ();

          //  fetchCusInvList({
          //     ccuscode: this.FCustCode,
          //     cinvccode: selected[i].cinvccode
          //   })
          //     .then(response => {
          const FPlanPrice = this.list[this.currentRow].FPlanPrice;
          const FTaxRate = this.orderForm.FTaxRate;
          const FTaxPrice = this.list[this.currentRow].FTaxPrice;
          const FQty = this.list[this.currentRow].FQty;
          const FPrice = Calc.divide(
            FTaxPrice,
            Calc.sum(1, Calc.divide(FTaxRate, 100))
          );
          const FAmount = Calc.multiply(FPrice, FQty);
          const FSum = Calc.multiply(FTaxPrice, FQty); //价税合计:含税单价*数量
          const FTaxAmount = Calc.multiply(Calc.divide(FTaxRate, 100), FSum); //税额:价税合计*(税率/100)
          const FDisAmount = Calc.multiply(
            FQty,
            Calc.minus(FPlanPrice, FTaxPrice)
          ); //折扣额:数量*(面价-含税单价）
          this.list[this.currentRow].FTaxPrice = FTaxPrice; //含税单价:默认从客户价格表中取，没有就取面价
          this.list[this.currentRow].FPrice = FPrice.toFixed(2); //无税单价:含税单价/(1+税率/100)
          this.list[this.currentRow].FAmount = FAmount.toFixed(2); //无税金额:数量*无税单价
          this.list[this.currentRow].FTaxAmount = FTaxAmount.toFixed(2); //无税金额:数量*无税单价
          this.list[this.currentRow].FSum = FSum.toFixed(2); //无税金额:数量*无税单价
          this.list[this.currentRow].FDisAmount = FDisAmount.toFixed(2); //折扣额:数量*(面价-含税单价）
          //     })
          //     .catch(err => {});
        });
        this.dialogInvVisible = false;
      } else {
        this.$notify({
          title: "错误",
          message: "没有勾选",
          type: "warning",
          duration: 2000
        });
      }
    },
    handleChange(val) {
      const nv = this.currentRow;
      if (this.list[nv].FInvCode == "") return;
      const FPlanPrice = this.list[nv].FPlanPrice;
      const FTaxRate = this.orderForm.FTaxRate;
      const FTaxPrice = this.list[nv].FTaxPrice;
      const FQty = val;
      const FPrice = Calc.divide(
        FTaxPrice,
        Calc.sum(1, Calc.divide(FTaxRate, 100))
      );
      const FAmount = Calc.multiply(FPrice, FQty);
      const FSum = Calc.multiply(FTaxPrice, FQty); //价税合计:含税单价*数量
      const FTaxAmount = Calc.multiply(Calc.divide(FTaxRate, 100), FSum); //税额:价税合计*(税率/100)
      const FDisAmount = Calc.multiply(FQty, Calc.minus(FPlanPrice, FTaxPrice)); //折扣额:数量*(面价-含税单价）
      this.list[nv].FTaxPrice = FTaxPrice; //含税单价:默认从客户价格表中取，没有就取面价
      this.list[nv].FPrice = FPrice.toFixed(2); //无税单价:含税单价/(1+税率/100)
      this.list[nv].FAmount = FAmount.toFixed(2); //无税金额:数量*无税单价
      this.list[nv].FTaxAmount = FTaxAmount.toFixed(2); //无税金额:数量*无税单价
      this.list[nv].FSum = FSum.toFixed(2); //无税金额:数量*无税单价
      this.list[nv].FDisAmount = FDisAmount.toFixed(2); //折扣额:数量*(面价-含税单价）
    },
    addRow() {
      this.list.push(
        Object.assign({}, this.entryForm, { FNo: this.list.length + 1 })
      );
      return this.list.length - 1;
    },
    delRow(row) {
      this.$confirm(`删除行${row + 1}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.list.splice(row, 1);
          this.reCalcRowNo();
        })
        .catch();
    },
    clearRow() {
      this.$confirm(`清空表格全部行, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.list = [];
          this.addRow();
        })
        .catch(() => {});
    },
    editForm() {},
    saveForm() {},
    reCalcRowNo() {
      this.list.forEach((f, i) => {
        f.FNo = i + 1;
      });
    }
  },
  created() {
    this.currentRole = [...this.$store.getters.roles].shift();
    this.orderForm.FBillerId = this.$store.getters.username;
    if (this.currentRole == `trader`) {
      this.orderForm.FDealerCode = this.$store.getters.username;
      fetchU8CusListFromTrader({ trader: this.$store.getters.username })
        .then(response => {
          this.u8List = response.data.items;
          this.u8ListCopy = response.data.items;
        })
        .catch(() => {});
    }
    fetchU8StList().then(response => {
      this.u8StList = response.data.items;
      this.orderForm.FSTCode = [...response.data.items].shift().cstcode;
    });
    this.entryForm.FTaxRate = this.orderForm.FTaxRate;
    this.list.push(
      Object.assign({}, this.entryForm, {
        FNo: this.list.length + 1
      })
    );
  },
  mounted() {
    //通过是否传入ID判断当前表单状态是新增还是编辑
    if (this.$route.params.id) {
      // eidt
      console.log(1);
      //this.getFormEntry();
    } else {
      //add
      getPreSellBillNo()
        .then(response => {
          const { billNo, date } = response.data;

          this.orderForm.FBillNo = billNo;
          this.orderForm.FDate = date;
          this.pickerOptionsStartForRequest = {
            disabledDate(time) {
              return time.getTime() <= new Date(date).getTime();
            }
          };
        })
        .catch(error => {});
    }

    this.getFormEntry();
  }
};
</script>

<style scoped>
.fixitem {
  width: 200px;
}
.offset {
  width: 180px;
}
</style>
