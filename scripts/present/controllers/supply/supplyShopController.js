define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('supplyShopController', function ($scope, $$toast, $$dataBase) {

        console.log('supply Shop');
        var shopListFeed = new $$dataBase.Feed({
            url: 'BackendCommericalManagedShopListGet',
            name:'shopList',
            scope: $scope,
            params: {
                regionId: 'all',
                customerName: $$dataBase.getUserInfo().mailAddress,
                token: $$dataBase.getUserInfo().token,
            }
        })
        shopListFeed.getOnce().then(function (data) {
            console.log(data);

        }, function (error) {
            console.log(error);
        })
    });
});