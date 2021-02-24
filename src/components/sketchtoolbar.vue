<template>
  <div id="sketchtoolbar">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-row>
          <el-button type="primary" icon="el-icon-map-location" @click="drawpoint">画点</el-button>
          <el-button type="primary" icon="el-icon-edit" >地块</el-button>
          <el-button type="warning" icon="el-icon-s-grid" @click="tabledialog = true">属性表</el-button>
          <el-button type="warning" icon="el-icon-thumb" >选中</el-button>
          <el-button type="warning" icon="el-icon-video-play" @click="pausedraw">暂停</el-button>
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
      :before-close="handleClose">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletedialog = false">取 消</el-button>
        <el-button type="primary" @click="deletedialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="savedialog"
      width="30%"
      :before-close="handleClose">
      <span>确认保存绘制图形？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialog = false">取 消</el-button>
        <el-button type="primary" @click="savedialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="地块属性表" :visible.sync="tabledialog">
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
        <el-button @click="tabledialog = false">取 消</el-button>
        <el-button type="primary" @click="tabledialog = false">确 定</el-button>
      </div>
    </el-dialog>
        
          <!-- {/* 删除时弹出确认对话框 */}
          <Dialog open={showDelDialog} onRequestClose={handleCloseDelDialog}>
            <DialogContent>
              <DialogContentText  style={{color:"#455A64"}}>确认删除？</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelDialog} color="default">
                取消
              </Button>
              <Button onClick={handleDelete} style={{color:"#455A64"}}>
                确认
              </Button>
            </DialogActions>
          </Dialog>
          {/* 保存时弹出确认对话框 */}
          <Dialog open={showSaveDialog} onRequestClose={handleCloseSaveDialog}>
            <DialogContent>
              <DialogContentText  style={{color:"#455A64"}}>确认保存草图绘制数据？</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSaveDialog} color="default">
                取消
              </Button>
              <Button onClick={updateMapdata2project} style={{color:"#455A64"}}>
                确认
              </Button>
            </DialogActions>
          </Dialog>
          {/* 已保存提示 */}
          <Dialog open={alerthaveSaved} onRequestClose={handleCloseSaveDialog}>
            <DialogContent>
              <DialogContentText  style={{color:"#455A64"}}>草图绘制数据已保存！</DialogContentText>
            </DialogContent>
          </Dialog>
          {/* 删除时错误操作提示框 */}
          <Dialog 
            open={haveObjToDel} 
            onRequestClose={onDelAlerClose}>
              <DialogContent className={classes.alert} onClick={onDelAlerClose}>
                <Typograghy className={classes.message}>
                  Error_map_001:未选中需要删除的对象！                
                </Typograghy>
              </DialogContent>
          </Dialog>
          {/* RTK展点时错误提示框 */}
          <Dialog 
            open={alertPlotFail} 
            onRequestClose={onPlotAlerClose}>
              <DialogContent className={classes.alert} onClick={onPlotAlerClose}>
                <Typograghy className={classes.message}>
                Error_map_002:请求RTK数据失败！                
                </Typograghy>
              </DialogContent>
          </Dialog>
          {/* 撤销重做错误操作提示框 */}
          <Dialog 
            open={drawAlert} 
            onRequestClose={onDrawAlerClose}>
              <DialogContent className={classes.alert} onClick={onDrawAlerClose}>
                <Typograghy className={classes.message}>
                Error_map_003:您未处于绘制过程中，操作无效！                
                </Typograghy>
              </DialogContent>
          </Dialog>
          {/* 未保存时错误操作提示框 */}
          <Dialog 
            open={alertSignature} 
            onRequestClose={onSignatureAlerClose}>
              <DialogContent className={classes.alert} onClick={onSignatureAlerClose}>
                <Typograghy className={classes.message}>
                Error_map_004:您还未点击保存！                
                </Typograghy>
              </DialogContent>
          </Dialog>
          {/* 确认取号提示框 */}
          <Dialog open={fetchPoiNumIsChecked} onRequestClose={closeFetchPoiNum}>
            <DialogContent>
              <DialogContentText  style={{color:"#455A64"}}>确认取号？</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeFetchPoiNum} color="default">
                取消
              </Button>
              <Button onClick={onFetchPoi_NumClick} style={{color:"#455A64"}}>
                确认
              </Button>
            </DialogActions>
          </Dialog>




      <TotalStationCoorTransform 
        controlPoiArr={controlPoiArr} 
        totalStationData={totalStationData}
      />
     
      {/* 点击纠点拍照弹出界址点列表 */}
      <Drawer
        type="persistent"
        classes={{
          paper: classes.rectifydrawerPaper,
        }}
        anchor= 'left'
        open={rectifyPoiIsChecked}
      >
        <Toolbar className={classes.toolBar}>
          <Typography className={classes.title}>
              实时成图点列表
          </Typography>
          <Button className={classes.fetchpoibut} onClick={openFetchPoiNum} >
          <Typography style={{fontSize:'0.875rem', color:'#fff'}}>
            取号
            </Typography>
          </Button>
        </Toolbar> 
        <div style={{overflowX: 'auto', overflowY: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow style={{height:'40px'}}>
                <TableCell className={classes.headcell} style={{width:`${window.innerWidth * 0.06}px`,padding:0}}>            
                  <Typography className={classes.headtext} >id/界址点编号</Typography>      
                </TableCell>
                <TableCell className={classes.headcell} style={{width:`${window.innerWidth * 0.075}px`,padding:0}}>
                  <Typography className={classes.headtext} >坐标</Typography>  
                </TableCell>
                <TableCell className={classes.headcell} style={{width:`${window.innerWidth * 0.015}px`,padding:0}}>
                  <Typography className={classes.headtext} >修正</Typography>  
                </TableCell>
                <TableCell className={classes.headcell} style={{width:`${window.innerWidth * 0.015}px`,padding:0}}>
                  <Typography className={classes.headtext} >拍照</Typography>  
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {plotListData.map(n => {
                return (
                  <TableRow key={n.id}>
                    {/* id/界址点号 */}
                    <TableCell className={classes.tablecell} style={{width:`${window.innerWidth * 0.06}px`,padding:0}}>{n.id}</TableCell>
                    {/* 坐标 */}
                    <TableCell className={classes.tablecell} style={{width:`${window.innerWidth * 0.075}px`,padding:0,textAlign:'left'}}>
                      Lng:{n.coordinates[0].toFixed(7)}<br/>Lat:{n.coordinates[1].toFixed(7)}
                    </TableCell>
                    {/* 纠点 */}
                    <TableCell 
                      className={classes.tablecell}
                      style={{width:`${window.innerWidth * 0.015}px`,padding:0}}
                      onClick={()=>onRectifyJzdClick(n.id)}
                    >
                    <Adjust style={{color:'#000',width:`${window.innerWidth * 0.015}px`}}/>
                    </TableCell>
                    {/* 拍照*/}
                    <TableCell 
                    className={classes.tablecell}
                    style={{width:`${window.innerWidth * 0.015}px`,padding:0}}
                    onClick={()=>onjzdXCZJClick(n.id)}> 
                    <PhotoCameraIcon style={{color:'#000',width:`${window.innerWidth * 0.015}px`}}/>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Drawer> -->

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
      tabledialog:false,
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
      formLabelWidth: '120px'
    };
  },

  methods: {
    drawpoint() {
      this.$parent.drawpoint();
    },
    pausedraw(){
      this.$parent.pausedraw();
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    }

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
  width: 40%;
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

