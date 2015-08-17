// ---------------------------------
// bizMitumoriモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 見積データ処理
    // ---------------------------------
    moduleApp.post('/bizmitsumori', function(req, res) {
        console.log("見積データ");
        console.dir(req.body);
        var cmd = req.body.cmd;
        var recid = req.body.recid;
        console.log("recid:" + recid);
        var sqldb = new sqlite3.Database('niscloud.db');
        var sql = {};
        // ---------------------------------
        // データ取得
        // ---------------------------------
        if (cmd == 'get-records' || cmd == 'get-record') {
            // WHERE句
            var where = util.makeSqlWhere(" ", req.body);
            if (recid != undefined && recid != "") {
                where += " AND mitsu_id = '" + recid + "' ";
            }
            
            // ORDER句
            var order = util.makeSqlOrder(req.body);

            sql = "SELECT"
                        + " mitsu_id as recid"
                        + ",mitsu_id"
                        + ",custmer_code"
                        + ",title"
                        + ",name"
                        + ",mitsumori_date"
                        + ",mitsumori_no"
                        + ",mitsumori_kigen_date"
                        + ",kesai_jyouken"
                        + ",nouki_date"
                        + ",nounyuu_basyo"
                        + ",tantousya_name"
                        + ",status"
                        + " FROM d_mitsumori MT"
                        + " LEFT OUTER JOIN"
                        + " m_custmer CS"
                        + " ON MT.custmer_code = CS.code"
                        + " WHERE 1 = 1" + where
                        + order;
            console.log("sql:" + sql);
            sqldb.all(sql, function(err, rows) {
                if (!err) {
                    console.log("見積データリストの取得:" + rows.length);
                    // console.log(rows);
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
            console.log("見積データの保存 ");
            sql = "SELECT"
                    + " count(*) as reccount"
                    + " FROM d_mitsumori"
                    + " WHERE mitsu_id = ?";
                    
            sqldb.all(sql, recid, function(err, rows) {
                var data = req.body.record;
            	var tm = moment().toISOString();
                if (!err) {
                    if (rows[0].reccount == 0) {
                        console.log("見積INSERT");
                        var uuid = require('node-uuid');
                        sql = "INSERT INTO d_mitsumori ("
                                + " mitsu_id"
                                + ",custmer_code"
                                + ",title"
                                + ",mitsumori_date"
                                + ",mitsumori_no"
                                + ",mitsumori_kigen_date"
                                + ",kesai_jyouken"
                                + ",nouki_date"
                                + ",nounyuu_basyo"
                                + ",tantousya_name"
                                + ",status"
                                + ",cre_date"
                                + ",upd_date"
                                + ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

                        var stmt = sqldb.prepare(sql);
                        stmt.run(
                            uuid.v1(),
                            data.custmer_code,
                            data.title,
                            data.mitsumori_date,
                            data.mitsumori_no,
                            data.mitsumori_kigen_date,
                            data.kesai_jyouken,
                            data.nouki_date,
                            data.nounyuu_basyo,
                            data.tantousya_name,
                            data.status,
                            tm,
                            tm
                        );
        				var insresult = {};
        				insresult["status"] = "success";
                        res.send(insresult);
                    }
                    else {
                        console.log("見積UPDATE");
                        var sql = "UPDATE d_mitsumori SET"
                                    + " custmer_code = ?"
                                    + ",title = ?"
                                    + ",mitsumori_date = ?"
                                    + ",mitsumori_no = ?"
                                    + ",mitsumori_kigen_date = ?"
                                    + ",kesai_jyouken = ?"
                                    + ",nouki_date = ?"
                                    + ",nounyuu_basyo = ?"
                                    + ",tantousya_name = ?"
                                    + ",status = ?"
                                    + ",upd_date = ?"
                                    + " WHERE"
                                    + " mitsu_id = ?";
                        var stmtUp = sqldb.prepare(sql);
                        stmtUp.run(
                            data.custmer_code,
                            data.title,
                            data.mitsumori_date,
                            data.mitsumori_no,
                            data.mitsumori_kigen_date,
                            data.kesai_jyouken,
                            data.nouki_date,
                            data.nounyuu_basyo,
                            data.tantousya_name,
                            data.status,
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
    });

    // ---------------------------------
    // 見積明細データ処理
    // ---------------------------------
    moduleApp.post('/bizmitsumorimei', function(req, res) {
        console.log("見積明細データ");
        // console.log(req);
        console.dir(req.body);
        var cmd = req.body.cmd;
        var recid = req.body.recid;
        var parent_id = req.body.parent_id;
        console.log("recid:" + recid);
        var sqldb = new sqlite3.Database('niscloud.db');

        // ---------------------------------
        // データ取得
        // ---------------------------------
        if (cmd == 'get-records' || cmd == 'get-record') {
            var where = "";
            if (recid != undefined && recid != "") {
                where += " and mitsumei_id = '" + recid + "' ";
            }
            if (parent_id != undefined && parent_id != "") {
                where += " and parent_id = '" + parent_id + "' ";
            }
            var order = util.makeSqlOrder(req.body);
            var sql = "SELECT"
                        + " mitsumei_id as recid"
                        + ",mitsumei_id"
                        + ",meisai_type"
                        + ",seq"
                        + ",template_id"
                        + ",parent_id"
                        + ",parent_type"
                        + ",mei_title"
                        + ",mei_kikaku"
                        + ",mei_tanka"
                        + ",mei_suuryo"
                        + ",mei_tani"
                        + ",mei_kingaku"
                        + ",mei_bikou"
                        + " FROM d_mitsumorimeisai MM"
                        + " WHERE 1 = 1"
                        + where
                        + order;

            console.log("sql:" + sql);
            sqldb.all(sql, function(err, rows) {
                if (!err) {
                    console.log("見積データリストの取得:" + rows.length);
                    // console.log(rows);
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
            console.log("見積明細データの保存 ");
            sqldb.all("SELECT count(*) as reccount FROM d_mitsumorimeisai WHERE mitsumei_id = ?", recid, function(err, rows) {
                var data = req.body.record;
                var parent_id = req.body.parent_id;
                var parent_type = req.body.parent_type;
            	var tm = moment().toISOString();
                if (!err) {
                    if (rows[0].reccount == 0) {
                        console.log("見積明細INSERT");
                        var uuid = require('node-uuid');
                        sql = "INSERT INTO d_mitsumorimeisai ("
                                + " mitsumei_id"
                                + ",meisai_type"
                                + ",parent_id"
                                + ",parent_type"
                                + ",mei_title"
                                + ",mei_kikaku"
                                + ",mei_tanka"
                                + ",mei_suuryo"
                                + ",mei_tani"
                                + ",mei_kingaku"
                                + ",mei_bikou"
                                + ",cre_date"
                                + ",upd_date"
                                + ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        var stmt = sqldb.prepare(sql);
                        stmt.run(
                            uuid.v1(),
                            data.meisai_type.id,
                            parent_id,
                            parent_type,
                            data.mei_title,
                            data.mei_kikaku,
                            data.mei_tanka,
                            data.mei_suuryo,
                            data.mei_tani,
                            data.mei_kingaku,
                            data.mei_bikou,
                            tm,
                            tm
                        );
        				var insresult = {};
        				insresult["status"] = "success";
                        res.send(insresult);
                    }
                    else {
                        console.log("見積明細UPDATE");
                        var sql = "UPDATE d_mitsumorimeisai SET"
                                    + " meisai_type = ?"
                                    + ",parent_id = ?"
                                    + ",parent_type = ?"
                                    + ",mei_title = ?"
                                    + ",mei_kikaku = ?"
                                    + ",mei_tanka = ?"
                                    + ",mei_suuryo = ?"
                                    + ",mei_tani = ?"
                                    + ",mei_kingaku = ?"
                                    + ",mei_bikou = ?"
                                    + ",upd_date = ?"
                                    + " WHERE"
                                    + " mitsumei_id = ?";
                        var stmtUp = sqldb.prepare(sql);
                        console.log(sql);
                        stmtUp.run(
                            data.meisai_type.id,
                            parent_id,
                            parent_type,
                            data.mei_title,
                            data.mei_kikaku,
                            data.mei_tanka,
                            data.mei_suuryo,
                            data.mei_tani,
                            data.mei_kingaku,
                            data.mei_bikou,
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
            var sql = {};
            sql = "CREATE TABLE d_mitsumori ("
                    + " mitsu_id PRIMARY KEY"
                    + ",custmer_code"
                    + ",title"
                    + ",mitsumori_date DATE"
                    + ",mitsumori_no"
                    + ",mitsumori_kigen_date DATE"
                    + ",kesai_jyouken"
                    + ",nouki_date DATE"
                    + ",nounyuu_basyo"
                    + ",tantousya_name"
                    + ",status"
                    + ",cre_date DATETIME"
                    + ",upd_date DATETIME"
                    + ")";
            sqldb.run(sql);
            sql = "CREATE TABLE d_mitsumorimeisai ("
                    + " mitsumei_id PRIMARY KEY"
                    + ",meisai_type"
                    + ",seq"
                    + ",template_id"
                    + ",parent_type"
                    + ",parent_id"
                    + ",mei_title"
                    + ",mei_kikaku"
                    + ",mei_tanka"
                    + ",mei_suuryo"
                    + ",mei_tani"
                    + ",mei_kingaku"
                    + ",mei_bikou"
                    + ",cre_date DATETIME"
                    + ",upd_date DATETIME"
                    + ")";
            sqldb.run(sql);

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
                reader.setColumnNames(['mitsumei_id', 'meisai_type', 'seq', 'template_id', 'parent_id', 'parent_type', 'mei_title', 'mei_bikou']);
                reader.addListener('data', function(data) {
                    readCount++;
    
                	var tm = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
                    var stmt = sqldb.prepare("INSERT INTO d_mitsumorimeisai (mitsumei_id, meisai_type, seq, template_id, parent_id, parent_type, mei_title, mei_bikou, cre_date, upd_date ) VALUES (?,?,?,?,?,?,?,?,?,?)");
                    stmt.run(
                            data.mitsumei_id,
                            data.meisai_type,
                            data.seq,
                            data.template_id,
                            data.parent_id,
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