/**
*   @author wk
*   @modify hk date 2016/6/7
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('mainController', function ($scope, groupService, $$dataBase, $$toast) {
            //默认头像
            $scope.faceImgUrl = 'resource/images/face.png';
            //获取登录者管理的商家
            $scope.$on("$ionicView.loaded", function () {
                if (arguments[0].targetScope == arguments[0].currentScope) {
                    var userInfo = $$dataBase.getUserInfo();
                    $scope.userInfo = userInfo;
                    if (!!userInfo.faceImgUrl)
                        $scope.faceImgUrl = cdn.resolve(userInfo.faceImgUrl);
                    //用户所在组
                    $scope.Groups = groupService.getGroups(userInfo.level || -1);
                    //获取管理用户管理店铺列表
                    $$dataBase.getData('BackendManagedCommericalShopListGet', {
                        customerName: userInfo.phoneNumber,
                        token: userInfo.token,
                    }).then(function (data) {
                        if (data.status == 'ok') {
                            $scope.shops = JSON.parse(data.content) || [];
                            if ($scope.shops.length > 0) {
                                $scope.selectShopName = $scope.shops[0].name;
                                $$dataBase.setSelectShop($scope.shops[0]);
                            }
                            else {
                                $$toast("获取管理店铺列表失败", "error");
                            }
                        } else {
                            $$toast("获取管理店铺列表失败", "error");
                        }
                    }, function (error) {
                        $$toast("网络错误，获取管理店铺列表失败", "error");
                    });
                }
            });
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
            $scope.choseShop = function (shop) {
                $$dataBase.setSelectShop(shop);
                $scope.selectShopName = shop.name;
                $scope.$broadcast('shopChanged');
                console.log("已选择商店：");
                console.log(shop);
            }
        });
    });