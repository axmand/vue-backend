define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('shelfCreateController', function (
        $scope, $$confirmModal, $$toast, $stateParams,$$cutPictureService,
        $$dataBase, $$chooseService, $state, $$dataCache) {
        //选中店铺
        $scope.selectShop = {};
        //获取城市列表
        $$dataBase.getCityList().then(function (data) {
            $scope.cityList = data;
        });
        //默认操作
        $scope.$on('$ionicView.enter', function () {
            $scope.model = $stateParams.model;
            if ($scope.model == 2) {
                $scope.shelf = $$dataCache.getData("shelfData");
                $scope.cargos = $scope.shelf.cargos || [];
            }
            else {
                $scope.shelf = {};
                $scope.cargos = [];
            }
        });
        //切割16：9
        $scope.cutHeadImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    $scope.shelf.headImgUrl = data;
                }
            });
        };
        //切割1：1
        $scope.cutFaceImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 1,
                cutPictureCallback: function (data) {
                    $scope.shelf.faceImgUrl = data;
                }
            });
        };
        //选择店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialShopListGet',
                feedParams: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    regionId: 'all',
                    searchWord: 'all',
                    location: [0, 0],
                    eSortMethod: -1,
                    radius: 500000000,
                },
                completeCallback: function (dataArr) {
                    $scope.shelf.shop = dataArr[0];
                    //更换店铺后，清空已选中的商品
                    $scope.cargos = [];
                },
            });
        };
        //添加货架商品
        $scope.addShelfCargo = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: Infinity,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cCargoType: 'all',
                    shopObjectId: $scope.shelf.shop.objectId || 'all',
                    searchWord: 'all',
                    regionId: 'all',
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    dataArr.forEach(function (value, index) {
                        if(this.indexOf(value) ===-1)
                            this.push(value);
                    },$scope.cargos);
                },
            });
        };
        //选择规格
        $scope.chooseStandard = function (cargo) {
            $$chooseStandardService.choose(cargo.objectId).then(function (standard) {
                cargo.selectStandardObjectId = standard.objectId;
            })
        }
        //上传faceimgurl
        $scope.uploadFaceImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 1,
                cutPictureCallback: function (imgUrl) {
                    $scope.shelf.faceImgUrl = imgUrl;
                }
            });
        };
        //长传headImgUrl
        $scope.uploadHeadImgUrl = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (imgUrl) {
                    $scope.shelf.headImgUrl = imgUrl;
                }
            });
        }
        //删除指定货架商品
        $scope.deleteCargo = function (cargo) {
            if ($scope.cargos.indexOf(cargo) != -1) {
                $$confirmModal('是否从货架中删除当前商品?').then(function () {
                    $scope.cargos.splice(cargo, 1);
                })
            }
        };
        //修改货架
        $scope.modify = function () {
            if (!$scope.shelf.regionId) {
                return $$toast('请选择城市', 'warning');
            }
            var postContent = {
                title: $scope.shelf.title,
                regionId: $scope.shelf.regionId,
                cargos: [],
            };
            $scope.cargos.forEach(function (currentValue) {
                if (currentValue.hasOwnProperty('cargoStandardIndex')) {
                    this.push({
                        cargoObjectId: currentValue.objectId,
                        shopObjectId: currentValue.shopObjectId,
                        cargoStandardIndex: currentValue.cargoStandardIndex
                    });
                } else {
                    return $$toast('请选择商品规格', 'warning');
                }
            }, postContent.cargos);

            if (!$scope.shelf.title) {
                return $$toast('请填写货架名称', 'warning');
            } else if (postContent.cargos.length == 0) {
                return $$toast('请补充货架商品', 'warning');
            };
            postContent.targetObjectId = postContent.objectId;
            postContent.modifyType = config.EModifyType.CommercialShelf;

            $$dataBase.postData('BackendCommonModifyDataPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.shelf');
                } else {
                    $$toast(data.content, 'error');
                }
                console.log(data);
            }, function (err) {
                console.log(err);
                $$('网络错误,请稍候再试', 'error');
            });
        }
        //删除货架
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前货架？').then(function () {
                var postContent = {
                    targetObjectId: targetObjectId,
                    modifyType: config.EModifyType.CommercialShelf
                };

                $$dataBase.postData('BackendCommonDeleteDataPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.shelf');
                    }
                    else {
                        $$toast(data.content, 'error');
                    }
                }, function (error) {
                    $$toast('删除失败', 'error');
                })
            }, function () {
            })
        }
        //获取配置
        var appConfig=$$dataBase.getAppConfig();
        //创建货架
        $scope.shelfPost = function () {
            var postContent = {
                title: $scope.shelf.title,
                regionId: $scope.shelf.regionId || "all",
                faceImgUrl: $scope.shelf.faceImgUrl,
                headImgUrl: $scope.shelf.headImgUrl,
                eClassifyPattern: appConfig.EClassifyPattern.Commercial,
                eShelfType: 10,
                content: $scope.shelf.content,
                shopObjectId: $scope.shelf.shop.objectId,
                content:$scope.shelf.content,
                shelfElements: [],
            };
            $scope.cargos.forEach(function (value) {
                if (!!value.selectStandardObjectId) {
                    this.push({
                        cargoObjectId: value.objectId,
                        shopObjectId: value.shopObjectId,
                        cargoStandardObjectId: value.selectStandardObjectId
                    });
                } else
                    return $$toast('商品['+value.title+']未选规格', 'warning');
            }, postContent.shelfElements);
            //
            if (!postContent.title)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.faceImgUrl)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.headImgUrl)
                return $$toast('请填写货架名称', 'warning');
            if (!postContent.shopObjectId)
                return $$toast('请选择店铺', 'warning');
            if (postContent.shelfElements.length == 0)
                return $$toast('货架内无商品', 'warning');
            //
            $$dataBase.postData('BackendCommercialCreateShelf', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.shelf');
                } else
                    $$toast(data.content, 'error');
            }, function (err) {
                $$toast(err || err.content, 'error');
            });
        }
    });
});