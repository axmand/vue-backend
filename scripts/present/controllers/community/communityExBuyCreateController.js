/**
*   今日特惠购
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {

    baseControllers.controller('communityExBuyCreateController', function (
        $scope, $filter, $$toast, $$chooseService, $$dataBase,
        $window, $$cutPictureService, $$dataCache, $state,
        $$chooseStandardService) {
        var config = $$dataBase.getAppConfig();
        $scope.buyOffer = {};
        $scope.$on('$ionicView.enter', function () {
            $('#buyOfferStartTime').flatpickr({
                enableTime: true,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.buyOffer.startTime = dateStr;
                }
            });
            $('#buyOfferEndTime').flatpickr({
                enableTime: true,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.buyOffer.endTime = dateStr;
                }
            });
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            });
        });

        //选择店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommunityShopListGet',
                feedParams: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    regionId: 'all',
                    searchWord: 'all',
                    location: [0, 0],
                    eSortMethod: -1,
                    radius: 500000000,
                },
                completeCallback: function (dataArr) {
                    $scope.buyOffer.shopObjectId = dataArr[0].objectId;
                    $scope.buyOffer.shopName = dataArr[0].name;
                },
            });
        };

        //选择参加特惠的商品
        $scope.chooseCargo = function () {
            if (!$scope.buyOffer.shopObjectId) {
                return $$toast('尚未选择商品', 'warning');
            }

            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cCargoType: 'all',
                    shopObjectId: $scope.buyOffer.shopObjectId,
                    searchWord: 'all',
                    regionId: 'all',
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    $scope.buyOffer.cargo = dataArr[0];
                },
            })
        };
        //裁剪1：1缩略图
        $scope.cutFaceImgUrlPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 1,
                cutPictureCallback: function (data) {
                    $scope.buyOffer.faceImgUrl = data;
                }
            });
        };
        //选择商品
        $scope.chooseStandard = function () {
            $$chooseStandardService.choose($scope.buyOffer.cargo.objectId).then(function (standard) {
                $scope.buyOffer.standard = standard;
            });
        }
        //提交创建今日团购
        $scope.exPurchasePost = function (buyOffer) {
            var postContent = {
                startTime: $filter('date')(buyOffer.startTime, 'yyyy/MM/dd HH:mm:ss'),
                endTime: $filter('date')(buyOffer.endTime, 'yyyy/MM/dd HH:mm:ss'),
                maxNum: buyOffer.maxNum,
                faceImgUrl: buyOffer.faceImgUrl,
                shopObjectId: buyOffer.shopObjectId,
                cargoObjectId: buyOffer.cargo.objectId,
                cargoStandardObjectId: buyOffer.standard.objectId,
                regionId: buyOffer.regionId,
                //eClassifyPattern: config.EClassifyPattern.Commercial,
            };
            if (!postContent.cargoObjectId)
                return $$toast('未设置商品', 'warning');
            if (!postContent.cargoStandardObjectId)
                return $$toast('未设置商品规格', 'warning');
            if (!postContent.startTime || !postContent.endTime)
                return $$toast('未设置时间', 'warning');
            if (!postContent.maxNum || postContent.maxNum == 0)
                return $$toast('未设置提供份数', 'warning');
            $$dataBase.postData('BackendCommunityCreateBuyOfferPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast('新建特惠成功', 'success');
                    $window.history.back();
                } else {
                    if (data.code = '400') {
                        $$toast('该商品正在参加特惠购', 'error')
                    }
                }
                console.log(data);
            }, function (err) {
                console.log(err);
            });
        }
    })
});