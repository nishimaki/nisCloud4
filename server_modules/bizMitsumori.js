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
        sqldb.all("SELECT mitsu_id, custmer_code, title, name, mitsumori_date, status FROM d_mitsumori MT, m_custmer CS WHERE MT.custmer_code = CS.code  ORDER BY mitsu_id, code", function(err, rows) {
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
        // 	var tm = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
        	var tm = moment().toISOString();
            if (!err) {
                if (rows.reccount == 0) {
                    console.log("見積INSERT");
                    var stmt = sqldb.prepare("INSERT INTO d_mitsumori (custmer_code, title, mitsumori_date, cre_date, upd_date) VALUES (?,?,?,?,?)");
                    stmt.run(
                        data.custmer_code,
                        data.title,
                        data.mitsumori_date,
                        tm,
                        tm
                    );
                    var status = "success";
                    res.send(status);
                }
                else {
                    console.log("見積UPDATE");
                    var sql = "UPDATE d_mitsumori SET custmer_code = ?,title = ?,mitsumori_date = ?, upd_date = ? WHERE mitsu_id = ?";
                    var stmtUp = sqldb.prepare(sql);
                    stmtUp.run(
                        data.custmer_code,
                        data.title,
                        data.mitsumori_date,
                        tm,
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
            sqldb.run("CREATE TABLE d_mitsumori (mitsu_id PRIMARY KEY, custmer_code, title, mitsumori_date DATE, status, cre_date DATETIME, upd_date DATETIME)");
            sqldb.run("CREATE TABLE d_mitsumorimeisai (mitsumei_id PRIMARY KEY, meisai_type, template_id, parent_type, mitsu_id, mei_title, mei_bikou,  cre_date DATETIME, upd_date DATETIME)");

            var readCount = 0;
            // CSV読み込み(見積)
            console.log("CSV読み込み(見積)");
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/mitsumori.csv');
            reader.setColumnNames(['mitsu_id','custmercode', 'title', 'mitsumori_date', 'status']);
            reader.addListener('data', function(data) {
                readCount++;

            	var tm = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
                var stmt = sqldb.prepare("INSERT INTO d_mitsumori (mitsu_id, custmer_code, title, mitsumori_date, status, cre_date, upd_date) VALUES (?,?,?,?,?,?,?)");
                stmt.run(
                        data.mitsu_id,
                        data.custmercode,
                        data.title,
                        data.mitsumori_date,
                        data.status,
            			tm,
            			tm
                );
                stmt.finalize();

            }).on('end', function() {
                readCount = 0;
                // CSV読み込み(見積明細)
                console.log("CSV読み込み(見積明細)");
                var csv = require('ya-csv');
                var reader = csv.createCsvFileReader('./csv/mitsumori_mei.csv');
                reader.setColumnNames(['mitsumei_id', 'meisai_type', 'template_id', 'mitsu_id', 'parent_type', 'mei_title', 'mei_bikou']);
                reader.addListener('data', function(data) {
                    readCount++;
    
                	var tm = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
                    var stmt = sqldb.prepare("INSERT INTO d_mitsumorimeisai (mitsumei_id, meisai_type, template_id, mitsu_id, parent_type, mei_title, mei_bikou, cre_date, upd_date ) VALUES (?,?,?,?,?,?,?,?,?)");
                    stmt.run(
                            data.mitsumei_id,
                            data.meisai_type,
                            data.template_id,
                            data.mitsu_id,
                            data.parent_type,
                            data.mei_title,
                            data.mei_bikou,
                			tm,
                			tm
                    );
                    stmt.finalize();
    
                }).on('end', function() {
                    res.redirect(302, "/");
                    // res.send("OK:" + readCount);
                });
            });
        });
        
    });
};