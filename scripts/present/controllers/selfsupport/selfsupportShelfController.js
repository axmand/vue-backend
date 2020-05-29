//货架管理
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('selfsupportShelfController', function ($scope, $$confirmModal, $state, $q, $$toast, $stateParams, $$dataBase) {
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
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.shelfList = [];
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



        //刷新货架
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.shelfListRefresh();
        });

        //#regionid  检索

        //关键词搜索
        $scope.searchwordGet = function (searchword) {
            var _searchWord = searchword || 'all';
            console.log(_searchWord);

            shelfFeed.setParam('searchWord', _searchWord);
            $scope.shelfListRefresh();
        };

        $scope.gotoshelfDetail = function (shelf) {
            var _shelfString = shelf ? JSON.stringify(shelf) : '';

            $state.go('main.selfsupportShelfCreate', { detail: _shelfString });
        }

        //#endregionId

    });
});