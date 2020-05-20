define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('bannerController', function ($scope,$$confirmModal,$$dataBase, $$toast) {
        //数据操作
        var bannerList = new $$dataBase.Feed({
            url: 'BackendCommercialBannerListGet',
            params: {
                regionId: 'all',
                pageNumber: 0,
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
                    $scope.bannerList = [];
                    $$toast('未查询到数据', 'error');
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    $$toast('未查询到更多数据', 'error');
                }
            },
        });
        //
        $scope.$on('$ionicView.beforeEnter', function () {
            //刷新bannerlist
            $scope.bannerListRefresh();
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            });
        });
        //获取类别
        var config = $$dataBase.getAppConfig();
        //选择城市
        $scope.cityChanged = function (regionId) {
            regionId = regionId || 'all';
            bannerList.setParam('regionId', regionId);
            $scope.bannerListRefresh();
        }
        //删除选中banner
        $scope.deleteBanner = function (banner) {
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
                });
            }, function () {
            });
        }
    });
});