<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.billno"
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
      >
        <el-option
          v-for="item in roleOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        class="filter-item"
        v-model="listQuery.daterange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions2"
      ></el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="handleExplore"
      >导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="昵称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="U8客户编码" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cuscode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否停用" width="80px" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isclosed"/>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            v-permission="['admin']"
            @click="handleResetPwd(scope.row)"
          >重置密码</el-button>
          <el-button type="warning" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.isclosed?'success':'danger'"
            size="mini"
            @click="handleDelete(scope.row)"
          >{{ scope.row.isclosed?'启用':'停用' }}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="是否停用">
          <el-checkbox v-model="temp.isclosed"/>
        </el-form-item>
        <el-form-item
          v-if="temp.role === 'customer' || temp.role ==='trader'"
          label="U8客户编码"
          prop="cuscode"
        >
          <el-input v-model="temp.cuscode" readonly disabled placeholder="选取要绑定的U8客户">
            <el-button slot="append" icon="el-icon-search" @click="handlerCus()"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="用户备注">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.remark"
            type="textarea"
            placeholder="请简述备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogCusVisible" title="选取U8客户">
      <div class="filter-container">
        <el-input
          v-model="u8cuslistQuery.searchword"
          placeholder="U8客户编码/客户名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleU8Filter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleU8Filter"
        >搜索</el-button>
      </div>
      <el-table
        :data="u8list"
        v-loading="u8cuslistLoading"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="ccuscode" label="U8客户编码"/>
        <el-table-column prop="ccusname" label="U8客户名称"/>
        <el-table-column
          label="操作"
          align="center"
          width="120px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleConfirm(scope.row)">选取</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="u8total>0"
        :total="u8total"
        :page.sync="u8cuslistQuery.page"
        :limit.sync="u8cuslistQuery.limit"
        @pagination="getU8CusList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCusVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, reSetUserPwd } from "@/api/user";
import { fetchU8CusList } from "@/api/u8cus";
import { fetchRoleForSelect } from "@/api/role";
import waves from "@/directive/waves"; // Waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      u8list: null,
      total: 0,
      u8total: 0,
      listLoading: true,
      u8cuslistLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: "",
        billno: "",
        ccuscode: "",
        daterange: []
      },
      u8cuslistQuery: {
        page: 1,
        limit: 20,
        searchword: undefined
      },
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
      roleOptions: [],
      temp: {
        roleId: "",
        rolename: "",
        rolecode: "",
        roledescription: "",
        isclosed: false,
        isbuildin: false
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        role: [
          { required: true, message: "角色为必输项目", trigger: "change" }
        ],
        name: [{ required: true, message: "昵称为必输项目", trigger: "blur" }],
        username: [
          { required: true, message: "用户名为必输项目", trigger: "blur" }
        ],
        cuscode: [
          { required: true, message: "U8客户编码为必输项目", trigger: "change" }
        ]
      },
      dialogCusVisible: false,
      pickerOptions2: {
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
      }
    };
  },
  created() {
    this.getList();
    this.getRoleForSelect();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

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
    getRoleForSelect() {
      fetchRoleForSelect().then(response => {
        this.roleOptions = response.data;
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
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleExplore() {
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      // this.temp = {};
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.userId = parseInt(Math.random() * 100) + 1024; // mock a id
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.userId === this.temp.userId) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: `${row.isclosed ? "启用" : "停用"}成功`,
        type: "success",
        duration: 2000
      });
      row.isclosed = !row.isclosed;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    handlerCus() {
      this.dialogCusVisible = !this.dialogCusVisible;
      this.getU8CusList();
    },
    handleConfirm(row) {
      this.dialogCusVisible = !this.dialogCusVisible;
      this.temp.cuscode = row.ccuscode;
    },
    handleResetPwd(row) {
      this.$confirm(`此操作将重置此用户的登录密码为123456, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          reSetUserPwd(row)
            .then(response => {
              const { state, message } = response;
              if (state === `success`) {
                this.$message({
                  type: "success",
                  message: "重置成功，请尽快通知用户!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "重置失败!"
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "重置失败!"
              });
            });
        })
        .catch(() => {});
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
    }
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

