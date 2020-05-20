/**
*   平台订单管理
*   @author yellow date 2016/8/27
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers
        .controller('orderController', function ($scope, groupService, $ionicSideMenuDelegate, $$dataBase, $state, $$toast, $$dataCache) {
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
                    eBuyPattern: -1,
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
            //
            $scope.searchOrder = function (searchWord, $event) {
                if ($event.keyCode === 13) {
                    orderListFeed.setParam('searchWord', searchWord || 'all');
                    $scope.orderListRefresh();
                }
            }
            //订单详情
            $scope.goToOrderDetail = function (order) {
                $$dataCache.setData("orderDetail", order, true);
                $state.go('main.commercialOrderDetail', { model: !!order ? 2 : 1 });
            }
            //刷新商家列表
            $scope.$on('$ionicView.enter', function () {
                //刷新 orderlist
                $scope.orderListRefresh();
                //if (arguments[0].targetScope == arguments[0].currentScope) { }
            });
        })
        .controller('orderDetailController', function ($window, $$confirmService, $$toast, $$bootstrapModal, $stateParams, $scope, $$dataCache, $$dataBase, groupService, $ionicSideMenuDelegate) {
            var  _userInfo = $$dataBase.getUserInfo();
            $scope.orderData = {};
            $scope.model = $stateParams.model;
            if ($scope.model == 2)
                $scope.orderData = $$dataCache.getData("orderDetail");

            $scope.disAgree = {
                reason: null,
            }

            var deliverOrderModal = {}, //发货信息对话框
                disDeliverOrderModal = {}; //拒绝订单对话框

            //选中购物车
            $scope.selectTrolleyElement = function (goods) {
                if (!!$scope.goods)
                    $scope.goods.isSelect = "";
                $scope.goods = goods;
                goods.isSelect = "mum-card-select";
            }
            //刷新商家列表
            $scope.$on('$ionicView.enter', function () {
                //if (arguments[0].targetScope == arguments[0].currentScope) {
                //    $scope.model = $stateParams.model;
                //    if ($scope.model == 2)
                //        $scope.orderData = $$dataCache.getData("orderDetail");
                //}
            });
            //销毁
            $scope.$on('$destroy', function () {
                disDeliverOrderModal.remove();
                deliverOrderModal.remove();
            });
            //订单发货modal
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumDeliverOrder.html', {
                scope: $scope
            }).then(function (modal) {
                deliverOrderModal = modal;
            });
            //拒绝发货modal
            $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumRefuseOrder.html', {
                scope: $scope
            }).then(function (modal) {
                disDeliverOrderModal = modal;
            });
            //打开订单发货对话框
            $scope.openDeliverModal = function (goods) {
                deliverOrderModal.show();
            };
            //打开拒绝发货订单对话框
            $scope.openDisDeliverModal = function () {
                disDeliverOrderModal.show();
            }
            //
            $window.getRefundSubmit = function () {
                return $scope.refundSubmit;
            }
            //退款
            $scope.refundOrder = function () {
                //同意退货
                $$dataBase.getData('BackendCommercialRefundMoneyGet', {
                    customerName: _userInfo.phoneNumber,
                    token: _userInfo.token,
                    orderObjectId: $scope.orderData.objectId,
                    batchNo: $scope.goods.batchNo
                }).then(function (data) {
                    if (data.status === "ok") {
                        $scope.refundSubmit = JSON.parse(data.content);
                        $window.open("scripts\\present\\views\\modal\\mumAlipayRefund.html");
                    }
                    else
                        $$toast(JSON.parse(data.content), "error");
                }, function (err) {
                    $$toast(err, "error");
                });
            };
            //同意退货
            $scope.agreeReturn = function (cargo) {
                $$confirmService.show("确认同意此件商品的退货申请吗？").then(function () {
                    //同意退货
                    $$dataBase.getData('BackendCommercialAgreeReturnCargoGet', {
                        customerName: _userInfo.phoneNumber,
                        token: _userInfo.token,
                        orderObjectId: $scope.orderData.objectId,
                        batchNo: $scope.goods.batchNo,
                    }).then(function (data) {
                        if (data.status === "ok")
                            $$toast(JSON.parse(data.content), "success");
                        else
                            $$toast(JSON.parse(data.content), "error");
                    }, function (err) {
                        $$toast(err, "error");
                    });
                }, function () {
                    //取消即可
                });
            }
            //不同意退货
            $scope.disagreeReturn = function (cargo) {
                $$confirmService.show("确认拒绝此件商品的退货申请吗？").then(function () {
                    //同意退货
                    $$dataBase.getData('BackendCommercialDisagreeReturnCargoGet', {
                        customerName: _userInfo.phoneNumber,
                        token: _userInfo.token,
                        orderObjectId: $scope.orderData.objectId,
                        batchNo: $scope.goods.batchNo,
                    }).then(function (data) {
                        if (data.status === "ok")
                            $$toast(JSON.parse(data.content), "success");
                        else
                            $$toast(JSON.parse(data.content), "error");
                    }, function (err) {
                        $$toast(err, "error");
                    });
                }, function () {
                    //取消即可
                });
            }
            //发货
            $scope.deliverOrder = function (goods) {
                if (!$scope.waybill.number)
                    return $$toast("请填写快递号", "error");
                $$dataBase.getData('BackendCommercialDeliverOrderGet', {
                    customerName: _userInfo.phoneNumber,
                    token: _userInfo.token,
                    orderObjectId: $scope.orderData.objectId,
                    batchNo: goods.batchNo,
                    waybillNumber: $scope.waybill.number,
                }).then(function (data) {
                    if (data.status === "ok")
                        $$toast(JSON.parse(data.content), "success");
                    else
                        $$toast(JSON.parse(data.content), "error");
                }, function (err) {
                    $$toast(err, "error");
                });
                deliverOrderModal.hide();
            }
            //不同意发货
            $scope.disDeliverOrder = function (order) {
                if (!$scope.disAgree.reason)
                    return $$toast("请填写拒绝订单的理由", "error");
                //
                $$dataBase.getData('BackendCommercialRefuseOrderGet', {
                    customerName: _userInfo.phoneNumber,
                    token: _userInfo.token,
                    orderObjectId: order.objectId,
                    refuseReason: $scope.disAgree.reason
                }).then(function (data) {
                    if (data.status === "ok")
                        $$toast(JSON.parse(data.content), "success");
                    else
                        $$toast(JSON.parse(data.content), "error");
                }, function (err) {
                    $$toast(err, "error");
                });
                disDeliverOrderModal.hide();
            }
        });

});