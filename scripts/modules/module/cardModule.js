/**
*   @date 2015/11/28
*   @author yellow 
*   @description 商户管理模块
*/
define(['baseModule', 'objutil'], function (baseModule, objutil) {

    var extend = objutil.extend;

    var cardModule = function (opts) {
        baseModule.call(this, opts || {});
        this.className = "cardModule";
    }

    extend(cardModule, baseModule);

    cardModule.prototype.createView = function () {
        //用户组管理与财务分配
        this.addView('main.verificationCard', {
            url: '/verification/card',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/verification/card.html',
                    controller: 'cardController',
                }
            }
        });
        //用户组管理与财务分配
        this.addView('main.verificationTicket', {
            url: '/verification/ticket',
            views: {
                'menuContent': {
                    templateUrl: 'scripts/present/views/verification/ticket.html',
                    controller: 'ticketController',
                }
            }
        });
    };

    return cardModule;
});