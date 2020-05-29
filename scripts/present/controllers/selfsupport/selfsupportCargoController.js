/**
*   @authr yellow date 2016/10/3
*   自营商城商品管理controller
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    //
    baseControllers.controller('selfsupportCargoController', function ($scope, $$dataBase, $$toast, $state, $$dataCache) {
        //获取商品
        var cargoListFeed = new $$dataBase.Feed({
            name: 'cargoList',
            url: 'BackendCommercialCargoListGet',
            scope: $scope,
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            params: {
                cargoType: 'all',
                shopObjectId: $$dataBase.selfsupportShopObjectId,
                searchword: 'all',
                eSearchPattern: 1,
                pageNumber: 0,
                regionId: 'all',
            },
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    if (!!error) {
                        $$toast(error.content, 'error');
                    }
                }
            },
            loadMoreCallback: {
                success: function (data) { console.log(data) }
            },
        });
        //
        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新
            $scope.cargoListRefresh();
            //获取商品类别
            var config = $$dataBase.getAppConfig();
            $$dataBase.getCategory(config.ECategory.CommercialCargo).then(function (data) {
                $scope.$$commericalCargoType = data;
            });
        })
        //搜索商品
        $scope.searchCargo = function (searchWords, $event) {
            if ($event.keyCode === 13) {
                cargoListFeed.setParam('searchword', searchWords || 'all');
                $scope.cargoListRefresh();
            }
        }
        //
        $scope.typeChanged = function (cargoType) {
            console.log(cargoType);
            cargoListFeed.setParam('cargoType', cargoType || 'all');
            $scope.cargoListRefresh();
        }
        //编辑商品
        $scope.editCargo = function (cargo) {
            console.log('编辑', cargo.name);
            $$dataCache.setData('editCargo', cargo, true);
            $state.go('main.selfsupportCargoDetail', { id: cargo.objectId, model: '2' })
        }
        //删除商品
        $scope.deleteCargo = function (cargo) {
            console.log('删除', cargo.name)
        }

    });
    //
    baseControllers.service('$$dataCache', function () {
        var _cachData = {};
        this.getData = function (name) {
            return _cachData[name];
        }
        this.setData = function (name, data, deepCopy) {
            _cachData[name] = deepCopy ? angular.copy(data) : data;
        }
    });
});