/**
*   @author yellow 
*   @date 2015/11/29
*   @module loginService
*   @description 登录服务
*/
define(['baseServices', 'objutil'], function (baseServices, objutil) {

    baseServices.factory('$$loginService', ['$http', '$q', 'configService', function ($http, $q, configService) {
        var _userInfo_name = "$$$userInfo";
        //用户信息对象
        var _userInfo = {};
        //登录rest地址
        var url = configService.urlRequest.rootUrl;
        var regionId = configService.urlRequest.regionId;
        //登录，并增加缓存
        var _login = function (userName, passWord) {
            var defer = $q.defer();
            var restApi = url + "/" + userName + "/authen/login/get/" + userName + "/" + passWord + "/" + regionId;
            $http.get(restApi).success(function (data) {
                var rtInfo = JSON.parse(data.content);
                if (data.status == "ok") {
                    var usrInfo = rtInfo;
                    rtInfo.userName = rtInfo.phoneNumber || rtInfo.mailAddress;
                    //存储用户信息
                    objutil.cover(_userInfo, usrInfo);
                    defer.resolve(data);
                }
                else
                    defer.reject(data.content);
            }).error(function (data, status) {
                defer.reject('网络异常');
            });
            return defer.promise;
        };
        //登出，并清理缓存
        var _logout = function () {
            _userInfo.userName = null;
            _userInfo.token = null;
        };

        return {
            login: _login,
            logout: _logout,
            userInfo: _userInfo,
        }

    }]);

});
