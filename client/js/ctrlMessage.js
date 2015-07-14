	'use strict';
	// ---------------------------------
	// コントローラー MessageCtrl
	// ---------------------------------
	app.controller('MessageCtrl'
				, ['$scope', 'SharedService'
				, function($scope, SharedService) {

        $scope.MessageList = {};
        $scope.ShowMessage = false;
        
        $scope.$on('changedErrorMessage', function() {
            console.log("[enter] changedErrorMessage");
            $scope.MessageList = [];
            var msg = SharedService.errorMessage;
            if (msg != undefined && msg != "") {
              $scope.MessageList = [SharedService.errorMessage];
            }
            
            // メッセージ領域の表示コントロール
            if ($scope.MessageList == undefined || $scope.MessageList.length == 0) {
                $scope.ShowMessage = false;
            } else {
                $scope.ShowMessage = true;
            }
        });

	}]);