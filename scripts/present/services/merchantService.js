//商家审核服务

define(['baseServices', 'objutil'], function (baseServices, objutil) {

    baseServices.factory('$$cooperationService', ['$http', '$q', 'Upload', 'configService', '$$loginService', function ($http, $q, Upload, configService, $$loginService) {

        var rootUrl = configService.urlRequest.rootUrl;


        var regionId = configService.urlRequest.regionId;


        var userInfo = $$loginService.userInfo;

        //创建对象结构
        var _postCreateData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: _regionId,
            customerObjectId: userInfo.objectId,
            targetObjectId: '',
            content: ''
        }
        //修改对象结构
        var _postModifyData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: _regionId,
            customerObjectId: userInfo.objectId,
            modifyType: -1,
            targetObjectId: "",
            content: '',
        }


        //获取所有专题候选商家列表
        var _getAllShop = function ( typeName, sortName, searchWord, location, pageNumber) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/' + regionId + '/HuangYe/Shop/' + typeName + '/' + sortName + '/' + searchWord + '/' + location + '/' + pageNumber)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            })
            return defer.promise;
        };
        //获取专题列表信息
        var _getMerchantDisplayList = function (sortName, searchWord, pageNumber) {
            var defer = $q.defer();
            console.log(rootUrl + userInfo.userName + '/' + regionId + configService.urlRequest.MerchantTopicGet + sortName + '/' + searchWord + '/' + pageNumber);
            $http.get(rootUrl + userInfo.userName + '/' + regionId + configService.urlRequest.MerchantTopicGet + sortName + '/' + searchWord + '/' + pageNumber)
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (error) {
                defer.reject(error);
            })
            return defer.promise;
        };

        //获取专题详情
        var _getMerchantDisplayDetial = function ( objectId) {
            var defer = $q.defer();

            $http.get(rootUrl + userInfo.userName + '/' + regionId + configService.urlRequest.MerchantTopicGet + objectId)
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (error) {
                defer.reject(error);
            })
            return defer.promise;
        };

        //修改专题信息
        var _postModifyDisplay = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postData);
            postData.content = JSON.stringify(data);
            //修改商品信息
            postData.modificationTypeName = "MerchantDisplay";
            var defer = $q.defer();
            console.log(postData);
            $http.post(configService.urlRequest.modificationPostUrl, postData)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (error) {
                    defer.reject('修改专题失败11');
                });
            return defer.promise;
        }



        //提交专题内容
        var _merchantTopic = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postData);
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(merchantTopicPostUrl, postData)
            .success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            })
            return defer.promise;
        }

       



      



        return {
            getAllShop:_getAllShop,
            getShopList: _getShopList,
            postMerchantBargain: _merchantBargain,
            postMerchantTopic:_merchantTopic,
            upload: _upload,
            upLoadImg: _upLoadImg,
            uploadMusic: _uploadMusic,
            postModifyDisplay: _postModifyDisplay,
            getMerchantDisplayList: _getMerchantDisplayList,
            getMerchantDisplayDetial: _getMerchantDisplayDetial
        }

    }]);
});