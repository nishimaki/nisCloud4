// NCMB
NCMB = require("ncmb-latest.min").NCMB;
NCMB.initialize("51eb52bd757e683f478b83012e77cbe63625301882bbc4972b412eabc19b5fde", "fcb51d2e05594e10b0f47ef258a6db9b30ac061932cedd33cfa63e1a930377f4");

// 顧客
C_CUSTMER = 'RE_CUSTMER';
RE_CUSTMER = NCMB.Object.extend(C_CUSTMER);

C_ITEM = 'RE_ITEM';
RE_ITEM = NCMB.Object.extend(C_ITEM);

module.exports = {
    init: function() {},
    // ---------------------------------
    // データ変更（Record -> Model）
    // ---------------------------------
    toModel: function(record) {
        var json = record.toJson.toJson();
        var model = eval('(' + json + ')');
        return model;
    },
    // ---------------------------------
    // データ変更（Model -> Record）
    // ---------------------------------
    toRecord: function(id, model) {
        var record = null;
        // タイプによってレコード生成
        if (id == 'RE_CUSTMER') {
            record = new RE_CUSTMER();
        }
        if (id == 'RE_ITEM') {
            record = new RE_ITEM();
        }
        // Modelの内容をRecordへ移送
        Object.keys(model).forEach(function(key) {
            if (key != "createDate" && key != "updateDate") {
                record.set(key, model[key]);
            }
        });
        //console.log("データ変更 @" + angular.toJson(record));
        return record;
    },

    // ---------------------------------
    // 顧客情報の保存
    // 引数：
    // 		custModel  :更新データ
    // 戻り：
    // ---------------------------------
    saveCustmer: function(custModel) {
        console.log("ncmb saveCustmer");

        // 顧客レコードへの変換
        var custRec = ncmb.toRecord('RE_CUSTMER', custModel);
        // console.log("ncmb saveCustmer 顧客レコードへの変換:" + angular.toJson(custRec));
        // console.log("ncmb saveCustmer id:" + custRec.id);

        // ログインしていない場合は更新しない
        // if (isUndefined(ReDBService.getUserId())) {
        //     return promise.resolve(true);
        // }

        // 保存
        custRec.save({
            success: function(result) {
                return true;
            },
            error: function(error) {
                console.log("ncmb saveCustmer() error:" + error);
                return false;
            }
        });
    },

    addCustmer: function() {},
    // -------------------------------------------
    // 顧客データの取得
    // -------------------------------------------
    getCustmer: function() {
        var query = new NCMB.Query(C_CUSTMER);
        // // タイムスタンプより大きいデータが対象
        // if (TimeStamp != null && TimeStamp != undefined && TimeStamp != "") {
        //     query.greaterThan("updateDate", new Date(TimeStamp));
        // }
        query.limit(1000);
        query.find({
            success: function(results) {
                console.log("C_CUSTMER LENGTH:" + results.length);
                custmerList = [];

                // データ移送
                __.each(results, function(c) {
                    var cus = {
                        objectId: c.id,
                        createDate: c.get("createDate"),
                        updateDate: c.get("updateDate"),
                        deleteFlag: c.get("deleteFlag"),
                        name: c.get("name"),
                        namekana: c.get("namekana"),
                        yuubin: c.get("yuubin"),
                        addr: c.get("addr"),
                        addrSub: c.get("addrSub"),
                        tel: c.get("tel"),
                        fax: c.get("fax"),
                        mobile: c.get("mobile"),
                        email: c.get("email"),
                    };
                    custmerList.push(cus);
                });
                // 戻り値を取得したデータリストとする
                return custmerList;
            },
            error: function(error) {
                return custmerList;
            }
        });

    },
    getTest: function() {
        var TestClass = NCMB.Object.extend("TestClass");
        var testClass = new TestClass();

        var query = new NCMB.Query(TestClass);
        query.equalTo("message", "test");
        query.find({
            success: function(results) {
                if (results[0] != null) {
                    console.info(results[0].get("message"));
                }
                else {
                    testClass.set("message", "Hello, NCMB!");
                    testClass.save({
                        success: function(results) {
                            console.info("Success", results.get("message"));
                        }
                    });
                    console.log("Save..");
                }
            },
            error: function(results) {
                console.error(results);
            }
        });

    },

};
