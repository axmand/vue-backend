/// <reference path="../../present/views/frontdesk/frontdeskBranchManagement.html" />
define(['baseModule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _frontdeskModule = function (opts) {
        basemodule.call(this, opts || {});
        this.className = "frontdeskModule";
    }

    extend(_frontdeskModule, basemodule);

    _frontdeskModule.prototype.createView = function () {
        //分站管理
        this.addView('main.branchManagement', {
            url: '/frontdesk/branchManagement',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/frontdesk/frontdeskBranchManagement.html',
                    controller: 'branchManagementController'
                }
            }
        });
        //订单管理
        this.addView('main.orderManagement', {
            url: '/frontdesk/orderManagement',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/frontdesk/frontdeskOrderManagement.html',
                    controller: 'orderManagementController'
                }
            }
        });
        //目录管理
        this.addView('main.categoryManagement', {
            url: '/frontdesk/categoryManagement',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/frontdesk/frontdeskCategoryManagement.html',
                    controller: 'categoryManagementController'
                }
            }
        });
    };

    return _frontdeskModule;
});