// ---------------------------------
// Custmerモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    var Custmer = require('./model/custmers').Custmer;

    // ---------------------------------
    // 顧客リストの取得
    // ---------------------------------
    moduleApp.get('/custmer', function(req, res) {
        console.log("顧客リストの取得 ");

        Custmer.find({}, {}, {
            sort: {
                'code': 1
            },
            limit: 0
        }, function(err, items) {
            res.send(items);
        });

    });

    // ---------------------------------
    // 顧客リストの保存
    // ---------------------------------
    moduleApp.post('/custmer', function(req, res) {
        console.log("顧客リストの保存 ");
        console.dir(req.body);
        var data = req.body.record;
        Custmer.findOne({_id:data._id},function(err,cust){
            if(err || cust === null){
                console.log("err ");
                return;
            }
            cust.code = data.code;
            cust.name_sei = data.name_sei;
            cust.name_mei = data.name_mei;
            cust.kananame_sei = data.kananame_sei;
            cust.kananame_mei = data.kananame_mei;
            cust.birthday = data.birthday;
            cust.yuubin_no = data.yuubin_no;
            cust.addr = data.addr;
            cust.tel = data.tel;
            cust.email = data.email;
            
            cust.save(function(err) {
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
    // CSV顧客テストデータの登録
    // ---------------------------------
    moduleApp.get('/createCustmer', function(req, res) {
        console.log("createCustmer get!!");
        var readCount = 0;

        // collection削除
        Custmer.remove({}, function(err, numberRemoved) {
            console.log("inside remove call back" + numberRemoved);
            // CSV読み込み
            var csv = require('ya-csv');
            var reader = csv.createCsvFileReader('./csv/custmer.csv');
            reader.setColumnNames(['code', 'name_sei', 'name_mei', 'kananame_sei', 'kananame_mei', 'birthday', 'yuubin_no', 'addr', 'tel', 'email']);
            reader.addListener('data', function(data) {
                readCount++;
                var newCustmer = new Custmer(data);
                newCustmer.save(function(err) {
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