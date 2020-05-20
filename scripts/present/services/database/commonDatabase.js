define(['baseServices', 'objutil'], function (baseServices, objutil) {
    baseServices.service('$$commonDatabase', function ($http, $q) {
        //缓存
        var cache = {};
        //区域读取
        var regionId = "all";
        var _rootUrl = "http://114.55.119.208:10200/";
        //var _rootUrl = "http://127.0.0.1:10200/";
        var urlRequest = {   //url请求地址集合处理
            rootUrl: _rootUrl, //接口根地址
            regionId: regionId, //区域标识
            imgUrl: "http://resource.liangshisq.com/images/", //读取图片地址
            musicUrl: "http://resource.liangshisq.com/music/",  //读取音乐地址
            postMusicFileUrl: "http://114.55.119.208:8095/", //上传音乐文件
            postImgFileUrl: "http://114.55.119.208:8093/", //上传图片，文件格式，使用boundary边界裁剪法
            postImageUrl: "http://114.55.119.208:8094/imgupload", //上传图片base64格式，用于裁剪    
            //commercial
            BackendCommercialCargoListGet: _rootUrl + '{visitor}/backend/commercial/cargolist/get/{cCargoType}/{shopObjectId}/{searchWord}/{eSearchPattern}/{pageNumber}/{regionId}',
            BackendCommercialAgreeReturnCargoGet: _rootUrl + '{visitor}/backend/commercial/agreereturncargo/get/{customerName}/{token}/{orderObjectId}/{batchNo}',
            BackendCommercialDisagreeReturnCargoGet: _rootUrl + '{visitor}/backend/commercial/disagreereturncargo/get/{customerName}/{token}/{orderObjectId}/{batchNo}',
            BackendCommericalOrderListGet: _rootUrl + '{visitor}/backend/commercial/stateorderlist/get/{customerName}/{token}/{searchWord}/{eOrderState}/{eBuyPattern}/{pageNumber}',
            BackendCommercialDeliverOrderGet: _rootUrl + '{visitor}/backend/commercial/deliverorder/get/{customerName}/{token}/{orderObjectId}/{batchNo}/{waybillNumber}',
            BackendCommercialRefundMoneyGet: _rootUrl + '{visitor}/backend/commercial/refundmoney/get/{customerName}/{token}/{orderObjectId}/{batchNo}',
            BackendCommercialRefuseOrderGet: _rootUrl + '{visitor}/backend/commercial/refuseorder/get/{customerName}/{token}/{orderObjectId}/{refuseReason}',
            BackendCommericalAgencyOrderListGet: _rootUrl + '{visitor}/backend/commercial/agencyorderlist/get/{customerName}/{token}/{shopObjectId}/{pageNumber}',
            BackendCommericalSupplyOrderListGet: _rootUrl + '{visitor}/backend/commercial/supplyorderlist/get/{customerName}/{token}/{shopObjectId}/{pageNumber}',
            BackendCommercialCreateBannerPost: _rootUrl + 'backend/commercial/createcommercialbanner/post',
            BackendCommercialCreateBargainPost: _rootUrl + 'backend/commercial/createcommercialbargain/post',
            BackendCommercialCreateCargoPost: _rootUrl + 'backend/commercial/createcommercialcargo/post',
            BackendCommercialCreateBuyGroupPost: _rootUrl + 'backend/commercial/createcommercialbuygroup/post',
            BackendCommercialCreateBuyOfferPost: _rootUrl + 'backend/commercial/createcommercialbuyoffer/post',
            BackendCommercialCreatePopularizePost: _rootUrl + 'backend/commercial/createcommercialpopularize/post',
            BackendCommercialCreateShopPost: _rootUrl + 'backend/commercial/createcommercialshop/post	',
            BackendCommercialCreateTopicPost: _rootUrl + 'backend/commercial/createcommercialtopic/post',
            BackendCommercialCreateVideoPost: _rootUrl + 'backend/commercial/createcommercialvideo/post',
            BackendCommercialCreateSFCPost: _rootUrl + 'backend/community/sfc/post',
            BackendCommercialCreateShelf: _rootUrl + 'backend/commercial/createcommercialshelf/post',
            BackendCommercialCreateStandardPost: _rootUrl + 'backend/commercial/createstandard/post',
            BackendCommercialCreateDummyPost: _rootUrl + 'backend/commercial/createcommercialdummy/post',
            BackendCommercialDummyListGet: _rootUrl + '{visitor}/backend/commercial/dummylist/get/{customerName}/{token}/{dummyShopObjectId}',
            BackendCommercialStandardListGet: _rootUrl + '{visitor}/backend/commercial/standardlist/get/{cargoObjectId}/{pageNumber}',
            BackendCommercialPopularizeListGet: _rootUrl + '{visitor}/backend/commercial/popularizelist/get/{pageNumber}/{regionId}',
            BackendCommercialBuyOfferListGet: _rootUrl + '{visitor}/backend/commercial/buyofferlist/get/{pageNumber}/{regionId}',
            BackendCommercialBuyGroupListGet: _rootUrl + '{visitor}/backend/commercial/buygrouplist/get/{pageNumber}/{regionId}',
            BackendCommercialDummyListGedt: _rootUrl + '{visitor}/backend/commercial/dummylist/get/{customerName}/{token}/{dummyShopObjectId}',
            BackendCommercialShopListGet: _rootUrl + '{visitor}/backend/commercial/shoplist/get/{cShopType}/{cMerchantType}/{eSearchPattern}/{searchWord}/{location}/{eSortMethod}/{radius}/{pageNumber}/{regionId}',
            BackendCommercialTopicListGet: _rootUrl + '{visitor}/backend/commercial/topiclist/get/{searchword}/{pageNumber}/{regionId}',
            BackendCommercialBannerListGet: _rootUrl + '{visitor}/backend/commercial/bannerlist/get/{pageNumber}/{regionId}',
            BackendCommercialVideoListGet: _rootUrl + '{visitor}/backend/commercial/videolist/get/{shopObjectId}/{cargoObjectId}/{cVideoType}/{pageNumber}/{regionId}',
            BackendCommericalManagedShopListGet: _rootUrl + '{visitor}/backend/commercial/managedshoplist/get/{customerName}/{token}/{regionId}',
            BackendCommercialShelfListGet: _rootUrl + '{visitor}/backend/commercial/shelf/get/{searchWord}/{pageNumber}',
            BackendCommercialCreateTicketGet: _rootUrl + '{visitor}/backend/commercial/createticket/get/{customerName}/{token}/{ruleMoney}/{money}',
            BackendCommercialCardListGet: _rootUrl + '{visitor}/backend/commercial/cardlist/get/{customerName}/{token}/{searchWord}/{pageNumber}',
            BackendCommercialCreateCardGet: _rootUrl + '{visitor}/backend/commercial/createcard/get/{customerName}/{token}/{eCardValue}',
            BackendCommercialTicketListGet: _rootUrl + '{visitor}/backend/commercial/ticketlist/get/{customerName}/{token}/{searchWord}/{pageNumber}',
            BackendCommercialCreateTicketPost: _rootUrl + 'backend/commercial/createsticket/post',
            //community
            BackendCommunityCreateNewProductPost: _rootUrl + 'backend/community/newproduct/post',
            BackendCommunityCreateDSSXPost: _rootUrl + 'backend/community/dsxx/post',
            BackendCommunityCreateSQRCPost: _rootUrl + 'backend/community/sqrc/post',
            BackendCommunityCreateSQZXPost: _rootUrl + 'backend/community/sqzx/post',
            BackendCoummunityCreatePresellPost: _rootUrl + 'backend/community/createpresell/post',
            BackendCommunityDSSXGet: _rootUrl + '{visitor}/backend/community/dssx/get/{shopObjectId}',
            BackendCommunityNewProductListGet: _rootUrl + '{visitor}/backend/community/newproductlist/get/{shopObjectId}/{pageNumber}',
            BackendCommunityPresellListGet: _rootUrl + '{visitor}/backend/community/preselllist/get/{shopObjectId}/{pageNumber}',
            BackendCommunitySFCListGet: _rootUrl + '{visitor}/backend/community/sfclist/get/{shopObjectId}/{pageNumber}',
            BackendCommunitySQRCGet: _rootUrl + '{visitor}/backend/community/sqrc/get/{shopObjectId}',
            BackendCommunitySQZXGet: _rootUrl + '{visitor}/backend/community/sqzx/get/{shopObjectId}',
            BackendCommuintySelectedAppraisalApplyListGet: _rootUrl + '{visitor}/backend/community/selectedappraisalapplylist/get/{customerName}/{token}/{appraisalObjectId}',
            BackendCommunitySelectApplyGet: _rootUrl + '{visitor}/backend/community/selectappraisalapply/get/{customerName}/{token}/{appraisalObjectId}/{applyCustomerObjectId}',
            BackendCommunityAppraisalListGet: _rootUrl + '{visitor}/backend/community/appraisallist/get/{searchWord}/{pageNumber}/{regionId}',
            BackendCommuintyAppraisalApplyGet: _rootUrl + '{visitor}/backend/community/appraisalapply/get/{customerName}/{token}/{appraisalObjectId}/{pageNumber}',
            BackendCommunityCreateAppraisalPost: _rootUrl + 'backend/community/createappraisal/post',
            BackendCommunityShopListGet: _rootUrl + '{visitor}/backend/community/shoplist/get/{regionId}/{pageNumber}',
            BackendCommunityBuyGroupListGet: _rootUrl + '{visitor}/backend/community/buygrouplist/get/{shopObjectId}/{regionId}/{pageNumber}',
            BackendCommunityCreateBuyGroupPost: _rootUrl + 'backend/community/buygroup/post',
            BackendCommunityBuyOfferListGet: _rootUrl + '{visitor}/backend/community/buyofferlist/get/{shopObjectId}/{regionId}/{pageNumber}',
            BackendCommunityCreateBuyOfferPost: _rootUrl + 'backend/community/buyoffer/post',
            BackendCommunityAppraisalStartGet: _rootUrl + '{visitor}/backend/community/appraisal/start/get/{customerName}/{token}/{appraisalObjectId}',
            //customer
            BackendCustomerSearchAuthenGet: _rootUrl + '{visitor}/backend/customer/searchauthen/get/{customerName}/{token}/{searchWord}',
            BackendCustomerBranchListGet: _rootUrl + '{visitor}/backend/customer/branchlist/get/{pageNumber}',
            BackendCustomerBranchSetAdminGet: _rootUrl + '{visitor}/backend/customer/setbranchadmin/get/{customerName}/{token}/{adminName}/{adminMailAddress}/{adminPhone}/{branchObjectId}',
            BackendCustomerCreateBranchPost: _rootUrl + 'backend/customer/createbranch/post',
            BackendCustomerCreateGroupPost: _rootUrl + 'backend/customer/creategroup/post',
            BackendCustomerLoginGet: _rootUrl + '{visitor}/backend/customer/login/get/{phoneNumber}/{password}',
            BackendCustomerGroupListGet: _rootUrl + '{visitor}/backend/customer/grouplist/get/{customerName}/{token}',
            BackendCustomerSetGroupGet: _rootUrl + '{visitor}/backend/customer/setgroup/get/{customerName}/{token}/{waitCustomerObjectId}/{eGroup}',
            BackendCustomerManagerListGet: _rootUrl + '{visitor}/backend/customer/managerlist/get/{customerName}/{token}/{pageNumber}',
            BackendCustomerConfigGet: _rootUrl + '{visitor}/backend/customer/config/get/{customerName}/{token}/{waitCustomerObjectId}',
            BackendCustomerSetConfigPost: _rootUrl + '/backend/customer/setconfig/post',
            //common
            BackendCommonConfigGet: _rootUrl + "{visitor}/backend/common/config/get",
            BackendCommonCreateCategoryPost: _rootUrl + 'backend/common/createcategory/post',
            BackendCommonCategoryGet: _rootUrl + '{visitor}/backend/common/category/get/{eCategory}',
            BackendCommonDeleteDataPost: _rootUrl + 'backend/common/deletedata/post',
            BackendCommonModifyDataPost: _rootUrl + 'backend/common/modifydata/post',
            BackendCommonSetPassPost: _rootUrl + 'backend/common/setpass/post',
            //缓存用户信息key
            userInfoName: '$$$userInfo',
        };
        //应用配置
        var _appConfig = {};
        //用户信息
        var userInfo = {};
        //创建对象结构
        var _postCreateData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            targetObjectId: '',
            content: ''
        };
        //修改对象结构
        var _postModifyData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            modifyType: -1,
            targetObjectId: "",
            content: '',
        };
        /*  通用get请求
        *   @example $$dataBase.getData('AuthenLoginGet',{visitor:'wk',phoneNumber:'12321',password:'xhxhxhx',regionId:'enshi'})
        */
        this.getData = function (urlName, opts) {
            opts = opts || {};
            opts.visitor = objutil.getFingerprint();;
            opts.regionId = opts.regionId || regionId;
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
            };
            //若传入数据存在下列字段，则替换成下列字段
            !!postContent.regionId && (_postData.regionId = postContent.regionId);
            !!postContent.targetObjectId && (_postData.targetObjectId = postContent.targetObjectId);
            !!postContent.modifyType && (_postData.modifyType = postContent.modifyType);
            //
            _postData.content = JSON.stringify(postContent);
            var _url = this.getConfig(urlName);
            var defer = $q.defer();
            console.log(_postData.content);
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
            if (!loginname || !loginpsd)
                return defer.reject('请输入登录账号和密码');
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
        }
    });
});