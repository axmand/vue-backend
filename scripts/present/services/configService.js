/**
*   @author xr wk hk,接口配置
*   @modify hk date 2016/4/14
*/
define(['baseServices', 'objutil'], function (baseServices, objutil) {
    baseServices.service('configService', function ($rootScope,$http) {
        //获取用户名
        var getVisitor = function (userInfo) {
            var visitorToken = "";
            //如果userInfo存在
            if (userInfo != null && userInfo != undefined && userInfo.userInfo != undefined) {
                visitorToken += userInfo.userInfo.UserName;
            }
            else {
                //未登录用户生成随机字符串
                visitorToken = randomString(16);
                storeData("userInfo", {
                    content: "未登录用户",
                    userInfo: {
                        UserName: visitorToken
                    }
                });
            }
            return visitorToken;
        };
        //创建图标path
        var createIconPath = function (count) {
            var _path = '';
            for (var i = 1; i <= count; i++) {
                _path = _path + '<span class="path' + i.toString() + '"></span>';
            }
            return _path;
        };
        //区域读取
        var regionId = ($rootScope.regionId === 'localhost' || $rootScope.regionId === 'bdl') ? 'bdl' : $rootScope.regionId;
        console.log(regionId);
        var rootUrl = "http://139.129.7.130:1338/";
        //var rootUrl = "http://127.0.0.1:10100/";
      
        var urlRequest = {   //url请求地址集合处理
            rootUrl: rootUrl, //接口根地址
            regionId: regionId, //区域标识
            imgUrl: "http://resource.qiongrenkeji.com/images/", //读取图片地址
            musicUrl: "http://resource.qiongrenkeji.com/music/",  //读取音乐地址
            postMusicFileUrl: "http://bdl.qiongrenkeji.com:8095/", //上传音乐文件
            postImgFileUrl: "http://bdl.qiongrenkeji.com:8093/", //上传图片，文件格式，使用boundary边界裁剪法
            postImageUrl: "http://bdl.qiongrenkeji.com:8094/imgupload", //上传图片base64格式，用于裁剪
            modificationPostUrl: rootUrl + 'backend/common/modifydata/post',//修改 （post）
            deleteDataPostUrl: rootUrl + '/backend/common/deletedata/post',//删除 （post）
            setPassPostUrl:rootUrl+'/backend/common/setpass/post	',//审核通过（post）
            //商家部分
            unauditedShopUrl: '/backend/commercial/shoplist/get/',                                  //待审核商家
            managedShopsUrl:'/backend/commercial/managedcommercialshoplist/get/',   //管理店铺列表
            carogsUrl: '/backend/commercial/cargolist/get/',                                               //后台获取商品列表
            activitiesUrl: '/backend/commercial/activitylist/get/',                                         //后台获取活动列表
            createActivityPostUrl:rootUrl + '/backend/commercial/createcommercialactivity/post',  //添加后台活动(post)
            createCargosPostUrl: rootUrl + 'backend/commercial/createcommercialcargo/post', //添加商品 (post)
            //站长部分
            createSuperMarketPostUrl: rootUrl + 'backend/convenience/createsupermarket/post', //确定分站特约商家（post）
            shopBargainUrl:rootUrl+'backend/commercial/createcommercialbargain/post', //后台合同绑定（post）
            unauditedJourneymanUrl: "/backend/convenience/journeymanlist/get/",                //后台工匠审核
            journeymanBargainUrl: rootUrl + "/backend/convenience/createconveniencebargain/post",  //工匠合同绑定 (post)
            messageListUrl: "/backend/convenience/messagelist/get/", //获取便民信息列表
            topicUrl: '/backend/commercial/topiclist/get/',  //专题信息
            createTopicPostUrl:rootUrl+'backend/commercial/createcommercialtopic/post',  //创建专题接口
            createMessagePostUrl: rootUrl + 'backend/convenience/createconveniencemessage/post',//发布便民信息(post)
            convenienceVideoUrl: '/backend/convenience/videolist/get/', //便民视频信息
            createConvenienceVideoPostUrl:rootUrl+'backend/convenience/createconveniencevideo/post', //创建便民视频(post)
            convenienceVideosUrl:'/backend/convenience/videolist/get/', //便民视频列表
            topicsUrl: '/backend/commercial/topiclist/get/', //专题列表
            //本地连高级管理员后台
            branchlistUrl: 'backend/customer/branchlist/get/',   //获取分站列表
            setBranchAdminUrl: '/backend/customer/', //设置分站管理员
            //提交专题内容
            merchantTopicPostUrl: rootUrl + '/backstage/merchantdisplay',
            //创建分站
            branchPostUrl: rootUrl + "backend/customer/createbranch/post",
            //获取专题信息
            MerchantTopicGet: '/huangye/display/',
        }
        //日期处理方法
        var dateProcess = function (data) {
            if (data != null && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var _date = data[i].date;
                    var _date = _date.replace("年", "/").replace("月", "/").replace("日", "");
                    data[i].date = _date;
                }
            }
            return data;
        };
        //生成随机字符串
        var randomString = function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        };
        //url匹配，获取regionId
        var _urlMatch = function (expression, matchString, source) {
            var regExp = expression;
            var _html = source;
            var result = _html.replace(regExp, matchString);
            return result;
        };

        var _appConfig = {};

        var _converToGroup = function (content) {
            //类型转换
            var content = JSON.parse(content);
            var collection = [];
            for (var i = 0; i < content.length; i++) {
                for (var j = 0; j < content[i].children.length; j++) {
                    var element = {
                        name: content[i].children[j].name,
                        uid: content[i].children[j].uid,
                        group: content[i].name
                    }
                    collection.push(element);
                }
                collection.push({
                    name: content[i].name,
                    uid: content[i].uid,
                    group: content[i].name
                });
            };
            return collection;
        }

        //获取app配置，包括类型配置，活动配置等
        $http.get(rootUrl + regionId + '/common/config/get').success(function (data) {
            if (data.status == "ok") {
                console.log(_appConfig);
                objutil.cover(_appConfig, JSON.parse(data.content));
                //1.获取店铺类型
                $http.get(rootUrl + regionId + '/category/categories/get/' + _appConfig.ECategory.CommercialShop).success(function (data) {
                    $rootScope.$$commericalShopTypes = _converToGroup(data.content);
                }, function (err) {

                });
                //2.获取店铺服务种类
                $http.get(rootUrl + regionId + '/category/categories/get/' + _appConfig.ECategory.CommercialMerchant).success(function (data) {
                    $rootScope.$$commericalMerchantType = _converToGroup(data.content);
                }, function (err) {

                });
                //3.获取商品种类
                $http.get(rootUrl + regionId + '/category/categories/get/' + _appConfig.ECategory.CommercialCargo).success(function (data) {
                    $rootScope.$$commericalCargoType = _converToGroup(data.content);
                }, function (err) {

                });
                //4.获取便民信息类型
                $http.get(rootUrl + regionId + '/category/categories/get/' + _appConfig.ECategory.ConvenienceMessage).success(function (data) {
                    $rootScope.$$convenienceMessage = _converToGroup(data.content);
                }, function (err) {

                });
                //5.便民视频类型
                $http.get(rootUrl + regionId + '/category/categories/get/' + _appConfig.ECategory.ConvenienceVideo).success(function (data) {
                    $rootScope.$$convenienceVideo = _converToGroup(data.content);
                }, function (err) {

                });
            }
            
        }).error(function (error) {

        });
        //
        return {
            urlRequest: urlRequest,
            urlMatch: _urlMatch,
            dateProcess: dateProcess,
            createIconPath: createIconPath,
            getVisitor: getVisitor,
            appConfig: _appConfig
        };
    });
});