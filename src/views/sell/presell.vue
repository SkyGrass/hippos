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
            <el-input class="fixitem" v-model="orderForm.FBillNo"></el-input>
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
          <el-form-item label="备注" prop="Fremark">
            <el-input style="width:85vw" type="textarea" v-model="orderForm.Fremark"></el-input>
          </el-form-item>
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

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="行号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FNo }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="存货编码">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select
              v-model="scope.row.FInvCode"
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
          </template>
          <span v-else>{{ scope.row.FInvCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单位编码" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FInvUnitCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FQty }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="面价" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FPlanPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="含税单价" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="无税单价" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="无税金额" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount }}</span>
        </template>
      </el-table-column>

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

      <el-table-column align="center" label="折扣额" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FDisAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价税合计" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="到货日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.FRequestDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="特价项目">
        <template slot-scope="scope">
          <span>{{ scope.row.FProject }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分录备注">
        <template slot-scope="scope">
          <span>{{ scope.row.FEntryRemark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终无税单价" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FPrice2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终无税金额" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FAmount2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终含税单价" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FTaxPrice2 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最终价税合计" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.FSum2 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          >确认</el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="scope.row.edit=!scope.row.edit"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchU8CusListFromTrader } from "@/api/u8cus";
import { fetchU8StList } from "@/api/u8st";

export default {
  name: `presell`,
  data() {
    return {
      formStatus: `add`,
      currentRole: "customer",
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
        FInvUnitCode: "",
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
      u8StList: []
    };
  },
  watch: {
    "orderForm.FTaxRate": {
      handler: function(nv) {
        this.entryForm.FTaxRate = nv;
      }
    }
  },
  methods: {
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
      console.log(row);
      this.$message({
        message: "The title has been edited",
        type: "success"
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
    this.list = [this.entryForm];
  },
  mounted() {
    //通过是否传入ID判断当前表单状态是新增还是编辑
    if (this.$route.params.id) {
      // eidt
      console.log(1);
    } else {
      //add
      console.log(2);
    }
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
