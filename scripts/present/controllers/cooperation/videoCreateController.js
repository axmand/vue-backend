//视频发布

define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('videoCreateController', function ($scope, $location, groupService, $$dataBase, $$toast, $stateParams, $$cutPictureService) {
        console.log($stateParams);
        $scope.newCargo = {};
        $scope.newVideo = $stateParams.detail ? JSON.parse($stateParams.detail) : {};
        console.log($scope.newVideo);
        var config = $$dataBase.getAppConfig();

        $scope.ECategory = config.ECategory;

        $scope.$on('$ionicView.enter', function () {
            console.log('entering');
            $scope.CommercialVideo = [
                    {
                        name: '全部分类',
                        value: 'all',
                    }
            ];

            console.log(config);
            $$dataBase.getCategory($scope.ECategory['CommercialVideo']).then(function (data) {
                console.log(data);
            }, function (err) {

            });
        })

        //#region 上传图片

        $scope.startCutPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    console.log(data);
                    $scope.newVideo.faceImgUrl = data;
                }
            });
        }

        //#endregion

        //提交视频
        $scope.videoPost = function () {
            var userInfo = $$dataBase.getUserInfo();

            var postContent = angular.copy($scope.newVideo);
            if (!postContent.title || !postContent.videoUrl ||
                !postContent.faceImgUrl || !postContent.videoType || !postContent.content)
                return $$toast('数据不全', 'error');

            console.log(postContent);
            postContent.authorObjectId = userInfo.objectId;

            $$dataBase.postData('BackendCreateConvenienceVideoPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast('添加视频成功', 'success');
                    $location.url('main/cooperation/publishVideo');
                } else {
                    $$toast(data.content);
                }
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        };

        //修改视频
        $scope.modifyVideoPost = function () {
            var userInfo = $$dataBase.getUserInfo();

            var postContent = angular.copy($scope.newVideo);
            if (!postContent.title || !postContent.videoUrl ||
                !postContent.faceImgUrl || !postContent.videoType || !postContent.content)
                return $$toast('数据不全', 'error');

            postContent.targetObjectId = $scope.newVideo.objectId;
            postData.modifyType = config.EModifyType.ConvenienceVideo;

            console.log(postContent);            

            $$dataBase.postData('BackendCreateConvenienceVideoPost', postContent)
            .then(function (data) {
                if (data.status == 'ok') {
                    $$toast('修改成功', 'success');
                    $location.url('main/cooperation/publishVideo');
                } else {
                    $$toast(data.content);
                }
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        }

    });
});