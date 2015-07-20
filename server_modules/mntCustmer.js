// ---------------------------------
// Custmerモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 顧客リストの取得
    // ---------------------------------
    moduleApp.post('/custmer', function(req, res) {
        console.log("顧客リストの取得 ");
        console.dir(req.body);
        var cmd = req.body.cmd;
        var recid = req.body.recid;
        console.log("recid:" + recid);
        var sqldb = new sqlite3.Database('niscloud.db');

        // ---------------------------------
        // データ取得
        // ---------------------------------
        if (cmd == 'get-records' || cmd == 'get-record') {
            // WHERE句
            var where = util.makeSqlWhere(" ", req.body);
            if (recid != undefined && recid != "") {
                where += " and code = '" + recid + "' ";
            }
            // ORDER句
            var order = util.makeSqlOrder(req.body);

            var sql = "SELECT"
                        + " code as recid"
                        + " , * "
                        + " FROM m_custmer"
                        + " WHERE 1 = 1 "
                        + where
                        + order;
            console.log("sql:" + sql);
            sqldb.all(sql, function(err, rows) {
                if (!err) {
                    console.log("顧客リストの取得:" + rows.length);
    				var result = {};
    				result["status"] = "success";
    				result["total"] = rows.length;
                    if (cmd == 'get-records') {
    				    result["records"] = rows;
                    } else {
        				result["record"] = rows[0];
                    }
                    res.send(result);
                }
            });
        }
        // ---------------------------------
        // データ保存
        // ---------------------------------
        if (cmd == 'save-record') {
            console.log("顧客リストの保存 ");
            sqldb.all("SELECT count(*) as reccount FROM m_custmer WHERE code = ?", recid, function(err, rows) {
                var data = req.body.record;
            	var tm = moment().toISOString();
                if (!err) {
                    if (rows[0].reccount == 0) {
                        console.log("顧客INSERT");
                        var stmt = sqldb.prepare("INSERT INTO m_custmer (code, name, kananame, birthday, yuubin_no, addr, tel, email, cre_date, upd_date) VALUES (?,?,?,?,?,?,?,?,?,?)");
                        stmt.run(
                            data.code,
                            data.name,
                            data.kananame,
                            data.birthday,
                            data.yuubin_no,
                            data.addr,
                            data.tel,
                            data.email,
                            tm,
                            tm
                        );
        				var insresult = {};
        				insresult["status"] = "success";
                        res.send(insresult);
                    }
                    else {
                        console.log("顧客UPDATE");
                        var sql = "UPDATE m_custmer SET code = ?,name = ?,kananame = ?,birthday = ?,yuubin_no = ?,addr = ?,tel = ?,email = ?, upd_date = ? WHERE code = ?";
                        var stmtUp = sqldb.prepare(sql);
                        stmtUp.run(data.code,
                            data.name,
                            data.kananame,
                            data.birthday,
                            data.yuubin_no,
                            data.addr,
                            data.tel,
                            data.email,
                            tm,
                            recid
                        );
        				var updresult = {};
        				updresult["status"] = "success";
                        res.send(updresult);
                    }
                }
            });
        }
        // ---------------------------------
        // データ削除
        // ---------------------------------
        if (cmd == 'delete-records') {
            console.log("顧客UPDATE");
            var sql = "DELETE FROM m_custmer WHERE code = ?";
            var selected = req.body.selected;
            var stmtUp = sqldb.prepare(sql);
            stmtUp.run(
                selected[0]
            );
			var delresult = {};
			delresult["status"] = "success";
            res.send(delresult);
        }
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
            sqldb.run("CREATE TABLE m_custmer (code PRIMARY KEY, name, kananame, birthday, yuubin_no, addr, tel, email, cre_date DATETIME, upd_date DATETIME)");

            var readCount = 0;
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/custmer.csv');
            reader.setColumnNames(['code', 'name_sei', 'name_mei', 'kananame_sei', 'kananame_mei', 'birthday', 'yuubin_no', 'addr', 'tel', 'email']);
            reader.addListener('data', function(data) {
                readCount++;

            	var tm = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
                var stmt = sqldb.prepare("INSERT INTO m_custmer (code, name, kananame, birthday, yuubin_no, addr, tel, email, cre_date, upd_date) VALUES (?,?,?,?,?,?,?,?,?,?)");
                stmt.run(
                    data.code,
                    data.name_sei + data.name_mei,
                    data.kananame_sei + data.kananame_mei,
                    data.birthday,
                    data.yuubin_no,
                    data.addr,
                    data.tel,
                    data.email,
                    tm,
                    tm
                );
            }).on('end', function() {
                res.redirect(302, "/");
                // res.send("OK:" + readCount);
            });
        });
    });
};