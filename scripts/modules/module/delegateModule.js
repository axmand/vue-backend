/**
*   @date 2016/8/2
*   @author xr 
*   @description 日常活动维护模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var delegateModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "delegateModule";
    }

    extend(delegateModule, baseModule);

    delegateModule.prototype.createView = function () {
        //代理商店铺
        this.addView('main.delegateShop', {
            url: '/delegate/delegateShop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/delegate/delegateShop.html',
                    controller: 'delegateShopController',
                }
            }
        })
        //代理商店铺对应的商品
        this.addView('main.delegateCargo', {
            url: '/delegate/delegateCargo/:id',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/delegate/delegateCargo.html',
                    controller: 'delegateCargoController',
                }
            }
        })     
    }

    return delegateModule;
});