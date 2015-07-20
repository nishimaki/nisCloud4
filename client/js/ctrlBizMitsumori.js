'use strict';
// ---------------------------------
// コントローラー BizMitSumoriCtrl
// ---------------------------------
app.controller('BizMitSumoriCtrl', ['$rootScope', '$scope', '$http', '$state', 'SharedService', function($rootScope, $scope, $http, $state, SharedService) {

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
                caption: 'メニューに戻る',
                icon: 'glyphicon glyphicon-menu-left',
                hint: 'Hint for item 1'
            }, {
                type: 'button',
                id: 'showIchiran',
                caption: '一覧表示',
                icon: 'glyphicon glyphicon-th-list',
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
            if (event.target == "showIchiran") {
                w2ui['toolbar'].disable('showIchiran');
                $(".clsMitsumoriIchiran").show();
                $(".clsMitsumoriDetail").hide();
            }
        }
    });

    $scope.init = function init() {
        console.log("BizMitSumoriCtrl init");
        w2ui['toolbar'].disable('showIchiran');

        // ---------------------------------
        // グリッド表示
        // ---------------------------------
        $("#myMainGrid").w2destroy("myMainGrid");
        $('#myMainGrid').w2grid({
            name: 'myMainGrid',
            url: '/bizmitsumori',
            show: {
                toolbar: true,
                footer: true,
	            toolbarAdd: true,
	            toolbarSearch: true,
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
            searches : [
                    { field: 'custmer_code', caption: '顧客コード', type: 'text' },
                    { field: 'name', caption: '顧客名', type: 'text' },
                    { field: 'title', caption: '見積名', type: 'text' },
                ],
			sortData: [
				{ field: 'mitsu_id', direction: 'asc' },
				{ field: 'code', direction: 'asc' },
			],
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
            // ---------------------------------
            // データロード
            // ---------------------------------
            onLoad: function(event) {
            },
            // ---------------------------------
            // 行クリック
            // ---------------------------------
            onClick: function(event) {
                w2ui['toolbar'].enable('showIchiran');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, event.recid);
                MakeMeisaiGrid(event, event.recid);
            },
			// ---------------------------------
			// 追加ボタンクリック
			// ---------------------------------
			onAdd: function(event) {
                w2ui['toolbar'].enable('showIchiran');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, "");
                MakeMeisaiGrid(event, "");
			},
        });


		// ---------------------------------
		// 明細グリッド表示
		// ---------------------------------
		function MakeMeisaiGrid(event, recid) {
		    
            $("#myMeisaiGrid").w2destroy("myMeisaiGrid");
            $('#myMeisaiGrid').w2grid({
                name: 'myMeisaiGrid',
                url: '/bizmitsumorimei',
                show: {
                    toolbar: true,
                    footer: true,
		            toolbarAdd: true,
                    selectColumn: true,
                    expandColumn: true
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
                        size: '200px',
                        sortable: true
                    }, {
                        field: 'mei_bikou',
                        caption: '備考',
                        size: '200px',
                        sortable: true
                    },
                ],
                postData: {
                    parent_id: recid,
                },
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
		function MakeForm(event, recid) {

			$("#myMitsumoriForm").w2destroy("myMitsumoriForm");
			$('#myMitsumoriForm').w2form({ 
		        name  : 'myMitsumoriForm',
		        url   : '/bizmitsumori',
		        recid : recid,
		        fields: [
		            { field: 'custmer_code', type: 'text', required: true, html: { caption: '顧客コード', attr: 'style="" maxlength="5" size="5"' }},
		            { field: 'name',  type: 'text', required: false, html: { caption: '顧客名', attr: 'style="" size="30"' }},
		            { field: 'title',  type: 'text', required: false, html: { caption: '見積名', attr: 'style="" size="30"' }},
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
		        actions: {
		            reset: function () {
		                this.clear();
		            },
		            save: function (target, data) {
		                this.save(function (event) {
		                	console.log("save");
							form2grid(recid, 'myMitsumoriForm', 'myMainGrid');
		                });
		            }
		        }
		    });

// 			w2ui['myForm'].on('change', function (target, eventData) {
// 			    console.log(target);
// 			    console.log(eventData);
// 			});		
// 			w2ui['myForm'].on('load', function (target, eventData) {
// 			    console.log(target);
// 			    console.log(eventData);
// 			});		
			
		}
    };

}]);