/**
*   订单controller
*   @author yellow date 2015/11/30
*/
define(['baseControllers'], function (baseControllers) {

    baseControllers.controller('orderController', ['$scope', '$location', '$$commercialService', '$$loginService', 'configService','$$toast', function ($scope, $location, $$commercialService, $$loginService,configService,$$toast) {
        $scope.imgUrl = configService.urlRequest.imgUrl;
        console.log(configService.appConfig);
        $scope.EWaybill = configService.appConfig.EWaybill;
        $scope.ChoseEWaybil = {
            SELF:'自取',
            SFEXPRESS:'顺丰快递',
        }
        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.orders = [];
                $scope.noMoreItemsAvailable = false;
                $scope.getOrderList(0);
                _num = 1;
            }
        });
        //换商店时刷新
        $scope.$on('shopChanged', function () {
            console.log('shopChanged');
            $scope.orders = [];
            $scope.noMoreItemsAvailable = false;
            $scope.getOrderList(0);
            _num = 1;
        });
        $scope.getOrderList = function (number) {
            var userInfo = $$loginService.userInfo;
            console.log(userInfo);
            $$commercialService.getOrderList(userInfo.userName, userInfo.token,number).then(function (data) {
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
        //发货操作
        $scope.deliverOrderData = {
            order: null,
            waybill: -1,
            waybillNumber:'',
        };
        $scope.deliverOrder = function (order) {
            $scope.deliverOrderData.order = order;
            $scope.deliverOrderData.waybillNumber = '';
            $('#deliverOrderModal').modal('show');
        }
        $scope.sumitDeliverOrder = function () {          
            var sumitOrder=$scope.deliverOrderData.order;
            var userInfo = $$loginService.userInfo;
            $$commercialService.deliverOrder(userInfo.userName, userInfo.token, $scope.deliverOrderData.order.objectId, $scope.deliverOrderData.waybill, $scope.deliverOrderData.waybillNumber||'000')
            .then(function (data) {
                if (data.status == 'ok') {
                    sumitOrder.orderState = 32;
                    $$toast('发货成功', 'success');
                }
                else $$toast('发货失败', 'error');
                $('#deliverOrderModal').modal('hide');
            }, function (error) {
                $$toast('网络连接出错', 'error');
                console.log(error);
                $('#deliverOrderModal').modal('hide');
            })
            console.log('summite deliver');
        }

        //拒绝订单操作
        $scope.refuseOrderData = {
            reason: '',
            order:null,
        }
        $scope.refuseOrder = function (order) {
            $scope.refuseOrderData.order = order;
            $('#refuseOrderModal').modal('show');
        }
        $scope.sumitRefuseOrder = function () {
            var userInfo = $$loginService.userInfo;
            var sumitOrder = $scope.refuseOrderData.order;
            $$commercialService.refuseOrder(userInfo.userName, userInfo.token, $scope.refuseOrderData.order.objectId, $scope.refuseOrderData.order.reason)
            .then(function (data) {
                if (data.status == 'ok') {
                    sumitOrder.orderState = 61;
                    $$toast('拒绝订单成功', 'success');
                }
                else $$toast('拒绝订单失败', 'error');
                $('#refuseOrderModal').modal('hide');
            }, function (error) {
                $$toast('网络连接出错', 'error');
                console.log(error);
                $('#refuseOrderModal').modal('hide');
            });
        }
        $scope.loadMore = function () {
            console.log('more')
            $scope.getOrderList(_num++);
        }
    }]);

});