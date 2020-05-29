/**
*   站长部分功能
*   @author xr
*   @modify hk date 2016/6/7
*/
define(['baseServices', 'objutil'], function (baseServices, objutil) {

    baseServices.factory('$$cooperationService', ['$http', '$q', 'configService', '$$loginService', function ($http, $q, configService, $$loginService) {
        //
        var regionId = configService.urlRequest.regionId,
            rootUrl = configService.urlRequest.rootUrl,
            appConfig = configService.appConfig,
            userInfo = $$loginService.userInfo;
        //
        var postImageUrl = configService.urlRequest.postImageUrl,
            postImgFileUrl = configService.urlRequest.postImgFileUrl,
            postMusicFileUrl = configService.urlRequest.postMusicFileUrl;
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

        //#region 工匠

        //获取工匠列表
        var _getUnAuditedJourneymanList = function (searchword, pageNumber) {
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            var waitAudit = searchword === "all" ? true : false;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.unauditedJourneymanUrl + 'all/-1/'+waitAudit+'/'+searchword + '/' + regionId + '/' + pageNumber).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //提交工匠合同
        var _postJourneymanBargain = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.journeymanBargainUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //工匠审核
        var _postpassJourneyman = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.modifyType = appConfig.EModifyType.ConvenienceJourneyman;
            postData.targetObjectId = targetObjectId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.setPassPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //删除工匠
        var _deleteJourneyman = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId,
            postData.modifyType = appConfig.EModifyType.ConvenienceJourneyman;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //#endregion

        //#region 便民信息

        //获取待审核便民信息列表
        var _getUnAuditedmessageList = function (searchword, pageNumber) {
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.messageListUrl + 'all/all/-1/true/' + searchword + '/' + regionId + '/' + pageNumber).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //审核便民信息通过
        var _postpassMessage = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.modifyType = appConfig.EModifyType.ConvenienceMessage;
            postData.targetObjectId = targetObjectId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.setPassPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //删除便民信息
        var _deleteMessage = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId,
            postData.modifyType = appConfig.EModifyType.ConvenienceMessage;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //发布便民公告（类型固定死）
        var _postMessageAnno = function (data) {
            data.regionId = regionId;
            data.messageType = "BDLBMGG";
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.createMessagePostUrl, postData).success(function (data) {
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
        //获取公告列表
        var _getMessageAnno = function (searchword, pageNumber) {
            var defer = $q.defer();
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.messageListUrl + 'BDLBMGG/all/-1/false/' + searchword + '/' + regionId + '/' + pageNumber).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //修改便民公告内容
        var _modifyMessageAnno = function (targetObjectId, data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId;
            postData.modifyType = appConfig.EModifyType.ConvenienceMessage;
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }

        //#endregion

        //#region 商城部分

        //获取未审核商家列表
        var _getShopList = function (searchword, pageNumber) {
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            var waitAudit = searchword === "all" ? true : false;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.unauditedShopUrl + 'all/all/' + waitAudit .toString()+ '/' + searchword + '/all/-1/100000000/' + pageNumber + '/' + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //获取已审核店铺列表
        var _getCheckedShops = function (searchword, pageNumber, eshoptype, emerchanttype) {
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            eshoptype = eshoptype || 'all';
            emerchanttype = emerchanttype || 'all';
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.unauditedShopUrl +'/'+eshoptype+'/'+emerchanttype+'/false/' + searchword + '/all/-1/100000000/' + pageNumber + '/' + regionId).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //设定特约商家
        var _postSpecialMarket = function (data,targetObjectId) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            postData.targetObjectId = targetObjectId;
            console.log(postData);
            console.log(configService.urlRequest.createSuperMarketPostUrl);
            var defer = $q.defer();
            $http.post(configService.urlRequest.createSuperMarketPostUrl, postData).success(function (data) {
                var contentInfo = JSON.parse(data.content);
                console.log(data);
                if (data.status === 'ok')
                    defer.resolve(contentInfo);
                else
                    defer.reject(contentInfo);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        //提交商户合同绑定
        var _postShopBargain = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.shopBargainUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //审核通过店铺
        var _postpassShop = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.modifyType = appConfig.EModifyType.CommercialShop;
            postData.targetObjectId = targetObjectId;
            var defer = $q.defer();
            $http.post(configService.urlRequest.setPassPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //删除店铺
        var _deleteShop = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId,
            postData.modifyType = appConfig.EModifyType.CommercialShop;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        //#endregion

        //#region 便民视频

        //添加视频
        var _postVideo = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.createConvenienceVideoPostUrl, postData).success(function (data) {
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
        //删除视频
        var _deleteVideo = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId,
            postData.modifyType = appConfig.EModifyType.ConvenienceVideo;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        //获取视频列表
        var _getVideos = function (searchword,pageNumber) {
            searchword = searchword || 'all';
            pageNumber = pageNumber || 0;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName +  configService.urlRequest.convenienceVideosUrl + 'all/' + searchword + '/' + regionId + '/' + pageNumber).success(function (data) {
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
        //修改视频
        var _modifyVideo = function (targetObjectId, data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId;
            postData.modifyType = appConfig.EModifyType.ConvenienceVideo;
            postData.content = JSON.stringify(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }

        //#endregion 

        //#region 专题
        var _getTopics = function (searchword, pageNumber) {
            searchword = searchword || "all";
            pageNumber = pageNumber || 0;
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.topicsUrl + searchword + '/' + pageNumber + '/' + regionId).success(function (data) {
                console.log(data);
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
        //获取全部商品列表
        var _getAllCargos = function (searchword, pageNumber) {
            searchword = searchword || "all",
            pageNumber = pageNumber || 0;
            var defer = $q.defer();
            console.log(rootUrl + userInfo.userName + configService.urlRequest.carogsUrl + 'all/all/' + searchword + '/' + pageNumber + '/' + regionId)
            $http.get(rootUrl + userInfo.userName + configService.urlRequest.carogsUrl + 'all/all/' + searchword + '/' + pageNumber + '/' + regionId).success(function (data) {
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
        //修改专题
        var _modifyTopic = function (targetObjectId, data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId;
            postData.modifyType = appConfig.EModifyType.CommercialTopic;
            postData.content = JSON.stringify(data);
            var defer=$q.defer();
            $http.post(configService.urlRequest.modificationPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        //创建专题
        var _createTopic = function (data) {
            data.regionId = regionId;
            var postData = objutil.clone(_postCreateData);
            postData.content = JSON.stringify(data);
            console.log(data);
            var defer = $q.defer();
            $http.post(configService.urlRequest.createTopicPostUrl, postData).success(function (data) {
                console.log(data);
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
        //删除专题
        var _deleteTopic = function (targetObjectId) {
            var postData = objutil.clone(_postModifyData);
            postData.targetObjectId = targetObjectId,
            postData.modifyType = appConfig.EModifyType.CommercialTopic;
            var defer = $q.defer();
            $http.post(configService.urlRequest.deleteDataPostUrl, postData).success(function (data) {
                var info = JSON.parse(data.content);
                if (data.status === 'ok')
                    defer.resolve(info);
                else
                    defer.reject(info);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        //#endregion

        return {
            //shop
            postpassShop: _postpassShop,
            deleteShop: _deleteShop,
            getShopList: _getShopList,
            getCheckedShops:_getCheckedShops,
            postShopBargain: _postShopBargain,
            getAllCargos: _getAllCargos,
            postSpecialMarket:_postSpecialMarket,//设定特约超市
            //message
            getUnAuditedmessageList: _getUnAuditedmessageList,
            postpassMessage: _postpassMessage,
            deleteMessage: _deleteMessage,
            postMessageAnno: _postMessageAnno, //发布便民公告
            getMessageAnno: _getMessageAnno,//获取便民公告列表（待编辑）
            modifyMessageAnno: _modifyMessageAnno,
            //journeyman
            getUnAuditedJourneymanList: _getUnAuditedJourneymanList,
            postJourneymanBargain: _postJourneymanBargain,
            postpassJourneyman: _postpassJourneyman,
            deleteJourneyman: _deleteJourneyman,
            //video
            postVideo: _postVideo,
            deleteVideo: _deleteVideo,
            getVideos: _getVideos,
            modifyVideo: _modifyVideo,
            //topics
            getTopics: _getTopics,
            modifyTopic: _modifyTopic,
            createTopic: _createTopic,
            deleteTopic: _deleteTopic
        };
    }]);

});