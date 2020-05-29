define(['baseServices'], function (baseServices) {
    baseServices.service('$$chooseCargoService', ['$$bootstrapModal','$rootScope','$$dataBase','$$toast',
        function ($$bootstrapModal, $rootScope,$$dataBase,$$toast) {
            var $scope = $rootScope.$new();
            var _callBack = null;
            //选择商品
            var cargoListModal = null;
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumChooseCargo.html', {
                scope: $scope
            }).then(function (modal) {
                cargoListModal = modal;
            });
            //获取商品列表
            var cargoListFeed = new $$dataBase.Feed({
                url: 'BackendCommercialCargoListGet',
                name: 'cargoList',
                scope: $scope,
                autoShowInfinit: true,
                autoRefreshAndLoadMore: true,
                params: {
                    cargoType: 'all',
                    shopObjectId: '0',           
                    searchword: 'all',
                    eSearchPattern:1,              
                    pageNumber: 0,
                    regionId: 'all'
                },         
                refreshCallback: {
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (error) {
                        console.log('refreshCallback')
                        if (error) {
                            $scope.cargoList = [];
                            $$toast(error.content, 'error');
                        }
                        else $$toast('无网络连接', 'warning');
                    }
                }
            });


            //获取店铺类别
            var config = $$dataBase.getAppConfig();
            $$dataBase.getCategory(config.ECategory.CommercialCargo).then(function (data) {
                data[data.length] = { name: '全部分类', uid: 'all' };
                $scope.$$commericalCargoType = data;
            });


            //搜索商品
            $scope.searchCargo = function (searchParams, $event) {
                if ($event.keyCode === 13) {
                    cargoListFeed.setParam('searchword', searchParams.searchword || 'all');
                    cargoListFeed.setParam('eSearchPattern', searchParams.eSearchPattern || '1');
                    cargoListFeed.setParam('cargoType', searchParams.cargoType || 'all');
                    $scope.cargoListRefresh();
                }
            };


            //添加商品
            $scope.addCargo = function (cargo) {
                if ($scope.chooseCargo[cargo.objectId]) {
                    delete $scope.chooseCargo[cargo.objectId];
                    return;
                }

                $scope.chooseCargo[cargo.objectId] = cargo;
                if ($scope.model == 'single') {
                    $scope.chooseCargo = {};
                    $scope.chooseCargo[cargo.objectId] = cargo;
                    //$scope.closeModal($scope.chooseCargo);
                }
            };


            //设置店铺关闭时执行回调
            $scope.closeModal = function (cargoList) {
                _callBack(cargoList);
                cargoListModal.hide();
            };


            //显示modal,同时刷新shoplist获取
            var openModal = function (callBack,params,chooseCargo,model) {
                _callBack = callBack || function () { return true };
                $scope.chooseCargo = chooseCargo || {};
                $scope.searchParams = {
                    cargoType: 'all',
                    searchword: 'all',
                    eSearchPattern:'1',
                }
                angular.extend(params, $scope.searchParams);
                console.log(params);
                $scope.model = model;
                //设置参数
                angular.forEach(params,function (value, key) {
                    cargoListFeed.setParam(key, value);
                });
                $scope.cargoListRefresh();
                cargoListModal.show();
                return cargoListModal;
            };


            //销毁modal
            $scope.$on('$destroy', function () {
                cargoListModal.remove();
            });
            return {
                open:openModal
            }
        }]);
})