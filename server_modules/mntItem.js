// ---------------------------------
// Itemモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    var Item = require('./model/items').Item;

    // ---------------------------------
    // 商品リストの取得
    // ---------------------------------
    moduleApp.get('/item', function(req, res) {
        console.log("商品リストの取得 ");

        Item.find({}, {}, {
            sort: {
                'code': 1
            },
            limit: 0
        }, function(err, items) {
            res.send(items);
        });

    });

    // ---------------------------------
    // 商品リストの保存
    // ---------------------------------
    moduleApp.post('/item', function(req, res) {
        console.log("商品リストの保存 ");
        console.dir(req.body);
        var data = req.body.record;
        Item.findOne({_id:data._id},function(err,itemdata){
            if(err || itemdata === null){
                console.log("err ");
                return;
            }
            itemdata.code = data.code;
            itemdata.name = data.name;
            itemdata.spec = data.spec;
            itemdata.price = data.price;
            itemdata.maker = data.maker;
            itemdata.salesDate = data.salesDate;

            itemdata.save(function(err) {
                if (err) {
                    console.log("save error:" + err);
                } else {
                    var status = "success";
                    res.send(status);
                }
            });
        });
    });

    // ---------------------------------
    // CSV商品テストデータの登録
    // ---------------------------------
    moduleApp.get('/createItem', function(req, res) {
        console.log("createItem get!!");
        var readCount = 0;

        // collection削除
        Item.remove({}, function(err, numberRemoved) {
            console.log("inside remove call back" + numberRemoved);
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/item.csv');
            reader.setColumnNames(['code', 'name', 'spec', 'price', 'maker', 'salesDate']);
            reader.addListener('data', function(data) {
                readCount++;
                var newItem = new Item(data);
                newItem.save(function(err) {
                    if (err) {
                        console.log("insert error:" + err);
                    }
                });
            }).on('end', function() {
                res.redirect(302, "/");
                // res.send("OK:" + readCount);
            });
        });

    });
};