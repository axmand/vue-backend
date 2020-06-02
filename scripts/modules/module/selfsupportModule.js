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
    };

    return _selfsupportModule;
});