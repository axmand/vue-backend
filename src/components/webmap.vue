<!-- 主要界面地图模版 -->
<template>
  <div id="WebMap"></div>
</template>

<script>
import Vue from "vue";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";

import imgURL_loc from "../assets/marker.png";
import imgURL_loc2 from "../assets/choosed.png";

import imgURL_loc_area from "./../assets/marker_area.png";
import imgURL_loc2_area from "./../assets/choosed_area.png";


//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "WebMap",
  components: {},
  data() {
    //这里存放数据
    return {
      lydata:{},
      dkdata:{},
      TDitem: [],
      LYitem: [],
      LYid: 0,
      TDid: 0,
      imglist: [],
      target: [],
      clickedObj:[],
      linePoiArr:[],
      listLoading:false,
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
      this.recoverObj()
      Vue.drawTool.setMode('Point').enable();
      Vue.drawTool.setSymbol({
        markerFile: imgURL_loc,
        markerWidth: {
          stops: [
            [6, 0],
            [14, 30],
          ],
        },
        markerHeight: {
          stops: [
            [6, 0],
            [14, 40],
          ],
        },
      })
    },

    //画面
    drawpolygon(){
      this.recoverObj()
      Vue.drawTool.setMode('Polygon').enable()
      Vue.drawTool.setSymbol({
        lineColor: "#2348E5",
        lineWidth: 2,
        polygonFill: "#355BFA",
        polygonOpacity: 0.6,
        markerFile: imgURL_loc_area,
        markerWidth: {
          stops: [
            [6, 0],
            [14, 30],
          ],
        },
        markerHeight: {
          stops: [
            [6, 0],
            [14, 40],
          ],
        },
      });
    },

   //选中
    chooseObj() {
      var that = this
      Vue.drawTool.disable();
      var geos = Vue.mapInstance.getLayer("vector").getGeometries()
      console.log(geos)
      if(geos.length){
        for (let i = 0; i < geos.length; i++) {
          Vue.mapInstance.getLayer("vector").getGeometries()[i].on("click", function(param){      
            that.target = param.target;
            console.log(that.target);
            that.target.config('isClicked',!that.target.options.isClicked)
            //判断是首次点击高亮还是第二次点击取消选中
            if (that.target.getJSONType() === "Marker") {
              //首次点击高亮显示选中对象，并添加至存储选中对象的数组
              if (that.target.options.isClicked) {
                that.target.updateSymbol({
                  markerFile: imgURL_loc2,
                  markerWidth: {
                    stops: [
                      [6, 0],
                      [14, 40],
                    ],
                  },
                  markerHeight: {
                    stops: [
                      [6, 0],
                      [14, 50],
                    ],
                  },
                });
                // that.linePoiArr.push(target.getId());
                that.clickedObj.push(that.target);
              }else {//第二次点击取消高亮效果，并从存储选中对象的数组中移除
                for(let i=0;i<that.clickedObj.length;i++){
                  if(that.clickedObj[i].getId() === that.target.getId()){
                    that.clickedObj.splice(i, 1);
                    break;
                  }
                }
                that.target.updateSymbol({
                  markerFile: imgURL_loc,
                  markerWidth: {
                    stops: [
                      [6, 0],
                      [14, 30],
                    ],
                  },
                  markerHeight: {
                    stops: [
                      [6, 0],
                      [14, 40],
                    ],
                  },
                });
              }   
            }

            //选中地块
            if (that.target.getJSONType() === "Polygon") {
              if (that.target.options.isClicked) {
                that.target.updateSymbol({
                  lineColor: "#E52323",
                  lineWidth: 4,
                  polygonFill: "#FA3535",
                  polygonOpacity: 0.6,
                  markerFile: imgURL_loc2_area,
                  markerWidth: {
                    stops: [
                      [6, 0],
                      [14, 40],
                    ],
                  },
                  markerHeight: {
                    stops: [
                      [6, 0],
                      [14, 54],
                    ],
                  },
                });
                that.clickedObj.push(that.target);
              }else {
                for(let i=0;i<that.clickedObj.length;i++){
                  if(that.clickedObj[i].getId() === that.target.getId()){
                    that.clickedObj.splice(i, 1);
                    break;
                    }
                }
                that.target.updateSymbol({ 
                    lineColor: "#2348E5",
                    lineWidth: 2,
                    polygonFill: "#355BFA",
                    polygonOpacity: 0.6,
                    markerFile: imgURL_loc_area,
                    markerWidth: {
                      stops: [
                        [6, 0],
                        [14, 30],
                      ],
                    },
                    markerHeight: {
                      stops: [
                        [6, 0],
                        [14, 40],
                      ],
                    },
                 });           
                }
            }
            console.log(that.clickedObj)});
        }
      }
    },
    //清除选中效果
    recoverObj(){
      var that = this
      let num = that.clickedObj.length;
      that.target = null;
      for (let i = 0; i < num; i++) {
        if (that.clickedObj[i].getJSONType()  === "Marker") {
          that.clickedObj[i].config('isClicked',false);
          that.clickedObj[i].updateSymbol({
            markerFile: imgURL_loc,
            markerWidth: {
              stops: [
                [6, 0],
                [14, 30],
              ],
            },
            markerHeight: {
              stops: [
                [6, 0],
                [14, 40],
              ],
            },
          });
        }
        if (that.clickedObj[i].getJSONType() === "Polygon") {
          that.clickedObj[i].config('isClicked',false);
          that.clickedObj[i].updateSymbol({ 
            lineColor: "#2348E5",
            lineWidth: 2,
            polygonFill: "#355BFA",
            polygonOpacity: 0.6,
            markerFile: imgURL_loc_area,
            markerWidth: {
              stops: [
                [6, 0],
                [14, 30],
              ],
            },
            markerHeight: {
              stops: [
                [6, 0],
                [14, 40],
              ],
            },
          });
        }
      }
      console.log(that.clickedObj)
      that.clickedObj=[];
  },

    stopdraw(){
      Vue.drawTool.disable();
    },

    savedata() {
      console.log("选中地块数据已经保存");
    },

    deletedata(){
      var that = this
      //批量删除存储在选中数组中的所有地图对象
      let num = that.clickedObj.length;
      for(let i=0;i<num;i++){
        that.target=that.clickedObj[i];
        that.target.remove();
      }
      console.log("选中数据已经删除");
    },

    savetable() {
      console.log("选中地块属性数据已经保存");
    } ,

    showly(){
      fetch("http://121.196.60.135:1338/bms/geoprovider/LYXX")
        .then((result) => result.json())
        .then((result) => {
          //Vue.mapInstance.addLayer(new maptalks.VectorLayer("vector"));
          this.lydata = JSON.parse(result.content);
          const geometries = maptalks.GeoJSON.toGeometry(this.lydata);
          console.log(geometries)
          for (var i = 0; i < geometries.length; i++) {
            this.LYitem[i] = geometries[i];
          }
          const vectorLayer = Vue.mapInstance
            .getLayer("vector")
            .addGeometry(this.LYitem);
          //设置style
          vectorLayer.setStyle([
            {
              symbol: {
                markerFile: imgURL_loc,
                markerWidth: {
                  stops: [
                    [6, 0],
                    [14, 30],
                  ],
                },
                markerHeight: {
                  stops: [
                    [6, 0],
                    [14, 40],
                  ],
                },
              },
            },
          ]);
          Vue.mapInstance.getLayer("vector").bringToBack();
      })
    },

    showdk(){
      fetch("http://121.196.60.135:1338/bms/geoprovider/TDXX")
        .then((result) => result.json())
        .then((result) => {
          //Vue.mapInstance.addLayer(new maptalks.VectorLayer("dk"));
          this.dkdata = JSON.parse(result.content);
          const geometries = maptalks.GeoJSON.toGeometry(this.dkdata);
          for (var i = 0; i < geometries.length; i++) {
            this.TDitem[i]=geometries[i]
          }
          const vectorLayer = Vue.mapInstance
            .getLayer("vector")
            .addGeometry(this.TDitem);
          //设置style
          vectorLayer.setStyle([
            {
              symbol: {
                lineColor: "#2348E5",
                lineWidth: 2,
                polygonFill: "#355BFA",
                polygonOpacity: 0.6,
                markerFile: imgURL_loc_area,
                markerWidth: {
                  stops: [
                    [6, 0],
                    [14, 30],
                  ],
                },
                markerHeight: {
                  stops: [
                    [6, 0],
                    [14, 40],
                  ],
                },
              },
            },
          ]);
          Vue.mapInstance.getLayer("vector").bringToBack();
      })
    },
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
      mode: "Point" }).addTo(Vue.mapInstance).disable();

    Vue.drawTool.on('drawend', function (param) {
      console.log(param.geometry);
      layer.addGeometry(param.geometry);
    });

    var geos = Vue.mapInstance.getLayer("vector").getGeometries()
    console.log(geos)
    if(geos.length){
      console.log(111)
        for (let i = 0; i < geos.length; i++) {
          console.log(111)
          Vue.mapInstance.getLayer("vector").getGeometries()[i].on("click", this.clickObj());
        }
    }

    //添加界址点图层数据
    // if(LayerData.jzdJSONData){
    //   let jzd_geos;
    //   jzd_geos=JSON.parse(LayerData.jzdJSONData).geometries;
    //   //为地图对象添加点击绑定事件
    //   if(jzd_geos){
    //     jzd.addGeometry(jzd_geos);
    //     for (let i = 0; i < jzd_geos.length; i++) {
    //       jzd.getGeometries()[i].on("click", clickObj);
    //     }
    //   }
    // }

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
  activated() {},//如果页面有keep-alive缓存功能，这个函数会触发
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