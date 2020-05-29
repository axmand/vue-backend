/**
 *@author wk
 *@date 2016/4/18
 *@descript shopController
 */
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('shopDetailController', function ($scope, $$dataBase,$$toast, $$cutPictureService) {
        //切换欢迎标语
        $scope.hasShops = true;
        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.shopDetailData = $$dataBase.getSelectShop();
            }
        });
        var config = $$dataBase.getAppConfig();

        //换商店时刷新
        $scope.$on('shopChanged', function () {
            $scope.shopDetailData = $$dataBase.getSelectShop();
        });

        //#region 图片裁剪处理

        //裁剪后的数据保存
        $scope.cut = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.75,
                cutPictureCallback: function (data) {
                    console.log(data);
                    $scope.editShopData.faceImgUrl = data;
                    $scope.shopDetailData.faceImgUrl = data;
                }
            });
        };

        //#endregion
       
        //编辑对象，用于post处理
        $scope.editShop = function () {
            $scope.editShopData = {
                eshopType: $scope.shopDetailData.eshopType,//店铺类型
                emerchantType: $scope.shopDetailData.emerchantType, //店铺服务类型
                address: $scope.shopDetailData.address,
                serviceScope:$scope.shopDetailData.serviceScope,
                telephone:$scope.shopDetailData.telephone,
                mobilephone:$scope.shopDetailData.mobilephone,
                location:$scope.shopDetailData.location,
                name:$scope.shopDetailData.name,
                faceImgUrl:$scope.shopDetailData.faceImgUrl,
                description:$scope.shopDetailData.description,
                weiXin:$scope.shopDetailData.weiXin,
                qq:$scope.shopDetailData.qq,
            };
            $scope.location = JSON.parse($scope.editShopData.location) || [0, 0];
            $('#editShopModal').modal('show');
        };
        //进度条
        var progresssbar = document.getElementById('shopImgProgress');

        $scope.openPictureModel = function (type) {
            $scope.pictureType = type;
            $('#pictureModal').modal('show');
        }

        $scope.sumitShopData = function () {
            $scope.editShopData.location = JSON.stringify([$scope.location[0] * 1, $scope.location[1] * 1]);
            $scope.editShopData.targetObjectId = $scope.shopDetailData.objectId;
            $scope.editShopData.modifyType = config.EModifyType.CommercialShop;

            $$dataBase.postData('BackendModifyDataPost', $scope.editShopData).then(function (data) {
                if (data.status == 'ok') {
                    $('#editShopModal').modal('hide');
                    $$toast(data.content, 'success');
                } else {
                    $$toast(data.content);
                }
                
            }, function (error) {
                $$toast(error, 'error');
            });
        };

    });
})