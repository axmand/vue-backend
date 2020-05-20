define(['baseControllers'], function (baseControllers) {
    //登录controller
    baseControllers.controller('loginController', ['$scope', '$location', '$$toast', '$$dataBase', function ($scope, $location, $$toast, $$dataBase) {
        //同时确定用户类型，载入不同的界面
        $scope.login = function (loginname, loginpsd) {
            loginname = loginname || '815966508@qq.com';
            loginpsd = loginpsd || 'yellow';
            if (!loginname || !loginpsd) {
                return $$toast('请输入用户名和密码', 'warning');
            }
            $$dataBase.login(loginname, loginpsd).then(function (data) {
                $$toast(data, "success");
                $location.path("/main");
            }, function (err) {
                console.log(err);
                err = err || '请检查网络';
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