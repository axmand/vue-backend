/**
*   @author xr
*/
define(['baseControllers', 'cdn', 'jquery'], function (baseControllers, cdn, $) {
    //今日团购list controller
    baseControllers.controller('groupPurchaseController', function ($scope, $$confirmModal, $$toast, $$dataBase, $filter) {
        //groupPurchaseList数据操作
        var groupPurchaseFeed = new $$dataBase.Feed({
            url: 'BackendCommercialBuyGroupListGet',
            params: {
                regionId: 'all',
            },
            scope: $scope,
            name: 'groupPurchaseList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {

                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.groupPurchaseList = [];
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

        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新groupPurchaseList
            $scope.groupPurchaseListRefresh();
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
                console.log($scope.cityList);
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });
        })

        //选择城市
        $scope.cityChanged = function (regionId) {
            regionId = regionId || 'all';
            groupPurchaseFeed.setParam('regionId', regionId);
            $scope.groupPurchaseListRefresh();
        }

        //获取类别
        var config = $$dataBase.getAppConfig();

        //删除团购
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前团购？').then(function () {
                var content = {
                    targetObjectId: targetObjectId,
                    modifyType: config.EModifyType.CommercialBuyGroup,
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $scope.groupPurchaseListRefresh();
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
    });
    //今日团购创建 controller
    baseControllers.controller('groupPurchaseCreateController', function (
        $scope, $filter, $$toast, $$chooseService, $state,$$cutPictureService,
        $$dataBase, $window, $$dataCache, $$chooseStandardService) {
        //团购
        $scope.newGroupCargo = {};
        $scope.$on('$ionicView.enter', function () {
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });
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
        //选择参加团购的商品
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
        var appConfg=$$dataBase.getAppConfig();
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
                regionId: newGroupCargo.regionId||"all",
                eClassifyPattern: appConfg.EClassifyPattern.Commercial,
            };
            if (!postContent.cargoObjectId)
                return $$toast('请选择商品', 'warning');
            if (!postContent.cargoStandardObjectId)
                return $$toast('请选择规格','warning');
            if(!postContent.startTime || !postContent.endTime)
                return $$toast('请设置团购时间','warning');
            if(!postContent.maxNum)
                return $$toast('请设置库存数', 'warning');
            $$dataBase.postData('BackendCommercialCreateBuyGroupPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast(data.content, 'success');
                    $state.go('main.groupPurchase');
                }
            }, function (err) {
                $$toast(err.content, 'error');
            });
        }
    });
});