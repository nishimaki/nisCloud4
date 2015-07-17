// ---------------------------------
// Custmerモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 顧客リストの取得
    // ---------------------------------
    moduleApp.get('/custmer', function(req, res) {
        console.log("顧客リストの取得 ");

        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT * FROM m_custmer ORDER BY code", function(err, rows) {
            if (!err) {
                console.log("顧客リストの取得:" + rows.length);
                res.send(rows);
            }
        });
    });

    // ---------------------------------
    // 顧客リストの保存
    // ---------------------------------
    moduleApp.post('/custmer', function(req, res) {
        console.log("顧客リストの保存 ");
        console.dir(req.body);
        var oldKey = req.body.code;
        var data = req.body.record;

        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT count(*) as reccount FROM m_custmer WHERE code = ?", oldKey, function(err, rows) {
            console.dir(rows);
            if (!err) {
                if (rows.reccount == 0) {
                    console.log("顧客INSERT");
                    var stmt = sqldb.prepare("INSERT INTO m_custmer VALUES (?,?,?,?,?,?,?,?)");
                    stmt.run(data.code,
                        data.name,
                        data.kananame,
                        data.birthday,
                        data.yuubin_no,
                        data.addr,
                        data.tel,
                        data.email);
                    stmt.finalize();
                    var status = "success";
                    res.send(status);
                }
                else {
                    console.log("顧客UPDATE");
                    var sql = "UPDATE m_custmer SET code = ?,name = ?,kananame = ?,birthday = ?,yuubin_no = ?,addr = ?,tel = ?,email = ? WHERE code = ?";
                    var stmtUp = sqldb.prepare(sql);
                    stmtUp.run(data.code,
                        data.name,
                        data.kananame,
                        data.birthday,
                        data.yuubin_no,
                        data.addr,
                        data.tel,
                        data.email,
                        oldKey
                    );
                    stmtUp.finalize();
                    var status = "success";
                    res.send(status);
                }
            }
            else {
                var status = "error";
                res.send(status);
            }
        });
    });

    // ---------------------------------
    // CSV顧客テストデータの登録
    // ---------------------------------
    moduleApp.get('/createCustmer', function(req, res) {
        console.log("createCustmer get!!");

        var sqldb = new sqlite3.Database('niscloud.db');

        sqldb.serialize(function() {

            // テーブルがあるとき削除する。
            sqldb.run("DROP TABLE IF EXISTS m_custmer");

            // テーブルを作成する。
            sqldb.run("CREATE TABLE m_custmer (code PRIMARY KEY, name, kananame, birthday, yuubin_no, addr, tel, email)");

            var readCount = 0;
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/custmer.csv');
            reader.setColumnNames(['code', 'name_sei', 'name_mei', 'kananame_sei', 'kananame_mei', 'birthday', 'yuubin_no', 'addr', 'tel', 'email']);
            reader.addListener('data', function(data) {
                readCount++;

                var stmt = sqldb.prepare("INSERT INTO m_custmer VALUES (?,?,?,?,?,?,?,?)");
                stmt.run(data.code,
                    data.name_sei + data.name_mei,
                    data.kananame_sei + data.kananame_mei,
                    data.birthday,
                    data.yuubin_no,
                    data.addr,
                    data.tel,
                    data.email);
                // stmt.finalize();

            }).on('end', function() {
                res.redirect(302, "/");
                // res.send("OK:" + readCount);
            });
        });
    });
};