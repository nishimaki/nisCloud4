var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');

// Http SocketIO設定
app = express();
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser("hogehoge"));
    app.use(express.session({
        secret: 'fugafuga'
    }));
    app.use(app.router);
    // clientの静的ファイルを公開する
    app.use(express.static(path.resolve(__dirname, 'client')));

});

// SocketIO
var server = http.createServer(app);
var io = socketio.listen(server);

// 外部モジュールの読み込み
var appModule = require('./server_modules');
// TEST
// ncmb.getTest();

// チャット初期処理
appModule.chat.init(io);

// ユーザー初期処理
// appModule.user.init(app);
// メンテナンス初期処理
appModule.mntcustmer.init(app);
appModule.mntitem.init(app);
// ポータル初期処理
// appModule.portal.init(app);
// テストデータ
// var res = util.testdata(app);

//appModule.user.AddUser(NCMB);


// ルートの初期設定
app.get('/user/:id', function(req, res) {
    console.log("get!!");
    res.send('user ' + req.params.id);
});

// Http起動
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});
