/**
*   今日特惠购
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {

    baseControllers.controller('communityExBuyListController', function ($scope, $$chooseService, $location, $$toast, $$dataBase, $$confirmModal) {
        $scope.shop = {};

        //exPurchaseList数据操作
        var exPurchaseListFeed = new $$dataBase.Feed({
            url: 'BackendCommunityBuyOfferListGet',
            params: {
                shopObjectId: 'all',
            },
            scope: $scope,
            name: 'exPurchaseList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log($scope.exPurchaseList);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.exPurchaseList = [];
                    }
                    console.log(err);
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
        })
        //
        $scope.$on('$ionicView.beforeEnter', function () {
            ////刷新exPurchaseList
            //$scope.exPurchaseListRefresh();
            ////获取城市列表
            //$$dataBase.getCityList().then(function (data) {
            //    $scope.cityList = data;
            //    console.log($scope.cityList);
            //}, function () {
            //    $$toast('获取城市列表失败', 'error');
            //});
        })

        //#region 检索条件店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommunityShopListGet',
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
                    $scope.shop.shopObjectId = dataArr[0].objectId;
                    $scope.shop.name = dataArr[0].name;
                    console.log($scope.shop.shopObjectId);
                    exPurchaseListFeed.setParam('shopObjectId', $scope.shop.shopObjectId);
                    $scope.exPurchaseListRefresh();
                },
            });
        }
        //#endregion  


        //获取类别
        var config = $$dataBase.getAppConfig();
        //删除特惠
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前特惠？').then(function () {
                var content = {
                    targetObjectId: targetObjectId,
                    //modifyType: config.EModifyType.CommercialBuyOffer,
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $scope.exPurchaseListRefresh();
                    }
                    else {
                        $$toast('删除失败', 'error');
                    }
                }, function (error) {
                    $$toast('删除失败', 'error');
                })
            }, function () {
            })
        }
        //选择城市
        $scope.cityChanged = function (regionId) {
            regionId = regionId || 'all';
            exPurchaseListFeed.setParam('regionId', regionId);
            $scope.exPurchaseListRefresh();
        };
    });

});