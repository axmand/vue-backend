/**
*   @date 2015/11/28
*   @author yellow 
*   @description 商户管理模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var commercialModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "commercialModule";
    }

    extend(commercialModule, baseModule);

    commercialModule.prototype.createView = function () {
        //商户页
        this.addView('main.shop', {
            url: '/commercial/shop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/shop.html',
                    controller: 'shopController',
                }
            }
        })
        //店铺详情
        this.addView('main.shopDetail', {
            url: '/commercial/shop/shopDetail/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/shopDetail.html',
                    controller: 'shopDetailController',
                }
            }
        })
        //商品页
        this.addView('main.commercialCargo', {
            url: '/commercial/cargo',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/cargo.html',
                    controller: 'cargoController',
                }
            }
        });
        //商品详情页
        this.addView('main.commercialCargoDetail', {
            url: '/commercial/cargo/cargoDetail/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/cargoDetail.html',
                    controller: 'cargoDetailController',
                }
            }
        });
        //订单页
        this.addView('main.commercialOrder', {
            url: '/commercial/order',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/order.html',
                    controller: 'orderController'
                }
            }
        });
        //订单详情
        this.addView('main.commercialOrderDetail', {
            url: '/commercial/order/orderDetail/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/orderDetail.html',
                    controller: 'orderDetailController'
                }
            }
        });

    }

    return commercialModule;
});