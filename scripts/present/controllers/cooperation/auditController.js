/**
*   便民信息审核
*   @author xr
*   @modify hk 2016/6/7
*/
define(['baseControllers'], function (baseControllers) {
    baseControllers.controller('auditController', function ($scope, $location, $$dataBase, $$bootstrapModal, $$toast, $filter, $$confirmModal) {
        var messageListFeed = new $$dataBase.Feed({
            url: 'BackendConvenienceMessageListGet',
            params: {
                messageType: 'all',
                subType: 'all',
                messageSortMethod: 1,
                waitAduit: 'true',
                searchword: 'all',
            },
            scope: $scope,
            name: 'messageList',
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    if (!!err && err.code == '401') {
                        $scope.messageList = [];
                    }
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


        //进入时刷新
        $scope.$on("$ionicView.enter", function () {
            if (arguments[0].targetScope == arguments[0].currentScope) {
                $scope.messageListRefresh();
            }
        });


        //获取工匠类别
        var config = $$dataBase.getAppConfig();
        console.log(config);
        $$dataBase.getCategory(config.ECategory.ConvenienceMessage).then(function (data) {
            $scope.$$convenienceMessageType = data;
        });

        //#region 检索条件店铺
        //关键词搜索
        $scope.searchwordGet = function (searchword, $event) {
            if ($event.keyCode === 13) {
                messageListFeed.setParam('searchword', searchword || 'all');
                $scope.messageListRefresh();
            }
        };

        //类别搜索
        $scope.chooseType = function (messageType) {
            console.log(messageType);
            messageListFeed.setParam('messageType', messageType || 'all');
            $scope.messageListRefresh();
        }

        var messageDetailModal = null;
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumMessageDetail.html', {
            scope: $scope
        }).then(function (modal) {
            messageDetailModal = modal;
        });

        $scope.openModal = function () {
            messageDetailModal.show();
        }

        $scope.closeModal = function () {
            messageDetailModal.hide();
        }

        $scope.$on('$destroy', function () {
            messageDetailModal.remove();
        });


        //字段说明
        var _text = {
            'alienName': '用户名',
            'content': '内容',
            'companyName': '公司名称',
            'date': '发布日期',
            'eduExperience': '教育经历',
            'jobAddress': '工作地址',
            'jobDescirbe': '工作描述',
            'jobIntension': '工作意向',
            'jobName': '招聘职位',
            'phone': '电话',
            'publishAddress': '发布地址',
            'selfDescribe': '自我介绍',
            'workExperience': '工作经验',
            'time': '发布时间',
        };
        //
        $scope.viewDetails = function (msg) {
            $scope.content = '';
            for (var element in msg) {
                if (element == 'messageType')
                    $scope.content += _text[element] + "  :  " + $filter('typeFilter')(msg[element]) + '<br/>';
                else
                    $scope.content += _text[element] + "  :  " + msg[element] + '<br/>';
            }
            $scope.openModal();
        };

        //审核通过
        $scope.msgAuditPass = function (msg, $index) {
            var content = {
                targetObjectId: msg.objectId,
                modifyType: config.EModifyType.ConvenienceMessage,
            };

            $$confirmModal('确认当前店铺通过审核?').then(function () {
                $$dataBase.postData('BackendSetPassPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $scope.messageList.splice($index, 1);
                    } else {
                        $$toast(data.content, 'error');
                    }

                    console.log(data);
                }, function (err) {
                    console.log(err);
                })
            })
        };

        //删除帖子
        var deleteMsg = null;
        $scope.delete = function (msg, $index) {
            var content = {
                targetObjectId: msg.objectId,
                modifyType: config.EModifyType.ConvenienceMessage,
            };

            $$confirmModal('确认删除当前帖子?').then(function () {
                $$dataBase.postData('BackendCommonDeleteDataPost', content).then(function (data) {
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        $scope.messageList.splice($index, 1);
                    } else {
                        $$toast(data.content, 'error');
                    }

                    console.log(data);
                }, function (err) {
                    console.log(err);
                })
            })
        };
    });
});