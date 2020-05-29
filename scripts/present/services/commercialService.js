/**
*   数据提交，获取操作服务
*   @module
*/
define(['baseServices','objutil'], function (baseServices,objutil) {
    baseServices.factory('$$commercialService', function ($http, $$loginService, $q, configService) {

        var rootUrl = configService.urlRequest.rootUrl,
            userInfo = $$loginService.userInfo,
            regionId = configService.urlRequest.regionId;

        var appConfig = configService.appConfig;

        //创建对象结构
        var _postCreateData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            targetObjectId:'',
            content: ''
        }
        //修改对象结构
        var _postModifyData = {
            customerName: userInfo.userName,
            token: userInfo.token,
            regionId: regionId,
            customerObjectId: userInfo.objectId,
            modifyType: -1,
            targetObjectId: "",
            content: '',
        }

        //#region 店铺选择操作

        var _selectShop = null;

        var _setSelectShop = function (shop) {
            _selectShop = shop;
        }

        var _getSelectShop = function () {
            return _selectShop;
        }

        //#endregion

        //提交活动
        var _postActivity = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            postData.targetObjectId = _selectShop.objectId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.createActivityPostUrl, postData).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === "ok")
                    defer.resolve(contentInfo)
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject('提交活动失败');
            });
            return defer.promise;
        };
        //获取活动列表
        var _getActivity = function (shopId, pageNumber) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.activitiesUrl + shopId + '/' + pageNumber + '/' + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status == "ok")
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            })
            .error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        var _postGoods = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            postData.targetObjectId = _selectShop.objectId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.createCargosPostUrl, postData).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject('提交商品失败');
            });
            return defer.promise;
        };
        //获取商品列表
        var _getGoods = function (pageNumber, cargoType) {
            var defer = $q.defer();
            cargoType = cargoType || "all";            
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.carogsUrl + cargoType + '/' + _selectShop.objectId + '/all/' + pageNumber + '/' + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status == "ok")
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
        //获取用户管理店铺列表
        var _getManagedShops = function () {
            var defer = $q.defer();
            var userInfo = $$loginService.userInfo;
            $http.get(rootUrl + "/" + userInfo.userName + configService.urlRequest.managedShopsUrl + userInfo.userName + '/' + userInfo.token + '/' + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === "ok") {
                    defer.resolve(contentInfo);
                } else {
                    defer.reject(contentInfo);
                }
            }).error(function (error) {
                defer.reject("网络错误");
            });
            return defer.promise;
        };
        //获取对店铺的评论
        var _getShopReview = function (pageNumber) {
            var defer = $q.defer();
            if (!pageNumber) pageNumber = 0;
            $http.get(rootUrl + userInfo.userName + '/common/reviewlist/get/' + _selectShop.objectId + '/' + regionId + '/' + pageNumber).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status == "ok")
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
        //获取店铺订单
        var _getOrderList = function (customerName, token, pageNumber) {
            var defer = $q.defer();
            if (_selectShop == null) {
                defer.resolve({ status: 'fail', content: '没有店铺' });
            }
            else
                $http.get(rootUrl + userInfo.userName + '/backend/commercial/orderlist/get/' + customerName + '/' + token + '/' + _selectShop.objectId + '/' + regionId + '/' + pageNumber).success(function (data) {
                    defer.resolve(data);
                }).error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };
        //商户拒绝订单
        var _refuseOrder = function (customerName, token, orderObjectId,refuseReason) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/backend/commercial/refuseorder/get/' + customerName + '/' + token + '/' + orderObjectId + '/' + regionId + '/' + refuseReason).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
        //商户发货
        var _deliverOrder = function (customerName, token, orderObjectId, waybill, waybillNumber) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/backend/commercial/deliverorder/get/' + customerName + '/' + token + '/' + orderObjectId + '/' + regionId + '/' + waybill + '/' + waybillNumber).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
   
        //修改商品信息
        var _postModifyCargo = function (cargoId,data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.content = JSON.stringify(data);
            postData.modifyType = appConfig.EModifyType.CommercialCargo;
            postData.targetObjectId = cargoId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject('提交活动失败');
            });
            return defer.promise;
        };

        //修改商家
        var _postModifyShop = function (shopId, data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.content = JSON.stringify(data);
            //修改商品信息
            postData.modifyType = appConfig.EModifyType.CommercialShop;
            postData.targetObjectId = shopId;
            var defer = $q.defer();
            console.log(postData);
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                    var contentInfo = JSON.parse(data.content);
                    if (data.status == "ok")
                        defer.resolve(contentInfo);
                    else
                        defer.reject(contentInfo);
                }).error(function (error) {
                    defer.reject('网络错误');
                });
            return defer.promise;
        }
        //修改活动
        var _postModifyActivity = function (activityId, data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.content = JSON.stringify(data);
            //修改活动信息
            postData.modifyType = appConfig.EModifyType.CommercialActivity;
            postData.targetObjectId = activityId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === "ok")
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (error) {
                defer.reject('修改活动失败');
            });
            return defer.promise;
        }
        //修改专题
        var _postModifyTopic = function (zhuantiId,data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postData);
            postData.content = JSON.stringify(data);
            //修改专题信息
            postData.modificationTypeName = "MerchantDisplay";
            postData.targetObjectId = zhuantiId;
            var defer = $q.defer();
            console.log(JSON.stringify(postData));
            $http.post(configService.urlRequest.modificationPostUrl, postData)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (error) {
                    defer.reject('修改活动失败');
                });
            return defer.promise;
        }
        //删除商品
        var _deleteGoods = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId;
            postData.modifyType = appConfig.EModifyType.CommercialCargo;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //删除活动
        var _deleteActivity = function (targetObjectId) {
            var defer = $q.defer();
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId;
            postData.modifyType = appConfig.EModifyType.CommercialActivity;
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        //获取商家详情
        var _getShopDetail = function () {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/business/shopdetail/get/' + _selectShop.objectId + "/" + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content)
                if (data.status == "ok")
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo)
            }).error(function (error) {
                defer.reject("网络错误");
            });
            return defer.promise;
        };

        return {
            //activity
            getActivity: _getActivity,
            postActivity: _postActivity,
            deleteActivity: _deleteActivity,
            //cargo
            getGoods: _getGoods,
            postGoods: _postGoods,
            deleteGoods: _deleteGoods,
            postModifyCargo: _postModifyCargo,
            //shops
            getManagedShops: _getManagedShops,
            setSelectShop: _setSelectShop,
            getSelectShop: _getSelectShop,
            getShopReview: _getShopReview,
            getShopDetail: _getShopDetail,
            //
            getOrderList: _getOrderList,
            refuseOrder: _refuseOrder,
            deliverOrder:_deliverOrder,
            postModifyShop: _postModifyShop,
            postModifyActivity: _postModifyActivity,
        }
    });

});