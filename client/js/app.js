    'use strict';
    // ---------------------------------
    // モジュール
    // ---------------------------------
    var app = angular.module('myApp', [
              'ui.router'
         ]);

    // ---------------------------------
    // Config
    //    ui-routerによる画面遷移定義
    //
    //      isLoginRequired:ログインが必要な画面
    // ---------------------------------
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/blank");
        $stateProvider
            .state('home', {
                // isLoginRequired: true,
                url: '/home',
                templateUrl: 'webclient/home.html'
            })
            .state('home.blank', {
                isLoginRequired: true,
                url: '/blank',
                templateUrl: 'webclient/blank.html'
            })
            .state('home.portal', {
                // isLoginRequired: true,
                url: '/portal',
                templateUrl: 'webclient/portal.html'
            })
            .state('home.mntcuts', {
                // isLoginRequired: true,
                url: '/mnt/custmer',
                templateUrl: 'webclient/mnt/custmer.html'
            })
            .state('home.mntitem', {
                // isLoginRequired: true,
                url: '/mnt/item',
                templateUrl: 'webclient/mnt/item.html'
            })
            .state('home.mnttool', {
                // isLoginRequired: true,
                url: '/mnt/tool',
                templateUrl: 'webclient/mnt/tool.html'
            })
            .state('home.chat', {
                isLoginRequired: true,
                url: '/chat',
                templateUrl: 'webclient/chat.html'
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'setting.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'webclient/login.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'webclient/register.html'
            })
            .state('mitsumori', {
                url: '/mitsumori',
                templateUrl: 'webclient/mitsumori.html'
            });

    });

    // ---------------------------------
    // run
    //    state変更
    // ---------------------------------
    app.run(['$rootScope', '$state', '$http', 'SharedService', function($rootScope, $state, $http, SharedService) {
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            // ログイン状態が必要か？
            if (toState.isLoginRequired) {
                // ログイン状態の判断処理
                async.waterfall([
                    function(callback) {
                        $http.get('/islogin')
                            .success(function(data) {
                                if (data == "OK") {
                                    callback(null, true);
                                }
                                else {
                                    callback(null, false);
                                }
                            })
                            .error(function(data) {
                                callback(null, false);
                            });
                    },
                    function(res, callback) {
                        if (!res) {
                            // エラーの為、ログイン画面に遷移
                            $state.go('login');
                            e.preventDefault();
                        }
                        else {
                            SharedService.SetLoginStatus("LOGIN");
                        }
                        callback(null, res);
                    }
                ], function(err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
    }]);

    // ---------------------------------
    // factory
    //    SharedService: 共有メッセージ
    // ---------------------------------
    app.factory("SharedService", ["$rootScope", function($rootScope) {
        var service = {};
        // ---------------------------------
        // エラーメッセージ
        // ---------------------------------
        service.errorMessage = {};
        service.SetErrorMessage = function(value) {
            this.errorMessage = value;
            $rootScope.$broadcast("changedErrorMessage");
        };
        // ---------------------------------
        // ログイン状態
        // ---------------------------------
        service.loginStatus = {};
        service.SetLoginStatus = function(value) {
            // console.log("loginStatus value:" + value);
            this.loginStatus = value;
            $rootScope.$broadcast("changedLoginStatus");
        };
        // ---------------------------------
        // タイトル
        // ---------------------------------
        service.title = {};
        service.SetTitle = function(value) {
            this.title = value;
            $rootScope.$broadcast("changedTitle");
        };

        return service;
    }]);

    // ---------------------------------
    // moment設定
    // ---------------------------------
    moment.locale('ja');