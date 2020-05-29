/**
*   自营商城商品管理controller
*   @authr yellow date 2016/10/3
*   @module selfsupportBannerController 
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    //
    baseControllers.controller('selfsupportBannerController', function ($scope, $$dataBase, $$toast, $state, $$dataCache) {
        //获取类别
        var config = $$dataBase.getAppConfig();
        //广告图list
        var bannerList = new $$dataBase.Feed({
            url: 'BackendCommercialBannerListGet',
            params: {
                regionId: 'all',
            },
            scope: $scope,
            name: 'bannerList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    console.log(err);
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.bannerList = [];
                    }
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
        //视图view
        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新bannerlist
            $scope.bannerListRefresh();
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
            bannerList.setParam('regionId', regionId);
            $scope.bannerListRefresh();
        }
        //删除选中banner
        $scope.deleteBanner = function (banner) {
            console.log(banner);
            $$confirmModal('是否删除当前banner？').then(function () {
                var content = {
                    targetObjectId: banner.objectId,
                    modifyType: config.EModifyType.CommericalBanner,
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $scope.bannerListRefresh();
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
});