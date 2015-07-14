	'use strict';
	// ---------------------------------
	// コントローラー HeaderCtrl
	// ---------------------------------
	app.controller('HeaderCtrl'
				, ['$rootScope', '$scope', '$http', '$interval', '$state', 'SharedService'
				, function($rootScope, $scope, $http, $interval, $state, SharedService) {
		$scope.Title = "";
		$scope.LoginStatus = false;
		$scope.DateTime = "";

		// homeを初期表示
		$state.go("home");

		// 日時のリアルタイム表示
		$interval(function () {
			var formatDate = moment().format('YYYY/MM/DD(ddd)  HH:mm:ss');
			$scope.DateTime = formatDate;
		}, 1000);
		
        $scope.logout = function logout() {
			console.log("HeaderCtrl logout");
			$http.get('/logout')
			.success(function(data) {
			  if (data == "OK") {
				$state.go("login");
			  }
			});
        };

        $scope.$on('changedLoginStatus', function() {
            var sts = SharedService.loginStatus;
            if (sts != "") {
            	$scope.LoginStatus = true;
            } else {
            	$scope.LoginStatus = false;
            }
        });
        $scope.$on('changedTitle', function() {
            $scope.Title = SharedService.title;
        });
        
	}]);