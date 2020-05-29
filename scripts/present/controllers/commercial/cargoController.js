/**
*   商品controller
*   @author yellow date 2015/11/30
*/
define(['baseControllers', 'cdn', 'pluginService'], function (baseControllers, cdn, pluginService) {
    baseControllers.controller('cargoController', function ($scope, groupService, $$dataBase, $$toast, $state,$$dataCache) {
        //获取商品
        var cargoListFeed = new $$dataBase.Feed({
            name: 'cargoList',
            url: 'BackendCommercialCargoListGet',
            scope: $scope,
            autoShowInfinit:true,
            autoRefreshAndLoadMore:true,
            params: {
                cargoType: 'all',
                shopObjectId: 'all',
                searchword: 'all',
                eSearchPattern:1,
                pageNumber: 0,
                regionId: 'all',
            },
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {

                    if (error)
                    {
                        $$toast(error,'error')
                    }
                }
            },
            loadMoreCallback: {
                success: function (data) { console.log(data)}
            }
        });

        //搜索商品
        $scope.searchCargo = function (searchWords, $event) {
            if ($event.keyCode === 13) {
                cargoListFeed.setParam('searchword', searchWords || 'all');
                $scope.cargoListRefresh();
            }
        }

        //编辑商品
        $scope.editCargo = function (cargo) {
            console.log('编辑', cargo.name);
            $$dataCache.setData('editCargo', cargo,true);
            $state.go('main.commercialCargoDetail', {id:cargo.objectId,model:'2'})
        }

        //删除商品
        $scope.deleteCargo = function (cargo) {
            console.log('删除',cargo.name)
        }

    });

    baseControllers.service('$$dataCache', function () {
        var _cachData = {};
        this.getData = function (name) {
            return _cachData[name];
        }
        this.setData = function (name, data, deepCopy) {
            _cachData[name] = deepCopy ? angular.copy(data) : data;
        }
    });




    //var rootUrl = configService.urlRequest.rootUrl;

    //$scope.imgUrl = configService.urlRequest.imgUrl;

    //$scope.newCarogStandard = function () {
    //    $scope.editCargoStandard = {
    //        name: '新建',
    //        purchasePrice:0.0,
    //        repertory:1,
    //        content: '规格描述',
    //        amount: 1,
    //        origianlPrice: 0.0,
    //        promotionPrice: 0.0,
    //        groupPirce: 0.0,
    //        regimentPrice: 0.0,
    //        specialPrice: 0.0
    //    };
    //    $scope.goodsData.cargoStandards.push($scope.editCargoStandard);
    //}

    //$scope.parentCargoType;//用于二级商品类别绑定

    //$scope.$on("$ionicView.enter", function () {
    //    console.log(arguments);
    //    if (arguments[0].targetScope == arguments[0].currentScope) {
    //        refreshCargo();
    //    }
    //});
    //var refreshCargo = function () {
    //    cargoPageNumber = 1;
    //    $$commercialService.getGoods(0).then(function (data) {
    //        console.log(data);
    //        $scope.cargos = data
    //    }, function (error) {
    //        console.log(error);
    //        $scope.cargos = [];
    //        $$toast(error, 'error');
    //    });
    //};

    //$scope.$on('shopChanged', function () {
    //    refreshCargo();
    //});

    //$scope.opengoodsModal = function () {
    //    if ($$commercialService.getSelectShop()) {
    //        $scope.cargoModelName = 'new';
    //        $scope.goodsData = {
    //            forbiddenCity:'',
    //            name: '',
    //            cargoType: '',
    //            measureUnit: '',
    //            content: '',
    //            postagePrice: 0,
    //            faceImgUrl: '',
    //            activityObjectId: '',
    //            cargoStandards: [],
    //            dispatchPlace:configService.urlRequest.regionId,
    //            shopObjectId: $$commercialService.getSelectShop().objectId,
    //        }
    //        $scope.faceImgUrl = 'resource/images/noPic.jpg';
    //        activityNumber = 1;
    //        $scope.moreData='加载更多活动'
    //        $$commercialService.getActivity($$commercialService.getSelectShop().objectId, 0).then(function (data) {
    //            $scope.shopActivities = data;
    //        }, function (err) {
    //            $$toast(err, 'error');
    //        });
    //        progresssbar.style.width = '0%';
    //        $('#goodsModal').modal('show');
    //    }
    //    else {
    //        alert('没有认证的商家！！');
    //    }
    //};
    //$scope.closegoodsModal = function () {
    //    $('#goodsModal').modal('hide');
    //};

    //$scope.openPictureModel = function (type) {
    //    $scope.pictureType = type;
    //    $('#pictureModal').modal('show');
    //}

    ////#region 图片裁剪处理

    //$scope.cut = function () {
    //    $$cutPictureService.show({
    //        viewportWidth: 304,
    //        currentScale: 0.75,
    //        cutPictureCallback: function (data) {
    //            console.log(data);
    //            $scope.goodsData.faceImgUrl = data;
    //        }
    //    });
    //};     
    ////#endregion

    //var progresssbar = document.getElementById('faceImgProgress');

    //$scope.sumiteGoods = function () {
    //    if ($scope.cargoModelName == 'new')
    //    {
    //        $$commercialService.postGoods($scope.goodsData).then(function (data) {
    //            $('#goodsModal').modal('hide');
    //            refreshCargo();
    //            $$toast(data, 'success');
    //        }, function (err) {
    //            $$toast(err, 'error');
    //        });
    //    }
    //    else if ($scope.cargoModelName = 'modify')
    //    {
    //        $$commercialService.postModifyCargo($scope.selectCargoId, $scope.goodsData).then(function (data) {
    //            $('#goodsModal').modal('hide');
    //            refreshCargo();
    //            $$toast(data, 'success');
    //        }, function (err) {
    //            $$toast(err, 'error');
    //        });
    //    }

    //}
    ////修改商品信息
    //$scope.modify = function (cargo) {
    //    $scope.cargoModelName = 'modify';
    //    $scope.selectCargoId = cargo.objectId;
    //    $scope.goodsData = {
    //        forbiddenCity: cargo.forbiddenCity,
    //        name: cargo.name,
    //        cargoType: cargo.cargoType,
    //        measureUnit: cargo.measureUnit,
    //        content: cargo.content,
    //        postagePrice: cargo.postagePrice,
    //        faceImgUrl: cargo.faceImgUrl,
    //        activityObjectId: cargo.activityObjectId,
    //        cargoStandards: cargo.cargoStandards,
    //        shopObjectId: cargo.shopObjectId,
    //    };
    //    $('#goodsModal').modal('show');
    //    $$commercialService.getActivity($$commercialService.getSelectShop().objectId, 0).then(function (data) {
    //        $scope.shopActivities = data;
    //    }, function (err) {
    //        $$toast("该店铺未创建活动", 'warning');
    //    });
    //};

    //var cargoPageNumber = 1;
    //$scope.showMoreGoods = function () {
    //    $$commercialService.getGoods(cargoPageNumber).then(function (data) {
    //        cargoPageNumber++;
    //        $scope.cargos = $scope.cargos.concat(data);
    //        $ionicScrollDelegate.resize();
    //    }, function (err) {
    //        $$toast(err, "error");
    //    });
    //}
    //var activityNumber = 1;
    //$scope.loadMoreActivity = function ($event) {
    //    $$commercialService.getActivity($$commercialService.getSelectShop().objectId, activityNumber).then(function (data) {
    //            $scope.shopActivities = $scope.shopActivities.concat(data);
    //            activityNumber++;
    //            $ionicScrollDelegate.resize();
    //    }, function (err) {
    //        $scope.moreData = '没有更多数据！';
    //        $$toast(err, "error");
    //    });
    //};
    ////删除商品
    //var deleteGoods = null;
    //$scope.delete = function (goods) {
    //    $$confirmModal(' 确认删除此商品？').then(function () {
    //        $$commercialService.deleteGoods(goods.objectId).then(function (data) {
    //            refreshCargo();
    //            //可改为其他的
    //            $$toast(data, 'success');
    //        }, function (error) {
    //            $$toast(error, 'error');
    //            console.log(error);
    //        });
    //    }, function (evt) {

    //    })
    //}  

});