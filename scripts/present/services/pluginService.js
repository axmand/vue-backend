/**
* 工具服务
*/
define(['baseServices', 'toastr', 'configService', 'jquery', 'croppie'], function (baseServices, toastr, configService, $, croppie) {
    //文件上传
    baseServices.factory('$$upload', function ($http, $q, configService, Upload) {
        //图片文件上传
        var _upload = function (file) {
            if (!file) return;
            return Upload.upload({
                url: configService.urlRequest.postImgFileUrl,
                data: { file: file },
                method: 'POST',
            });
        };
        //背景音乐上传
        var _uploadMusic = function (file) {
            if (!file) return;
            return Upload.upload({
                url: configService.urlRequest.postMusicFileUrl,
                data: { file: file },
                method: 'POST',
            });
        };
        //图片base64编码上传
        var _upLoadImg = function (postData) {
            var defer = $q.defer();
            $http.post(configService.urlRequest.postImageUrl, postData).success(function (data) {
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
            upload: _upload,
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
                    $$toast(err, 'error');
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
                        width: 500,
                        height: 500 * opts.currentScale
                    },
                    showZoomer: false
                });
                viewportEl = document.getElementsByClassName('cr-viewport');
                targetEl = $('#cutPictureModal');

                targetEl.on('hidden.bs.modal', function () {
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
                console.log('clicked');
                $uploadCrop.result({
                    type: 'canvas',
                    size: {
                        width: 640,
                        height: 640 * scope.currentScale
                    }
                }).then(function (resp) {
                    console.log('resulted');
                    _popupResult({
                        src: resp
                    });
                });
            };

            //上传数据
            scope.upload = function ($file) {
                if (!postImg) {
                    $$toast('未裁剪的图像不能上传', 'error');
                    return;
                };

                _uploadCutted().then(function (data) {
                    //得到返回的图片id,展示在视图中
                    opts.cutPictureCallback(data);
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
    })


    //      商品/商家选择modal
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
            })
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
                })

                scope.dataListRefresh().finally(function () {
                    console.log(scope.dataList);
                    targetEl.modal('show');
                });
            });

            //#region 检索
            //关键词检索
            scope.searchwordGet = function (searchword, $event) {
                var _searchWord = searchword || 'all';
                console.log(_searchWord);
                if ($event.keyCode === 13) {

                    feed.setParam('searchword', _searchWord);
                    scope.dataListRefresh().then(function (data) {
                        console.log(data);
                    }, function (err) {
                        if (!!err && err.code == '401') {
                            scope.dataList = [];
                        }
                    });
                }
               

            }

            //类型检索
            scope.typeChanged = function (type,typeName) {
                console.log(type);
                feed.setParam(typeName, type);
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
                var len = scope.chosenData.length;

                if (scope.chosenData.indexOf(data) == -1) {
                    if (len < opts.maxChooseNumber) {
                        scope.chosenData.push(data);
                        $$toast('添加成功', 'success');
                    } else {
                        $$toast('不能再选了', 'warning');
                    };
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