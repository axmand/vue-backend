/**
*   商品controller
*   @author yellow date 2015/11/30
*/
define(['baseControllers', 'cdn', 'pluginService'], function (baseControllers, cdn, pluginService) {
    baseControllers.controller('dikuaiController', function ($scope, groupService, $$dataBase, $$toast, $state, $$dataCache) {
        //获取商品
        var dikuaiListFeed = new $$dataBase.Feed({
            name: 'cargoList',
            url: 'BackendCommercialCargoListGet',
            scope: $scope,
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            params: {
                cargoType: 'all',
                shopObjectId: 'all',
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

                    if (error) {
                        $$toast(error, 'error')
                    }
                }
            },
            loadMoreCallback: {
                success: function (data) { console.log(data) }
            }
        });

        //搜索商品
        $scope.searchCargo = function (searchWords, $event) {
            if ($event.keyCode === 13) {
                cargoListFeed.setParam('searchword', searchWords || 'all');
                $scope.cargoListRefresh();
            }
        }

        //编辑商品
        $scope.editCargo = function (cargo) {
            console.log('编辑', cargo.name);
            $$dataCache.setData('editCargo', cargo, true);
            $state.go('main.commercialCargoDetail', { id: cargo.objectId, model: '2' })
        }

        //删除商品
        $scope.deleteCargo = function (cargo) {
            console.log('删除', cargo.name)
        }

    });

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