/**
* 工具服务
*/
define(['baseServices', 'toastr', 'jquery', 'croppie'], function (baseServices, toastr, $, croppie) {
    //文件上传
    baseServices.factory('$$upload', function ($http, $q, Upload, $$commonDatabase,$$toast) {
        //图片文件上传
        //var _upload = function (file) {
        //    if (!file) return;
        //    return Upload.upload({
        //        url: $$commonDatabase.getConfig(postImageUrl),
        //        data: { file: file },
        //        method: 'POST',
        //    });
        //};
        //背景音乐上传
        var _uploadMusic = function (file) {
            console.log($$commonDatabase.getConfig('postMusicFileUrl'));
            if (!file) return;
            return Upload.upload({
                url: $$commonDatabase.getConfig('postMusicFileUrl'),
                data: { file: file },
                method: 'POST',
            });
        };
        //图片base64编码上传
        var _upLoadImg = function (postData) {
            var defer = $q.defer();
            $http.post($$commonDatabase.getConfig('postImageUrl'), postData).success(function (data) {
                if (data.status === 'ok')
                    defer.resolve(data.content);
                else
                    defer.reject(data.content);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        return {
            uploadMusic: _uploadMusic,
            upLoadImg: _upLoadImg,
            //upload: _upload,
        };
    });
    /**
    *   @example
    *   $$toast('这是要显示的消息'，type)
    *   type默认为warning,有success，info，warning，error4种
    */
    baseServices.factory('$$toast', function () {
        var _show = function (msg, type) {
            msg = msg || '空消息';
            toastr.options = {
                //"closeButton": true,
                "showDuration": "600",
                "positionClass": "toast-bottom-right",
                "timeOut": "4000",
            }
            toastr[type](msg)
        }
        return _show;
    });

    /*  
    *   公共确认框服务
    */
    baseServices.factory('$$confirmModal', function ($compile, $ionicBody, $q, $ionicTemplateLoader, $$toast) {
        
        //容器div
        var div = $('<div class="modal fade" tabindex="-1" role="dialog" id="pageWarnModal" style="width:100%;top:40px;z-index:999;"></div>');
        var div_modal = $('<div class="modal-dialog modal-sm"></div>');
        var div_content = $('<div class="modal-content"></div>');
        var div_c_h = $('<div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">警告</h4></div>');
        //
        var div_c_bd = $('<div class="modal-body"></div>');
        //
        var div_c_f = $('<div class="modal-footer"></div>');
        var div_c_cancel = $('<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>');
        var div_c_ok = $('<button type="button" class="btn btn-danger" >确定</button>');

        //组合
        div_c_f.append(div_c_cancel);
        div_c_f.append(div_c_ok);
        //
        div_content.append(div_c_h);
        div_content.append(div_c_bd);
        div_content.append(div_c_f);
        //
        div_modal.append(div_content);
        div.append(div_modal);
            
        var loadInstance;

        var _show = function (text) {
            console.log(div);
            var defer = $q.defer();
            if (!loadInstance)
                $ionicTemplateLoader.compile({
                   template: div,
                   appendTo: $ionicBody.get()
               }).then(function (self) {
                   loadInstance = this;
                   div_c_bd.text(text);
                   $('#pageWarnModal').modal('show');
                   div_c_ok[0].onclick = function (evt) {
                       $('#pageWarnModal').modal('hide');
                       defer.resolve(evt);
                   };
                   div_c_cancel[0].onclick = function (evt) {
                       $('#pageWarnModal').modal('hide');
                       defer.reject(evt);
                   };
               }, function (err) {
                   loadInstance = null;
                   $$toast(err,'error');
               });
            else {
                div_c_bd.text(text);
                $('#pageWarnModal').modal('show');
                div_c_ok[0].onclick = function (evt) {
                    $('#pageWarnModal').modal('hide');
                    defer.resolve(evt);
                };
                div_c_cancel[0].onclick = function (evt) {
                    $('#pageWarnModal').modal('hide');
                    defer.reject(evt);
                };
            }
            return defer.promise;
        }

        return _show;
    });

    //裁剪服务  
    /*
        opts参数
            viewportWidth {=string||number} : 裁剪框宽度 ,default 304px 
            currentScale  {=string||number}: 裁剪图片比例 ,default 0.5625 -- 宽:长 16:9 
            cutPictureCallback {function}:裁剪成功回调, 返回 服务器返回的 imgUrl 地址
    */
    baseServices.factory('$$cutPictureService', function ($compile,
       $rootScope,
       $ionicBody,
       $q,
       $ionicTemplateLoader,
       $$toast,
        $$upload) {

        //裁剪modal
        var element = null;
        var targetEl = null;
        //裁剪区域框element
        var viewportEl = null;

        var scope = $rootScope.$new(true);

        var _showModal = function (opts) {
            console.log(viewportEl);

            angular.extend(scope, {
                viewportWidth: 304,
                currentScale: 0.5625,
                cutScales: [],
                cutPictureCallback: angular.noop,
            }, opts || {});

            $ionicTemplateLoader.load('scripts/present/views/modal/mumCutModal.html').then(function (data) {
                element = $compile(data)(scope);
                $ionicBody.append(element);

                $uploadCrop = new Croppie(document.getElementById('upload-demo'), {
                    viewport: {
                        width: opts.viewportWidth,
                        height: opts.viewportWidth * opts.currentScale,
                        type: 'square'
                    },
                    boundary: {
                        width: 400,
                        height: 400 * opts.currentScale
                    },
                    showZoomer: false
                });
                viewportEl = document.getElementsByClassName('cr-viewport');
                targetEl = $('#cutPictureModal');

                targetEl.on('hidden.bs.modal', function () {

                    scope.cutPicFlag = true;
                    scope.uploadFlag = true;
                    $uploadCrop.destroy();
                    console.log('modal hidden');
                })

                targetEl.modal('show');
            });

            //下拉框更改图片比例后，刷新裁剪区域
            scope.scaleChange = function () {
                if (!!viewportEl) {
                    viewportEl[0].style['width'] = scope.viewportWidth + 'px';
                    viewportEl[0].style['height'] = scope.viewportWidth * scope.currentScale + 'px';
                }
            }

            //更改图片宽度后，刷新裁剪区域
            scope.$watch('viewportWidth', function (newValue) {
                if (viewportEl) {
                    viewportEl[0].style['width'] = newValue + 'px';
                    viewportEl[0].style['height'] = newValue * scope.currentScale + 'px';
                }
            })

            //裁剪按钮禁用flag
            scope.cutPicFlag = true;
            //上传按钮禁用flag
            scope.uploadFlag = true;
            scope.preUpload = function ($file) {
                if (!$file) {
                    return;
                } else {
                    console.log($file);
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $uploadCrop.bind({
                            url: e.target.result
                        });
                        $('.upload-demo').addClass('ready');
                        //可以裁剪
                        scope.cutPicFlag = false;
                    };
                    reader.readAsDataURL($file);
                }
            };

            var postImg = null;
            var _popupResult = function (result) {

                if (result.src) {
                    postImg = result.src;
                    $$toast('裁剪成功', 'success');
                }
            };

            //裁剪图片
            scope.clickEl = function () {
                $uploadCrop.result({
                    type: 'canvas',
                    size: {
                        width: 640,
                        height: 640 * scope.currentScale
                    }
                }).then(function (resp) {
                    console.log(scope.uploadFlag);
                    scope.uploadFlag = false;
                    console.log(scope.uploadFlag);
                    _popupResult({
                        src: resp
                    });
                });
            };

            //上传数据
            scope.upload = function ($file) {
                console.log(!scope.uploadFlag);
                if (!postImg || scope.uploadFlag) {
                    $$toast('未裁剪的图像不能上传', 'error');
                    return;
                };

                _uploadCutted().then(function (data) {
                    //得到返回的图片id,展示在视图中
                    opts.cutPictureCallback(data);
                    postImg = null;
                    targetEl.modal('hide');
                }, function (err) {
                    $$toast(err, 'error');
                });
            };

            //上传裁剪后的图片
            var _uploadCutted = function () {
                var defer = $q.defer();
                var postData = {
                    img: postImg,
                };
                //上传base64编码图片
                $$upload.upLoadImg(JSON.stringify(postData)).then(function (data) {
                    defer.resolve(data);
                    $$toast('图片上传成功', 'success');
                }, function (err) {
                    $$toast(err, 'error');
                });
                return defer.promise;
            };
        }
        return {
            show: _showModal
        }
    });
    
    //商品/商家选择modal
    baseServices.factory('$$chooseService', function ($compile,
       $rootScope,
       $ionicBody,
       $q,
       $ionicTemplateLoader,
       $$toast,
       $$dataBase) {

        var element = null;
        var targetEl = null;
        var scope = $rootScope.$new(true);

        var _showModal = function (opts) {
            angular.extend(scope, {
                minChooseNumber: 1,
                maxChooseNumber: 1,
                feedUrl: '',
                feedParams: {},
                completeCallback: angular.noop,
            }, opts || {});
            var feed = new $$dataBase.Feed({
                url: opts.feedUrl,
                params: opts.feedParams,
                scope: scope,
                name: 'dataList',
                autoShowInfinit: false,
                autoRefreshAndLoadMore: true,
            });
            scope.chosenData = [];
            $ionicTemplateLoader.load('scripts/present/views/modal/mumChooseModal.html').then(function (data) {
                element = $compile(data)(scope);
                $ionicBody.append(element);
                targetEl = $('#chooseModal');
                //关闭modal时,清空选中项
                targetEl.on('hide.bs.modal', function () {
                    targetEl = null;
                    scope.searchword = '';
                    scope.chosenData = [];
                });
                scope.dataListRefresh().finally(function () {
                    console.log(scope.dataList);
                    targetEl.modal('show');
                });
            });
            //总配置目录
            var config = $$dataBase.getAppConfig();
            //获取商品类别
            $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialCargo).then(function (data) {
                scope.$$commericalCargoType = data;
            });
            //店铺入驻形式对照
            $$dataBase.getCategory(config.EClassifyPattern.CategoryCommercialMerchant).then(function (data) {
                scope.$$cMerchantType = data;
            });
            //关键词检索
            scope.searchwordGet = function (searchword) {
                var _searchWord = searchword || 'all';
                console.log(_searchWord);
                feed.setParam('searchWord', _searchWord);
                scope.dataListRefresh().then(function (data) {
                    console.log(data);
                }, function (err) {
                    if (!!err && err.code == '401') {
                        scope.dataList = [];
                    }
                });
            }
            //类型检索
            scope.typeChanged = function (type, typeName) {
                console.log(type);
                feed.setParam(typeName, type || 'all');
                scope.dataListRefresh().then(function (data) {
                    console.log(data);
                }, function (err) {
                    if (!!err && err.code == '401') {
                        scope.dataList = [];
                    }
                })
            }
            //#endregion

            //添加到选中list中
            scope.addToChosenData = function (data) {
                if (scope.chosenData.indexOf(data) == -1) {
                    if (scope.chosenData.length >= scope.maxChooseNumber) {
                        $$toast('只能添加一个对象，删除后继续添加', 'error');
                    } else {
                        scope.chosenData.push(data);
                        $$toast('添加成功', 'success');
                    }
                } else {
                    $$toast('选中列表中已有重复项', 'warning');
                }
            }
            //从选中list中删除
            scope.deleteFromChosenData = function (data) {
                if (scope.chosenData.indexOf(data) == -1) {
                    return true;
                } else {
                    scope.chosenData.splice(scope.chosenData.indexOf(data), 1);
                    $$toast('移除选中项', 'success');
                }
            }
            //确定选中的内容
            scope.choose = function (dataArr) {
                var len = dataArr.length;
                if ((opts.minChooseNumber > len || len > opts.maxChooseNumber))
                    return $$toast('选择项数目不符合要求', 'warning');
                if (dataArr.length != 0) {
                    opts.completeCallback(dataArr);
                    targetEl.modal('hide');
                } else {
                    $$toast('还没有进行选择', 'warning');
                }
            }
        }
        return {
            show: _showModal
        }
    });
});