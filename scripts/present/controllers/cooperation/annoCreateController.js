define(['baseControllers', 'jquery', 'cdn', 'pluginService'], function (baseControllers, $, cdn, pluginService) {
    baseControllers.controller('annoCreateController', function ($scope, $$upload, $$dataBase, $stateParams, $$toast, $$confirmModal, $$cutPictureService, $state) {
        $scope.messageInfo = !!$stateParams.detail ? JSON.parse($stateParams.detail) : {};

        console.log($scope.messageInfo);
        var config = $$dataBase.getAppConfig();
        //#region 上传图片

        $scope.startCutPicture = function () {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: 0.5625,
                cutPictureCallback: function (data) {
                    console.log(data);
                    $scope.messageInfo.faceImgUrl = data;
                }
            });
        }

        //#endregion

        //提交
        $scope.commit = function () {
            var userInfo = $$dataBase.getUserInfo();

            if (!$scope.messageInfo.faceImgUrl || !$scope.messageInfo.content) {
                $$toast("请补全必填项", 'error');
                return;
            } else {
                $scope.messageInfo.authorObjectId = userInfo.objectId;//发布者objectId
                $scope.messageInfo.checkflag = true; //验证通过
                console.log($scope.messageInfo);
                $$dataBase.postData('BackendCreateConvenienceMessagePost', $scope.messageInfo).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.cooperationPublishAnno');
                    } else {
                        $$toast(data.content, 'error');
                    }
                    
                }, function (err) {
                    $$toast(err, 'error');
                });
            };
        };

        //提交编辑内容
        $scope.modifyAnnoPost = function () {
            //检查
            if (!$scope.messageInfo.faceImgUrl || !$scope.messageInfo.content) {
                $$toast("请补全必填项", 'error');
                return;
            } else {
                $scope.messageInfo.targetObjectId = $scope.messageInfo.objectId;
                $scope.messageInfo.modifyType = config.EModifyType.ConvenienceMessage;

                $$dataBase.postData('BackendModifyDataPost', $scope.messageInfo).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $state.go('main.cooperationPublishAnno');
                    } else {
                        $$toast(data.content, 'error');
                    }
                }, function (err) {
                    $$toast(err, 'error');
                });
            };
        };
        //删除选中公告
        $scope.deleteAnno = function (anno) {
            if (!!anno) {
                $$confirmModal(' 确认删除此公告？').then(function () {
                    var postContent = {
                        targetObjectId: anno.objectId,
                        modifyType: config.EModifyType.ConvenienceMessage
                    };

                    $$dataBase.postData('BackendDeleteDataPost', postContent)
                        .then(function (data) {
                            console.log(data);
                            if (data.status == 'ok') {
                                $$toast(data.content, 'success');
                                $state.go('main.cooperationPublishAnno');
                            } else {
                                $$toast(data.content, 'error');
                            }
                        }, function (err) {
                            $$toast(err, 'error');
                        });
                }, function (evt) {

                })
            };
        };
    });
});