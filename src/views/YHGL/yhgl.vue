<template>
  <div class="app-container">
    <el-button :loading="loading" type="primary" style="width:20%;margin-bottom:30px;" @click="dialogFormVisible = true">新增用户组</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用户组名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户等级" width="110">
        <template slot-scope="scope">
          {{ scope.row.author}}
        </template>
      </el-table-column> -->
      <el-table-column label="用户描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button  type="primary" style="width:20%;" @click="apiYH(scope.row.objectId)">设置权限</el-button>
          &nbsp;
          <el-button  type="primary" style="width:20%;" @click="deleteYH(scope.row.objectId)">删除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog title="新增用户组" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户等级" :label-width="formLabelWidth">
          <el-input v-model="form.level" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addYH">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限设置" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="desc" label="权限描述" >
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button  type="primary" style="width:20%;" @click="APIAuthorize(scope.row.key)">权限授予</el-button>
            &nbsp;
            <el-button  type="primary" style="width:20%;" @click="APIWithdraw(scope.row.key)">权限收回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'
import Vue from "vue";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      ObjectId:'',
      list: null,
      listLoading: true,
      loading: false,
      gridData: [{
        key: 'Client.HYY.Routes.BMSTDXXGeoDataUpdate',
        desc: '修改土地信息接口，需要用户权限',
      }, {
        key: 'Client.HYY.Routes.BMSLYXXGeoDataUpdate',
        desc: '修改楼宇信息接口，需要用户权限',
      }],
      apidata:null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        desc: '',
        level:'',
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
    // this.fetchAPI()
  },

  methods: {

    fetchData() {
      this.listLoading = true
      // getList().then(response => {
      //   this.list = response.data.items
      //   console.log(this.list)
      //   this.listLoading = false
      // })

      //获取用户列表
      let url = 'http://121.196.60.135:1338/cms/getgrouplist/'+ Vue.userName + '/' + Vue.token
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.status == "ok"){
          let groupdata = JSON.parse(result.content)
          this.list = groupdata
          console.log(this.list)
          this.listLoading = false
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
    },
    
    fetchAPI() {
      this.listLoading = true
      //获取用户权限列表
      let url = 'http://121.196.60.135:1338/cms/getconfigureableapilist'
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.status == "ok"){
          let apidata = JSON.parse(result.content)
          console.log(Object.keys(apidata))
          console.log(apidata)
          for (var i = 0; i < Object.keys(apidata).length; i++) {
            this.gridData[i].key = Object.keys(apidata)[i]
            let key0 = Object.keys(apidata)[i]
            this.gridData[i].desc = apidata[key0]
          }
          console.log(this.gridData)
          this.listLoading = false
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
    },

    addYH(){
      this.dialogFormVisible = false
      let url = 'http://121.196.60.135:1338/cms/creategroup/'+ Vue.userName + '/' + Vue.token +'/' + this.form.name +'/' + this.form.desc +'/' + this.form.level
      //新增用户组
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.content == "\"用户组创建成功\""){
          this.$message({
            message: result.content,
            type: 'success'
          });
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
      this.fetchData()
    },

    deleteYH(id){
      let url = 'http://121.196.60.135:1338/cms/deletegroup/'+ Vue.userName + '/' + Vue.token +'/' + id
      console.log(url)
       // 删除用户组
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.status == "ok"){
          this.$message({
            message: result.content,
            type: 'success'
          });
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
      this.fetchData()
    },


    //获取ObjectId的中间件
    apiYH(id){
      this.dialogTableVisible = true
      this.ObjectId = id
      console.log(this.ObjectId)
    },

    //权限授予
    APIAuthorize(key){
      let url = 'http://121.196.60.135:1338/cms/authorizegroupapi/'+ Vue.userName + '/' + Vue.token +'/' + this.ObjectId + '/' +key
      console.log(url)
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.status == "ok"){
          this.$message({
            message: result.content,
            type: 'success'
          });
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
    },

    //权限收回
    APIWithdraw(key){
      let url = 'http://121.196.60.135:1338/cms/withdrawgroupapi/'+ Vue.userName + '/' + Vue.token +'/' + this.ObjectId + '/' +key
      console.log(url)
      fetch(url).then(result => result.json())
      .then((result) => {
        if(result.status == "ok"){
          this.$message({
            message: result.content,
            type: 'success'
          });
        }
        else{
          this.$message({
            message: result.content,
            type: 'error'
          });
        }
      }) 
    },

  }
}
</script>
