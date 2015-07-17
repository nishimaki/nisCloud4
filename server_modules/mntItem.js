// ---------------------------------
// Itemモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ---------------------------------
    // 商品リストの取得
    // ---------------------------------
    moduleApp.get('/item', function(req, res) {
        console.log("商品リストの取得 ");

        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT * FROM m_item ORDER BY code", function(err, rows) {
            if (!err) {
                console.log("商品リストの取得:" + rows.length);
                res.send(rows);
            }
        });
    });

    // ---------------------------------
    // 商品リストの保存
    // ---------------------------------
    moduleApp.post('/item', function(req, res) {
        console.log("商品リストの保存 ");
        console.dir(req.body);
        var oldKey = req.body.code;
        var data = req.body.record;
        
        var sqldb = new sqlite3.Database('niscloud.db');
        sqldb.all("SELECT count(*) as reccount FROM m_item WHERE code = ?", oldKey, function(err, rows) {
            console.dir(rows);
            if (!err) {
                if (rows.reccount == 0) {
                    console.log("商品INSERT");
                    var stmt = sqldb.prepare("INSERT INTO m_item VALUES (?,?,?,?,?,?)");
                    stmt.run(data.code,
                        data.name,
                        data.spec,
                        data.price.replace(/,/g,""),
                        data.maker,
                        data.salesDate
                    );
                    stmt.finalize();
                    var status = "success";
                    res.send(status);
                }
                else {
                    console.log("商品UPDATE");
                    var sql = "UPDATE m_item SET code = ?,name = ?,spec = ?,price = ?,maker = ?,salesDate = ? WHERE code = ?";
                    var stmtUp = sqldb.prepare(sql);
                    stmtUp.run(
                        data.code,
                        data.name,
                        data.spec,
                        data.price.replace(/,/g,""),
                        data.maker,
                        data.salesDate,
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
        
        
        
        // Item.findOne({_id:data._id},function(err,itemdata){
        //     if(err || itemdata === null){
        //         console.log("err ");
        //         return;
        //     }
        //     itemdata.code = data.code;
        //     itemdata.name = data.name;
        //     itemdata.spec = data.spec;
        //     itemdata.price = data.price;
        //     itemdata.maker = data.maker;
        //     itemdata.salesDate = data.salesDate;

        //     itemdata.save(function(err) {
        //         if (err) {
        //             console.log("save error:" + err);
        //         } else {
        //             var status = "success";
        //             res.send(status);
        //         }
        //     });
        // });
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
            sqldb.run("CREATE TABLE m_item (code PRIMARY KEY, name, spec, price INTEGER, maker, salesDate)");

            var readCount = 0;
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/item.csv');
            reader.setColumnNames(['code', 'name', 'spec', 'price', 'maker', 'salesDate']);
            reader.addListener('data', function(data) {
                readCount++;

                var stmt = sqldb.prepare("INSERT INTO m_item VALUES (?,?,?,?,?,?)");
                stmt.run(data.code,
                    data.name,
                    data.spec,
                    data.price.replace(/,/g,""),
                    data.maker,
                    data.salesDate);
                // stmt.finalize();

            }).on('end', function() {
                res.redirect(302, "/");
                // res.send("OK:" + readCount);
            });
        });
        
        // var readCount = 0;

        // // collection削除
        // Item.remove({}, function(err, numberRemoved) {
        //     console.log("inside remove call back" + numberRemoved);
        //     // CSV読み込み
        //     var csv = require('ya-csv');
        //     var reader = csv.createCsvFileReader('./csv/item.csv');
        //     reader.setColumnNames(['code', 'name', 'spec', 'price', 'maker', 'salesDate']);
        //     reader.addListener('data', function(data) {
        //         readCount++;
        //         var newItem = new Item(data);
        //         newItem.save(function(err) {
        //             if (err) {
        //                 console.log("insert error:" + err);
        //             }
        //         });
        //     }).on('end', function() {
        //         res.redirect(302, "/");
        //         // res.send("OK:" + readCount);
        //     });
        // });

    });
};