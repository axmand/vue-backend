/**
*   今日特惠购
*/
define(['baseControllers', 'cdn','jquery'], function (baseControllers, cdn,$) {

    baseControllers.controller('exPurchaseController', function ($scope, $location, $$toast, $$dataBase, $$confirmModal) {
        //exPurchaseList数据操作
        var exPurchaseListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialBuyOfferListGet',
            params: {
                regionId: 'all',
            },
            scope: $scope,
            name: 'exPurchaseList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {

                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.exPurchaseList = [];
                    }
                    console.log(err);
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到更多数据', 'error');
                    }
                    console.log(err);
                }
            },
        })
        //
        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新exPurchaseList
            $scope.exPurchaseListRefresh();
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
                console.log($scope.cityList);
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });
        })
        //获取类别
        var config = $$dataBase.getAppConfig();
        //删除特惠
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前特惠？').then(function () {
                var content = {
                    targetObjectId: targetObjectId,
                    modifyType: config.EModifyType.CommercialBuyOffer,
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $scope.exPurchaseListRefresh();
                    }
                    else {
                        $$toast('删除失败', 'error');
                    }
                }, function (error) {
                    $$toast('删除失败', 'error');
                })
            }, function () {
            })
        }
        //选择城市
        $scope.cityChanged = function (regionId) {
            regionId = regionId || 'all';
            exPurchaseListFeed.setParam('regionId', regionId);
            $scope.exPurchaseListRefresh();
        };
    });

    baseControllers.controller('exPurchaseCreateController', function (
        $scope, $filter, $$toast, $$chooseService, $$dataBase,
        $window, $$cutPictureService, $$dataCache, $state,
        $$chooseStandardService) {
        var config = $$dataBase.getAppConfig();
        $scope.buyOffer={};
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
        //选择参加特惠的商品
        $scope.chooseCargo = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cCargoType: 'all',
                    shopObjectId: 'all',
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
                cargoObjectId: buyOffer.cargo.objectId,
                cargoStandardObjectId: buyOffer.standard.objectId,
                regionId: buyOffer.regionId,
                eClassifyPattern: config.EClassifyPattern.Commercial,
            };
            if (!postContent.cargoObjectId)
                return $$toast('未设置商品', 'warning');
            if(!postContent.cargoStandardObjectId)
                return $$toast('未设置商品规格', 'warning');
            if(!postContent.startTime || !postContent.endTime)
                return $$toast('未设置时间', 'warning');
            if(!postContent.maxNum|| postContent.maxNum==0)
                return $$toast('未设置提供份数', 'warning');
            $$dataBase.postData('BackendCommercialCreateBuyOfferPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast('新建特惠成功', 'success');
                    $window.history.back();
                } else {
                    if (data.code = '400') {
                        $$toast('该商品正在参加特惠购','error')
                    }
                }
                console.log(data);
            }, function (err) {
                console.log(err);
            });
        }
    })
});