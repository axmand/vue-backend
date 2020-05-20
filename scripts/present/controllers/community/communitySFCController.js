define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('communitySFCController', function ($scope, $state, $$dataBase, $$toast, $$dataCache, $$chooseService) {
        $scope.shop = {};

        //专题列表获取
        var topicFeed = new $$dataBase.Feed({
            url: 'BackendCommunitySFCListGet',
            params: {
                shopObjectId: 'all',
            },
            scope: $scope,
            name: 'topicList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    console.log($scope.topicList);
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.topicList = [];
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
        });

        //#region 检索条件店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommunityShopListGet',
                feedParams: {
                    regionId:"all",
                },
                completeCallback: function (dataArr) {
                    console.log(dataArr);
                    $scope.shop.shopObjectId = dataArr[0].objectId;
                    $scope.shop.name = dataArr[0].name;
                    topicFeed.setParam('shopObjectId', $scope.shop.shopObjectId)
                    $scope.topicListRefresh();
                },
            });
        }
        //#endregion      

        $scope.gotoTopicDetail = function (topic) {
            if (!!topic)
                $$dataCache.setData('SFCDetail', topic, true);
            $state.go('main.communitySFCCreate', { model: !!topic ? 2 : 1 });
        }

    });
});