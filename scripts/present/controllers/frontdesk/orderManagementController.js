/**
*   订单管理
*   
*/

define(['baseControllers', 'frontdeskService'], function (baseControllers, frontdeskService) {

    baseControllers.controller('orderManagementController', ['$scope', 'configService', '$$frontdeskService', '$$loginService', '$$toast', '$window', function ($scope, configService, $$frontdeskService, $$loginService, $$toast, $window) {
        $scope.imgUrl = configService.urlRequest.imgUrl;
        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.orders = [];
                $scope.noMoreItemsAvailable = false;
                $scope.getOrderList(0);
                _num = 1;
            }
        });
        $scope.EOrderState = configService.appConfig.EOrderState;
        $scope.orderState=$scope.EOrderState.REFUND;
        $scope.setOrderState = function (_orderState) {
            $scope.orderState = _orderState;
            $scope.$emit('$ionicView.enter');
        }
        $scope.getOrderList = function (number) {
            var userInfo = $$loginService.userInfo;
            $$frontdeskService.getOrderList(userInfo.userName, userInfo.token, number,$scope.orderState).then(function (data) {
                console.log('get shop order success');
                if (data.status == 'ok') {
                    var addOrders = JSON.parse(data.content);
                    addOrders.forEach(function (currentValue, index, array) {
                        currentValue.address = currentValue.address.split('|');

                    })

                    $scope.orders = $scope.orders.concat(addOrders);
                    console.log($scope.orders);
                }
                else {
                    $scope.noMoreItemsAvailable = true;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                $$toast('无网络连接！', 'warning');
                console.log('get Shop order fail');
                console.log(error);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.loadMore = function () {
            console.log('more')
            $scope.getOrderList(_num++);
        }
        var deleteOrder = null;
        $scope.openDeletOrderModal = function (order) {
            if ($scope.orderState === $scope.EOrderState.REFUNDSUCCESS) return;
            deleteOrder = order;          
            $('#deletOrderModal').modal('show');
        }
        $window.getAlipaypayData = function () {
            return $scope.alipaySubmit;
        }
        $scope.sumitDeleteOrder = function () {
            var userInfo = $$loginService.userInfo;
            $$frontdeskService.reimburseOrder(userInfo.userName, userInfo.token, deleteOrder.objectId)
            .then(function (data) {
                console.log(data);
                if (data.status == 'ok') {
                    $scope.alipaySubmit = JSON.parse(data.content);
                    $window.open("scripts\\present\\views\\frontdesk\\refund\\alipayModal.html");
                    $$toast('确认退单成功', 'success');
                }
                else {
                    $$toast('确认退单败', 'error');
                }
                $('#deletOrderModal').modal('hide');
            }, function (error) {
                console.log(error);
                $$toast('网络连接出错', 'error');
                $('#deletOrderModal').modal('hide');
            });
        }

    }]);

});