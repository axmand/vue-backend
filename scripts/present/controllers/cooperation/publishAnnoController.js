/**
*
*
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers.controller('publishAnnoController', function ($scope, $$dataBase, configService, $$toast, $$confirmModal, $state) {
        var messageListFeed = new $$dataBase.Feed({
            url: 'BackendConvenienceMessageListGet',
            params: {
                messageType: 'BDLBMGG',
                subType: 'all',
                messageSortMethod: 1,
                waitAduit: 'false',
                searchword: 'all',
            },
            scope: $scope,
            name: 'messageList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $scope.messageList = [];
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
        $scope.$on('$ionicView.enter', function () {
            $scope.messageListRefresh();
        })

        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            var _searchWord = searchword || 'all';
            console.log(_searchWord);

            if ($event.keyCode === 13) {
                messageListFeed.setParam('searchword', _searchWord);
                $scope.messageListRefresh();
            }
        };

        //#endregion  

        //#region 视频操作
        //创建视频
        $scope.createAnno = function () {
            $state.go('main.annoCreate', {
                detail: '',
            });
        };

        //查看修改视频

        $scope.modifyAnno = function (msg) {

            $state.go('main.annoCreate', {
                detail: JSON.stringify(msg),
            });
        }
    });
});