/**
*   @date 2015/11/28
*   @author yellow 
*   @description 商户管理模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var accountModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "accountModule";
    }

    extend(accountModule, baseModule);

    accountModule.prototype.createView = function () {
        //用户组管理与财务分配
        this.addView('main.accountGroup', {
            url: '/account/accountGroup',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/account/accountGroup.html',
                    controller: 'accountGroupController',
                }
            }
        });
    };

    return accountModule;
});