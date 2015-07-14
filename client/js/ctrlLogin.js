	'use strict';
	// ---------------------------------
	// コントローラー LoginCtrl
	// ---------------------------------
	app.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$state', 'SharedService'
				,
		function($rootScope, $scope, $http, $state, SharedService) {

			$scope.init = function init() {
				console.log("LoginCtrl init");
				SharedService.SetLoginStatus("");

				/***/
				$("#loginform").w2destroy("loginform");
				$('#loginform').w2form({
					name: 'loginform',
					header: 'Auto-Generated Form',
					url: 'server/post',
			        fields : [
			            { field: 'first_name', type: 'text', required: true, html: { caption: 'First Name', attr: 'style="width: 300px"' } },
			            { field: 'last_name',  type: 'text', required: true, html: { caption: 'Last Name', attr: 'style="width: 300px"' } },
			            { field: 'comments',   type: 'textarea', html: { caption: 'Comments', attr: 'style="width: 300px; height: 90px"' } }
			        ],
					actions: {
						reset: function() {
							this.clear();
						},
						save: function() {
							this.save();
						}
					}
				});
				/***/

			};

			$scope.submit = function() {
				if ($scope.inputUserName) {
					var postData = {
						data: {
							email: null,
							username: $scope.inputUserName,
							password: $scope.inputPassword
						}
					};
					$http.post('/login', postData, null).success(function(data) {
						// console.log("Loing result:" + data);
						if (data == "OK") {
							// console.log("Loing OK!! GOTO Home");
							SharedService.SetErrorMessage("");
							SharedService.SetLoginStatus("LOGIN");
							$state.go("home.portal");
							// $state.go("home");
						}
						else {
							// console.log("Loing NG!!");
							SharedService.SetErrorMessage("ログインエラー");
						}
					});
				}
			};

			$scope.showRegister = function showRegister() {
				console.log("LoginCtrl showRegister");
				$state.go("register");
			};


			$scope.init_register = function init_register() {
				//console.log("LoginCtrl init");
				SharedService.SetLoginStatus("");
			};

			$scope.submit_register = function() {
				if ($scope.inputEmail) {
					var postData = {
						data: {
							email: $scope.inputEmail
						}
					};
					$http.post('/register', postData, null).success(function(data) {
						// console.log("Loing result:" + data);
						if (data == "OK") {
							// console.log("Loing OK!! GOTO Home");
							SharedService.SetErrorMessage("");
							SharedService.SetLoginStatus("LOGIN");
							$state.go("login");
						}
						else {
							// console.log("Loing NG!!");
							SharedService.SetErrorMessage("登録エラー");
						}
					});
				}
			};

	}]);