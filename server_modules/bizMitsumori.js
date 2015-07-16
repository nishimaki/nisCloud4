// ---------------------------------
// bizMitumoriモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 見積データリストの取得
    // ---------------------------------
    moduleApp.get('/bizmitsumori', function(req, res) {
        console.log("見積データリストの取得 ");

        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT mitsu_id, custmer_code, title, name, mitsumori_date FROM d_mitsumori MT, m_custmer CS WHERE MT.custmer_code = CS.code  ORDER BY mitsu_id, code", function(err, rows) {
            if (!err) {
                console.log("見積データリストの取得:" + rows.length);
                res.send(rows);
            }
        });
    });

    // ---------------------------------
    // 見積の保存
    // ---------------------------------
    moduleApp.post('/mitsumori', function(req, res) {
        console.log("見積の保存 ");
        console.dir(req.body);
        var oldKey = req.body.mitsu_id;
        var data = req.body.record;
        
        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT count(*) as reccount FROM d_mitsumori WHERE mitsu_id = ?", oldKey, function(err, rows) {
            console.dir(rows);
            if (!err) {
                if (rows.reccount == 0) {
                    console.log("見積INSERT");
                    var stmt = sqldb.prepare("INSERT INTO d_mitsumori (custmer_code, title, mitsumori_date) VALUES (?,?,?)");
                    stmt.run(
                        data.custmer_code,
                        data.title,
                        data.mitsumori_date
                    );
                    var status = "success";
                    res.send(status);
                }
                else {
                    console.log("見積UPDATE");
                    var sql = "UPDATE d_mitsumori SET custmer_code = ?,title = ?,mitsumori_date = ? WHERE mitsu_id = ?";
                    var stmtUp = sqldb.prepare(sql);
                    stmtUp.run(
                        data.custmer_code,
                        data.title,
                        data.mitsumori_date,
                        oldKey
                    );
                    var updstatus = "success";
                    res.send(updstatus);
                }
            }
            else {
                var errstatus = "error";
                res.send(errstatus);
            }
        });
    });

    // ---------------------------------
    // テーブル作成
    // ---------------------------------
    moduleApp.get('/createMitsumori', function(req, res) {
        console.log("createMitsumori get!!");

        var sqldb = new sqlite3.Database('niscloud.db');

        sqldb.serialize(function() {

            // テーブルがあるとき削除する。
            sqldb.run("DROP TABLE IF EXISTS d_mitsumori");
            sqldb.run("DROP TABLE IF EXISTS d_mitsumorimeisai");

            // テーブルを作成する。
            sqldb.run("CREATE TABLE d_mitsumori (mitsu_id INTEGER PRIMARY KEY AUTOINCREMENT, custmer_code, title, mitsumori_date DATE, cre_date DATETIME, upd_date DATETIME)");
            sqldb.run("CREATE TABLE d_mitsumorimeisai (mitsumei_id INTEGER PRIMARY KEY AUTOINCREMENT, meisai_type, mitsu_id, parent_type, cre_date DATETIME, upd_date DATETIME)");

            var readCount = 0;
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/mitsumori.csv');
            reader.setColumnNames(['custmercode', 'title', 'mitsumori_date']);
            reader.addListener('data', function(data) {
                readCount++;

                var stmt = sqldb.prepare("INSERT INTO d_mitsumori (custmer_code, title, mitsumori_date) VALUES (?,?,?)");
                stmt.run(data.custmercode,
                            data.title,
                            data.mitsumori_date);
                // stmt.finalize();

            }).on('end', function() {
                res.redirect(302, "/");
                // res.send("OK:" + readCount);
            });
        });
        
    });
};