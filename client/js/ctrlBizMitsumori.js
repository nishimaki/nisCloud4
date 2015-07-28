'use strict';
// ---------------------------------
// コントローラー BizMitSumoriCtrl
// ---------------------------------
app.controller('BizMitSumoriCtrl', ['$rootScope', '$scope', '$http', '$sce', '$window', '$state', 'SharedService', function($rootScope, $scope, $http, $sce, $window, $state, SharedService) {

    $scope.MessageList = [];
    $scope.content = {};
    $scope.record = {};
    $scope.record_meisai = {};

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
                id: 'makeReport',
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
                w2ui['toolbar'].disable('makeReport');
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
            // 見積書作成
            if (event.target == "makeReport") {
                
                $scope.record_meisai = w2ui['myMeisaiGrid'].records;
                console.dir($scope.record_meisai);
                
                var postData = MakeReportData();
                $http.post('/report', postData, {responseType:'arraybuffer'}) 
                    .success(function(response) {
                        console.log("report ok");
                        var file = new Blob([response], {type: 'application/pdf'});
                        var fileURL = URL.createObjectURL(file);
                        console.log(fileURL);
                        var popupWindow = window.open(fileURL);
                        
                        //@@@@@
                        // w2popup.load({ url: fileURL });
                        // w2popup.open({
                        //     title   : 'Popup Title HTML',
                        //     body    : fileURL,
                        //     buttons : 'Buttons HTML'
                        // });                        
                        //@@@@@

                        // $scope.content = $sce.trustAsResourceUrl(fileURL);
                        // $scope.content = fileURL
                        // $window.location = fileURL;
                    })
                    .error(function(data) {
                    });

            }
        }
    });

    $scope.init = function init() {
        console.log("BizMitSumoriCtrl init");
        w2ui['toolbar'].disable('showIchiran');
        w2ui['toolbar'].disable('showMeisaiForm');
        w2ui['toolbar'].disable('makeReport');

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
	            toolbarEdit: true,
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
                $scope.record = record;
                
                w2ui['toolbar'].enable('showIchiran');
                w2ui['toolbar'].enable('makeReport');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, event.recid);
                MakeMeisaiGrid(event, event.recid, record.mitsu_id, "M");
                console.log(event);
            },
    		// ---------------------------------
    		// 編集ボタンクリック
    		// ---------------------------------
    		onEdit: function(event) {
    			var id = w2ui['myMainGrid'].getSelection();
    			
                var record = w2ui['myMainGrid'].get(id);
                $scope.record = record;
                
                w2ui['toolbar'].enable('showIchiran');
                w2ui['toolbar'].enable('makeReport');
                $(".clsMitsumoriIchiran").hide();
                $(".clsMitsumoriDetail").show();
                MakeForm(event, id);
                MakeMeisaiGrid(event, id, record.mitsu_id, "M");
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
		            { field: 'mitsumori_no',  type: 'text', required: false, html: { caption: '見積番号', attr: 'style="" size="20"' }},
		            {
		            	field: 'mitsumori_kigen_date',
		            	type: 'date',
		            	required: false,
		            	options: {
		            		format: 'yyyy/mm/dd',
		            	},
		            	html: {
		            		caption: '見積期限',
		            		attr: 'style="" size="10"'
		            	}
		            },
		            { field: 'kesai_jyouken',  type: 'text', required: false, html: { caption: '決済条件', attr: 'style="" size="30"' }},
		            {
		            	field: 'nouki_date',
		            	type: 'date',
		            	required: false,
		            	options: {
		            		format: 'yyyy/mm/dd',
		            	},
		            	html: {
		            		caption: '納期',
		            		attr: 'style="" size="10"'
		            	}
		            },
		            { field: 'nounyuu_basyo',  type: 'text', required: false, html: { caption: '納入場所', attr: 'style="" size="30"' }},
		            { field: 'tantousya_name',  type: 'text', required: false, html: { caption: '担当者名', attr: 'style="" size="30"' }},
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
                // ロード完了
                // ---------------------------------
                onLoad: function(event) {
                    // $scope.record_meisai = w2ui['myMeisaiGrid'].records;
                    // console.dir($scope.record_meisai);
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
		            { field: 'mei_kikaku', type: 'text', required: true, html: { caption: '規格', attr: 'style="" size="30"' }},
		            { field: 'mei_tanka', type: 'text', required: true, html: { caption: '単価', attr: 'style="" size="30"' }},
		            { field: 'mei_suuryo', type: 'text', required: true, html: { caption: '数量', attr: 'style="" size="30"' }},
		            { field: 'mei_tani', type: 'text', required: true, html: { caption: '単位', attr: 'style="" size="30"' }},
		            { field: 'mei_kingaku', type: 'text', required: true, html: { caption: '金額', attr: 'style="" size="30"' }},
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
	// ---------------------------------
	// レポートデータ作成
	// ---------------------------------
	function MakeReportData() {
	    var reportData = {};

	    reportData["template"] = "default.html";
	    reportData["mitsumori_date"] = $scope.record.mitsumori_date;
	    reportData["mitsumori_no"] = $scope.record.mitsumori_no;
	    reportData["mitsumori_kingaku"] = '１２３，４５６，７８９円';
	    reportData["title"] = $scope.record.title;
	    reportData["name"] = $scope.record.name;
	    reportData["mitsumori_kigen_date"] = $scope.record.mitsumori_kigen_date;
	    reportData["kesai_jyouken"] = $scope.record.kesai_jyouken;
	    reportData["nouki_date"] = $scope.record.nouki_date;
	    reportData["nounyuu_basyo"] = $scope.record.nounyuu_basyo;
	    reportData["tantousya_name"] = $scope.record.tantousya_name;
	    reportData["mitsumori_meisai"] = $scope.record_meisai;

        // 明細行の移送
	    reportData["mitsumori_meisai"] = $scope.record_meisai;
        // 明細行の編集
        _.each(reportData.mitsumori_meisai, function(meisai) {
            if (meisai.mei_tanka != undefined && meisai.mei_tanka != null){
                var num = numeral().unformat(meisai.mei_tanka);
                if (w2utils.isInt(num)) {
                    meisai.mei_tanka = numeral(num).format('0,0');
                }
            }
            if (meisai.mei_suuryo != undefined && meisai.mei_suuryo != null){
                var num = numeral().unformat(meisai.mei_suuryo);
                if (w2utils.isInt(meisai.mei_suuryo)) {
                    meisai.mei_suuryo = numeral(num).format('0,0');
                }
            }
            if (meisai.mei_kingaku != undefined && meisai.mei_kingaku != null){
                var num = numeral().unformat(meisai.mei_kingaku);
                if (w2utils.isInt(meisai.mei_kingaku)) {
                    meisai.mei_kingaku = numeral(num).format('0,0');
                }
            }
        });
        // 空白明細行の追加
        var linecnt = $scope.record_meisai.length;
	    for (var idx = 15 ; idx > linecnt; idx--) {
	        reportData["mitsumori_meisai"].push({mei_title:"　"});
	    }

        // 合計行の作成
        var goukei_suu = 0;
        var goukei_kin = 0;
        _.each($scope.record_meisai, function(meisai) {
            if (meisai.mei_suuryo != undefined && meisai.mei_suuryo != null){
                var num = numeral().unformat(meisai.mei_suuryo);
                if (_.isNumber(num)) {
                    goukei_suu = goukei_suu + Number(num);
                }
            }
            if (meisai.mei_kingaku != undefined && meisai.mei_kingaku != null){
                var num = numeral().unformat(meisai.mei_kingaku);
                if (_.isNumber(num)) {
                    goukei_kin = goukei_kin + Number(num);
                }
            }
        });
	    reportData["goukei_suuryo"] = numeral(goukei_suu).format('0,0');
	    reportData["goukei_kingaku"] = numeral(goukei_kin).format('0,0');
        


	    return reportData;
	}

}]);