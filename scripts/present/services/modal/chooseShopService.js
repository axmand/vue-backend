define(['baseServices'], function (baseServices) {
    baseServices.service('$$chooseShopService', ['$$bootstrapModal','$rootScope','$$dataBase','$$toast',
        function ($$bootstrapModal, $rootScope,$$dataBase,$$toast) {
            var $scope = $rootScope.$new();
            var _callBack = null;
            //选择店铺
            var shopListModal = null;
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumChooseShop.html', {
                scope: $scope
            }).then(function (modal) {
                shopListModal = modal;
            });
            //获取店铺列表
            var shopListFeed = new $$dataBase.Feed({
                url: 'BackendCommercialShopListGet',
                name: 'shopList',
                scope: $scope,
                autoShowInfinit: true,
                autoRefreshAndLoadMore: true,
                params: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    searchWord: 'all',
                    location: [0, 0],
                    pageNumber: 0,
                    eSortMethod: -1,
                    radius: 5000000,
                    regionId: 'all'
                },
                loadMoreCallback: {
                    success: function (data) {
                        console.log(data);
                    }
                },
                refreshCallback: {
                    success: function (data) {

                    },
                    error: function (err) {
                        $scope.shopList = [];
                        $$toast(err.content, 'error');
                    }
                }
            });
            //搜索店铺
            $scope.searchShop = function (searchWord, $event) {
                if ($event.keyCode === 13) {
                    shopListFeed.setParam('searchWord', searchWord);
                    $scope.shopListRefresh();
                }
            }
            //设置店铺关闭时执行回调
            $scope.setShop = function (shop) {
                _callBack(shop);
                shopListModal.hide();
            }
            //显示modal,同时刷新shoplist获取
            var openModal = function (callBack, opt) {
                var _opt = opt || {};
                for (var key in _opt) {
                    console.log(key);
                    shopListFeed.setParam(key, _opt[key]);
                }

                _callBack = callBack || function () { return true };
                $scope.shopListRefresh();
                shopListModal.show();
                return shopListModal;
            };

            //销毁modal
            $scope.$on('$destroy', function () {
                cargoStandardModal.remove();
                shopListModal.remove();
            });
            return {
                open:openModal
            }
        }]);
})