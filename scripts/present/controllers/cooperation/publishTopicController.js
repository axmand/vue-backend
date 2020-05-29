/**
*   提供文字编辑
*   @module 专题发布controller
*/
define(['baseControllers', 'jquery', 'cdn', 'croppie', 'simplecolor', 'pluginService'], function (baseControllers, $, cdn, croppie, simplecolor, pluginService) {

    baseControllers.controller('publishTopicController', function ($q, $scope, $state,$$dataBase, $$toast, $filter, $$confirmModal) {
        var topicFeed = new $$dataBase.Feed({
            url: 'BackendCommercialTopicListGet',
            params: {
                searchword: 'all',
            },
            scope: $scope,
            name: 'topicList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    console.log($scope.topicList);
                    if (!!err && err.code == '401') {
                        $$toast('未查询到数据', 'error');
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

        //刷新专题列表
        $scope.$on('$ionicView.enter', function () {
            //刷新bannerlist
            $scope.topicListRefresh();
            console.log($$dataBase.getAppConfig());
        });


        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            var _searchWord = searchword || 'all';
            console.log(_searchWord);

            if ($event.keyCode === 13) {
                topicFeed.setParam('searchword', _searchWord);
                $scope.topicListRefresh();
            }
        };

        //#endregion      

        $scope.gotoTopicDetail = function (topic) {
            var _topicString = topic ? JSON.stringify(topic) : '';

            $state.go('main.topicCreate', { detail: _topicString });
        }



        //=================================
        ////编辑模式
        //var _editModal = false;
        //$scope.searchWord;

        ////#region 下拉框枚举
        //var appConfig = configService.appConfig;

        //$scope.textPositions = {}; //文字位置下拉
        //for (var element in appConfig.ETextPosition) {
        //    //专题模板设定
        //    $scope.textPositions[appConfig.ETextPosition[element]] = {
        //        name: $filter('typeFilter')(element),
        //        uid: appConfig.ETextPosition[element]
        //    };
        //};

        //$scope.templateTypes = {}; //专题板式
        //for (var element in appConfig.ETopicTemplate) {
        //    //专题模板设定
        //    $scope.templateTypes[appConfig.ETopicTemplate[element]] = {
        //        name: $filter('typeFilter')(element),
        //        uid: appConfig.ETopicTemplate[element]
        //    };
        //};

        //$scope.hrefTypes = {}; //跳转类型
        //for (var element in appConfig.ETopicHref) {
        //    //专题模板设定
        //    $scope.hrefTypes[appConfig.ETopicHref[element]] = {
        //        name: $filter('typeFilter')(element),
        //        uid: appConfig.ETopicHref[element]
        //    };
        //};

        ////#endregion
       
        ////#region 图片裁剪处理
        //var postImgType;
        //$scope.cut = function (type, scale) {
        //    postImgType = type;
        //    var scale = scale || 1.7777;

        //    $$cutPictureService.show({
        //        viewportWidth: 304,
        //        currentScale: scale,
        //        cutPictureCallback: function (data) {
        //            console.log(data);
        //            if (postImgType == 'newCover') {
        //                $scope.newTopic.faceImgUrl = data;
        //            } else if (postImgType == 'newContent') {
        //                $scope.currentNewTopicContent.faceImgUrl = data;
        //            } else if (postImgType == 'modifyContent') {
        //                $scope.currentModifyTopicContent.faceImgUrl = data;
        //            } else {
        //                $scope.moidfyTopicDetail.faceImgUrl = data;
        //            }
        //        }
        //    });
        //};


        ////#region 上传

        ////上传背景音乐
        //$scope.upLoadMusic = function ($file) {
        //    if (!$file) {
        //        $$toast('没有文件，无法上传', 'error');
        //        return;
        //    } else if ($file.size > 1 * 1024 * 1024) {
        //        $$toast('上传的音乐不能超过1m', 'error');
        //    } else {
        //        var progresssbar = document.getElementById('musicProgress');
        //        progresssbar.style.width = '0%';
        //        $$upload.uploadMusic($file).then(function (resp) {
        //            var musicUrl = resp.data.filename;
        //            if (_editModal) //编辑模式，设置编辑模式对象数据
        //                $scope.moidfyTopicDetail.musicUrl = musicUrl;
        //            else {  //新建模式
        //                $scope.newTopic.musicUrl = musicUrl;
        //            }
        //            $$toast('背景音乐上传完成', 'success');
        //        }, function (resp) {
        //            $$toast(resp, 'error');
        //        }, function (evt) {
        //            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //            progresssbar.style.width = progressPercentage + '%';
        //        });
        //    };
        //};


        ////#endregion

        ////#region 采集器

        ////新建
        //$('#newColor').simpleColor({
        //    livePreview: true,
        //    cellWidth: 9,
        //    cellHeight: 9,
        //    onSelect: function (hex, element) {
        //        $scope.currentColor = '#' + hex;
        //        console.log("color picked!#" + hex + " for input #" + element.attr('class'));
        //    }
        //});

        ////修改
        //$('#modifyColor').simpleColor({
        //    livePreview: true,
        //    cellWidth: 5,
        //    cellHeight: 5,
        //    onSelect: function (hex, element) {
        //        console.log($scope.modifyPageNum);
        //        $scope.currentModifyTopicContent.textColor = '#' + hex;
        //        console.log("sssssss" + "color picked!#" + hex + " for input #" + element.attr('class'));
        //    }
        //});

        ////#endregion

        ////#region 事件注册

        //$('#modifyTopicModal').on('hidden.bs.modal', function (e) {
        //    $scope.chosenCargos = [];
        //    $scope.chosenShops = [];
        //    //编辑模式关闭
        //    _editModal = false;
        //});

        ////#endregion
        
        //var _refreshNewTopic = function () {
        //    $scope.newTopic = {
        //        title: "",
        //        label: "",
        //        faceImgUrl: "",
        //        musicUrl: "",
        //        subTitle: "",
        //        templateType: 0,
        //        content: [{
        //            hrefType: 1,
        //            targetObjectId: "",
        //            pageId: 0,
        //            faceImgUrl: "",
        //            title: "",
        //            details: "",
        //            position: 0,
        //            textColor: "",
        //        }],
        //    };
        //    $scope.newPage = 0;
        //    $scope.currentNewTopicContent = $scope.newTopic.content[$scope.newPage];
        //}

        //$scope.newTopic;
        //$scope.newPage = 0;
        //$scope.currentNewTopicContent;
        
        //_refreshNewTopic();

        ////#region 模态框事件
        ////当前编辑对象，给定对象用于绑定结果商家、商品跳转id
        //$scope.currentShopGoodsModalObject;
        //$scope.openListModal = function (hrefType) {
        //    var eHref = $scope.hrefTypes[hrefType] || {};
        //    if (eHref.name === '店铺') {
        //        //打开店铺列表时，店铺分页置0
        //        _preShopNum = 0;
        //        $scope.shops = [];
        //        $$cooperationService.getCheckedShops("all", _preShopNum).then(function (data) {
        //            $scope.shops = $scope.shops.concat(data);
        //        }, function (err) {
        //            $$toast(err, 'error');
        //            $('#merchantListModal').modal('hide');
        //        });
        //        $('#merchantListModal').modal('show');
        //    } else if (eHref.name == '商品') {
        //        //打开商品列表时，商品分页置0
        //        _preCargoNum = 0;
        //        $scope.cargos = [];
        //        $$cooperationService.getAllCargos("all", _preCargoNum).then(function (data) {
        //            $scope.cargos = $scope.cargos.concat(data);
        //        }, function (err) {
        //            $$toast(err, 'error');
        //            $('#cargoListModal').modal('hide');
        //        });
        //        $('#cargoListModal').modal('show');
        //    };
        //};
        ////打开专题列表
        //$scope.openTopicListModal = function () {
        //    $scope.chosenTopic = {};
        //    $scope.topics = []; //清空专题列表
        //    $scope.getZhuantiList('all', 0);
        //    $('#zhuantiListModal').modal('show');
        //};
        ////开始编辑
        //var currentModifyTopic;
        //$scope.moidfyTopicDetail; 
        //$scope.currentModifyTopicContent;//编辑页对象
        //$scope.modifyPage = 0;   //编辑页码
        //$scope.modifyTopic = function (topic) {
        //    //开启编辑模式
        //    _editModal = true;
        //    //当前选中编辑的topic
        //    currentModifyTopic = topic;
        //    console.log(topic);
        //    //重置 topicDetial
        //    $scope.moidfyTopicDetail = {
        //        title: topic.title,
        //        label: topic.label,
        //        faceImgUrl: topic.faceImgUrl,
        //        musicUrl: topic.musicUrl,
        //        subTitle: topic.subTitle,
        //        templateType: topic.templateType,
        //        content: topic.content,
        //    };
        //    //固定从0开始
        //    $scope.modifyPage = 0;
        //    $scope.currentModifyTopicContent = $scope.moidfyTopicDetail.content[$scope.modifyPage];
        //    //同步颜色选择框
        //    $('#modifyColor').setColor($scope.currentModifyTopicContent.textColor);
        //    $('#modifyTopicModal').modal('show');
        //};
        ////#endregion
        //$scope.commit = function () {
        //    if ($scope.newTopic.content.length == 0 || !$scope.newTopic.title) {
        //        return $$toast('请补全专题内容','warning')
        //    }
        //    $$cooperationService.createTopic($scope.newTopic).then(function (data) {
        //        $$toast(data, 'success');
        //    }, function (err) {
        //        $$toast(err, "error");
        //    });
        //};
        ////编辑专题数据提交
        //$scope.modifyTopicPost = function () {
        //    //提交专题修改
        //    $$cooperationService.modifyTopic(currentModifyTopic.objectId, $scope.moidfyTopicDetail).then(function (data) {
        //            $$toast(data, 'success');
        //            $('#modifyTopicModal').modal('hide');
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};
        
        ////打开专题列表（所有专题）
        ////删除选中专题
        //$scope.deleteTopic = function (topic) {
        //    $$confirmModal("是否删除此专题").then(function () {
        //        $$cooperationService.deleteTopic(topic.objectId).then(function (data) {
        //            var _index = $scope.topics.indexOf(topic);
        //            $scope.topics.splice(_index, 1);
        //            $$toast('删除成功', 'success');
        //        }, function (err) {
        //            $$toast(err, 'error');
        //        });
        //    });
        //}
        ////下一页
        //$scope.nextPage = function () {
        //    if (_editModal) {//编辑模式
        //        var modifyPage = $scope.modifyPage + 1;
        //        if (!!$scope.moidfyTopicDetail.content[modifyPage]) {
        //            $scope.modifyPage++;
        //            $scope.currentModifyTopicContent = $scope.moidfyTopicDetail.content[$scope.modifyPage];
        //        } else
        //            $$confirmModal("不存在下一页，是否新增？").then(function () {
        //                $scope.modifyPage++;
        //                //模态框
        //                $scope.moidfyTopicDetail.content.push({
        //                    hrefType: 1,
        //                    targetObjectId: "",
        //                    pageId: $scope.modifyPage,
        //                    faceImgUrl: "",
        //                    title: "",
        //                    details: "",
        //                    position: 0,
        //                    textColor: "",
        //                });
        //                $scope.currentModifyTopicContent = $scope.moidfyTopicDetail.content[$scope.modifyPage];
        //            });
        //        $('#modifyColor').setColor($scope.currentModifyTopicContent.textColor);
        //    } else {//非编辑模式
        //        console.log($scope.newPage);
        //        var newPage = $scope.newPage + 1;
        //        if (!!$scope.newTopic.content[newPage]) {
        //            $scope.newPage++;
        //            $scope.currentNewTopicContent = $scope.newTopic.content[$scope.newPage];
        //        } else
        //            $$confirmModal("不存在下一页，是否新增？").then(function () {
        //                $scope.newPage++;
        //                $scope.newTopic.content.push({
        //                    hrefType: 1,
        //                    targetObjectId: "",
        //                    pageId: $scope.modifyPage,
        //                    faceImgUrl: "",
        //                    title: "",
        //                    details: "",
        //                    position: 0,
        //                    textColor: "",
        //                });
        //                $scope.currentNewTopicContent = $scope.newTopic.content[$scope.newPage];
        //            });
        //        $('#modifyColor').setColor($scope.currentNewTopicContent.textColor);
        //    }
        //};
        ////上一页
        //$scope.prevPage = function () {
        //    if (_editModal) {//编辑模式
        //        if ($scope.modifyPage == 0) {
        //            $$toast('已是第一页', 'warning');
        //            return;
        //        }
        //        $scope.modifyPage--;
        //        $scope.currentModifyTopicContent = $scope.moidfyTopicDetail.content[$scope.modifyPage];
        //        $('#modifyColor').setColor($scope.currentModifyTopicContent.textColor);
        //    } else {//非编辑模式
        //        if ($scope.newPage == 0) {
        //            $$toast('已是第一页', 'warning');
        //            return;
        //        }
        //        $scope.newPage--;
        //        $scope.currentNewTopicContent = $scope.newTopic.content[$scope.newPage];
        //    }
        //};

        ////获取全部(搜索)专题列表
        //var preTopicNum = -1;
        //$scope.getZhuantiList = function (searchWord, pageNumber) {
        //    console.log(pageNumber);
        //    searchWord = searchWord || 'all';
        //    //获取专题列表
        //    $$cooperationService.getTopics(searchWord, pageNumber).then(function (data) {
        //        $scope.topics = $scope.topics.concat(data);
        //        preTopicNum = pageNumber;
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};
        ////获取topics列表
        //$scope.topics = [];
        ////获取更多的专题
        //$scope.getMoreTopic = function (searchWord) {
        //    $scope.getZhuantiList(searchWord, ++preTopicNum);
        //};
        ////
        //var _preShopNum = 0;
        //$scope.shops = [];
        //$scope.chosenShop = {};
        //$scope.getShopList = function (searchword) {
        //    //打开店铺列表时，店铺分页置0
        //    _preShopNum = 0;
        //    $scope.shops = [];
        //    $$cooperationService.getCheckedShops(searchword, _preShopNum).then(function (data) {
        //        $scope.shops = $scope.shops.concat(data);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};
        ////店铺++
        //$scope.getMoreShop = function (searchWord) {
        //    _preShopNum++
        //    $$cooperationService.getCheckedShops(searchWord, _preShopNum).then(function (data) {
        //        $scope.shops = $scope.shops.concat(data);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};
        
        //var _preCargoNum = 0;
        //$scope.cargos = [];
        //$scope.chosenCargo = {};
        //$scope.getCargoList = function (searchword) {
        //    //打开商品列表时，商品分页置0
        //    _preCargoNum = 0;
        //    $scope.cargos = [];
        //    $$cooperationService.getAllCargos(searchword, _preCargoNum).then(function (data) {
        //        $scope.cargos = $scope.cargos.concat(data);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};
        //$scope.getMoreCargo = function (searchword) {
        //    _preCargoNum++;
        //    $$cooperationService.getAllCargos(searchword, _preCargoNum).then(function (data) {
        //        $scope.cargos = $scope.cargos.concat(data);
        //    }, function (err) {
        //        $$toast(err, 'error');
        //    });
        //};

        ////设置跳转objectId
        //$scope.setTargetObjectHref = function (chosen) {
        //    if (_editModal)
        //        $scope.currentModifyTopicContent.targetObjectId = chosen.objectId;
        //    else
        //        $scope.currentNewTopicContent.targetObjectId = chosen.objectId;
        //    $('#merchantListModal').modal('hide');
        //    $('#cargoListModal').modal('hide');
        //};

    });

});