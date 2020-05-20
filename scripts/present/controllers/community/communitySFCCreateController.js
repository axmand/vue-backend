/**
*
*   专题
*/
define(['baseControllers', 'simplecolor', 'jquery'], function (baseControllers, simplecolor, $) {
    baseControllers.controller('communitySFCCreateController', function (
        $scope, $$upload, $$chooseShelfService, $$cutPictureService, $$dataCache,
        $$confirmModal, $stateParams, $$dataBase, $$toast, $window, $$chooseService) {
        //当前的topic
        $scope.nowTopic = {};
        $scope.$on('$ionicView.enter', function () {
            console.log($stateParams);
            $scope.model = $stateParams.model;
            //当前编辑的专题
            $scope.nowTopic = $scope.model == 1 ? {} : $$dataCache.getData('SFCDetail');
            //当前编辑的详情页
            $scope.currentTopicContent = $scope.nowTopic.content ? $scope.nowTopic.content[0] : {};
            $scope.nowTopic.content && $('#colorSelector').setColor($scope.currentTopicContent.textColor);
            if (!$scope.nowTopic.content) {
                $scope.nowTopic.content = [];
                //设置当前新建详情页的pageId
                $scope.currentTopicContent.pageId = $scope.nowTopic.content.push($scope.currentTopicContent);
            }
            //当前编辑详情页页数
            $scope.pageId = 1;
            //获取城市列表
            $$dataBase.getCityList().then(function (data) {
                $scope.cityList = data;
            }, function () {
                $$toast('获取城市列表失败', 'error');
            });
        });
        //获取config类别数据
        var config = $$dataBase.getAppConfig();
        //下一页编辑
        $scope.goToSide = function (index) {
            var _nextIndex = $scope.pageId + index;
            if (_nextIndex == 0) {
                return $$toast('已经是第一页', 'warning');
            } else if (!!$scope.nowTopic.content && _nextIndex > $scope.nowTopic.content.length) {
                //若当前页必填项都有值,且当前页为最后一页,询问是否新建详情页
                if (!$scope.currentTopicContent.verticalImgUrl) {
                    return $$toast('当前详情页缺少必要信息', 'error');
                } else {
                    //询问是否新建详情页
                    $$confirmModal('是否新建详情页？').then(function () {
                        $scope.currentTopicContent = {};
                        //设置当前新建详情页的pageId
                        $scope.currentTopicContent.pageId = $scope.nowTopic.content.push($scope.currentTopicContent);
                        $scope.pageId = _nextIndex;
                    }, function () {

                    })
                };
            } else {
                //切换当前编辑 详情页内容
                $scope.currentTopicContent = $scope.nowTopic.content[_nextIndex - 1];
                $('#colorSelector').setColor($scope.currentTopicContent.textColor);
                $scope.pageId = _nextIndex;
            }
        }
        //专题模板枚举
        $scope.topicTemplete = [
            {
                name: '默认模板',
                value: 0
            }
        ];
        //文字位置枚举
        $scope.textposition = [
            {
                name: '文字置顶',
                value: 0
            }, {
                name: '文字居中',
                value: 1
            }, {
                name: '文字置底',
                value: 2
            }
        ];
        // 颜色选择器
        $('#colorSelector').simpleColor({
            livePreview: true,
            cellWidth: 10,
            cellHeight: 10,
            displayCSS: {
                width: '200px',
                'margin-top': '5px'
            },
            onSelect: function (hex, element) {
                $scope.currentTopicContent.textColor = '#' + hex;
            }
        });
        //上传背景音乐
        $scope.upLoadMusic = function ($file) {
            console.log($file);
            if (!$file) {
                $$toast('没有文件，无法上传', 'error');
                return;
            } else if ($file.size > 1 * 1024 * 1024) {
                $$toast('上传的音乐不能超过1m', 'error');
            } else {
                var progresssbar = document.getElementById('musicProgress');
                progresssbar.style.width = '0%';
                $$upload.uploadMusic($file).then(function (resp) {
                    var musicUrl = resp.data.filename;
                    $scope.nowTopic.musicUrl = musicUrl;
                    $$toast('背景音乐上传完成', 'success');
                }, function (resp) {
                    console.log(resp);
                    $$toast('上传失败', 'error');
                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    progresssbar.style.width = progressPercentage + '%';
                });
            };
        };
        //上传图片
        $scope.cutPicture = function (scale) {
            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: scale,
                cutPictureCallback: function (data) {
                    if (scale == 0.5625) {
                        //16:9封面
                        $scope.nowTopic.headImgUrl = data;
                    } else if (scale == 1.77) {
                        //子页面
                        $scope.currentTopicContent.verticalImgUrl = data;
                    } else if (scale == 1) {
                        //1:1封面
                        $scope.nowTopic.faceImgUrl = data;
                    }
                }
            });
        };
        //选择货架
        $scope.chooseShelf = function () {
            $$chooseShelfService.open(function (shelf) {
                $scope.nowTopic.shelfObjectId = shelf.objectId;
                $scope.nowTopic.shelfName = shelf.title;
            });
        };
        //选择店铺
        $scope.chooseShop = function () {
            $$chooseService.show({
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: 'BackendCommercialShopListGet',
                feedParams: {
                    cShopType: 'all',
                    cMerchantType: 'all',
                    eSearchPattern: 1,
                    regionId: 'all',
                    searchWord: 'all',
                    location: [0, 0],
                    eSortMethod: -1,
                    radius: 500000000,
                },
                completeCallback: function (dataArr) {
                    $scope.nowTopic.shopObjectId = dataArr[0].objectId;
                    $scope.nowTopic.shopName = dataArr[0].name;
                },
            });
        };
        //创建专题
        $scope.topicPost = function () {
            var postContent = angular.copy($scope.nowTopic);
            if (!postContent.title)
                return $$toast('未填专题标题', 'warning');
            if (!postContent.faceImgUrl)
                return $$toast('未设置专题封面(1:1)', 'warning');
            if (!postContent.headImgUrl)
                return $$toast('未设置专题封面(16:9)', 'warning');
            if (!postContent.content || postContent.content.length == 0)
                return $$toast('未设填写专题简述', 'warning');
            if (!postContent.regionId)
                postContent.regionId = "all";
            $$dataBase.postData('BackendCommercialCreateSFCPost', postContent).then(function (data) {
                if (data.status == 'ok') {
                    $$toast('创建成功', 'success');
                    $window.history.back();
                } else {
                    $$toast('创建失败', 'error');
                }
            }, function (err) {
                $$toast('创建失败', 'error');
            });
        };
        //修改专题
        $scope.modifyTopic = function () {
            if (!$scope.nowTopic.objectId)
                return $$toast('专题数据有误,无法修改', 'error');

            var postContent = angular.copy($scope.nowTopic);

            if (!postContent.title || !postContent.faceImgUrl
                || postContent.content.length == 0 || !postContent.regionId || !postContent.shelfObjectId || !postContent.shopObjectId) {
                return $$toast('缺少必填信息', 'error');
            };
            if (postContent.templateType != 0 && !postContent.templateType) {
                return $$toast('缺少必填信息', 'error');
            }

            postContent.targetObjectId = postContent.objectId;
            //postContent.modifyType = config.EModifyType.CommercialTopic;
            console.log(postContent);

            $$dataBase.postData('BackendCommonModifyDataPost', postContent).then(function (data) {
                console.log(data);
                if (data.status == 'ok') {
                    $$toast('修改成功', 'success');
                    $window.history.back();
                } else {
                    $$toast('修改失败', 'error');
                }
            }, function (err) {
                $$toast('修改失败', 'error');
                console.log(err);
            })
        }
        //删除专题
        $scope.deleteTopic = function (targetObjectId) {
            $$confirmModal('是否删除当前专题？').then(function () {
                var postContent = {
                    targetObjectId: targetObjectId,
                    //modifyType: config.EModifyType.CommercialTopic
                };
                $$dataBase.postData('BackendCommonDeleteDataPost', postContent).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast('删除成功', 'success');
                        $window.history.back();
                    }
                    else {
                        $$toast('删除失败', 'error');
                    }
                }, function (error) {
                    $$toast('删除失败', 'error');
                })
            }, function () { })
        }
    })
})