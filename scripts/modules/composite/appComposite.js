/**
*   此类为资源整合类，提供各种资源组合调用
*   @author }{hk date 2014/10/13
*   @class webComposite
*/

define(['baseComposite', 'objutil'], function (baseComposite, objutil) {

    var extend = objutil.extend;

    var _appComposite = function (opts) {
        baseComposite.call(this, opts || {});
        this.className = 'appComposite';
    }

    extend(_appComposite, baseComposite);

    _appComposite.prototype.inilizationComposite = function () {
        this.constructor.__super__._iniComposite.call(this);
    }

    _appComposite.prototype.inilizationFunction = function () {
        this.constructor.__super__._iniFunction.call(this);
    }

    _appComposite.prototype.createView = function () {
        this.constructor.__super__.createView.call(this);
    }

    _appComposite.prototype.inilization = function () {
        //视图资源
        this.inilizationComposite();
        //其他资源
        this.inilizationFunction();
    }

    return _appComposite;
});