/*
 *  商户功能  --创建店铺  创建商品  订单管理，查看订单/退款。
 */
define(['baseServices'], function (services) {
    services.service('$$commercialDatabase', ['$$commonDatabase', '$rootScope', '$q', function ($$commonDatabase, $rootScope, $q) {

        //#region 店铺选择操作

        var _selectShop = null;

        this.setSelectShop = function (shop) {
            _selectShop = shop;
        }

        this.getSelectShop = function () {
            return _selectShop;
        }

        //#endregion

    }]);
});