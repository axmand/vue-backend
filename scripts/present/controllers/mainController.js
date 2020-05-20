/**
*   @author wk
*   @modify hk date 2016/6/7
*/


define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers.controller('mainController', function ($scope, groupService, $$dataBase) {
            //默认头像
            $scope.faceImgUrl = 'resource/images/face.png';
            //获取登录者管理的商家
            $scope.$on('$ionicView.loaded', function () {
                if (arguments[0].targetScope == arguments[0].currentScope) {
                    var userInfo = $$dataBase.getUserInfo();
                    $scope.userInfo = userInfo;  
                    console.log(userInfo);
                    //用户所在组
                    $scope.Groups = groupService.getGroups(userInfo.level || -1);
                }
            });
            //
            $scope.toggleGroup = function (group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };
            $scope.isGroupShown = function (group) {
                return $scope.shownGroup === group;
            };
            //$scope.choseShop = function (shop) {
            //    $$commercialService.setSelectShop(shop);
            //    $scope.selectShopName = shop.name;
            //    $scope.$broadcast('shopChanged');
            //    console.log("已选择商店：");
            //    console.log(shop);
        //}

        });
    });