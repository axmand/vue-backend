define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('superMarketController', function ($scope, $$dataBase, $$toast, $filter, $$confirmModal) {
        var shopListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialShopListGet',
            params: {
                eshoptype: 'all',
                emerchanttype: 'all',
                waitAudit: false,
                esearchPattern: 2,
                regionId: 'all',
                searchword: 'all',
                location: [0, 0],
                sortMethod: -1,
                radius: 100000000,
            },
            scope: $scope,
            name: 'shopList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $scope.shopList = [];
                    }
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到更多数据', 'error');
                    }
                    console.log(err);
                }
            },
        });

        //刷新商家列表
        $scope.$on('$ionicView.enter', function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                //刷新bannerlist
                $scope.shopListRefresh();
            }
        });

        //获取商家类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.ECategory.CommercialShop).then(function (data) {
            $scope.$$commercialShopType = data;
        });

        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            if ($event.keyCode === 13) {
                shopListFeed.setParam('searchword', searchword || 'all');
                $scope.shopListRefresh();
            }
        }

        //类别搜索
        $scope.chooseType = function (eshoptype) {
            shopListFeed.setParam('eshoptype', eshoptype || 'all');
            $scope.shopListRefresh();
        }
        //#endregion 

        var currentShop = null;
        //查看商家信息
        $scope.openShopDetail = function (shop) {
            currentShop = shop;
            $('#ShopModal').modal('show');
            $scope.shopData = shop;
        };

        //设定为特约超市
        $scope.setShop = function (shopData) {
            //
            var postData = {
                targetObjectId: shopData.objectId
            };
            //
            $$dataBase.postData('BackendCreateSuperMarketPost', postData).then(function (data) {
                console.log(data);
                $$toast(data, 'success');
                $('#ShopModal').modal('hide');
            }, function (err) {
                $$toast(err, 'error');
            })
        };

        ////============================
        //var regionId = configService.urlRequest.regionId,
        //     imgUrl = configService.urlRequest.imgUrl,
        //     _num = 1;
        //$scope.imgUrl = configService.urlRequest.imgUrl;
        //$scope.shops = [];

        ////进入时刷新
        //$scope.$on("$ionicView.enter", function () {
        //    if (arguments[0].targetScope == arguments[0].currentScope) {
        //        $scope.shops = [];
        //        _num = 1;
        //        $scope.getShopList('all', 0);
        //    };
        //});

        //$scope.getMore = function (searchWord) {
        //    $scope.getShopList(searchWord, _num++);
        //};

        ////获取未审核商家列表
        //$scope.getShopList = function (searchWord, number) {
        //    searchWord = searchWord || 'all';
        //    $$cooperationService.getCheckedShops(searchWord, number, 'cssd', 'supply').then(function (data) {
        //        $scope.shops = $scope.shops.concat(data);
        //        console.log($scope.shops);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};

        ////搜索商家
        //$scope.searchShop = function (searchWord) {
        //    searchWord = searchWord || 'all';
        //    $scope.shops = [];
        //    $$cooperationService.getCheckedShops(searchWord, 0, 'cssd', 'supply').then(function (data) {
        //        $scope.shops = $scope.shops.concat(data);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //}

      

    });
});