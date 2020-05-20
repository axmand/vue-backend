/// <reference path="../../../vendor/jquery/dist/jquery.js" />
/// <reference path="../../../vendor/jquery/dist/jquery.min.js" />

/**
*
*
*/

define(['baseDirectives', 'jquery'], function (baseDirectives, jquery) {

    baseDirectives.contorller('mumEditor', [function () {

    }]).directive('mumEdit', [function () {

        return {
            restrice: 'EA',
            transclude: true,
            compile: function (element, attr) {
                element.attr('data-tap-disabled',true);
                //
                var preCompile = function ($scope, $element) {
                    
                    var editBox = $('<div ="true"></div>');
                    var buttonGroup1 = $('<div class="btn-group"></div>');
                    var buttonGroup2 = $('<div class="btn-group"></div>');
                    var buttonGroup3 = $('<div class="btn-group"></div>');
                    editBox.append(buttonGroup1);
                    editBox.append(buttonGroup2);
                    editBox.append(buttonGroup3);
                    //
                    var buttonImage = $('<button type="button" class="btn btn-default" aria-label="图标链接" ng-click="openPictureModal()"><span class="glyphicon glyphicon-picture" aria-hidden="true"></span></button>');
                };

                return { pre: preCompile };
            }

        }
    }]);

});