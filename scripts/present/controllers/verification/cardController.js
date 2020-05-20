/**
*
*
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers.controller('cardController', function ($scope, $stateParams, $$bootstrapModal, $$toast, $$dataBase) {
        var userInfo = $$dataBase.getUserInfo();
        //获取储值卡
        var cardListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialCardListGet',
            scope: $scope,
            name: 'cardList',
            params: {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                searchWord: 'all',
                pageNumber: 0
            },
            autoShowInfinit: true,
            autoRefreshAndLoadMore: true,
            refreshCallback: {
                success: function (data) {
                   
                    console.log(data);
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data)
                }
            }
        });
        //
        cardListFeed.refresh();
        //创建储值卡modal
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumCreateCard.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.cardModal = modal;
        });
        //打开储值卡modal
        $scope.openCardModal = function () {
            $scope.cardModal.show();
        }
        //创建储值卡
        $scope.card = {
            eCardValue:300,
        }
        //创建储值卡
        $scope.createCard = function () {
            $$dataBase.getData('BackendCommercialCreateCardGet', {
                customerName: userInfo.phoneNumber,
                token: userInfo.token,
                eCardValue: $scope.card.eCardValue
            }).then(function (data) {
                $$toast(data.content, 'info');
            }).finally(function () {
                $scope.cardModal.hide();
                cardListFeed.refresh();
            });
        };
        //
    });
});