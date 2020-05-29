define(['baseServices'], function (baseServices) {
    baseServices.service('$$chooseShopService', ['$$bootstrapModal','$rootScope','$$dataBase',
        function ($$bootstrapModal, $rootScope,$$dataBase) {
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
                    eshoptype: 'all',
                    emerchanttype: 'all',
                    waitAudit: false,
                    esearchPattern:1,
                    searchword: 'all',
                    location: 'all',
                    sortMethod: -1,
                    radius: 1000000,
                    pageNumber: 0,
                    regionId: 'all'
                },
                loadMoreCallback: {
                    success: function (data) {
                        console.log(data);
                    }
                }
            });
            //搜索店铺
            $scope.searchShop = function (searchWord, $event) {
                if ($event.keyCode === 13) {
                    shopListFeed.setParam('searchword', searchWord);
                    $scope.shopListRefresh();
                }
            }

            //设置店铺关闭时执行回调
            $scope.setShop = function (shop) {
                _callBack(shop);
                shopListModal.hide();
            }
            //显示modal,同时刷新shoplist获取
            var openModal = function (callBack) {
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