define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('topicController', function ($scope, $state, $$dataBase, $$toast,$$dataCache) {
        //专题列表获取
        var topicFeed = new $$dataBase.Feed({
            url: 'BackendCommercialTopicListGet',
            params: {
                searchword: 'all',
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

        //刷新专题列表
        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新topicList
            $scope.topicListRefresh();
        });


        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            var _searchWord = searchword || 'all';
            console.log(_searchWord);

            if ($event.keyCode === 13) {
                topicFeed.setParam('searchword', _searchWord);
                $scope.topicListRefresh();
            }
        };

        //#endregion      

        $scope.gotoTopicDetail = function (topic) {
            if (!!topic)
                $$dataCache.setData('topicDetail', topic, true);
            $state.go('main.topicCreate', { model : !!topic?2:1 });
        }

    });
});