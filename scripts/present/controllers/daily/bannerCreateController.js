define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('bannerCreateController', function ($scope,$location, $$upload, $$dataBase, $$cutPictureService, $$chooseService, $q, $$toast) {
        
        $scope.newBannerCargo = {};
        //新建banner
        $scope.newBanner = {};

        $scope.$on('$ionicView.enter', function () {
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            });
        });
        //
        $scope.getCargo = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cCargoType: 'all',
                    shopObjectId: 'all',
                    searchWord: 'all',
                    regionId: $scope.newBanner.regionId||'all',
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    $scope.newBannerCargo = dataArr[0];
                    console.log(dataArr);
                    console.log('completeCallback has fired');
                },
            })
        }
        //
        $scope.startCutPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    $scope.newBanner.headImgUrl = data;
                }
            });
        };
        //创建banner
        $scope.bannerPost = function () {
            var postContent = {
                headImgUrl: $scope.newBanner.headImgUrl,
                cargoObjectId: $scope.newBannerCargo.objectId,
                regionId: $scope.newBanner.regionId||"all",
            };
            if (!postContent.headImgUrl)
                return $$toast('未添加封面图片', 'warning');
            if (!postContent.cargoObjectId)
                return $$toast('未选择商品', 'warning');
            $$dataBase.postData('BackendCommercialCreateBannerPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $scope.newBannerCargo = {};
                    $scope.newBanner = {};
                    $$toast(data.content, 'success');
                    //成功后返回bannerlist
                    $location.url('/main/daily/banner');
                } else {
                    $$toast(data.content, 'error');
                }
            }, function (err) {
                $$toast(err.content, 'error');
            });
        }
    });
});