/**
*   组织module
*   @author }{hk date 2014/10/13
*   @class compositemodule
*/
define(['baseModule', 'objutil'], function (basemodule, objutil) {

    var extend = objutil.extend;

    var _baseComposite = function (opts) {
        this.className = "baseComposite";
        basemodule.call(this, opts || {});
        this.modules = [];
    }

    extend(_baseComposite, basemodule);

    _baseComposite.prototype.add = function (module) {
        this.modules.push(module);
    }

    _baseComposite.prototype.configure = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].configure();
    }

    _baseComposite.prototype.createView = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createView();
    }

    _baseComposite.prototype.createService = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createService();
    }

    _baseComposite.prototype.createCommand = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createCommand();
    }

    _baseComposite.prototype.createModal = function () {
        for (var i = 0, len = this.modules.length; i < len; i++)
            this.modules[i].createModal();
    }

    // 初始化界面ui,保证domready
    _baseComposite.prototype._iniComposite = function () {
        this.configure();
        this.createView();
        this.createModal();
    }

    // 初始化功能api,需要在composite后执行
    _baseComposite.prototype._iniFunction = function () {
        this.createService();
        this.createCommand();
        this.cmds.onCreate(this.hook);
    }

    return _baseComposite;
});