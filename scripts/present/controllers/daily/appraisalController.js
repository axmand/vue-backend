/**
*   评审活动
*/
define(['baseControllers'], function (baseControllers) {

    baseControllers
        .controller('appraisalController', function ($scope, $$dataBase, $$toast, $state, $$dataCache) {
            var appraisalFeed = new $$dataBase.Feed({
                url: 'BackendCommunityAppraisalListGet',
                params: {
                    searchWord: 'all',
                },
                scope: $scope,
                name: 'appraisalList',
                autoShowInfinit: true,
                autoRefreshAndLoadMore: true,
                refreshCallback: {
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (err) {
                        $scope.appraisalList = [];
                        if (!!err && err.code == '401') {
                            $$toast('未查询到数据', 'error');
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
            //
            $scope.$on('$ionicView.beforeEnter', function () {
                //刷新appraisalList
                $scope.appraisalListRefresh();
                //获取城市列表
                $$dataBase.getCityList().then(function (data) {
                    $scope.cityList = data;
                }, function () {
                    $$toast('获取城市列表失败', 'error');
                });
            });
            //评审状态字段对照
            $scope.appraisalState = {
                11: '预热状态（可申请）',
                21: '进行中',
                31: '提交结论中',
                41: '完成'
            }
            //关键词搜索
            $scope.searchwordGet = function (searchWord) {
                appraisalFeed.setParam('searchWord', searchWord || 'all');
                $scope.appraisalListRefresh();
            }
            //选择城市
            $scope.cityChanged = function (regionId) {
                regionId = regionId || 'all';
                appraisalFeed.setParam('regionId', regionId);
                $scope.appraisalListRefresh();
            }
            //创建评审
            $scope.gotoAppraisalDetail = function (appraisal) {
                $$dataCache.setData("appraisalDetail", appraisal, true);
                //2为编辑，1为新建
                $state.go('main.appraisalCreate', { model: !!appraisal ? 2 : 1 });
            }
            //查看评审详情(选择评审团)
            $scope.checkAppraisalDetail = function (appraisal) {
                $state.go('main.appraisalDetail', {
                    detail: JSON.stringify(appraisal)
                });
            }
            var userInfo = $$dataBase.getUserInfo();
            //删除评审
            $scope.deleteAappraisal = function (appraisal) {
                $$dataBase.getData('BackendCommuintyAppraisalApplyGet', {
                    customerName: userInfo.phoneNumber,
                    token: userInfo.token,
                    appraisalObjectId: appraisal.objectId,
                    pageNumber: 0
                }).then(function (data) {
                    console.log(data);
                    console.log(JSON.parse(data.content));
                })
            }
        })
        .controller('appraisalCreateController', function ($scope, $stateParams, $state, $$dataBase, $$chooseService, $q, $$toast, $filter, $$dataCache, $$cutPictureService) {

            $scope.model = !!$stateParams.model;
            var userInfo = $$dataBase.getUserInfo();
            $scope.appraisal = $$dataCache.getData("appraisalDetail") || {};

            $scope.$on('$ionicView.enter', function () {
                $$dataBase.getCityList().then(function (data) {
                    $scope.cityList = data;
                }, function () {
                    $$toast('获取城市列表失败', 'error');
                });
            });
            //起始时间
            $('#appraisalStartTime').flatpickr({
                enableTime: true,
                defaultDate: $scope.appraisal.startTime,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.appraisal.startTime = dateStr;
                }
            });
            //结束时间
            $('#appraisalEndTime').flatpickr({
                enableTime: true,
                defaultDate: $scope.appraisal.endTime,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.appraisal.endTime = dateStr;
                }
            });
            //16：9封面
            $scope.cutHeadImgUrl = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 0.5625,
                    cutPictureCallback: function (data) {
                        $scope.appraisal.headImgUrl = data;
                    }
                });
            }
            //1：1缩略图
            $scope.cutFaceImgUrl = function () {
                $$cutPictureService.show({
                    viewportWidth: 304,
                    currentScale: 1,
                    cutPictureCallback: function (data) {
                        $scope.appraisal.faceImgUrl = data;
                    }
                });
            }
            //选择店铺
            $scope.chooseShop = function () {
                $$chooseService.show({
                    minChooseNumber: 1,
                    maxChooseNumber: 1,
                    feedUrl: 'BackendCommunityShopListGet',
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
                        $scope.appraisal.shopObjectId = dataArr[0].objectId;
                        $scope.appraisal.shopName = dataArr[0].name;
                    },
                });
            };
            //选择商品
            $scope.chooseCargo = function () {
                if (!$scope.appraisal.shopObjectId)
                    return $$toast('请先选择店铺', 'warning');
                $$chooseService.show({
                    minChooseNumber: 1,
                    maxChooseNumber: 1,
                    feedUrl: 'BackendCommercialCargoListGet',
                    feedParams: {
                        cCargoType: 'all',
                        shopObjectId: $scope.appraisal.shopObjectId,
                        searchWord: 'all',
                        regionId: 'all',
                        eSearchPattern: '2',
                    },
                    completeCallback: function (dataArr) {
                        $scope.appraisal.cargoObjectId = dataArr[0].objectId;
                        $scope.appraisal.cargoName = dataArr[0].title;
                    },
                });
            };
            //提交新建
            $scope.commitCreate = function (appraisal) {
                var postContent = {
                    title: appraisal.title,
                    faceImgUrl: appraisal.faceImgUrl,
                    headImgUrl: appraisal.headImgUrl,
                    content: appraisal.content,
                    procedure: appraisal.procedure,
                    maxNum: appraisal.maxNum,
                    marketPrice: appraisal.marketPrice,
                    admissionPrice: appraisal.admissionPrice,
                    startTime: appraisal.startTime,
                    endTime: appraisal.endTime,
                    cargoObjectId: appraisal.cargoObjectId,
                    cargoName: appraisal.cargoName,
                    shopName: appraisal.shopName,
                    shopObjectId:appraisal.shopObjectId,
                };
                if (!postContent.title)
                    return $$toast('请填写评审标题', 'warning');
                if (!postContent.faceImgUrl)
                    return $$toast('请上传评审封面(16:9)', 'warning');
                if (!postContent.headImgUrl)
                    return $$toast('请上传评审缩略图(1:1)', 'warning');
                if (!postContent.content)
                    return $$toast('请填写评审活动简介', 'warning');
                if (!postContent.procedure)
                    return $$toast('请填写评审活动流程', 'warning');
                if (!postContent.maxNum)
                    return $$toast('请设置评审允许参与的最大人数', 'warning');
                if (!postContent.marketPrice)
                    return $$toast('请填写评审商品市场价', 'warning');
                if (!postContent.admissionPrice)
                    return $$toast('请设置评审活动参与费用(门票费用)', 'warning');
                if (!postContent.startTime)
                    return $$toast('请设置评审活动开始时间', 'warning');
                if (!postContent.endTime)
                    return $$toast('请设置评审活动结束时间', 'warning');
                if (!postContent.shopObjectId)
                    return $$toast('未选择评审店铺', 'warning');
                if (!postContent.cargoObjectId)
                    return $$toast('未选择评审商品', 'warning');
                //
                $$dataBase.postData('BackendCommunityCreateAppraisalPost', postContent).then(function (data) {
                    if(data.status=="ok")
                        $state.go('main.appraisal');
                    else
                        $$toast(data.content,'error');
                }, function (err) {
                    $$toast(err, 'error');
                });
            }
            //提交修改
            $scope.commitModify = function () {

            }
            //开启评审活动
            $scope.startAppraisal = function (appraisalObjectId) {
                $$dataBase.getData('BackendCommunityAppraisalStartGet', {
                    customerName: userInfo.phoneNumber,
                    token: userInfo.token,
                    appraisalObjectId: appraisalObjectId
                }).then(function (data) {
                    if (data.status == "ok"){
                        $$toast(data.content, 'success');
                        $state.go('main.appraisal');
                    }
                    else
                        $$toast(data.content,'error');
                }, function (err) {
                    $$toast(err,'error');
                });
            }
        })
        .controller('appraisalDetailController', function ($scope, $stateParams, $state, $$dataBase, $q, $$toast) {

            $scope.appraisalDetail = JSON.parse($stateParams.detail);
            console.log($scope.appraisalDetail);
            $scope.appraisalDetail.people = !!$scope.appraisalDetail.people ? $scope.appraisalDetail.people : [];
            //评审团成员键值对
            $scope.checkPeople = {};
            //将以前加入的评审团成员,打上 appraisalCheckedOld 样式
            $scope.appraisalDetail.people.forEach(function (currentValue, index) {
                $scope.checkPeople[currentValue.objectId] = true;
            });
            var _userInfo = $$dataBase.getUserInfo();
            var appraisalPersonFeed = new $$dataBase.Feed({
                url: 'BackendCommuintyAppraisalApplyGet',
                params: {
                    customerName: _userInfo.phoneNumber,
                    token: _userInfo.token,
                    appraisalObjectId: $scope.appraisalDetail.objectId,
                },
                scope: $scope,
                name: 'appraisalPerson',
                autoShowInfinit: true,
                autoRefreshAndLoadMore: true,
                refreshCallback: {
                    success: function (data) {
                        console.log(data);
                        //当前选中成员名单
                        $scope.selectedPerson = [];
                    },
                    error: function (err) {
                        console.log(err);
                        if (!!err && err.code == '401') {
                            $$toast('未查询到数据', 'error');
                            $scope.appraisalPerson = [];
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

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.appraisalPersonRefresh();
            })


            //选中评审团成员列表
            $scope.selectedPerson = [];

            //选中成员element,只能选中一个时，限制
            var targetEl = null;
            //选择评审团成员
            $scope.choosePerson = function (person, event) {
                console.log($scope.selectedPerson);
                var index = $scope.selectedPerson.indexOf(person.objectId);
                //一次只能选定一位评审团成员
                if ($scope.selectedPerson.length == 1 && index == -1) {
                    return true;
                }

                if (!!$scope.checkPeople[person.objectId]) {
                    return $$toast('该成员已经是评审团一员', 'warning');
                }

                targetEl = angular.element(event.target.parentElement);

                if (index == -1) {
                    targetEl.addClass('appraisalCheckedNew');
                    $scope.selectedPerson.push(person.objectId);
                } else {
                    $scope.selectedPerson.splice(index, 1);
                    targetEl.removeClass('appraisalCheckedNew');
                }
            }

            //提交评审团成员
            $scope.selectAppraisalPost = function () {
                if ($scope.selectedPerson.length == 0) {
                    return $$toast('尚未选中任何成员', 'warning');
                }
                if ($scope.appraisalDetail.maxNum <= $scope.appraisalDetail.people.length) {
                    return $$toast('评审团成员已满编', 'warning');
                }


                $$dataBase.getData('BackendCommunitySelectApplyGet', {
                    customerName: _userInfo.phoneNumber,
                    token: _userInfo.token,
                    appraisalObjectId: $scope.appraisalDetail.objectId,
                    applyCustomerObjectId: $scope.selectedPerson[0]
                }).then(function (data) {
                    console.log(data);
                    if (data.status == 'ok') {
                        $$toast(data.content, 'success');
                        //删除新增人员样式,红色圆勾
                        targetEl.removeClass('appraisalCheckedNew');
                        //加入评审团样式表中
                        $scope.checkPeople[$scope.selectedPerson[0]] = true;
                        $scope.appraisalDetail.people.push({
                            objectId: $scope.selectedPerson[0]
                        });
                        //提交成功后,清空已选择人员列表
                        $scope.selectedPerson = [];
                    } else {
                        $$toast(data.content, 'error');
                    }
                    console.log(data);
                }, function (err) {
                    console.log(err);
                });
            }

        });
});