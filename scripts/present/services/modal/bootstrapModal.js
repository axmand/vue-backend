define(['baseServices'], function (baseServices) {
    baseServices
   .factory('$$bootstrapModal', [
       '$ionicBody',
       '$compile',
       '$ionicTemplateLoader',
   function ($ionicBody, $compile, $ionicTemplateLoader) {
       var BootstrapModal = function (el) {
           this.$el = $(el)
       }
       BootstrapModal.prototype.show = function () {
           if (this.$el.parent().length == 0) {
               $ionicBody.append(this.$el);
           }
           this.$el.modal('show');
       }
       BootstrapModal.prototype.hide = function () {
           this.$el.modal('hide');
       }
       BootstrapModal.prototype.remove = function () {
           this.$el.remove();
       }
       var createModal = function (templateString, options) {
           var scope = options.scope || $new(true);
           var el = $compile(templateString)(scope);
           return new BootstrapModal(el);
       }
       var fromTemplateUrl = function (url, options) {
           return $ionicTemplateLoader.load(url).then(function (templateString) {
               var modal = createModal(templateString, options || {});
               return modal;
           });
       }
       return {
           fromTemplateUrl:fromTemplateUrl,
       }
   }]);
})