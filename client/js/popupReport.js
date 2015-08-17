'use strict';
var mitumori_rec = {};
var mitumorimeisai_rec = {};
var report_filname = "";


var report_config = {
    layout: {
        name: 'report_layout',
        padding: 4,
        panels: [
            { type: 'left', size: '50%', resizable: true, minSize: 300 },
            { type: 'main', minSize: 300 }
        ]
    },
    grid: { 
        name: 'report_gridItem',
        columns: [
            { field: 'name', caption: '見積書名', size: '33%', sortable: true, searchable: true },
            { field: 'type', caption: '様式', size: '33%', sortable: true, searchable: true },
        ],
        records: [
            { recid: 1, name: '見積書　様式１', type: 'A4縦', filename: 'report1.html' },
            { recid: 2, name: '見積書　様式２', type: 'A4縦', filename: 'report2.html' },
        ],
        // ---------------------------------
        // ロード完了
        // ---------------------------------
        onLoad: function(event) {
        },
        // ---------------------------------
        // 明細クリック
        // ---------------------------------
        onClick: function(event) {
            var grid = this;
            var form = w2ui.report_form;
            event.onComplete = function () {
                var sel = grid.getSelection();
                if (sel.length == 1) {
                    form.recid  = grid.getSelection();
                    form.record = $.extend(true, {}, grid.get(sel[0]));
                    form.refresh();
                    report_filname = grid.get(sel[0]).filename;
                } else {
                    form.clear();
                }
            };
        }
    },
    form: { 
        name: 'report_form',
        formURL: 'webclient/popupReport.html',
        fields: [
            { name: 'name', type: 'text'},
            { name: 'type', type: 'text'},
            { name: 'filename', type: 'text'},
        ],
        actions: {
            pdf: function () {
                console.log("pdf");
                makePdf("pdf");
            },
            download: function () {
                console.log("download");
                makePdf("download");
            }
        }
    }
};
function makePdf(mode) {
    if (report_filname == "") {
        w2alert('出力する見積書を選択して下さい。');
        return;
    }

    // ダイアログのロック
    w2popup.lock('作成中...', true);

    // 送信データ作成
    var postData = MakeReportData();
    // バイナリデータの受信
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/report', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        // ArrayBufferで返ってくる
        var file = new Blob([xhr.response], {type: 'application/pdf;name="abc.pdf"'});
        var fileURL = URL.createObjectURL(file);
        if (mode == 'pdf') {
            // popup windowでの表示
            window.open(fileURL);
        } else {
            // ファイルのダウンロード
            var a = document.createElement('a');
            a.download = "test.pdf";
            a.href = fileURL;
            a.click();  
        }
        // ダイアログのロック解除
        w2popup.unlock();
        // ダイアログを閉じる
        // w2popup.close();
        
    };
    xhr.send(JSON.stringify(postData));
}

$(function () {
    // w2utils.locale('/json_path/locale/ja-jp.json');
    // initialization in memory
    $().w2layout(report_config.layout);
    $().w2grid(report_config.grid);
    $().w2form(report_config.form);
});

function openPopup_report(mitsu, mitsumei) {
    mitumori_rec = mitsu;
    mitumorimeisai_rec = mitsumei;
    w2popup.open({
        title   : 'Popup',
        width   : 900,
        height  : 600,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('report_layout');
                w2ui.report_layout.content('left', w2ui.report_gridItem);
                w2ui.report_layout.content('main', w2ui.report_form);
            };
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.report_layout.resize();
            };
        }
    });
}

// ---------------------------------
// レポートデータ作成
// ---------------------------------
function MakeReportData() {
    var reportData = {};

    reportData["template"] = report_filname;
    reportData["mitsumori_date"] = mitumori_rec.mitsumori_date;
    reportData["mitsumori_no"] = mitumori_rec.mitsumori_no;
    reportData["mitsumori_kingaku"] = '';
    reportData["title"] = mitumori_rec.title;
    reportData["name"] = mitumori_rec.name;
    reportData["mitsumori_kigen_date"] = mitumori_rec.mitsumori_kigen_date;
    reportData["kesai_jyouken"] = mitumori_rec.kesai_jyouken;
    reportData["nouki_date"] = mitumori_rec.nouki_date;
    reportData["nounyuu_basyo"] = mitumori_rec.nounyuu_basyo;
    reportData["tantousya_name"] = mitumori_rec.tantousya_name;
    reportData["mitsumori_meisai"] = mitumori_rec;

    // 明細行の移送
    reportData["mitsumori_meisai"] = mitumorimeisai_rec;

    // 明細行の編集
    _.each(reportData.mitsumori_meisai, function(meisai) {
        // 単価
        if (meisai.mei_tanka != undefined && meisai.mei_tanka != null) {
            var num = numeral().unformat(meisai.mei_tanka);
            if (w2utils.isInt(num)) {
                meisai.mei_tanka = numeral(num).format('0,0');
            }
        }
        // 数量
        if (meisai.mei_suuryo != undefined && meisai.mei_suuryo != null) {
            var num = numeral().unformat(meisai.mei_suuryo);
            if (w2utils.isInt(meisai.mei_suuryo)) {
                meisai.mei_suuryo = numeral(num).format('0,0');
            }
        }
        // 金額
        if (meisai.mei_kingaku != undefined && meisai.mei_kingaku != null) {
            var num = numeral().unformat(meisai.mei_kingaku);
            if (w2utils.isInt(meisai.mei_kingaku)) {
                meisai.mei_kingaku = numeral(num).format('0,0');
            }
        }
    });
    // 空白明細行の追加
    var linecnt = mitumorimeisai_rec.length;
    for (var idx = 15; idx > linecnt; idx--) {
        reportData["mitsumori_meisai"].push({
            mei_title: "　"
        });
    }

    // 合計行の作成
    var goukei_suu = 0;
    var goukei_kin = 0;
    _.each(mitumorimeisai_rec, function(meisai) {
        if (meisai.mei_suuryo != undefined && meisai.mei_suuryo != null) {
            var num = numeral().unformat(meisai.mei_suuryo);
            if (_.isNumber(num)) {
                goukei_suu = goukei_suu + Number(num);
            }
        }
        if (meisai.mei_kingaku != undefined && meisai.mei_kingaku != null) {
            var num = numeral().unformat(meisai.mei_kingaku);
            if (_.isNumber(num)) {
                goukei_kin = goukei_kin + Number(num);
            }
        }
    });
    reportData["goukei_suuryo"] = numeral(goukei_suu).format('0,0');
    reportData["goukei_kingaku"] = numeral(goukei_kin).format('0,0');
    
    // 数値を全角変換
    var total = numeral(goukei_kin).format('0,0');
    total = total.replace( /[A-Za-z0-9-!"#$%&'()=<>,.?_\[\]{}@^~\\]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 65248);
    });
    reportData["mitsumori_kingaku"] = total + '円';

    return reportData;
}
