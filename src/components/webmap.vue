<!-- 主要界面地图模版 -->
<template>
  <div id="WebMap"></div>
</template>

<script>
import Vue from "vue";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";


//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "WebMap",
  components: {},
  data() {
    //这里存放数据
    return {
      TDitem: [],
      LYitem: [],
      LYid: 0,
      TDid: 0,
      imglist: [],
      target: [],
      clickedObj: [],
      editingLabel:[],
      linePoiArr :[],
      deleteObj:[], 
      recoverObj:[], 
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //画点
    drawpoint(){
      Vue.drawTool.setMode('Point').enable();
    },
    stopdraw(){
      Vue.drawTool.disable();
    }  
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //构建map
    var image = new Image();
   

    Vue.mapInstance = new maptalks.Map("WebMap", {
      center: [114.190649, 30.570374],
      zoom: 15,
    });
    
    var layer = new maptalks.VectorLayer('vector').addTo(Vue.mapInstance);
    //添加画图工具
    Vue.drawTool = new maptalks.DrawTool({
      mode: "Point",
      symbol: {
        lineColor: "#000000",
        lineWidth: 1.5,
        polygonFill: "#FFFFFF",
        markerWidth : 20,
        markerHeight: 20,
        markerType : 'ellipse',
      }
    }).addTo(Vue.mapInstance).disable();

    Vue.drawTool.on('drawend', function (param) {
      console.log(param.geometry);
      layer.addGeometry(param.geometry);
    });


    // Vue.mapInstance.setBaseLayer(
    //   new maptalks.TileLayer("base", {
    //     urlTemplate: "http://121.196.60.135:1338/layer/google/{z}/{x}/{y}",
    //     attribution:
    //       '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    //   })
    // );

    Vue.mapInstance.setBaseLayer(
      new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d0c3c3be64e0042982f3d4a94cb15298",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        attribution:
          '&copy; <a href="https://map.tianditu.gov.cn//">天地图</a>,&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
      })
    );

    Vue.mapInstance.addLayer(
      new maptalks.TileLayer("base2", {
        urlTemplate:
          "http://{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d0c3c3be64e0042982f3d4a94cb15298",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      })
    );

    Vue.mapInstance.setMaxZoom(18);
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