define(['baseServices'], function (baseServices) {
    baseServices.service('$$chooseShelfService', ['$$bootstrapModal', '$rootScope', '$$dataBase', '$$toast',
        function ($$bootstrapModal, $rootScope, $$dataBase, $$toast) {
            var $scope = $rootScope.$new();
            var _callBack = null;
            //选择店铺
            var shelfListModal = null;
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumChooseShelfModal.html', {
                scope: $scope
            }).then(function (modal) {
                shelfListModal = modal;
            });
            //获取店铺列表
            var shelfListFeed = new $$dataBase.Feed({
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

            $scope.shelfListRefresh();
            //搜索店铺
            $scope.searchShelf = function (searchWord, $event) {
                if ($event.keyCode === 13) {
                    shelfListFeed.setParam('searchword', searchWord);
                    $scope.shelfListRefresh();
                }
            }

            //设置店铺关闭时执行回调
            $scope.setShelf = function (shelf) {
                _callBack(shelf);
                shelfListModal.hide();
            }
            //显示modal,同时刷新shelfList获取
            var openModal = function (callBack) {
                _callBack = callBack || function () { return true };
                $scope.shelfListRefresh();
                shelfListModal.show();
                return shelfListModal;
            };

            //销毁modal
            $scope.$on('$destroy', function () {
                //cargoStandardModal.remove();
                shelfListModal.remove();
            });
            return {
                open: openModal
            }
        }]);
})