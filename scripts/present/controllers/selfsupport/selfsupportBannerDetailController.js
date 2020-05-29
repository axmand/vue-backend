/**
*   滑动广告详情
*   @author yellow date 2016/10/6
*   @module selfsupportBannerDetailController
*/
define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('selfsupportBannerDetailController', function ($scope, $location, $$upload, $$dataBase, $$cutPictureService, $$chooseService, $q, $$toast) {
        $scope.newBannerCargo = {};
        $scope.newBanner = {};

        $scope.$on('$ionicView.enter', function () {
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
                console.log($scope.cityList);
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });
        })

        //#region  选择banner展示商品
        $scope.getCargo = function () {
            if (!$scope.newBanner.regionId) {
                return $$toast('请先选择城市', 'error');
            }

            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialCargoListGet',
                feedParams: {
                    cargoType: 'all',
                    shopObjectId: 'all',
                    searchword: 'all',
                    regionId: $scope.newBanner.regionId,
                    eSearchPattern: '2',
                },
                completeCallback: function (dataArr) {
                    $scope.newBannerCargo = dataArr[0];

                    console.log(dataArr);
                    console.log('completeCallback has fired');
                },
            })
        }
        //#endregion


        //#region 上传banner图片

        $scope.startCutPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    console.log(data);
                    $scope.newBanner.faceImgUrl = data;
                }
            });
        }

        //#endregion

        //#region 创建banner

        $scope.bannerPost = function () {
            var postContent = {
                faceImgUrl: $scope.newBanner.faceImgUrl,
                cargoObjectId: $scope.newBannerCargo.objectId,
                regionId: $scope.newBanner.regionId
            };

            if (!postContent.faceImgUrl || !postContent.cargoObjectId) {
                return $$toast('数据不全', 'warning');
            }
            console.log(postContent);

            $$dataBase.postData('BackendCreateCommercialBannerPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $scope.newBannerCargo = {};
                    $scope.newBanner = {};
                    $$toast(data.content, 'success');
                    //成功后返回bannerlist
                    $location.url('/main/daily/banner');
                } else {
                    $$toast(data.content, 'error');
                }
                console.log(data);
            }, function (err) {
                console.log(err);
            })

        }


    });
});