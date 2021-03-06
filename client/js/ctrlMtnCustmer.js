	'use strict';
	// ---------------------------------
	// コントローラー MtnCustmerCtrl
	// ---------------------------------
	app.controller('MtnCustmerCtrl', function($rootScope, $scope, $http, $controller, SharedService) {

		$scope.init = function init() {
			console.log("MtnCustmerCtrl init");

			SharedService.SetTitle("顧客メンテナンス");

			// ---------------------------------
			// グリッド表示
			// ---------------------------------
			$("#myGridCust").w2destroy("myGridCust");
			$('#myGridCust').w2grid({
				name: 'myGridCust',
	            url: '/custmer',
		        show: { 
		            toolbar: true,
		            footer: true,
		            toolbarAdd: true,
		            toolbarDelete: true,
		            toolbarEdit: true
		        },
				columns: [{
						field: 'code',
						caption: 'コード',
						size: '50px',
						sortable: true
	                }, {
						field: 'name',
						caption: '氏名',
						size: '100px',
						sortable: true
	                }, {
						field: 'kananame',
						caption: 'かな',
						size: '120px',
						sortable: true
	                }, {
						field: 'birthday',
						caption: '誕生日',
						size: '80px',
						sortable: true
	                }, {
						field: 'yuubin_no',
						caption: '郵便番号',
						size: '70px',
						sortable: true
	                }, {
						field: 'addr',
						caption: '住所',
						size: '200px',
						sortable: true
    	            },
				],
				sortData: [
					{ field: 'code', direction: 'asc' },
				],
				// ---------------------------------
				// 行クリック
				// ---------------------------------
				onClick: function(event) {
					// console.log(event);
					MakeForm(event, event.recid);
				},
				// ---------------------------------
				// 追加ボタンクリック
				// ---------------------------------
				onAdd: function(event) {
					MakeForm(event, "");
				},
				// ---------------------------------
				// 削除ボタンクリック後
				// ---------------------------------
				onDeleted: function(event) {
					console.log(event);
					$("#myForm").w2destroy("myForm");
				}
			});
		};

		// ---------------------------------
		// フォーム表示
		// ---------------------------------
		function MakeForm(event, recid) {
			// console.log(event);

			$("#myForm").w2destroy("myForm");
			$('#myForm').w2form({ 
		        name  : 'myForm',
		        url   : '/custmer',
		        recid : recid,
		        fields: [
		            { field: 'code', type: 'text', required: true, html: { caption: 'コード', attr: 'style="" maxlength="5" size="5"' }},
		            { field: 'name',  type: 'text', required: true, html: { caption: '氏名', attr: 'style="" size="30"' }},
		            { field: 'kananame',  type: 'text', required: false, html: { caption: 'かな', attr: 'style="" size="30"' }},
		            {
		            	field: 'birthday',
		            	type: 'date',
		            	required: false,
		            	options: {
		            		format: 'yyyy/mm/dd',
		            	},
		            	html: {
		            		caption: '誕生日',
		            		attr: 'style="" size="10"'
		            	}
		            },
		            { field: 'yuubin_no',  type: 'text', required: false, html: { caption: '郵便番号', attr: 'style="" maxlength="8" size="8"' }},
		            { field: 'addr',  type: 'text', required: false, html: { caption: '住所', attr: 'style="" size="40"' }},
		            { field: 'tel',  type: 'text', required: false, html: { caption: '電話番号', attr: 'style="" size="12"' } },
		            { field: 'email',  type: 'email', required: false, html: { caption: 'EMAIL', attr: 'style="" size="40"' } },
		        ],
		        actions: {
		            reset: function () {
		                this.clear();
		            },
		            save: function () {
		                this.save(function (event) {
		                	console.log("save");
							form2grid(recid, 'myForm', 'myGridCust');
		                });
		            }
		        }
		    });
		    
			// w2ui['myForm'].on('change', function (target, eventData) {
			//     console.log(target);
			//     console.log(eventData);
			// });		
			// w2ui['myForm'].on('load', function (target, eventData) {
			//     console.log(target);
			//     console.log(eventData);
			// });		
			
		}
	});
