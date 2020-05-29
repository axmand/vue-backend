/// <reference path="../../present/views/frontdesk/frontdeskBranchManagement.html" />
define(['baseModule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _selfsupportModule = function (opts) {
        basemodule.call(this, opts || {});
        this.className = "frontdeskModule";
    }

    extend(_selfsupportModule, basemodule);

    _selfsupportModule.prototype.createView = function () {
        //自营商品管理
        this.addView('main.selfsupportCargo', {
            url: '/selfsupport/selfsupportCargo',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportCargo.html',
                    controller: 'selfsupportCargoController'
                }
            }
        });
        //自营商品管理详情
        this.addView('main.selfsupportCargoDetail', {
            url: '/selfsupport/selfsupportCargoDetail/:id/:model',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportCargoDetail.html',
                    controller: 'selfsupportCargoDetailController'
                }
            }
        });
        //自营订单管理
        this.addView('main.selfsupportOrder', {
            url: '/selfsupport/selfsupportOrder',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportOrder.html',
                    controller: 'selfsupportOrderController'
                }
            }
        });
        //自营订单管理详情
        this.addView('main.selfsupportBanner', {
            url: '/selfsupport/selfsupportOrderDetail/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportOrderDetail.html',
                    controller: 'selfsupportOrderDetailController'
                }
            }
        });
        //自营滑动广告位
        this.addView('main.selfsupportBannerDetail', {

        });
        //自营货架管理
        this.addView('main.selfsupportShelf', {
            url: '/selfsupport/selfsupportShelf',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportShelf.html',
                    controller: 'selfsupportShelfController'
                }
            }
        })
        //自营货架编辑
        this.addView('main.selfsupportShelfCreate', {
            url: '/selfsupport/selfsupportShelfCreate/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/selfsupport/selfsupportShelfCreate.html',
                    controller: 'selfsupportShelfCreateController'
                }
            }
        })
    };

    return _selfsupportModule;
});