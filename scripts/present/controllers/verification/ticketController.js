/**
*
*
*/
define(['baseControllers', 'cdn'], function (baseControllers, cdn) {

    baseControllers.controller('ticketController', function ($scope, $stateParams, $$bootstrapModal, $$toast, $$dataBase, $filter) {
        var userInfo = $$dataBase.getUserInfo();
        console.log(userInfo);


        //获取储值卡
        var ticketListFeed = new $$dataBase.Feed({
            url: 'BackendCommercialTicketListGet',
            scope: $scope,
            name: 'ticketList',
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
                    console.log($scope);
                }
            },
            loadMoreCallback: {
                success: function (data) {
                    console.log(data)
                }
            }
        });
        $scope.ticketListRefresh();

        //创建优惠券modal
        $$bootstrapModal.fromTemplateUrl('scripts/present/views/modal/mumCreateTicket.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.ticketModal = modal;           
        });
        //打开优惠券modal
        $scope.openTicketModal = function () {
            console.log($scope.ticketModal);
            $scope.ticketModal.show();
            $('#ticketEndTime').flatpickr({
                enableTime: true,
                onChange: function (selectedDates, dateStr, instance) {
                    $scope.ticket.endTime = dateStr;
                }
            });
        }     

        //创建储值卡
        $scope.ticket = {
            ruleMoney: 100,
            money:30,
        }
        $scope.createTicket = function () {
            $$dataBase.postData('BackendCommercialCreateTicketPost', {
                createrObjectId: userInfo.objectId,           
                ruleMoney: $scope.ticket.ruleMoney,
                money: $scope.ticket.money,
                endTime:$filter('date')($scope.ticket.endTime, 'yyyy/MM/dd HH:mm:ss')
            }).then(function (data) {
                console.log(data);
                $$toast(data.content, 'info');
            }).finally(function () {
                $scope.ticketModal.hide();
                $scope.ticketListRefresh();
            });
        }
    });

});