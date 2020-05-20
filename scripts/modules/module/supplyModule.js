define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var supplyModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "supplyModule";
    }

    extend(supplyModule, baseModule);

    supplyModule.prototype.createView = function () {
        //代理商店铺
        this.addView('main.supplyShop', {
            url: '/supply/supplyShop',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/supply/supplyShop.html',
                    controller: 'supplyShopController',
                }
            }
        })
        //代理商店铺对应的商品
        this.addView('main.supplyCargo', {
            url: '/supply/supplyCargo/:id',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/supply/supplyCargo.html',
                    controller: 'supplyCargoController',
                }
            }
        })
    }

    return supplyModule;
});