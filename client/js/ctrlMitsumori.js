'use strict';
// ---------------------------------
// コントローラー MitSumoriCtrl
// ---------------------------------
app.controller('MitSumoriCtrl', ['$rootScope', '$scope', '$http', '$state', 'SharedService', function($rootScope, $scope, $http, $state, SharedService) {

    $scope.MessageList = [];
    $scope.custmerList = [];

    SharedService.SetTitle("見積入力");

    $("#toolbar").w2destroy("toolbar");
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            {
                type: 'button',
                id: 'return',
                caption: '戻る',
                icon: 'glyphicon glyphicon-menu-left',
                hint: 'Hint for item 1'
            }, {
                type: 'button',
                id: 'item2',
                caption: 'Item 2',
                icon: 'fa-wrench',
                hint: 'Hint for item 2'
            }, {
                type: 'button',
                id: 'item3',
                caption: 'Item 3',
                icon: 'fa-star-empty',
                hint: 'Hint for item 3'
            }, {
                type: 'button',
                id: 'item4',
                caption: 'Item 4',
                icon: 'fa-comments',
                hint: 'Hint for item 4'
            }, {
                type: 'button',
                id: 'item5',
                caption: 'Item 5',
                icon: 'fa-beaker',
                hint: 'Hint for item 5'
            }
        ],
        onClick: function(event) {
            console.log('Target: ' + event.target, event);
            if (event.target == "return") {
                $state.go("home.portal");
            }
        }
    });

    $scope.init = function init() {
        console.log("MitSumoriCtrl init");

        $http.get('/custmer').success(function(data) {
            var cnt = 0;
            _.each(data, function(dat) {
                dat["recid"] = cnt++;
                // console.log("dat:" + angular.toJson(dat) );
            });
            // console.log("data length:" + data.length);

            $scope.custmerList = data;

            // ---------------------------------
            // グリッド表示
            // ---------------------------------
            $("#myGrid1").w2destroy("myGrid1");
            $('#myGrid1').w2grid({
                name: 'myGrid1',
                show: {
                    toolbar: true,
                    footer: true,
                },
                columns: [{
                        field: 'code',
                        caption: 'code',
                        size: '80px',
                        sortable: true
                    }, {
                        field: 'name_sei',
                        caption: '姓',
                        size: '50px',
                        sortable: true
                    }, {
                        field: 'name_mei',
                        caption: '名',
                        size: '50px',
                        sortable: true
                    },
                ],
                records: $scope.custmerList,
                // ---------------------------------
                // 行クリック
                // ---------------------------------
                onClick: function(event) {
                    // console.log(event);
                    MakeForm(event, $scope.itemList[event.recid]);
                }
            });

        });
    };

}]);