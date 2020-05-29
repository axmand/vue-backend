define(['baseControllers', 'simplecolor', 'jquery'], function (baseControllers, simplecolor, $) {
    baseControllers.controller('topicCreateController', function ($scope, $$upload, $$cutPictureService, $$confirmModal, $stateParams, $$dataBase, $$toast, $$chooseService, $$chooseShopService,$$chooseCargoService) {
        $scope.$on('$ionicView.enter', function () {
            //当前编辑的专题
            $scope.nowTopic = $stateParams.detail ? JSON.parse($stateParams.detail) : {};
            console.log($scope.nowTopic);
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
        })
        //获取config类别数据
        var config = $$dataBase.getAppConfig();

        //#region 编辑 详情页切换
        $scope.goToSide = function (index) {
            var _nextIndex = $scope.pageId + index;
            console.log(_nextIndex);
            console.log(!!$scope.nowTopic.content && _nextIndex > $scope.nowTopic.content.length);
            if (_nextIndex == 0) {
                return $$toast('已经是第一页', 'warning');
            } else if (!!$scope.nowTopic.content && _nextIndex > $scope.nowTopic.content.length) {
                //若当前页必填项都有值,且当前页为最后一页,询问是否新建详情页
                if (!$scope.currentTopicContent.faceImgUrl) {
                    return $$toast('当前详情页缺少必要信息', 'error');
                } else {
                    console.log('sssssssss');
                    //询问是否新建详情页
                    $$confirmModal('是否新建详情页').then(function () {
                        $scope.currentTopicContent = {};
                        //设置当前新建详情页的pageId
                        $scope.currentTopicContent.pageId = $scope.nowTopic.content.push($scope.currentTopicContent);
                        $scope.pageId = _nextIndex;
                    }, function () {
                    })
                }
            } else {
                //切换当前编辑 详情页内容
                $scope.currentTopicContent = $scope.nowTopic.content[_nextIndex - 1];
                $('#colorSelector').setColor($scope.currentTopicContent.textColor);
                $scope.pageId = _nextIndex;
            }

        }
        //#endregion

        //#region  枚举
        //专题模板枚举
        $scope.topicTemplete = [
            {
                name: '默认模板',
                uid: 0
            }
        ];

        //文字位置枚举
        $scope.textposition = [
            {
                name: '文字置顶',
                uid: 0
            }, {
                name: '文字居中',
                uid: 1
            }, {
                name: '文字置底',
                uid: 2
            }
        ];

        //跳转枚举
        $scope.hrefTypes = [
            {
                name: '商家',
                uid: '0'
            }, {
                name: '商品',
                uid: '1'
            }
        ];

        //获取商家类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.ECategory.CommercialShop).then(function (data) {
            $scope.$$commercialShopType = data;
        });

        //#endregion

        //#region  颜色选择器
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
                console.log("sssssss" + "color picked!#" + hex + " for input #" + element.attr('class'));
            }
        });
        //#endregion

        //#region 上传

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
            var scale = scale || 1.7777;

            $$cutPictureService.show({
                viewportWidth: 304,
                currentScale: scale,
                cutPictureCallback: function (data) {
                    if (scale == 0.75) {
                        //封面
                        $scope.nowTopic.faceImgUrl = data;
                    } else if (scale == 1.7777) {
                        //正文
                        $scope.currentTopicContent.faceImgUrl = data;
                    }
                }
            });
        }
        //#endregion    

        //#region  选择跳转
        $scope.openListModal = function (hrefType) {
            console.log(hrefType);
            if (hrefType < 0) {
                return $$toast('请选择跳转类型', 'error');
            };
            var hrefName = $scope.hrefTypes[hrefType].name;

            console.log(hrefName);
            if (hrefName == '商家') {
                $$chooseShopService.open(function (shop) {
                    $scope.currentTopicContent.targetObjectId = shop.objectId;
                })

            } else if (hrefName == '商品') {
                $$chooseShopService.open(function (shop) {
                    $$chooseCargoService.open(function (cargo) {
                        $scope.currentTopicContent.targetObjectId = cargo.objectId;
                    }, {
                        'shopObjectId': shop.objectId
                    })

                })

            };
        };

        //选择货架
        //$scope.chooseShelf = function () {
        //    $$chooseShelfService.open(function (shelf) {
        //        $scope.shelf = shelf;
        //        $scope.nowTopic.shelfObjectId = shelf.objectId;
        //        console.log($scope.shelf);
        //    })
        //}

        //创建专题
        $scope.topicPost = function () {
            var postContent = angular.copy($scope.nowTopic);

            console.log(postContent);

            if (!postContent.title || !postContent.faceImgUrl
                || postContent.content.length == 0 || !postContent.regionId || !postContent.shelfObjectId) {
                return $$toast('缺少必填信息', 'error');
            };
            if (postContent.templateType != 0 && !postContent.templateType) {
                return $$toast('缺少必填信息', 'error');
            }

            $$dataBase.postData('BackendCreateCommercialTopicPost', postContent)
            .then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            });
        };

        //修改专题
        $scope.modifyTopic = function () {
            if (!$scope.nowTopic.objectId)
                return $$toast('专题数据有误,无法修改', 'error');

            var postContent = angular.copy($scope.nowTopic);
            console.log(postContent);

            if (!postContent.title || !postContent.label || !postContent.faceImgUrl
                || postContent.content.length == 0 || !postContent.regionId) {
                return $$toast('缺少必填信息', 'error');
            };

            postContent.targetObjectId = postContent.objectId;
            postContent.modifyType = config.EModifyType.CommercialTopic;
            console.log(postContent);

            $$dataBase.postData('BackendCommonModifyDataPost', postContent).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        }
    });
})