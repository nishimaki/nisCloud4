// ---------------------------------
// Itemモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 商品リストの取得
    // ---------------------------------
    moduleApp.post('/item', function(req, res) {
        console.log("商品リストの取得 ");
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
                        + " FROM m_item"
                        + " WHERE 1 = 1 "
                        + where
                        + order;
            console.log("sql:" + sql);
            sqldb.all(sql, function(err, rows) {
                if (!err) {
                    console.log("商品リストの取得:" + rows.length);
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
            console.log("商品リストの保存 ");
            var sqldb = new sqlite3.Database('niscloud.db');
            sqldb.all("SELECT count(*) as reccount FROM m_item WHERE code = ?", recid, function(err, rows) {
                var data = req.body.record;
            	var tm = moment().toISOString();
                if (!err) {
                    if (rows[0].reccount == 0) {
                        console.log("商品INSERT");
                        var stmt = sqldb.prepare("INSERT INTO m_item (code, name, spec, price, maker, salesDate, cre_date, upd_date ) VALUES (?,?,?,?,?,?,?,?)");
                        stmt.run(
                            data.code,
                            data.name,
                            data.spec,
                            data.price.replace(/,/g,""),
                            data.maker,
                            data.salesDate,
                            tm,
                            tm
                        );
        				var insresult = {};
        				insresult["status"] = "success";
                        res.send(insresult);
                    }
                    else {
                        console.log("商品UPDATE");
                        var sql = "UPDATE m_item SET code = ?,name = ?,spec = ?,price = ?,maker = ?,salesDate = ?, upd_date = ? WHERE code = ?";
                        var stmtUp = sqldb.prepare(sql);
                        stmtUp.run(
                            data.code,
                            data.name,
                            data.spec,
                            data.price.replace(/,/g,""),
                            data.maker,
                            data.salesDate,
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
            console.log("商品UPDATE");
            var sql = "DELETE FROM m_item WHERE code = ?";
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
    // CSV商品テストデータの登録
    // ---------------------------------
    moduleApp.get('/createItem', function(req, res) {
        console.log("createItem get!!");

        var sqldb = new sqlite3.Database('niscloud.db');

        sqldb.serialize(function() {

            // テーブルがあるとき削除する。
            sqldb.run("DROP TABLE IF EXISTS m_item");

            // テーブルを作成する。
            sqldb.run("CREATE TABLE m_item (code PRIMARY KEY, name, spec, price INTEGER, maker, salesDate, cre_date DATETIME, upd_date DATETIME)");

            var readCount = 0;
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/item.csv');
            reader.setColumnNames(['code', 'name', 'spec', 'price', 'maker', 'salesDate']);
            reader.addListener('data', function(data) {
                readCount++;
            	var tm = moment().toISOString();
                var stmt = sqldb.prepare("INSERT INTO m_item (code, name, spec, price, maker, salesDate, cre_date, upd_date ) VALUES (?,?,?,?,?,?,?,?)");
                stmt.run(
                    data.code,
                    data.name,
                    data.spec,
                    data.price.replace(/,/g,""),
                    data.maker,
                    data.salesDate,
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