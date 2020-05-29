/**
*   自营商品创建/修改
*   @author yellow date 2016/10/3
*/
define(['baseControllers'], function (controllers) {

    controllers.controller('selfsupportCargoDetailController', ['$scope', '$$dataBase', '$stateParams', '$ionicModal', '$$chooseShopService', '$$cutPictureService', '$$dataCache', '$$toast', '$window', '$$bootstrapModal', function ($scope, $$dataBase, $stateParams, $ionicModal, $$chooseShopService, $$cutPictureService, $$dataCache, $$toast, $window, $$bootstrapModal) {
        $scope.model = $stateParams.model == 1 ? '增加商品' : '编辑商品';
        $scope.modelFlag = $stateParams.model;
        console.log($stateParams.id);
        $scope.flag = {
            //增加还是编辑
            addCargoStandard: null,
            check: [{ label: '是', value: true }, { label: '否', value: false }]
        }
        if ($stateParams.model == 1) {
            $scope.cargo = {
                shopObjectId: $$dataBase.selfsupportShopObjectId,
                shopName:"本地链官方自营",
                checkFlag: false,
                cargoStandards: [],
                album: [],
            };
        }
        else {
            $scope.cargo = $$dataCache.getData('editCargo');
            console.log($scope.cargo);
        }
        //获取店铺类别
        var config = $$dataBase.getAppConfig();
        $$dataBase.getCategory(config.ECategory.CommercialCargo).then(function (data) {
            $scope.$$commericalCargoType = data;
            console.log($scope.shopType);
        });
        $$dataBase.getCategory(config.ECategory.CommercialWhareHouse).then(function (data) {
            $scope.$$commercialWhareHouse = data;
            console.log(data);
        });
        //创建规格
        $scope.editData = {
            cargoStandard: null,
        };
        var cargoStandardModal = null;
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumcargoStandardModal.html', {
            scope: $scope
        }).then(function (modal) {
            cargoStandardModal = modal;
        })
        $scope.openCarogStandardModal = function () {
            console.log($scope.editData.cargoStandard);
            $scope.editData.cargoStandard = $scope.editData.cargoStandard || {};
            $scope.flag.addCargoStandard = $scope.editData.cargoStandard.name ? false : true;
            cargoStandardModal.show();
        }
        $scope.confirmCargoStandard = function () {
            console.log('confirm')
            if ($scope.flag.addCargoStandard)
            { $scope.cargo.cargoStandards.push($scope.editData.cargoStandard); }
        }
        //设置faceimages
        $scope.setFaceImage = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 1,
                cutPictureCallback: function (data) {
                    $scope.cargo.faceImgUrl = data;
                }
            });
        }
        //增加画册
        $scope.addCargoAlbum = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    console.log('ok');
                    $scope.cargo.album.push(data);
                }
            });
        };
        //改变画册
        $scope.changeCargoAlbum = function (index) {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    $scope.cargo.album[index] = data;
                }
            });
        }
        //选择商家--}{debug 这里的店铺始终为自营店铺
        var _callback = function (shop) {
            console.log(shop);
            $scope.cargo.shopObjectId = shop.objectId;
            $scope.cargo.shopName = shop.name;
            return true;
        }
        $scope.openShopModal = function () {
            $$chooseShopService.open(_callback)
        }
        //提交商品
        $scope.sumitCargo = function () {
            if ($stateParams.model == 1) {
                $$dataBase.postData('BackendCreateCommercialCargoPost', $scope.cargo).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok')
                    { $$toast('新增成功', 'success'); }
                    else {
                        $$toast('新增失败', 'error');
                    }
                }, function (error) {
                    $$toast('新增失败', 'error');
                });
            }
            else {
                $scope.cargo.targetObjectId = $scope.cargo.objectId;
                $scope.cargo.modifyType = config.EModifyType.CommercialCargo;
                delete $scope.cargo.objectId;
                delete $scope.cargo._id;
                delete $scope.cargo.guid;
                $$dataBase.postData('BackendModifyDataPost', $scope.cargo).then(function (data) {

                    if (data.status == 'ok')
                    { $$toast('修改成功', 'success'); }
                    else {
                        $$toast('修改失败', 'error');
                    }
                }, function (error) {
                    $$toast('修改失败', 'error');
                })
            }
            $window.history.back();
        }
        //
        $scope.$on('$destroy', function () {
            cargoStandardModal.remove();
        });

    }]);

});