/**
*   @module 商品
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {

    baseControllers
        .controller('cargoController', function ($scope, $$dataBase, $$toast, $state, $$dataCache, $$confirmModal) {
            var config = $$dataBase.getAppConfig();
            //获取信息
            $scope.$on('$ionicView.beforeEnter', function () {
                if (arguments[0].targetScope == arguments[0].currentScope) {
                    //刷新
                    $scope.cargoListRefresh();
                    //获取商品类别
                    $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialCargo).then(function (data) {
                        $scope.$$commericalCargoType = data;
                    });
                }
            });
            //获取商品
            var cargoListFeed = new $$dataBase.Feed({
                url: 'BackendCommercialCargoListGet',
                params: {
                    cCargoType: 'all',
                    shopObjectId: 'all',
                    searchWord: 'all',
                    eSearchPattern: 1,
                    location: [0, 0],
                    pageNumber: 0,
                    radius: 5000000000,
                    regionId: 'all',
                    eSortMethod: -1,
                },
                scope: $scope,
                name: 'cargoList',
                autoShowInfinit: true,
                autoRefreshAndLoadMore: true,
                refreshCallback: {
                    success: function (data) {
                        var s = data;
                        console.log(data);
                    },
                    error: function (err) {
                        $scope.cargoList = [];
                        $$toast(err.content || "刷新失败", 'error');
                    }
                },
                loadMoreCallback: {
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (err) {
                        $$toast(err.content || "加载失败", 'error');
                    }
                }
            });
            //搜索商品
            $scope.searchCargo = function (searchWord, cCargoType, $event) {
                if ($event.keyCode === 13) {
                    cargoListFeed.setParam('cCargoType', cCargoType || 'all');
                    cargoListFeed.setParam('searchWord', searchWord || 'all');
                    $scope.cargoListRefresh();
                }
            }
            //切换类型
            $scope.typeChanged = function (cCargoType) {
                cargoListFeed.setParam('cCargoType', cCargoType || 'all');
                $scope.cargoListRefresh();
            }
            //跳转商品 1为新建 2为编辑
            $scope.goToCargoDetail = function (cargo) {
                $$dataCache.setData('cargoDetail', cargo, true);
                $state.go('main.commercialCargoDetail', { model: !cargo ? 1 : 2 });
            };
        })
        .controller('cargoDetailController', function ($scope, $$dataBase, $stateParams, $$chooseStandardService, $$confirmModal, $$chooseService, $$cutPictureService, $$dataCache, $$toast, $window) {
            //编辑模式=1，修改模式=2
            $scope.model;
            $scope.modelText = "商品";
            //增加商家详情
            $scope.cargoDisplay = [];
            var config = $$dataBase.getAppConfig();
            //
            $scope.$on('$ionicView.enter', function () {
                //获取操作模式
                $scope.model = $stateParams.model;
                $scope.modelText = $scope.model === 1 ? "新建商品" : "编辑商品";
                $scope.cargo = $scope.model == 1 ? {} : $$dataCache.getData("cargoDetail");
                $scope.cargo.album = $scope.cargo.album || [];
                $scope.cargoDisplay = ($scope.cargo.meticulousContent || "").match(/(images\/)(.*?jpg)/g) || [];
                //
                $scope.cargoDisplay.forEach(function (currentValue, index) {
                    this[index] = currentValue.slice(7);
                }, $scope.cargoDisplay);
                //获取店铺类别
                $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialCargo).then(function (data) {
                    $scope.$$commericalCargoType = data;
                });
                //获取仓库类别
                $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialWhareHouse).then(function (data) {
                    $scope.$$commercialWhareHouse = data;
                });
                //获取城市列表
                $$dataBase.getCityList().then(function (data) {
                    $scope.$$commercialMarketCity = data;
                });
            });
            //设置faceimages
            $scope.setFaceImage = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 1,
                    cutPictureCallback: function (data) {
                        $scope.cargo.faceImgUrl = data;
                    }
                });
            };
            //增加商品详情图片
            $scope.addCargoDisplayPicture = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
                        $scope.cargoDisplay.push(data);
                    }
                });
            };
            //修改商家详情
            $scope.changeCargoDisplayPicture = function (index) {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
                        $scope.cargoDisplay[index] = data;
                    }
                });
            };
            //增加画册
            $scope.addCargoAlbum = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
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
            };
            //选择商家
            $scope.openShopModal = function () {
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
                        var shop = dataArr[0];
                        $scope.cargo.shopObjectId = shop.objectId;
                        $scope.cargo.shopName = shop.name;
                    },
                });
            };
            //提交/修改商品
            $scope.sumitCargo = function () {
                var regexp = '<img src="http://resource.liangshisq.com/images/example">',
                    string = '<div>';
                //处理商品详情
                $scope.cargoDisplay.forEach(function (currentValue, index) {
                    var newString = regexp.replace('example', currentValue);
                    string += newString;
                    console.log(newString);
                });
                string += '</div>';
                $scope.cargo.meticulousContent = string;
                //处理商品详情结束
                $scope.cargo.checkFlag = true;
                //创建post数据
                $$dataBase.postData('BackendCommercialCreateCargoPost', $scope.cargo).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok') {
                        $$toast('新增成功', 'success');
                        $window.history.back();
                    }
                    else {
                        $$toast('新增失败', 'error');
                    }
                }, function (error) {
                    $$toast('新增失败', 'error');
                });
            };
            //审核商品
            $scope.setCargoPass = function () {
                $$confirmModal('当前商品是否通过审核？').then(function () {
                    $scope.cargo.targetObjectId = $scope.cargo.objectId;
                    $scope.cargo.modifyType = config.EModifyType.CommercialCargo;
                    delete $scope.cargo.objectId;
                    delete $scope.cargo._id;
                    delete $scope.cargo.guid;
                    $$dataBase.postData('BackendCommonSetPassPost', $scope.cargo).then(function (data) {
                        console.log(data);
                        if (data.status == 'ok') {
                            $$toast('审核通过', 'success');
                            $window.history.back();
                        }
                        else {
                            $$toast(data.content, 'error');
                        }
                    }, function (error) {
                        $$toast('审核失败', 'error');
                    })
                }, function (err) {
                    $$toast(err, 'error');
                });
            };
            //删除商品
            $scope.deleteCargo = function (cargo) {
                var content = {
                    targetObjectId: cargo.objectId,
                    modifyType: config.EClassifyPattern.CommercialCargo,
                };
                $$confirmModal('确认删除当前商品?').then(function () {
                    $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                        if (data.status == 'ok') {
                            $$toast(data.content, 'success');
                            $window.history.back();
                        } else {
                            $$toast(data.content, 'error');
                        }
                    }, function (err) {
                        $$toast("删除商品失败", "error");
                    });
                });
            };
            //修改商品
            $scope.modifyCargo = function (cargo) {
                var regexp = '<img src="http://resource.liangshisq.com/images/example">',
                    string = '<div>';
                //处理商品详情
                $scope.cargoDisplay.forEach(function (currentValue, index) {
                    var newString = regexp.replace('example', currentValue);
                    string += newString;
                });
                string += '</div>';
                $scope.cargo.meticulousContent = string;
                $scope.cargo.targetObjectId = cargo.objectId;
                $scope.cargo.modifyType = config.EClassifyPattern.CommercialCargo;
                $$dataBase.postData('BackendCommonModifyDataPost', $scope.cargo).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('修改成功', 'success');
                        $window.history.back();
                    }
                    else {
                        $$toast('修改失败', 'error');
                    }
                }, function (error) {
                    $$toast('修改失败', 'error');
                });
            }
            //显示/编辑规格
            $scope.showCargoStandards = function () {
                $$chooseStandardService.show($scope.cargo.objectId);
            }
        });

});