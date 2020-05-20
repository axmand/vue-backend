define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('supplyCargoController', function ($scope, $stateParams, $$chooseCargoService, $$toast, $$dataBase) {
        //初始化
        var supplyListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialDummyListGedt',
            name: 'supplyList',
            scope: $scope,
            params: {
                dummyShopObjectId: $stateParams.id,
                customerName: $$dataBase.getUserInfo().mailAddress,
                token: $$dataBase.getUserInfo().token,
            }
        });
        supplyListFeed.getOnce();

        //增加商品
        $scope.addSupplyCargo = function () {
            $scope.openCargoModal();
        }

        //选择商品
        var _cargoCallback = function (cargolist) {
            $scope.cargoList = cargolist;
            console.log($scope.cargoList);
            angular.forEach(cargolist, function (value) {
                $scope.sumitSupply(value.objectId);
            });
            supplyListFeed.getOnce();
        }
        $scope.openCargoModal = function () {
            if ($stateParams.id)
            { $$chooseCargoService.open(_cargoCallback, { shopObjectId: $stateParams.id }, $scope.cargoList, 'single'); }
            else {
                $$toast('请先选择店铺', 'warning');
            }
        }

        //提交供应商品
        $scope.sumitSupply = function (objectId) {
            console.log('sumit');
            var postContent = {
                dummyShopObjectId: $stateParams.id,
                cargoObjectId: objectId,
                regionId: 'all'
            };
            $$dataBase.postData('BackendCommercialCreateDummyPost', postContent).then(function (data) {
                $$toast(data.content, 'info');
            })
        }
    });
});