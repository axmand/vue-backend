define(['baseServices', 'objutil'], function (baseServices, objutil) {
    baseServices.service('$$commonDatabase', function ($rootScope, $http, $q) {
        //区域读取
        var regionId = ($rootScope.regionId === 'localhost' || $rootScope.regionId === 'all') ? 'all' : $rootScope.regionId;
        console.log(regionId);
       // var _rootUrl = "http://120.55.166.61:20200/";
        var _rootUrl = "http://139.129.7.130:1338/"
        var urlRequest = {   //url请求地址集合处理
            rootUrl: _rootUrl, //接口根地址
            regionId: regionId, //区域标识
            imgUrl: "http://resource.qiongrenkeji.com/images/", //读取图片地址
            musicUrl: "http://resource.qiongrenkeji.com/music/",  //读取音乐地址
            postMusicFileUrl: "http://114.55.119.208:8095/", //上传音乐文件
            postImgFileUrl: "http://bdl.qiongrenkeji.com:8093/", //上传图片，文件格式，使用boundary边界裁剪法
            postImageUrl: "http://114.55.119.208:8094/imgupload", //上传图片base64格式，用于裁剪    
            BackendCommercialActivityListGet: _rootUrl + '{visitor}/backend/commercial/activitylist/get/{shopObjectId}/{pageNumber}/{regionId}',
            BackendCommercialCargoListGet: _rootUrl + '/{visitor}/backend/commercial/cargolist/get/{cargoType}/{shopObjectId}/{searchword}/{eSearchPattern}/{pageNumber}/{regionId}',
            BackendCommercialDeliverOrderGet: _rootUrl + '{visitor}/backend/commercial/deliverorder/get/{customerName}/{token}/{orderObjectId}/{regionId}/{waybillCategory}/{waybillNumber}',
            BackendCommercialOrderListByOrderStateGet: _rootUrl + '{visitor}/backend/commercial/orderbyorderstate/get/{customerName}/{token}/{searchWord}/{orderState}/{pageNumber}',
            BackendCommercialRefuseOrderGet: _rootUrl + '{visitor}/backend/commercial/refuseorder/get/{customerName}/{token}/{orderObjectId}/{regionId}/{refuseReason}',
            BackendCommercialReimburseOrderGet: _rootUrl + '{visitor}/backend/commercial/reimburseorder/get/{customerName}/{token}/{orderObjectId}/{regionId}',
            BackendCommercialShopListGet: _rootUrl + '{visitor}/backend/commercial/shoplist/get/{eshoptype}/{emerchanttype}/{esearchPattern}/{searchword}/{location}/{sortMethod}/{radius}/{pageNumber}/{regionId}',
            BackendCommercialTopicListGet: _rootUrl + '{visitor}/backend/commercial/topiclist/get/{searchword}/{pageNumber}/{regionId}',
            BackendCommercialVideoListGet: _rootUrl + '{visitor}/backend/commercial/videolist/get/{shopObjectId}/{cargoObjectId}/{evideoType}/{esource}/{pageNumber}/{regionId}',
            BackendCommericalOrderListGet: _rootUrl + '{visitor}/backend/commercial/orderlist/get/{customerName}/{token}/{shopObjectId}/{regionId}/{pageNumber}',
            BackendConvenienceJourneymanListGet: _rootUrl + '{visitor}/backend/convenience/journeymanlist/get/{journeymanType}/{journeymanSortMethod}/{waitAduit}/{searchword}/{regionId}/{pageNumber}',
            BackendConvenienceMessageListGet: _rootUrl + '{visitor}/backend/convenience/messagelist/get/{messageType}/{subType}/{messageSortMethod}/{waitAduit}/{searchword}/{regionId}/{pageNumber}',
            BackendConvenienceVideoListGet: _rootUrl + '{visitor}/backend/convenience/videolist/get/{videoType}/{searchword}/{regionId}/{pageNumber}',
            BackendCreateCategoryPost: _rootUrl + 'backend/category/createcategory/post',
            BackendCreateCommercialActivityPost: _rootUrl + 'backend/commercial/createcommercialactivity/post',
            BackendCreateCommercialBargainPost: _rootUrl + 'backend/commercial/createcommercialbargain/post',
            BackendCreateCommercialCargoPost: _rootUrl + 'backend/commercial/createcommercialcargo/post',
            BackendCreateCommercialShopPost: _rootUrl + 'backend/commercial/createcommercialshop/post',
            BackendCreateCommercialTopicPost: _rootUrl + 'backend/commercial/createcommercialtopic/post',
            BackendCreateCommercialVideoPost: _rootUrl + 'backend/commercial/createcommercialvideo/post',
            BackendCreateConvenienceBargainPost: _rootUrl + 'backend/convenience/createconveniencebargain/post',
            BackendCreateConvenienceJourneymanPost: _rootUrl + 'backend/convenience/createconveniencejourneyman/post',
            BackendCreateConvenienceMessagePost: _rootUrl + 'backend/convenience/createconveniencemessage/post',
            BackendCreateConvenienceVideoPost: _rootUrl + 'backend/convenience/createconveniencevideo/post',
            BackendCreateSuperMarketPost: _rootUrl + 'backend/convenience/createsupermarket/post',
            BackendCustomerBranchListGet: _rootUrl + 'backend/customer/branchlist/get/{pageNumber}',
            BackendCustomerBranchSetAdminGet: _rootUrl + '{visitor}/backend/customer/{customerName}/{token}/{adminName}/{adminMailAddress}/{adminPhone}/{branchObjectId}',
            BackendCustomerCreateBranchPost: _rootUrl + 'backend/customer/createbranch/post',
            BackendCustomerCreateGroupPost: _rootUrl + 'backend/customer/creategroup/post',
            BackendCustomerGroupListGet: _rootUrl + '{visitor}/backend/customer/grouplist/get/{customerName}/{token}',
            BackendCustomerLoginGet: _rootUrl + '{visitor}/backend/customer/login/get/{phoneNumber}/{password}/{regionId}',
            BackendCustomerSetGroupGet: _rootUrl + '{visitor}/backend/customer/{customerName}/{token}/{waitCustomerObjectId}/{groupObjectId}',
            BackendDeleteDataPost: _rootUrl + 'backend/common/deletedata/post',
            BackendManagedCommericalShopListGet: _rootUrl + '{visitor}/backend/commercial/managedcommercialshoplist/get/{customerName}/{token}/{regionId}',
            BackendModifyDataPost: _rootUrl + 'backend/common/modifydata/post',
            BackendSetPassPost: _rootUrl + 'backend/common/setpass/post',
            BackendCommonCategoryGet: _rootUrl + '{visitor}/backend/common/category/get/{eCategory}',
            BackendCommonConfigGet: _rootUrl + '{visitor}/backend/common/config/get',
            BackendCommercialShelfListGet: _rootUrl + '{visitor}/backend/commercial/shelf/get/{searchWord}/{pageNumber}',
            BackendCommercialCreateShelf: _rootUrl + 'backend/commercial/createcommercialshelf/post',
            //缓存用户信息key
            userInfoName: '$$$userInfo',
        };
        //应用配置
        var _appConfig = {};
        //用户信息
        var userInfo = {};
        //创建对象结构
        var _postCreateData = {
            customerName: userInfo.phoneNumber,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            targetObjectId: '',
            content: ''
        };
        //修改对象结构
        var _postModifyData = {
            customerName: userInfo.phoneNumber,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            modifyType: -1,
            targetObjectId: "",
            content: '',
        };
        //自营店铺objectId
        this.selfsupportShopObjectId = "a5f0dd9139284cd8a609b12eea638ce1";
        /*  通用get请求
        *   @example $$dataBase.getData('AuthenLoginGet',{visitor:'wk',phoneNumber:'12321',password:'xhxhxhx',regionId:'enshi'})
        */
        this.getData = function (urlName, opts) {
            opts = opts || {};
            opts.visitor = objutil.getFingerprint();;
            console.log(regionId);
            opts.regionId = opts.regionId || regionId;
            console.log(opts);
            //通用opts外部不要传入
            var _url = this.getConfig(urlName).format(opts);
            console.log(_url);
            var defer = $q.defer();
            $http.get(_url).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
        //通用post请求
        this.postData = function (urlName, postContent) {
            var userInfo = this.getUserInfo();
            var _postData = {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                customerObjectId: userInfo.objectId,
                modifyType: '',
                targetObjectId: '',
                content: '',
                regionId: regionId
            };
            //若传入数据存在下列字段，则替换成下列字段
            !!postContent.regionId && (_postData.regionId = postContent.regionId);
            !!postContent.targetObjectId && (_postData.targetObjectId = postContent.targetObjectId);
            !!postContent.modifyType && (_postData.modifyType = postContent.modifyType);
            _postData.content = JSON.stringify(postContent);
            console.log(_postData);

            var _url = this.getConfig(urlName);
            var defer = $q.defer();
            $http.post(_url, _postData)
            .success(function (data) {
                _postData = null;
                defer.resolve(data);
            })
            .error(function (error) {
                _postData = null;
                console.log(error);
                defer.reject(error);
            })
            return defer.promise;
        };
        //获取接口配置信息
        this.getConfig = function (name) {
            return urlRequest[name]
        };
        //
        this.getUserInfo = function () {
            return userInfo;
        }
        //登陆接口
        this.login = function (loginname, loginpsd) {
            var defer = $q.defer();
            if (!loginname || !loginpsd) {
                return defer.reject('请输入登陆账号和密码');
            }
            this.getData('BackendCustomerLoginGet', {
                phoneNumber: loginname,
                password: loginpsd
            }).then(function (data) {
                if (data.status == 'ok') {
                    userInfo = JSON.parse(data.content);
                    defer.resolve('登陆成功');
                    console.log(userInfo);
                } else {
                    defer.reject(data.content);
                }

            }, function (err) {
                defer.reject(null);
            })
            return defer.promise;
        }

        //获取服务端配置信息
        this._getAppConfig = function () {
            var defer = $q.defer();
            this.getData('BackendCommonConfigGet', {}).then(function (data) {
                if (data.status == 'ok')
                    defer.resolve(JSON.parse(data.content));
                else
                    defer.reject(data.content);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //获取应用配置
        this._getAppConfig().then(function (data) {
            _appConfig = data;
            console.log(_appConfig);
        }, function (err) {
            _appConfig = null;
        });
        //公开-获取app配置
        this.getAppConfig = function () {
            return _appConfig;
        };
    });
});