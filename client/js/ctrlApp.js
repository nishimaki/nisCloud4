  'use strict';
  // ---------------------------------
  // コントローラー AppCtrl
  // ---------------------------------
  app.controller('AppCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    $scope.MessageList = [];



    $scope.init = function init() {
      console.log("AppCtrl init");

    $("#sideMenu").w2destroy("sidebar");
    $('#sideMenu').w2sidebar({
    	name: 'sidebar',
    	img: null,
    	nodes: [ 
    		{ id: 'level-1', text: 'Level 1', img: 'icon-folder', expanded: true, group: true,
    		  nodes: [ { id: 'level-1-1', text: 'ホーム', icon: 'glyphicon glyphicon-home', state: 'home.portal' },
    				   { id: 'level-1-2', text: 'チャット', icon: 'fa fa-star', state: 'home.chat'  },
    				   { id: 'level-1-3', text: '見積入力', icon: 'fa fa-check', state: 'mitsumori' },
    				   { id: 'level-1-4', text: 'Level 1.4', icon: 'fa fa-cubes', state: 'home.blank' },
    				 ]
    		},
    		{ id: 'mnt', text: 'メンテナンス', img: 'icon-folder', expanded: true, group: true,
    		  nodes: [ { id: 'mnt-1', text: '顧客', icon: 'glyphicon glyphicon-user', state: 'home.mntcuts' },
    				   { id: 'mnt-2', text: '商品', icon: 'glyphicon glyphicon-list-alt', state: 'home.mntitem'  },
    				   { id: 'mnt-99', text: 'ツール', icon: 'fa fa-wrench', state: 'home.mnttool'  },
    				 ]
    		},
    	],
    	onClick: function (event) {
    	    console.dir(event);
            console.log(event.target);
            $state.go(event.node.state);
    	}
    });

    };

    // 日付編集		
    $scope.editDate = function editDate(datetime) {
      var m = moment(datetime);
      var formatDate = m.format('YYYY/MM/DD HH:mm:ss.SSS');
      return formatDate;
    };

  }]);