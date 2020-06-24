/**
*   总后台服务接口
*   @author yellow date 2016/4/18
*/

define(['baseServices', 'objutil'], function (baseServices, objutil) {

    baseServices.factory('$$frontdeskService', ['$http', '$q', 'configService', '$$dataBase', function ($http, $q, configService, $$dataBase) {
        //克隆操作
        var clone = objutil.clone;
        //参数配置
        var rootUrl = configService.urlRequest.rootUrl,
            regionId = configService.urlRequest.regionId,
            
            appConfig = configService.appConfig,
            //创建分站接口
            branchPostUrl = configService.urlRequest.branchPostUrl,
            //获取分站接口
            branchlistUrl = configService.urlRequest.branchlistUrl,
            //搜索用户账户接口
            searchAccountUrl = configService.urlRequest.searchAccountUrl,
            //删除信息接口
            deleteDataPostUrl = configService.urlRequest.deleteDataPostUrl,
            //设置分站管理员接口
            setBranchAdminUrl = configService.urlRequest.setBranchAdminUrl,

            //用户信息
            userInfo = $$dataBase.getUserInfo(),
 
            //提交信息
            postData = {
                customerName: userInfo.userName,
                customerObjectId:userInfo.objectId,
                token: userInfo.token,
                regionId: regionId,
                content:''
            };
        //获取组管理权限列表
        var _getAPIList = function () {
            var defer = $q.defer();
            $http.get(rootUrl + '/cms/getconfigureableapilist/')
                .success(function (data) {
                    var branchs = JSON.parse(data.content);
                    if (data.status == 'ok')
                        defer.resolve(branchs)
                    else
                        defer.reject(branchs);
                }).error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //获取用户（管理员）列表
        var _getBranchList = function (pageNumber) {
            var defer = $q.defer();
            pageNumber = pageNumber || 0;
            //$http.get(rootUrl + branchlistUrl + '/' + pageNumber)
            //.success(function (data) {
            //    var branchs = JSON.parse(data.content);
            //    if (data.status == 'ok')
            //        defer.resolve(branchs)
            //    else
            //        defer.reject(branchs);
            //}).error(function (error) {
            //    defer.reject(error);
            //});
            $http.get(rootUrl + '/cms/getgrouplist/' + userInfo.userName + '/' + userInfo.token)
            .success(function (data) {
                var branchs = JSON.parse(data.content);
                if (data.status == 'ok')
                   defer.resolve(branchs)
                else
                defer.reject(branchs);
            }).error(function (error) {
               defer.reject(error);
            });
            return defer.promise;
        }
        //设置(修改)管理员
        var _setBranchAdmin = function (adminName, adminMailAddress, adminPhone,branchObjectId) {
            var defer = $q.defer();
            console.log(rootUrl + userInfo.userName + setBranchAdminUrl + userInfo.userName + '/' + userInfo.token + '/' + adminName + '/' + adminMailAddress + '/' + adminPhone + '/' + branchObjectId);
            $http.get(rootUrl + userInfo.userName + setBranchAdminUrl + userInfo.userName + '/' + userInfo.token + '/' + adminName + '/' + adminMailAddress + '/' + adminPhone + '/' + branchObjectId)
            .success(function (data) {
                if (data.status == 'ok')
                    defer.resolve(data.content)
                else
                    defer.reject(data.content);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }
        //

        //搜索账户名（管理员才能使用的api）
        var _getSearchAccount = function (keyWord, pageNumber) {
            var defer = $q.defer();
            pageNumber = pageNumber || 0;
            $http.get(rootUrl + userInfo.userName + '/' + regionId + searchAccountUrl + userInfo.userName + '/' + userInfo.token + '/' + keyWord + '/' + pageNumber)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //提交管理员信息，用于创建
        //var _postBranchInfo = function (info) {
        //    var defer = $q.defer();
        //    var _postData = clone(postData);
        //    _postData.regionId = info.regionId;
        //    _postData.content = JSON.stringify(info);
        //    console.log(_postData);
        //    $http.post(branchPostUrl, _postData)
        //        .success(function (data) {
        //            var res = JSON.parse(data.content);
        //            if (data.status == 'ok')
        //                defer.resolve(res)
        //            else
        //                defer.reject(res);
        //        })
        //        .error(function (error) {
        //            defer.reject(error);
        //        });
        //    return defer.promise;
        //}
        var _postBranchInfo = function (info) {
            var defer = $q.defer();
            // pageNumber = pageNumber || 0;
            var groupName = info.groupName;
            var groupDesc = info.groupDesc;
            var groupLevel = info.groupLevel
            $http.get(rootUrl + '/cms/creategroup/'+ userInfo.userName + '/' + userInfo.token + '/' + groupName + '/' + groupDesc + '/' + groupLevel )
                .success(function (data) {
                    console.log('success')
                    defer.resolve(data);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //删除管理员
        //var _postDeleteBranch = function (branch) {
        //    var defer = $q.defer();
        //    var _postData = clone(postData);
        //    _postData.modifyType = appConfig.EModifyType.Branch;
        //    _postData.content = "";
        //    _postData.targetObjectId = branch.objectId;
        //    _postData.regionId = branch.regionId;
        //    console.log(_postData);
        //    $http.post(deleteDataPostUrl, _postData)
        //        .success(function (data) {
        //            var res = JSON.parse(data.content);
        //            if (data.status == 'ok')
        //                defer.resolve(res);
        //            else
        //                defer.reject(res);
        //        })
        //        .error(function (error) {
        //            defer.reject(error);
        //        });
        //    return defer.promise;
        //}
        var _postDeleteBranch = function (branch) {
            var defer = $q.defer();
            $http.get(rootUrl + '/cms/deletegroup/' + userInfo.userName + '/' + userInfo.token + '/' + branch.objectId)
                .success(function (data) {
                    var res = JSON.parse(data.content);
                    if (data.status == 'ok')
                        defer.resolve(res);
                    else
                        defer.reject(res);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //用户组授权
        var _postAPIAuthorize = function (branch,id) {
            var defer = $q.defer()
            $http.get(rootUrl + '/cms/authorizegroupapi/' + userInfo.userName + '/' + userInfo.token + '/' + id + '/' + branch.Name)
                .success(function (data) {
                    var res = JSON.parse(data.content);
                    if (data.status == 'ok')
                        defer.resolve(res);
                    else
                        defer.reject(res);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //用户组收回权限
        var _postAPIWithdraw = function (branch,id) {
            var defer = $q.defer();
            $http.get(rootUrl + '/cms/withdrawgroupapi/' + userInfo.userName + '/' + userInfo.token + '/' + id + '/' + branch.Name)
                .success(function (data) {
                    var res = JSON.parse(data.content);
                    if (data.status == 'ok')
                        defer.resolve(res);
                    else
                        defer.reject(res);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
        //平台管理员获取订单列表接口
        var _getOrderList = function (customerName, token, pageNumber, orderState) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/backend/commercial/orderbyorderstate/get/' + customerName + '/' + token + '/' + pageNumber + '/' + orderState).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };
        //平台管理员退款操接口
        var _reimburseOrder = function (customerName, token, orderObjectId) {
            var defer = $q.defer();
            $http.get(rootUrl + userInfo.userName + '/backend/commercial/reimburseorder/get/' + customerName + '/' + token + '/' + orderObjectId + '/' + regionId).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        return {
            getAPIList: _getAPIList,
            getBranchList: _getBranchList,
            getSearchAccount: _getSearchAccount,
            postBranchInfo: _postBranchInfo,
            postDeleteBranch: _postDeleteBranch,
            getOrderList: _getOrderList,
            reimburseOrder: _reimburseOrder,
            setBranchAdmin: _setBranchAdmin,
            postAPIWithdraw: _postAPIWithdraw,
            postAPIAuthorize: _postAPIAuthorize,
        }
    }]);

});