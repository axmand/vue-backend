define(['baseControllers', 'cdn'], function (baseControllers, cdn) {
    baseControllers.controller('publishVideoController', function ($scope,$state, $$dataBase, $q, $$toast, $$confirmModal) {
        var videoListFeed = new $$dataBase.Feed({
            url: 'BackendConvenienceVideoListGet',
            params: {
                videoType: 'all',
                searchword: 'all',
            },
            scope: $scope,
            name: 'videoList',
            autoShowInfinit: false,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
                        $scope.videoList = [];
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
        });

        $scope.$on('$ionicView.enter', function () {
            $scope.videoListRefresh();
        })

        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            var _searchWord = searchword || 'all';
            console.log(_searchWord);

            if ($event.keyCode === 13) {
                videoListFeed.setParam('searchword', _searchWord);
                $scope.videoListRefresh();
            }
        };

        //#endregion  

        //#region 视频操作
        //创建视频
        $scope.createVidoe = function () {
            if (!shopObjectId) return $$toast('请先选择店铺', 'warning');
            cargoObjectId = cargoObjectId || 'all';


            $state.go('main.videoCreate', {
                detail: '',
            });
        };

        //查看修改视频

        $scope.modifyVideo = function (video) {

            $state.go('main.videoCreate', {
                detail: JSON.stringify(video),
            });
        }

        //修改视频
        //#endregion

        //==============================
        //var userInfo = $$loginService.userInfo;

        //$scope.videoInfo = {};
        //$scope.videos = [];
        //$scope.modifyvideoDetail = {};
        //$scope.chosenVideo = {};

        ////#region 图片裁剪处理

        ////裁剪后的数据保存
        //var postImg;
        //var postImgType;
        //$scope.cut = function (type) {
        //    postImgType = type;

        //    $$cutPictureService.show({
        //        viewportWidth: 304,
        //        currentScale: 0.75,
        //        cutPictureCallback: function (data) {
        //            console.log(data);
        //            if (postImgType == 'new') {
        //                $scope.videoInfo.faceImgUrl = data;
        //            } else if (postImgType == 'modify') {
        //                console.log('modify picture');
        //                $scope.modifyvideoDetail.faceImgUrl = data;
        //            }
        //        }
        //    });
        //}

        //$scope.commit = function () {
        //    //检查
        //    if (!$scope.videoInfo.faceImgUrl || !$scope.videoInfo.title || !$scope.videoInfo.content || !$scope.videoInfo.videoUrl || !$scope.videoInfo.videoType) {
        //        $$toast("视频数据缺省，请检查字段", 'error');
        //    } else {
        //        $scope.videoInfo.authorObjectId = userInfo.objectId;
        //        $$cooperationService.postVideo($scope.videoInfo).then(function (data) {
        //            $$toast(data, 'success');
        //            $scope.videoInfo = {}; //情况数据
        //        }, function (err) {
        //            $$toast(err.content, 'error');
        //        });
        //    }
        //};
        ////删除选中视频
        //var deleteVideo = null;
        //$scope.deleteVideo = function (video) {
        //    if (!!video) {
        //        $$confirmModal(' 确认删除此视频？').then(function () {
        //            $$cooperationService.deleteVideo(video.objectId).then(function (data) {
        //                $scope.videos = [];
        //                $scope.getVideoList('all', 0);
        //                $$toast(data, 'success');
        //            }, function (error) {
        //                $$toast(error, 'error');
        //            });
        //        }, function (evt) {

        //        })
        //    }
        //}

        ////提交编辑视频
        //$scope.modifyVideoPost = function () {
        //    //检查
        //    if (!$scope.modifyvideoDetail.faceImgUrl || !$scope.modifyvideoDetail.title || !$scope.modifyvideoDetail.content || !$scope.modifyvideoDetail.videoUrl) {
        //        $$toast("视频数据缺省，请检查字段", 'error');
        //        return;
        //    } else {
        //        $$cooperationService.modifyVideo(currentEditVideo.objectId, $scope.modifyvideoDetail).then(function (data) {
        //            $$toast(data, 'success');
        //            $('#modifyVideoModal').modal('hide');
        //            $('#videoListModal').modal('hide');
        //        }, function (err) {
        //            $$toast(err, 'error');
        //        });
        //    };
        //};
        ////查看视频列表
        //$scope.openvideoListModal = function () {
        //    _videoNum = 0;
        //    $scope.videos = [];
        //    $('#videoListModal').modal('show');
        //    $scope.getVideoList(_videoNum);
        //};
        ////视频编辑
        //var currentEditVideo;
        //$scope.modifyVideo = function (video) {
        //    currentEditVideo = video;
        //    $scope.modifyvideoDetail = {
        //        title: video.title,
        //        content: video.content,
        //        videoUrl: video.videoUrl,
        //        faceImgUrl: video.faceImgUrl,
        //        copyright: video.copyright,
        //        videoType: video.videoType,
        //    };
        //    $('#modifyVideoModal').modal('show');
        //};
        ////获取视频列表
        //$scope.getVideoList = function (pageNumber) {
        //    $$cooperationService.getVideos("all", pageNumber).then(function (data) {
        //        $scope.videos = $scope.videos.concat(data);
        //    }, function (err) {
        //        $$toast(err,'error');
        //    })
        //};

        //$scope.getMoreVideo = function () {
        //    $scope.getVideoList(++_videoNum);
        //};

    });

});