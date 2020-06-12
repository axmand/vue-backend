define(['baseControllers'], function (baseControllers) {
    //登录controller
    baseControllers.controller('loginController', ['$scope', '$location', '$$loginService', '$$toast', function ($scope, $location, $$loginService, $$toast) {
        //同时确定用户类型，载入不同的界面
        $scope.login = function (loginname, loginpsd) {
            loginname = loginname || 'axmand';
            loginpsd = loginpsd || 'yellow';

            if (!loginname||!loginpsd) {
                $$toast("请输入登录账户和密码", "info")
                return;
            }
            $$loginService.login(loginname, loginpsd).then(function (data) {
                $$toast(data, "success");
                $location.path("/main");
            }, function (err) {
                $$toast(err, "error");
            });
        };
        $scope.userInfo = {};
        document.getElementById('loginname').focus();
        $scope.keyDown = function ($event) {
            //捕获enter事件
            if ($event.keyCode == 13) {
                if ($scope.userInfo.loginname && $scope.userInfo.loginpsd)
                    $scope.login($scope.userInfo.loginname, $scope.userInfo.loginpsd);
                else {
                    document.getElementById('loginpsd').focus();
                }
            }
        };
    }]);

});