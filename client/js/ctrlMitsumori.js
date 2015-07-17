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

        $http.get('/bizmitsumori').success(function(data) {
            var cnt = 0;
            _.each(data, function(dat) {
                dat["recid"] = cnt++;
                // console.log("dat:" + angular.toJson(dat) );
            });
            // console.log("data length:" + data.length);

            $scope.mitsumoriList = data;

            // ---------------------------------
            // グリッド表示
            // ---------------------------------
            $("#myGrid1").w2destroy("myGrid1");
            $('#myGrid1').w2grid({
                name: 'myGrid1',
                show: {
                    toolbar: true,
                    footer: true,
		            toolbarAdd: true,
                },
                toolbar: {
                    items: [
                        { type: 'break' },
                        { type: 'button', id: 'mybutton', caption: 'ボタン', img: 'icon-folder' }
                    ],
                    onClick: function (target, data) {
                        console.log(target);
                    }
                },
                columns: [{
                        field: 'custmer_code',
                        caption: 'コード',
                        size: '60px',
                        sortable: true
                    }, {
                        field: 'name',
                        caption: '氏名',
                        size: '120px',
                        sortable: true
                    }, {
                        field: 'title',
                        caption: '見積名',
                        size: '200px',
                        sortable: true
                    }, {
                        field: 'mitsumori_date',
                        caption: '見積日',
                        size: '100px',
                        sortable: true
                    }, {
                        field: 'status',
                        caption: '状態',
                        size: '100px',
                        sortable: true
                    },
                ],
                records: $scope.mitsumoriList,
                // ---------------------------------
                // 行クリック
                // ---------------------------------
                onClick: function(event) {
                    // console.log(event);
                    MakeForm(event, $scope.mitsumoriList[event.recid]);
                    MakeMeisaiGrid(event, $scope.mitsumoriList[event.recid]);
                }
            });

        });

		// ---------------------------------
		// 明細グリッド表示
		// ---------------------------------
		function MakeMeisaiGrid(event, data) {
		    
            $("#myGrid3").w2destroy("myGrid3");
            $('#myGrid3').w2grid({
                name: 'myGrid3',
                show: {
                    toolbar: true,
                    footer: true,
		            toolbarAdd: true,
                },
                toolbar: {
                    items: [
                        { type: 'break' },
                        { type: 'button', id: 'mybutton', caption: 'ボタン', img: 'icon-folder' }
                    ],
                    onClick: function (target, data) {
                        console.log(target);
                    }
                },
                columns: [{
                        field: 'mei_title',
                        caption: 'タイトル',
                        size: '60px',
                        sortable: true
                    }, {
                        field: 'mei_bikou',
                        caption: '備考',
                        size: '200px',
                        sortable: true
                    },
                ],
                // records: $scope.mitsumoriList,
                // ---------------------------------
                // 行クリック
                // ---------------------------------
                onClick: function(event) {
                    console.log(event);
                }
            });
		}

		// ---------------------------------
		// フォーム表示
		// ---------------------------------
		function MakeForm(event, data) {
			// console.log(event);
			// console.log(data);
	
			$("#myGrid2").w2destroy("myGrid2");
			$('#myGrid2').w2form({ 
		        name  : 'myGrid2',
		        url   : 'mitsumori',
		        fields: [
		            { field: 'custmer_code', type: 'text', required: true, html: { caption: 'コード', attr: 'style="" maxlength="5" size="5"' }},
		            { field: 'name',  type: 'text', required: true, html: { caption: '氏名', attr: 'style="" size="30"' }},
		            { field: 'title',  type: 'text', required: false, html: { caption: 'かな', attr: 'style="" size="30"' }},
		            {
		            	field: 'mitsumori_date',
		            	type: 'date',
		            	required: false,
		            	options: {
		            		format: 'yyyy/mm/dd',
		            	},
		            	html: {
		            		caption: '見積日',
		            		attr: 'style="" size="10"'
		            	}
		            },
		            { field: 'status',  type: 'text', required: false, html: { caption: '状態', attr: 'style="" size="10"' }},
		        ],
		        record: data,
		        actions: {
		            reset: function () {
		                this.clear();
		            },
		            save: function () {
		                this.save(data, function (){
		                	console.log("save");
		                });
		            }
		        }
		    });
		    
			w2ui['myForm'].on('change', function (target, eventData) {
			    console.log(target);
			    console.log(eventData);
			});		
			w2ui['myForm'].on('load', function (target, eventData) {
			    console.log(target);
			    console.log(eventData);
			});		
			
		}
    };

}]);