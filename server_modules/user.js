// ---------------------------------
// Userモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // Login処理
    // ---------------------------------
    moduleApp.post('/login', function(req, res) {
        console.log("portal post:" + req.body.data.username + ':' + req.body.data.password);

        // ユーザー名とパスワードでログイン
        var username = req.body.data.username;
        var passwd = req.body.data.password;
        NCMB.User.logIn(username, passwd, {
            success: function(user) {
                console.log("ログイン　成功");
                // セッションに登録
                req.session.user = username;
                // ログイン完了
                res.send('OK');
            },
            error: function(user, error) {
                console.log("ログイン失敗: " + error.message);
                res.send('NG');
            }
        });

    });
    // ---------------------------------
    // Logout
    // ---------------------------------
    moduleApp.get('/logout', function(req, res) {
        // セッションに登録
        req.session.user = null;
        // ログアウト完了
        res.send('OK');
    });
    // ---------------------------------
    // Loginチェック
    // ---------------------------------
    moduleApp.get('/islogin', function(req, res) {
        console.log("ログインチェック: " + req.session.user);
        if (req.session.user != undefined && req.session.user != '') {
            // ログイン済み
            res.send('OK');
        }
        else {
            // 未ログイン
            res.send('NG');
        }
    });
    // ---------------------------------
    // regist
    // ---------------------------------
    moduleApp.post('/register', function(req, res) {
        // メールアドレスを登録
        var email = req.body.data.email;
        
        NCMB.User.requestAuthenticationMail(email, {
            success: function() {
                // 成功
                res.send('OK');
            },
            error: function(error) {
                // エラー
                res.send('NG');
            }
        });
    });
};