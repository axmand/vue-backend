/**
*   @authr yellow date 2016/10/3
*   自营商城订单管理controller
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers.controller('selfsupportOrderController', function ($scope, groupService, $ionicSideMenuDelegate, $$dataBase, $state, $$toast) {
        //用户信息
        var _userInfo = $$dataBase.getUserInfo();
        //订单列表
        var orderListFeed = new $$dataBase.Feed({
            name: 'orderList',
            url: 'BackendCommericalOrderListGet',
            scope: $scope,
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            params: {
                customerName: _userInfo.phoneNumber,
                token: _userInfo.token,
                searchWord: "all",
                eOrderState: -1,
                pageNumber: 0,
            },
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $scope.orderList = [];
                    }
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到更多数据', 'error');
                    }
                    console.log(err);
                }
            }
        });
        //刷新 orderlist
        $scope.orderListRefresh();
        //
        $scope.changeOrderState = function (orderState, $event) {

        }
        //
        $scope.searchOrder = function (searchWord, $event) {
            if ($event.keyCode === 13) {
                orderListFeed.setParam('searchWord', searchWord || 'all');
                $scope.orderListRefresh();
            }
        }

        $scope.goToOrderDetail = function (order) {
            if (!order) {
                $$toast('未选中订单数据', 'error');
                return;
            }
            $state.go('main.commercialOrderDetail', { detail: JSON.stringify(order) })
        }

        //刷新商家列表
        $scope.$on('$ionicView.enter', function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {

            }
        });


    });

});