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
                id: 'showMeisaiForm',
                caption: '見積入力',
                icon: 'fa fa-file-text',
                hint: 'Hint for item 3'
            }, {
                type: 'button',
                id: 'pdf',
                caption: '見積書作成',
                icon: 'fa fa-print',
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
                w2ui['toolbar'].disable('showMeisaiForm');
                $(".clsMitsumoriIchiran").show();
                $(".clsMitsumoriDetail").hide();
                $(".clsMitsumoriForm").show();
                $(".clsMitsumoriMeisaiForm").hide();
            }
            if (event.target == "showMeisaiForm") {
                w2ui['toolbar'].disable('showMeisaiForm');
                $(".clsMitsumoriForm").show();
                $(".clsMitsumoriMeisaiForm").hide();
            }
        }
    });

    $scope.init = function init() {
        console.log("BizMitSumoriCtrl init");
        w2ui['toolbar'].disable('showIchiran');
        w2ui['toolbar'].disable('showMeisaiForm');

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
                    { field: 'status', caption: '状態', type: 'text' },
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
                var record = w2ui['myMainGrid'].get(event.recid);
                
                w2ui['toolbar'].enable('showIchiran');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, event.recid);
                MakeMeisaiGrid(event, event.recid, record.mitsu_id, "M");
                console.log(event);
            },
			// ---------------------------------
			// 追加ボタンクリック
			// ---------------------------------
			onAdd: function(event) {
                w2ui['toolbar'].enable('showIchiran');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, "");
                MakeMeisaiGrid(event, "DUMMY", record.mitsu_id);
			},
        });

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

// 			w2ui['myMitsumoriForm'].on('change', function (target, eventData) {
// 			    console.log(target);
// 			    console.log(eventData);
// 		        $('#name').prop("disabled", true);
// 			});		
// 			w2ui['myMitsumoriForm'].on('load', function (target, eventData) {
// 			    console.log("load");
// 		        $('#name').prop("disabled", true);
// 			});		
			w2ui['myMitsumoriForm'].on('refresh', function (target, eventData) {
			    console.log("refresh");
			    //顧客名を入力不可に設定
		        $('.clsMitsumoriForm').find('#name').prop("disabled", true);
			});		

		}
		// ---------------------------------
		// 明細グリッド表示
		// ---------------------------------
		function MakeMeisaiGrid(event, recid, parent_id, parent_type) {
		    
            $("#myMeisaiGrid").w2destroy("myMeisaiGrid");
            $('#myMeisaiGrid').w2grid({
                name: 'myMeisaiGrid',
                url: '/bizmitsumorimei',
                show: {
                    toolbar: true,
                    footer: true,
		            toolbarAdd: true,
                    selectColumn: false,
                    expandColumn: true,
                },
                toolbar: {
                    items: [
                        { type: 'break' },
                        { type: 'button', id: 'TemplateBtn', caption: 'テンプレートから追加', icon: 'fa fa-folder-open' },
                        { type: 'break' },
                        { type: 'button', id: 'TemplateBtn', caption: '上の階層へ', icon: 'fa fa-angle-double-left' },
                        { type: 'button', id: 'UpBtn', caption: '上へ', icon: 'fa fa-arrow-up' },
                        { type: 'button', id: 'UpBtn', caption: '下へ', icon: 'fa fa-arrow-down' },
                    ],
                    onClick: function (target, data) {
                        console.log(target);
                    }
                },
                columns: [
                    {
                        field: 'seq',
                        caption: '順序',
                        size: '40px',
                        sortable: true,
                    }, {
                        field: 'meisai_type',
                        caption: '種類',
                        size: '80px',
                        sortable: true,
                        render: function (record, index, col_index) {
                            var html = '';
                            var val = this.getCellValue(index, col_index);
                            if (val == 'M') {
                                html = '見出し';
                            }
                            if (val == 'S') {
                                html = '明細';
                            }
                            // for (var p in people) {
                            //     if (people[p].id == this.getCellValue(index, col_index)) html = people[p].text;
                            // }
                            return html;
                        }
                    }, {
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
                    parent_id: parent_id,
                    parent_type: parent_type,
                },
                // ---------------------------------
                // 行クリック
                // ---------------------------------
                onClick: function(event) {
                    w2ui['toolbar'].enable('showMeisaiForm');
                    w2ui['toolbar'].disable('showMitsumoriMeisaiForm');
                    $(".clsMitsumoriForm").hide();
                    $(".clsMitsumoriMeisaiForm").show();
                    MakeMeisaiForm(event, event.recid, parent_id, parent_type);
                },
    			// ---------------------------------
    			// 追加ボタンクリック
    			// ---------------------------------
    			onAdd: function(event) {
                    console.log("追加ボタンクリック");
                    w2ui['toolbar'].enable('showMeisaiForm');
                    w2ui['toolbar'].disable('showMitsumoriMeisaiForm');
                    $(".clsMitsumoriForm").hide();
                    $(".clsMitsumoriMeisaiForm").show();
                    MakeMeisaiForm(event, "", parent_id, parent_type);
    			},
            });
		}
		// ---------------------------------
		// 明細フォーム表示
		// ---------------------------------
		function MakeMeisaiForm(event, recid, parent_id, parent_type) {

			$("#myMitsumoriMeisaiForm").w2destroy("myMitsumoriMeisaiForm");
			$('#myMitsumoriMeisaiForm').w2form({ 
		        name  : 'myMitsumoriMeisaiForm',
		        url   : '/bizmitsumorimei',
		        recid : recid,
		        fields: [
		            { field: 'mei_title', type: 'text', required: true, html: { caption: '名称', attr: 'style="" size="30"' }},
                    { field: 'meisai_type', type: 'list', required: true, html: { caption: '種類', attr: 'style="" size="30"' },
                        options: { items: [{id:'M', text:'見出し'},{id:'S', text:'明細'}]}
                    },
		            { field: 'mei_bikou',  type: 'textarea', required: false, html: { caption: '備考', attr: 'style="height: 60px; width: 400px;" size="30" ' }},
		        ],
                postData: {
                    parent_id: parent_id,
                    parent_type: parent_type,
                },
		        actions: {
		            reset: function () {
		                this.clear();
		            },
		            save: function (target, data) {
		                this.save(function (event) {
		                	console.log("save");
							form2grid(recid, 'myMitsumoriMeisaiForm', 'myMeisaiGrid');
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