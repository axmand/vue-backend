define(['baseModule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _cooperationModule = function (opts) {
        basemodule.call(this, opts || {});
        this.className = "cooperationModule";
    }

    extend(_cooperationModule, basemodule);

    _cooperationModule.prototype.createView = function () {
        //商户管理
        this.addView('main.cooperationShop', {
            url: '/cooperation/shop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/cooperationShop.html',
                    controller: 'shopController',
                }
            }
        });
        //商家详情操作
        this.addView('main.shopAudit', {
            url: '/cooperation/shopAudit/:detail',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/cooperation/shopAudit.html',
                    controller: 'shopAuditController',
                }
            }
        });
    }

    return _cooperationModule;
});