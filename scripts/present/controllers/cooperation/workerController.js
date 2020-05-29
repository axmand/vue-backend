define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('workerController', function ($scope, $$dataBase,$state, $location, $$loginService, $$cooperationService, configService, $$toast, $$confirmModal) {
        var workerListFeed = new $$dataBase.Feed({
            url: 'BackendConvenienceJourneymanListGet',
            params: {
                journeymanType: 'all',
                journeymanSortMethod: 1,
                waitAduit: 'true',
                searchword: 'all',
            },
            scope: $scope,
            name: 'workerList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $scope.workerList = [];
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

        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.workerListRefresh();
            }
        });

        //获取工匠类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.ECategory.ConvenienceJourneyman).then(function (data) {
            $scope.$$convenienceJourneymanType = data;
        });

        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            if ($event.keyCode === 13) {
                workerListFeed.setParam('searchword', searchword || 'all');
                $scope.workerListRefresh();
            }                     
        };

        //类别搜索
        $scope.chooseType = function (journeymanType) {
            console.log(journeymanType);
            workerListFeed.setParam('journeymanType', journeymanType || 'all');
            $scope.workerListRefresh();
        }
        $scope.goToWorkerDetail = function (worker) {
            if (!worker) worker = '';
            $state.go('main.workerAudit', { detail: JSON.stringify(worker) });
        }

        //#endregion 
    });

});