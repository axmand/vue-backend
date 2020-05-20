/**
*   @author xr
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {
    //今日团购list controller
    baseControllers.controller('communityBuyGroupCreateController',
        function ($scope, $filter, $$toast, $$chooseService, $state,
         $$cutPictureService, $$dataBase, $window, $$dataCache, $$chooseStandardService) {
            //团购
            $scope.newGroupCargo = {};
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });

            //裁剪16：9
            $scope.cutHeadImgUrlPicture = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
                        $scope.newGroupCargo.headImgUrl = data;
                    }
                });
            };
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
                        $scope.newGroupCargo.shopObjectId = dataArr[0].objectId;
                        $scope.newGroupCargo.shopName = dataArr[0].name;
                    },
                });
            };

            //选择参加团购的商品
            $scope.chooseCargo = function () {
                if (!$scope.newGroupCargo.shopObjectId)
                    return $$toast('请先选择商家', 'warning');

                $$chooseService.show({
                    minChooseNumber: 1,
                    maxChooseNumber: 1,
                    feedUrl: 'BackendCommercialCargoListGet',
                    feedParams: {
                        cCargoType: 'all',
                        shopObjectId: $scope.newGroupCargo.shopObjectId,
                        searchWord: 'all',
                        regionId: 'all',
                        eSearchPattern: '2',
                    },
                    completeCallback: function (dataArr) {
                        $scope.newGroupCargo.cargo = dataArr[0];
                    },
                })
            };
            //选择或编辑商品规格
            $scope.chooseStandard = function () {
                if (!!$scope.newGroupCargo.cargo) {
                    $$chooseStandardService.choose($scope.newGroupCargo.cargo.objectId).then(function (standard) {
                        if (!!standard.objectId) {
                            $scope.newGroupCargo.cargoStandard = standard;
                        } else {
                            $$toast("选择的规格未存储，请重新选择", "error");
                        }
                    });
                } else
                    $$toast("请先选择商品", "warning");
            };
            //
            $('#buyGroupStartTime').flatpickr({
                enableTime: true,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.newGroupCargo.startTime = dateStr;
                }
            });
            $('#buyGroupEndTime').flatpickr({
                enableTime: true,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.newGroupCargo.endTime = dateStr;
                }
            });
            var appConfg = $$dataBase.getAppConfig();
            //提交创建今日团购
            $scope.groupPurchasePost = function (newGroupCargo) {
                var postContent = {
                    headImgUrl: newGroupCargo.headImgUrl,
                    startTime: $filter('date')(newGroupCargo.startTime, 'yyyy/MM/dd HH:mm:ss'),
                    endTime: $filter('date')(newGroupCargo.endTime, 'yyyy/MM/dd HH:mm:ss'),
                    maxNum: newGroupCargo.maxNum,
                    cargoObjectId: newGroupCargo.cargo.objectId,
                    shopObjectId: newGroupCargo.cargo.shopObjectId,
                    cargoStandardObjectId: newGroupCargo.cargoStandard.objectId,
                    regionId: newGroupCargo.regionId || "all",
                    eClassifyPattern: appConfg.EClassifyPattern.Commercial,
                };
                console.log(postContent);
                if (!postContent.cargoObjectId)
                    return $$toast('请选择商品', 'warning');
                if (!postContent.cargoStandardObjectId)
                    return $$toast('请选择规格', 'warning');
                if (!postContent.startTime || !postContent.endTime)
                    return $$toast('请设置团购时间', 'warning');
                if (!postContent.maxNum)
                    return $$toast('请设置库存数', 'warning');
                $$dataBase.postData('BackendCommunityCreateBuyGroupPost', postContent).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.communityBuyGroup');
                    }
                }, function (err) {
                    $$toast(err.content, 'error');
                });
            }
        });

});