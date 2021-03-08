<template>
  <div id="sketchtoolbar">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-row>
          <el-button type="primary" icon="el-icon-map-location" @click="drawpoint">楼宇</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="drawpolygon">地块</el-button>
          <el-button type="warning" icon="el-icon-s-grid" @click="showtable">属性</el-button>
          <el-button type="warning" icon="el-icon-thumb" @click="chooseObj">选中</el-button>
          <el-button type="warning" icon="el-icon-video-play" @click="stopdraw">暂停</el-button>
          <el-button type="warning" icon="el-icon-star-off" @click="savedialog = true">保存</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deletedialog = true">删除</el-button>
        </el-row>
      </div>
      </el-col>
    </el-row>

    <el-dialog
      title="提示"
      :visible.sync="deletedialog"
      width="30%"
      :before-close="handleClose"
      :modal="false">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletedialog = false">取 消</el-button>
        <el-button type="primary" @click="deletedialog = false;deletedata()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="savedialog"
      width="30%"
      :before-close="handleClose"
      :modal="false">
      <span>确认保存绘制图形？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialog = false">取 消</el-button>
        <el-button type="primary" @click="savedialog = false;savedata()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="楼宇属性表" :visible.sync="lytabledialog" :modal="false">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lytabledialog = false">取 消</el-button>
        <el-button type="primary" @click="lytabledialog = false;savetable()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="地块属性表" :visible.sync="dktabledialog" :modal="false">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择nide活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dktabledialog = false">取 消</el-button>
        <el-button type="primary" @click="dktabledialog = false;savetable()">确 定</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog title="地块属性表" :visible.sync="dktabledialog" :modal="false">
      <el-form :model="form">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.Id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.location" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面积" :label-width="formLabelWidth">
          <el-input v-model="form.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.location" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dktabledialog = false">取 消</el-button>
        <el-button type="primary" @click="dktabledialog = false;savetable()">确 定</el-button>
      </div>
    </el-dialog> -->  

  </div>
</template>

<script>
import { config } from '@vue/test-utils';
export default {
  name: "SketchToolBar",
  data() {
    return {
      visible: false,
      deletedialog:false,
      savedialog:false,
      //tabledialog:false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
      },
      formLabelWidth: '120px',
      lytabledialog:false,
      dktabledialog:false,
    };
  },

  methods: {
    drawpoint() {
      this.$parent.drawpoint();
    },

    drawpolygon(){
      this.$parent.drawpolygon();
    },

    chooseObj() {
      this.$parent.chooseObj();
    },

    stopdraw(){
      this.$parent.stopdraw();
    },
    savedata() {
      this.$parent.savedata();
    },
    deletedata(){
      this.$parent.deletedata();
    },
    savetable() {
      this.$parent.savetable();
    },

    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    showtable(){
      this.$parent.showtable();
      this.lytabledialog=this.$parent.lytabledialog;
      this.dktabledialog=this.$parent.dktabledialog;
      //console.log("zi"+this.lytabledialog);
      //console.log("fu"+this.$parent.dktabledialog);
    },

  },
  mounted() {},
};
</script>

<!-- 限定局部有效的样式 -->
<style scoped>
#sketchtoolbar {
  top: 7.1%;
  width: 100%;
  position: absolute;
  z-index: 2;
}
/* .el-button {
  position: fixed;
  padding: 1%;
  z-index: 3;
  right: 2%;
  bottom: 12%;
  width: 1.5em;
  height: 2.4em;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  border-radius: 10px;
  word-wrap: break-word;
} */
#div1 {
  margin: 0%;
  padding: 0;
}
.el-col {
  width: 50%;
  text-align: center;
}

#type {
  font-size: 25px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 60px;
}
#button0 {
  font-size: 0.5em;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 60px;
}
</style>

<style >
.element.style {
  transform-origin: right center;
  z-index: 4;
  display: none;
}
</style>

