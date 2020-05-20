//视频发布

define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('videoCreateController', function ($scope, $location, groupService, $$dataBase, $$toast, $stateParams, $$cutPictureService, $$confirmModal) {
        
        $scope.newCargo = {};
        $scope.newVideo = $stateParams.detail ? JSON.parse($stateParams.detail) : {};


        $scope.CommercialVideo = [
                { name: '全部分类', uid: 'all', }
        ];

        var config = $$dataBase.getAppConfig();

        $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialVideo).then(function (data) {
            $scope.CommercialVideo = data;
        });

        $scope.$on('$ionicView.enter', function () {
            $scope.EvideoSources = [
                { value: 1, name: '官方视频' },
                { value: 2, name: '合作者', },
                { value: 3, name: '用户' }
            ];
        });
        //上传图片
        $scope.startCutPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    console.log(data);
                    $scope.newVideo.headImgUrl = data;
                }
            });
        }
        //提交视频
        $scope.videoPost = function () {
            var postContent = angular.copy($scope.newVideo);
            if (!postContent.title || !postContent.videoUrl || !postContent.headImgUrl || !postContent.cVideoType)
                return $$toast('数据不全', 'error');
            //现阶段都是官方视频
            postContent.eVideoSource = 1;
            postContent.shopObjectId = $stateParams.shopObjectId;
            postContent.cargoObjectId = $stateParams.cargoObjectId;
            postContent.regionId = $stateParams.regionId;
            $$dataBase.postData('BackendCommercialCreateVideoPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast('添加视频成功', 'success');
                    $location.url('main/daily/video');
                } else {
                    $$toast(data.content,'error');
                }
            }, function (err) {
                $$toast(err.content, 'error');
            })
        };
        //修改视频
        $scope.modify = function () {
            var postContent = angular.copy($scope.newVideo);
            if (!postContent.title || !postContent.videoUrl || !postContent.headImgUrl || !postContent.cVideoType)
                return $$toast('数据不全', 'error');
            postContent.shopObjectId = $stateParams.shopObjectId;
            postContent.cargoObjectId = $stateParams.cargoObjectId;
            postContent.regionId = $stateParams.regionId;
            postContent.targetObjectId = $scope.newVideo.objectId;
            postContent.modifyType = config.EModifyType.CommercialVideo;
            delete postContent.objectId;
            delete postContent._id;
            delete postContent.guid;
            $$dataBase.postData('BackendCommonModifyDataPost', postContent).then(function (data) {
                console.log(data);
                if (data.status == 'ok') {
                    $$toast('修改视频成功', 'success');
                    $location.url('main/daily/video');
                } else {
                    $$toast(data.content, 'error');
                }
            }, function (err) {
                $$toast(data.content, 'error');
            })
        };
        //删除视频
        $scope.delete = function (targetObjectId) {
            $$confirmModal('是否删除当前视频？').then(function () {
                $scope.newVideo.targetObjectId = targetObjectId;
                $scope.newVideo.modifyType = config.EModifyType.ConvenienceVideo;
                delete $scope.newVideo.objectId;
                delete $scope.newVideo._id;
                delete $scope.newVideo.guid;
                $$dataBase.postData('BackendCommonDeleteDataPost', $scope.newVideo).then(function (data) {

                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $location.url('main/daily/video');
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