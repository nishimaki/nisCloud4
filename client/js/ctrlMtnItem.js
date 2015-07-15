	'use strict';
	// ---------------------------------
	// コントローラー MtnItemCtrl
	// ---------------------------------
	app.controller('MtnItemCtrl', function($rootScope, $scope, $http, $controller, SharedService) {

		// MntCtrlから継承
		// $controller('MtnCtrl', {
		//     $rootScope: $rootScope,
		//     $scope: $scope
		// });

		$scope.itemList = {};

		$scope.init = function init() {
			console.log("MtnItemCtrl init");

			SharedService.SetTitle("商品メンテナンス");

			$http.get('/item').success(function(data) {
				var cnt = 0;
				_.each(data, function(dat) {
					dat["recid"] = cnt++;
					// console.log("dat:" + angular.toJson(dat) );
				});
				// console.log("data length:" + data.length);

				$scope.itemList = data;

				// ---------------------------------
				// グリッド表示
				// ---------------------------------
				$("#myGrid").w2destroy("myGrid");
				$('#myGrid').w2grid({
					name: 'myGrid',
			        show: { 
			            toolbar: true,
			            footer: true,
			            toolbarAdd: true,
			            toolbarDelete: true,
			            toolbarSave: true,
			            toolbarEdit: true
			        },
					columns: [{
							field: 'code',
							caption: 'code',
							size: '80px',
							sortable: true 
		                }, {
							field: 'name',
							caption: '商品名',
							size: '200px',
							sortable: true
		                }, {
							field: 'spec',
							caption: '規格',
							size: '80px',
							sortable: true
		                }, {
							field: 'price',
							type: 'int',
							caption: '単価',
							size: '80px',
							sortable: true
		                }, {
							field: 'maker',
							caption: 'メーカー名',
							size: '200px',
							sortable: true
		                }, {
							field: 'salesDate',
							caption: '発売年月',
							size: '120px',
							sortable: true
	    	            }, ],
					records: $scope.itemList,
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

		// ---------------------------------
		// フォーム表示
		// ---------------------------------
		function MakeForm(event, data) {
			// console.log(event);
			// console.log(data);
	
			$("#myForm").w2destroy("myForm");
			$('#myForm').w2form({ 
		        name  : 'myForm',
		        url   : 'item',
		        fields: [
		            { field: 'code', type: 'text', required: true, html: { caption: 'コード', attr: 'style="" maxlength="8" size="8"' }},
		            { field: 'name',  type: 'text', required: true, html: { caption: '商品名', attr: 'style="" size="50"' }},
		            { field: 'spec',  type: 'text', required: true, html: { caption: '規格', attr: 'style="" size="30"' }},
		            { field: 'price',  type: 'int', required: false, html: { caption: '単価', attr: 'style="" size="20"' }},
		            { field: 'maker',  type: 'text', required: false, html: { caption: 'メーカー名', attr: 'style="" size="50"' }},
		            { field: 'salesDate',  type: 'text', required: false, html: { caption: '発売年月', attr: 'style="" size="10"' }},
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
	});
