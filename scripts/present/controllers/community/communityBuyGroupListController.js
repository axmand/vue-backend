/**
*   @author xr
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {
    //今日团购创建 controller
    baseControllers.controller('communityBuyGroupListController', function (
       $scope, $$confirmModal, $$toast, $$dataBase, $filter, $$chooseService) {
        $scope.shop = {};

        //groupPurchaseList数据操作
        var groupPurchaseFeed = new $$dataBase.Feed({
            url: 'BackendCommunityBuyGroupListGet',
            params: {
                shopObjectId: 'all',
            },
            scope: $scope,
            name: 'groupPurchaseList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log($scope.groupPurchaseList);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.groupPurchaseList = [];
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

        //获取类别
        var config = $$dataBase.getAppConfig();

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
                    groupPurchaseFeed.setParam('shopObjectId', $scope.shop.shopObjectId);
                    $scope.groupPurchaseListRefresh();
                },
            });
        }
        //#endregion   

        //删除团购
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前团购？').then(function () {
                var content = {
                    targetObjectId: targetObjectId,
                    //modifyType: config.EModifyType.CommercialBuyGroup,
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $scope.groupPurchaseListRefresh();
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
    });
});