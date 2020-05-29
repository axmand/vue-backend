/**
*   订单controller
*   @author yellow date 2015/11/30
*/

define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('shopController', function ($scope, $state,$location, $$dataBase, configService, $$toast, $$confirmModal) {
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
                sortMethod: 1,
                radius: 500000,
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

        $scope.goToShopDetail = function (shop) {
            if (!shop) shop = '';
            $state.go('main.shopAudit', { detail: JSON.stringify(shop) });
        }


    });
});