'use strict';
// ---------------------------------
// コントローラー BizMitSumoriCtrl
// ---------------------------------
app.controller('BizMitSumoriCtrl', ['$rootScope', '$scope', '$http', '$sce', '$window', '$state', 'SharedService', function($rootScope, $scope, $http, $sce, $window, $state, SharedService) {

    $scope.MessageList = [];
    $scope.content = {};
    $scope.record = {};
    $scope.record_meisai = {};

    $scope.meisaiCurentId = "";

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
                caption: '一覧表示に戻る',
                icon: 'glyphicon glyphicon-th-list',
                hint: 'Hint for item 2'
            }, {
                type: 'button',
                id: 'showMeisaiForm',
                caption: '見積入力に戻る',
                icon: 'fa fa-file-text',
                hint: 'Hint for item 3'
            }, {
                type: 'button',
                id: 'makeReport',
                caption: '見積書作成',
                icon: 'fa fa-print',
                hint: 'Hint for item 4'
            }
        ],
        onClick: function(event) {
            console.log('Target: ' + event.target, event);
            if (event.target == "return") {
                $state.go("home.portal");
            }
            if (event.target == "showIchiran") {
                // View制御(見積一覧)
                MitsumoriViewControl('1');
            }
            if (event.target == "showMeisaiForm") {
                // View制御(見積フォーム)
                MitsumoriViewControl('2');
            }
            // 見積書作成（angularjsでの操作）
            // if (event.target == "makeReport") {
                // $scope.record_meisai = w2ui['myMeisaiGrid'].records;
                // console.dir($scope.record_meisai);
                
                // var postData = MakeReportData();
                // $http.post('/report', postData, {responseType:'arraybuffer'}) 
                //     .success(function(response) {
                //         console.log("report ok");
                //         var file = new Blob([response], {type: 'application/pdf'});
                //         var fileURL = URL.createObjectURL(file);
                //         console.log(fileURL);
                //         var popupWindow = window.open(fileURL);
                //     })
                //     .error(function(data) {
                //     });
            // }
            // 見積書作成（ダイアログ選択）
            if (event.target == "makeReport") {
                $scope.record_meisai = w2ui['myMeisaiGrid'].records;
                // ダイアログに見積レコードを渡して表示する
                console.dir($scope.record);
                console.dir($scope.record_meisai);
                openPopup_report($scope.record, $scope.record_meisai);
            }
        }
    });

    $scope.init = function init() {
        console.log("BizMitSumoriCtrl init");
        // View制御
        MitsumoriViewControl('1');

        // ---------------------------------
        // メイングリッド表示
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
                // 選択行レコードの退避
                var record = w2ui['myMainGrid'].get(event.recid);
                $scope.record = record;
                
                // 明細カレント行のクリア
                $scope.meisaiCurentId = "";
                
                // View制御(見積フォーム)
                MitsumoriViewControl('3');
                
                // 見積フォーム/見積明細一覧の表示
                MakeForm(event, event.recid);
                MakeMeisaiGrid(event, event.recid, record.mitsu_id, "M");
                console.log(event);
            },
    		// ---------------------------------
    		// 編集ボタンクリック
    		// ---------------------------------
    		onEdit: function(event) {
                // 選択行レコードの退避
    			var id = w2ui['myMainGrid'].getSelection();
                var record = w2ui['myMainGrid'].get(id);
                $scope.record = record;
                
                // View制御(見積フォーム)
                MitsumoriViewControl('3');
                
                // 見積フォーム/見積明細一覧の表示
                MakeForm(event, id);
                MakeMeisaiGrid(event, id, record.mitsu_id, "M");
                console.log(event);
    		},
            
			// ---------------------------------
			// 追加ボタンクリック
			// ---------------------------------
			onAdd: function(event) {
                // View制御(見積フォーム)
                MitsumoriViewControl('3');
                
                // 空の見積フォーム/見積明細一覧の表示
                MakeForm(event, "");
                MakeMeisaiGrid(event, "DUMMY", record.mitsu_id);
			},
			// ---------------------------------
			// ソートリクエスト
			// ---------------------------------
            onSort: function(event) {
                console.log(event);
            },
        });

		// ---------------------------------
		// 見積フォーム表示
		// ---------------------------------
		function MakeForm(event, recid) {

			$("#myMitsumoriForm").w2destroy("myMitsumoriForm");
			$('#myMitsumoriForm').w2form({ 
		        name  : 'myMitsumoriForm',
		        url   : '/bizmitsumori',
		        recid : recid,
		        fields: [
		            { field: 'custmer_code', type: 'text', required: true, html: { caption: '顧客コード', attr: 'style="" maxlength="5" size="5"' }},
		            { field: 'name',  type: 'text', required: false, html: { caption: '顧客名', attr: 'disabled="disabled" style="" size="30"' }},
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
                //      $('.clsMitsumoriForm').find('#name').prop("disabled", true);
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
                        { type: 'button', id: 'TemplateBtn', caption: 'リストから追加', icon: 'fa fa-folder-open' },
                        { type: 'break' },
                        { type: 'button', id: 'UpLevel', caption: '上の階層へ', icon: 'fa fa-angle-double-left' },
                        { type: 'button', id: 'UpBtn', caption: '上へ', icon: 'fa fa-arrow-up' },
                        { type: 'button', id: 'DownBtn', caption: '下へ', icon: 'fa fa-arrow-down' },
                    ],
                    onClick: function (target, data) {
                        console.log(target);
                        // テンプレートから追加
                        if (target == 'TemplateBtn') {
                            var meisaiLength = w2ui['myMeisaiGrid'].records.length;
                            // 編集中の見積レコードを取得
                            var mitumori_rec = w2ui['myMainGrid'].get(recid);
                            console.dir(mitumori_rec);
                            // ダイアログに見積レコードを渡して表示する
                            openPopup_temp(mitumori_rec, meisaiLength);
                        }
                        // 行の移動
                        if (target == 'UpBtn' || target == 'DownBtn') {
                            var meirecs = w2ui['myMeisaiGrid'].records;
                            var idx1 = 0;
                            var idx2 = 0;
                            // 入れ替え
                            var meiArray = _.toArray(meirecs);
                            for (var idx = 0; idx < meiArray.length; idx++) {
                                // カレント行の判断
                                if (meiArray[idx].recid == $scope.meisaiCurentId) {
                                    // 行の入れ替え
                                    if (target == 'UpBtn') {
                                        if (idx - 1 >= 0) {
                                            var wk = meiArray[idx-1];
                                            meiArray[idx-1] = meiArray[idx];
                                            meiArray[idx] = wk;
                                            idx1 = idx;
                                            idx2 = idx - 1;
                                            break;
                                        }
                                    }
                                    if (target == 'DownBtn') {
                                        if (idx + 1 < meiArray.length) {
                                            var wk = meiArray[idx+1];
                                            meiArray[idx+1] = meiArray[idx];
                                            meiArray[idx] = wk;
                                            idx1 = idx;
                                            idx2 = idx + 1;
                                            break;
                                        }
                                    }
                                }
                            }
                            // SEQの振り直し
                            var idx = 1;
                            _.each(meiArray, function(meisai) {
                                meisai.seq = idx++;
                            });
                            // レコードへ戻す
                            w2ui['myMeisaiGrid'].records = meiArray;
                            // グリッドの再描画
                            w2ui['myMeisaiGrid'].refresh();
                            // カレント行をクリック
                            w2ui['myMeisaiGrid'].click($scope.meisaiCurentId);
                            // 更新
                            meirecs = w2ui['myMeisaiGrid'].records;
                            var postData1 = makeMitsumriMeisaiPostData($scope.record, meiArray[idx1]);
                            var postData2 = makeMitsumriMeisaiPostData($scope.record, meiArray[idx2]);
                            $.ajax({
                                type: "POST",
                                url: "/bizmitsumorimei",
                                data: postData1,
                                success: function(msg) {
                                    $.ajax({
                                        type: "POST",
                                        url: "/bizmitsumorimei",
                                        data: postData2,
                                        success: function(msg) {
                                        }
                                    });
                                }
                            });
                            
                        }
    
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
                        size: '40px',
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
                        field: 'mei_tanka',
                        caption: '単価',
                        size: '70px',
                        sortable: true
                    }, {
                        field: 'mei_suuryo',
                        caption: '数量',
                        size: '70px',
                        sortable: true
                    }, {
                        field: 'mei_tani',
                        caption: '単位',
                        size: '50px',
                        sortable: true
                    }, {
                        field: 'mei_kingaku',
                        caption: '金額',
                        size: '70px',
                        sortable: true
                    }, {
                        field: 'mei_bikou',
                        caption: '備考',
                        size: '200px',
                        sortable: true
                    },
                ],
                sortData: [
                    { field: 'seq', direction: 'asc' },
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
                    // View制御(見積明細フォーム)
                    MitsumoriViewControl('4');
                    
                    MakeMeisaiForm(event, event.recid, parent_id, parent_type);
                    // 現在の明細カレント行
                    $scope.meisaiCurentId = event.recid;
                },
    			// ---------------------------------
    			// 追加ボタンクリック
    			// ---------------------------------
    			onAdd: function(event) {
                    console.log("追加ボタンクリック");
                    // 明細カレント行のクリア
                    $scope.meisaiCurentId = "";                
                    
                    // View制御(見積明細フォーム)
                    MitsumoriViewControl('4');
                    
                    MakeMeisaiForm(event, "", parent_id, parent_type);
    			},
    			// ---------------------------------
    			// ソートリクエスト
    			// ---------------------------------
                onSort: function(event) {
                    console.log(event);
                    // 明細カレント行のクリア
                    $scope.meisaiCurentId = "";
                    // 行移動ボタン操作
                    if (event.field == 'seq') {
                        w2ui['myMeisaiGrid'].toolbar.enable('UpBtn');
                        w2ui['myMeisaiGrid'].toolbar.enable('DownBtn');
                    } else {
                        w2ui['myMeisaiGrid'].toolbar.disable('UpBtn');
                        w2ui['myMeisaiGrid'].toolbar.disable('DownBtn');
                    }
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
		            { field: 'seq', type: 'text', required: true, html: { caption: '順序', attr: 'disabled="disabled" style="" size="10"' }},
		            { field: 'mei_kikaku', type: 'text', required: true, html: { caption: '規格', attr: 'style="" size="30"' }},
		            { field: 'mei_tanka', type: 'text', required: true, html: { caption: '単価', attr: 'style="" size="30"' }},
		            { field: 'mei_suuryo', type: 'text', required: true, html: { caption: '数量', attr: 'style="" size="30"' }},
		            { field: 'mei_tani', type: 'text', required: true, html: { caption: '単位', attr: 'style="" size="30"' }},
		            { field: 'mei_kingaku', type: 'text', required: true, html: { caption: '金額', attr: 'disabled="disabled" style="" size="30"' }},
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
		        },
                onChange: function (event) {
                    // 単価・数量変更時の処理
                    if (event.target == 'mei_tanka' || event.target == 'mei_suuryo') {
                        var tanka = $('#mei_tanka').val().replace(/,/g,"");
                        var suuryo = $('#mei_suuryo').val().replace(/,/g,"");
                        var kingaku = tanka * suuryo;
                        w2ui['myMitsumoriMeisaiForm'].record['mei_tanka'] = numeral(tanka).format('0,0'); 
                        w2ui['myMitsumoriMeisaiForm'].record['mei_suuryo'] = numeral(suuryo).format('0,0'); 
                        w2ui['myMitsumoriMeisaiForm'].record['mei_kingaku'] = numeral(kingaku).format('0,0'); 
                        w2ui['myMitsumoriMeisaiForm'].refresh();	                    
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
	// 見積View制御
	// ---------------------------------
	function MitsumoriViewControl(viewMode) {
	    // 初期表示
	    if (viewMode == '1') {
            w2ui['toolbar'].disable('showIchiran');
            w2ui['toolbar'].disable('showMeisaiForm');
            w2ui['toolbar'].disable('makeReport');
            $(".clsMitsumoriIchiran").show();
            $(".clsMitsumoriDetail").hide();
            $(".clsMitsumoriForm").show();
            $(".clsMitsumoriMeisaiForm").hide();
	    }
	    // 見積一覧
	    if (viewMode == '2') {
            w2ui['toolbar'].disable('showMeisaiForm');
            $(".clsMitsumoriForm").show();
            $(".clsMitsumoriMeisaiForm").hide();
	    }
	    // 見積フォーム
	    if (viewMode == '3') {
            w2ui['toolbar'].enable('showIchiran');
            w2ui['toolbar'].enable('makeReport');
            $(".clsMitsumoriIchiran").hide();
            $(".clsMitsumoriDetail").show();
	    }

	    // 見積明細フォーム
	    if (viewMode == '4') {
            w2ui['toolbar'].enable('showMeisaiForm');
            w2ui['toolbar'].disable('showMitsumoriMeisaiForm');
            $(".clsMitsumoriForm").hide();
            $(".clsMitsumoriMeisaiForm").show();
	    }

	}
}]);