<!-- 主要界面地图模版 -->
<template>
  <div id="LYXX">
    <div class="map">
      <webmap ref="webmap"></webmap>
      <sketchtoolbar></sketchtoolbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import webmap from "./../../components/webmap.vue";
import sketchtoolbar from "./../../components/sketchtoolbar";



// import tdxx from '../assets/tdxx.js'
// import lyxx from '../assets/lyxx.js'

//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "tdxx",

  components: {
    webmap: webmap,
    sketchtoolbar:sketchtoolbar
  },
  data() {
    //这里存放数据
    return {
      TDitem: [],
      LYitem: [],
      LYid: 0,
      TDid: 0,
      imglist: [],
      lytabledialog:false,
      dktabledialog:false,
      lyform:{},
      dkform:{},
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    drawpoint() {
      this.$refs.webmap.drawpoint();
    },
    
    drawpolygon(){
      this.$message({
        message: '请绘制楼宇',
        type: 'warning'
      });
    },

    chooseObj() {
      this.$refs.webmap.chooseObj();
    },
    stopdraw(){
      this.$refs.webmap.stopdraw();
    },
    savedata() {
      this.$refs.webmap.savelydata();
    },
    deletedata(){
      this.$refs.webmap.deletelydata();
    },
    savetable() {
      this.$refs.webmap.savetable();
    },
    showly(){
      this.$refs.webmap.showly();
    },
    showtable(){
      //判断选中对象是楼宇还是地块
      let num = this.$refs.webmap.clickedObj.length;
      console.log(num);
      if(num!=0){
        if(this.$refs.webmap.clickedObj[0].getJSONType() === "Marker"){
          this.lytabledialog=true;
          this.dktabledialog=false;
          this.lyform = this.$refs.webmap.clickedObj[0].properties; 
        }else{
          this.lytabledialog=false;
          this.dktabledialog=true;
          this.dkform=this.$refs.webmap.clickedObj[0].properties;
        }
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.showly()
  },

  beforeCreate() {}, //生命周期 - 创建之前rk
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<!-- 限定局部有效的样式 -->
<style scoped>
#WebMap {
  height: 100%;
  position: absolute;
  /* position:relative; */
  top: 0px;
  left: 0px;
  width: 100%;
}

* {
  touch-action: pan-y;
}
</style>