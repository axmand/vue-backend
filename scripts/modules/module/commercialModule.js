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
        this.addView('main.shopDetail', {
            url: '/commercial/shop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialShop.html',
                    controller: 'shopDetailController',
                }
            }
        })
        //商品页
        this.addView('main.commercialCargo', {
            url: '/commercial/cargo',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialCargo.html',
                    controller: 'cargoController',
                }
            }
        });
        //商品详情页
        this.addView('main.commercialCargoDetail', {
            url: '/commercial/cargoDetail/:id/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/cargoDetail.html',
                    controller: 'cargoDetailController',
                }
            }
        });
        //活动页
        this.addView('main.commercialActivity', {
            url: '/commercial/activity',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialActivity.html',
                    controller: 'activityController',
                }
            }
        });
        //订单页
        this.addView('main.commercialOrder', {
            url: '/commercial/order',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialOrder.html',
                    controller: 'orderController'
                }
            }
        });
        //评论页
        this.addView('main.commercialReview', {
            url: '/commercial/review',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/commercial/commercialReview.html',
                    controller: 'reviewController'
                }
            }
        });
    }

    return commercialModule;
});