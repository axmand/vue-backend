/**
*
*   @description 口令优惠
*/
define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('passwordActivityController', function ($scope, $$dataBase, $state, $$dataCache) {

        var commandListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialPopularizeListGet',
            name: 'commandList',
            scope: $scope,
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            params: {
                pageNumber: 0,
                regionId: 'all'
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                }
            }
        });
        
        $scope.$on('$ionicView.enter', function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.commandListRefresh();
            }
        });

        $scope.goToPopularizeDetail = function (popularize) {
            if (!!popularize)
                $$dataCache.setData("popularizeDetail", popularize, true)
            $state.go('main.passwordActivityDetail', { model: !popularize ? 1 : 2 });
        }

    });
});