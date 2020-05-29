/**
*   商户获取对自己店铺的评论
*   @author  wk
*/
define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('reviewController', function ($scope, $$commercialService, configService,$$toast) {
        $scope.imgUrl = configService.urlRequest.imgUrl;        
        //进入时刷新
        var _num = 1
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                refreshReview();
            }
        });
        //换商店时刷新
        $scope.$on('shopChanged', function () {
            refreshReview();
        });

        var refreshReview = function () {
            _num = 1;
            $$commercialService.getShopReview(0).then(function (data) {
                $scope.reviews = data;
            }, function (error) {
                $scope.reviews = [];
                $$toast(error, "error");
            });
        }

        $scope.getReviewList = function (number) {
            $$commercialService.getShopReview(number).then(function (data) {
                $scope.reviews = $scope.reviews.concat(data);
            }, function (error) {
                $$toast(error, "error");
            });
        }
        //手动点击添加更多
        $scope.loadMore = function () {
            $scope.getReviewList(_num++);
        }
    });
});