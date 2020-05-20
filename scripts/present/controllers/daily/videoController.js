//视频发布
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('videoController', function ($scope, $$chooseService, $$dataBase, $$toast, $state) {
        //视频列表获取
        var videoListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialVideoListGet',
            params: {
                shopObjectId: '',
                cargoObjectId: 'all',
                cVideoType: 'all',
            },
            scope: $scope,
            name: 'videoList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    $scope.videoList = [];
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
        $scope.$on('$ionicView.enter', function () {
            if (!!$scope.newShop) {
                $scope.videoListRefresh();
            }
        })
        //检索
        $scope.typeChange = function (typeVaule, type) {
            typeVaule = typeVaule || 'all';
            videoListFeed.setParam(type, typeVaule);
            if (!!$scope.newShop) {
                $scope.videoListRefresh();
            }
        }
        //选择查看的商家
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialShopListGet',
                feedParams: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    regionId:'all',
                    searchWord: 'all',
                    location: [0, 0],
                    eSortMethod: -1,
                    radius: 500000000,
                },
                completeCallback: function (dataArr) {
                    $scope.newShop = dataArr[0];
                    videoListFeed.setParam('shopObjectId', $scope.newShop.objectId);
                },
            })
        };
        //选择展示商品
        $scope.getCargo = function () {
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
                    $scope.newCargo = dataArr[0];
                    videoListFeed.setParam('cargoObjectId', $scope.newCargo.objectId);
                    console.log($scope.newCargo);
                    console.log('completeCallback has fired');
                },
            })
        };
        //创建视频
        $scope.createVidoe = function (shopObjectId, cargoObjectId, regionId) {
            if (!shopObjectId) return $$toast('请先选择店铺', 'warning');
            cargoObjectId = cargoObjectId || 'all';
            $state.go('main.videoCreate', {
                shopObjectId: shopObjectId,
                cargoObjectId: cargoObjectId,
                detail: '',
                regionId: regionId
            });
        };
        //查看修改视频
        $scope.modifyVideo = function (shopObjectId, cargoObjectId,video) {
            if (!shopObjectId)
                return $$toast('请先选择店铺', 'warning');
            cargoObjectId = cargoObjectId || 'all';
            $state.go('main.videoCreate', {
                shopObjectId: shopObjectId,
                cargoObjectId: cargoObjectId,
                detail: JSON.stringify(video),
                regionId:video.regionId
            });
        }
    });

});