'use strict';
var mitumori_rec = {};
var mitumorimeisai_rec = {};
var m_type = 'S';

var mitsumori_config = {
    layout: {
        name: 'temp_layout',
        padding: 0,
        panels: [
            { type: 'top', size: 32, content: '<div style="padding: 7px;">アイテムの選択</div>', style: 'border-bottom: 1px solid silver;' },
            { type: 'left', size: 150, resizable: true, minSize: 120 },
            { type: 'main', minSize: 350, overflow: 'hidden' }
        ]
    },
    sidebar: {
        name: 'temp_sidebar',
        nodes: [ 
            { id: 'general', text: 'General', group: true, expanded: true, nodes: [
                { id: 'gridItem', text: '商品マスタ', img: 'icon-page', selected: true },
                { id: 'gridTemplate', text: 'テンプレート', img: 'icon-page' }
            ]}
        ],
        onClick: function (event) {
            switch (event.target) {
                case 'gridItem':
                    // 明細タイプ：商品
                    m_type = 'S';
                    // 商品グリッドの表示
                    w2ui.temp_layout.content('main', w2ui.temp_gridItem);
                    break;
                case 'gridTemplate':
                    // 明細タイプ：見出し
                    m_type = 'M';
                    // テンプレートグリッドの表示
                    w2ui.temp_layout.content('main', '<div style="padding: 10px">Some HTML</div>');
                    $(w2ui.temp_layout.el('main'))
                        .removeClass('w2ui-grid')
                        .css({ 
                            'border-left': '1px solid silver'
                        });
                    break;
            }
        }
    },
    grid: { 
        name: 'temp_gridItem',
        style: 'border: 0px; border-left: 1px solid silver',
        url: '/item',
        show: { 
            toolbar: true,
        },
        toolbar: {
            items: [
                { type: 'break' },
                { type: 'button', id: 'addItem', caption: '登録', icon: 'fa fa-check' },
            ],
            onClick: function (target, data) {
                console.log(target);
                if (target == 'addItem'){
                    console.dir(mitumori_rec);
                    console.dir(data);
                    console.log("m-type:");
                    console.dir(m_type);
                    // 明細への登録
                    var postData = {
                        cmd: 'save-record',
                        recid: '',
                        parent_id: mitumori_rec.recid,
                        parent_type: 'T',
                        record:  {
                            mei_title: mitumorimeisai_rec.name,
                            meisai_type: {
                                id: m_type,
                            },
                            mei_kikaku: mitumorimeisai_rec.spec,
                            mei_tanka: mitumorimeisai_rec.price,
                            mei_suuryo: 1,
                            mei_tani: "単",
                            mei_kingaku:  mitumorimeisai_rec.price * 1,
                            mei_bikou: mitumorimeisai_rec.maker,
                        }
                    };

                    $.ajax({
                        type: "POST",
                        url: "/bizmitsumorimei",
                        data: postData,
                        success: function(msg) {
                            // 強制更新
                            w2ui['myMeisaiGrid'].reload();
                            // ダイアログを閉じる
                            w2popup.close();
                        }
                    });

                }

            }
        },
		columns: [{
				field: 'code',
				caption: 'code',
				size: '80px',
				sortable: true 
            }, {
				field: 'name',
				caption: '商品名',
				size: '200px',
				sortable: true
            }, {
				field: 'spec',
				caption: '規格',
				size: '80px',
				sortable: true
            }, {
				field: 'price',
				type: 'int',
				caption: '単価',
				size: '60px',
				sortable: true
            }, {
				field: 'maker',
				caption: 'メーカー名',
				size: '200px',
				sortable: true
            }, 
        ],
        // ---------------------------------
        // ロード完了
        // ---------------------------------
        onLoad: function(event) {
            w2ui.temp_gridItem.toolbar.disable('addItem');
        },
        // ---------------------------------
        // 明細クリック
        // ---------------------------------
        onClick: function(event) {
            w2ui.temp_gridItem.toolbar.enable('addItem');
            console.dir(event);
            // クリックした明細を退避
            mitumorimeisai_rec = w2ui['temp_gridItem'].get(event.recid);

        },
    }
}

$(function () {
    // w2utils.locale('/json_path/locale/ja-jp.json');
    // initialization in memory
    $().w2layout(mitsumori_config.layout);
    $().w2sidebar(mitsumori_config.sidebar);
    $().w2grid(mitsumori_config.grid);
});

function openPopup_temp(rec) {
    mitumori_rec = rec;
    w2popup.open({
        title   : '見積明細',
        width   : 900,
        height  : 700,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('temp_layout');
                w2ui.temp_layout.content('left', w2ui.temp_sidebar);
                w2ui.temp_layout.content('main', w2ui.temp_gridItem);
            }
        },
        onToggle: function (event) { 
            event.onComplete = function () {
                w2ui.temp_layout.resize();
            }
        }        
    });
}