define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('shelfController', function ($scope, $$confirmModal, $state, $q, $$toast, $stateParams, $$dataBase, $$dataCache) {

        var shelfFeed = new $$dataBase.Feed({
            url: 'BackendCommercialShelfListGet',
            params: {
                searchWord: 'all',
            },
            scope: $scope,
            name: 'shelfList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    $scope.shelfList = [];
                    $$toast('未查询到数据', 'error');
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    $$toast('未查询到更多数据', 'error');
                }
            },
        });
        
        //刷新货架
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.shelfListRefresh();
        });

        //#regionid  检索

        //关键词搜索
        $scope.searchwordGet = function (searchword) {
            var _searchWord = searchword || 'all';
            shelfFeed.setParam('searchWord', _searchWord);
            $scope.shelfListRefresh();
        };

        $scope.gotoshelfDetail = function (shelf) {
            !!shelf ? $$dataCache.setData("shelfData", shelf, true) : null;
            $state.go('main.shelfCreate', { model: !!shelf?2:1});
        }

        //#endregionId

    });
});