define(['baseControllers', 'jquery'], function (baseControllers, $) {

    baseControllers.controller('passwordActivityDetailController', function (
        $scope, $stateParams, $$bootstrapModal, $$dataBase, $state, $$dataCache,
        $filter, $$chooseShopService, $$chooseCargoService, $$toast) {
        //操作模式
        $scope.$on('$ionicView.enter', function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                //获取操作模式
                $scope.model = $stateParams.model;
                $scope.modelText = $scope.model == 1 ? "新建口令" : "编辑口令";
                //获取商家详情
                $scope.command = $scope.model == 1 ? {} : $$dataCache.getData("popularizeDetail");
            }
        });
        //
        $('#passwordStartTime').flatpickr({
 
            enableTime: true,
            onChange: function (selectedDates, dateStr, instance) {
                $scope.command.startTime = dateStr;
            }
        });
        //
        $('#passwordEndTime').flatpickr({
  
            enableTime: true,
            onChange: function (selectedDates, dateStr, instance) {
                $scope.command.endTime = dateStr;
            }
        });
        //切换店铺
        $scope.openShopModal = function () {
            $$chooseShopService.open(function (shop) {
                $scope.command.shopName = shop.name;
                $scope.command.shopObjectId = shop.objectId;
                //清空选择的商品
                $scope.cargoList = {};
                $scope.command.cargoObjectIds = [];
                return true;
            })
        };
        //选择商品
        var _cargoCallback = function (cargolist) {
            $scope.cargoList = cargolist;
            console.log($scope.cargoList);
            $scope.command.cargoObjectIds = [];
            angular.forEach(cargolist, function (value) {
                $scope.command.cargoObjectIds.push(value.objectId);
            })
        }
        //
        $scope.openCargoModal = function () {
            if ($scope.command.shopObjectId)
                $$chooseCargoService.open(_cargoCallback, { shopObjectId: $scope.command.shopObjectId }, $scope.cargoList);
            else
                $$toast('请先选择店铺', 'warning');
        };
        //
        $scope.sumitCommand = function () {
            var postContent = {
                startTime: $filter('date')($scope.command.startTime, 'yyyy-MM-dd'),
                endTime: $filter('date')($scope.command.endTime, 'yyyy-MM-dd'),
                words: $scope.command.words,
                minDiscount: +$scope.command.minDiscount,
                maxDiscount: +$scope.command.maxDiscount,
                cargoObjectIds: $scope.command.cargoObjectIds,
                shopObjectId: $scope.command.shopObjectId,
                regionId: 'all'
            };
            if (postContent.cargoObjectIds.length === 0) {
                $$toast('请完善信息', 'error');
                return
            };
            $$dataBase.postData('BackendCommercialCreatePopularizePost', postContent).then(function (data) {
                if (data.status === "ok") {
                    $state.go('main.passwordActivity');
                    $$toast(data.content, "success");
                }
                else
                    $$toast(data.content, "error");
            }, function (err) {
                $$toast(err.content, "error");
            });
        };
    });
});