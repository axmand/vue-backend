define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('delegateCargoController', function ($scope, $stateParams, $$chooseCargoService, $$toast, $$dataBase) {
        //初始化
        var delegateListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialDummyListGedt',
            name: 'delegateList',
            scope: $scope,
            params: {
                dummyShopObjectId: $stateParams.id,
                customerName: $$dataBase.getUserInfo().mailAddress,
                token: $$dataBase.getUserInfo().token,
            }
        });
        delegateListFeed.getOnce();

        //增加代理商品
        $scope.addDelegateCargo = function () {
            $scope.openCargoModal();
        }

        //选择商品
        var _cargoCallback = function (cargolist) {
            $scope.cargoList = cargolist;
            console.log($scope.cargoList);
            angular.forEach(cargolist, function (value) {
                $scope.sumitDelagate(value.objectId);
            });
            delegateListFeed.getOnce();
        }
        $scope.openCargoModal = function () {
            if ($stateParams.id)
            { $$chooseCargoService.open(_cargoCallback, { shopObjectId: $stateParams.id }, $scope.cargoList, 'single'); }
            else {
                $$toast('请先选择店铺', 'warning');
            }
        }

        //提交代理商品
        $scope.sumitDelagate = function (objectId) {
            console.log('sumit');
            var postContent = {
                dummyShopObjectId:$stateParams.id,
                cargoObjectId: objectId,
                regionId: 'all'
            };
            $$dataBase.postData('BackendCommercialCreateDummyPost', postContent).then(function (data) {
                $$toast(data.content, 'info');
            })
        }
       
    });
});