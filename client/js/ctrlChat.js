	'use strict';
	// ---------------------------------
	// コントローラー ChatCtrl
	// ---------------------------------
	var addChat = app.controller('ChatCtrl', function($rootScope, $scope, $controller, SharedService) {

	    // AppCtrlから継承
	    $controller('AppCtrl', {
	        $rootScope: $rootScope,
	        $scope: $scope
	    });

	    var socket = io.connect();

	    $scope.messages = [];
	    $scope.roster = [];
	    $scope.name = '';
	    $scope.text = '';

	    $scope.init = function init() {
	        console.log("ChatCtrl init");
	        SharedService.SetTitle("チャット");

	        socket.emit('reconnect', 'dummy');
	    };

	    socket.on('connect', function() {
	        $scope.setName();
	    });

	    socket.on('message', function(msg) {
	        $scope.messages.push(msg);
	        $scope.$apply();
	    });

	    socket.on('roster', function(names) {
	        $scope.roster = names;
	        $scope.$apply();
	    });

	    $scope.send = function send() {
	        console.log('Sending message:', $scope.text);
	        socket.emit('message', $scope.text);
	        $scope.text = '';
	    };

	    $scope.setName = function setName() {
	        socket.emit('identify', $scope.name);
	    };

	});