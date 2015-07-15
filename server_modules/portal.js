// ---------------------------------
// Portalモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {

    // ポータルデータの取得
    moduleApp.get('/portal', function(req, res) {
        console.log("portal get!!");

        var portalList = [{
            title: 'タイトル１'
        }, {
            title: 'タイトル２'
        }, {
            title: 'タイトル３'
        }];
        res.send(portalList);

    });

    // ポータルデータの取得
    moduleApp.get('/portalpdf', function(req, res) {
        var PDFDocument = require('pdfkit');
        var fs = require('fs');

        var doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('output.pdf'));

        doc.font('Times-Roman')
            .fontSize(25)
            .text('Some text with an existing font!', 100, 100);

        doc.font('fonts/ipam.ttf')
            .fontSize(12)
            .text('あいうえおテスト漢字Some text with an existing font!')
            .moveDown(0.5);
        doc.font('fonts/ipagp.ttf')
            .fontSize(12)
            .text('あいうえおテスト漢字Some text with an existing font!')
            .moveDown(0.5);

        doc.addPage()
            .fontSize(25)
            .text('Here is some vector graphics...', 100, 100);
        doc.font('fonts/ipam.ttf')
            .fontSize(12)
            .text('あいうえおテスト漢字Some text with an existing font!')
            .moveDown(0.5);
        doc.font('fonts/ipagp.ttf')
            .fontSize(12)
            .text('あいうえおテスト漢字Some text with an existing font!')
            .moveDown(0.5);

        doc.save()
            .moveTo(100, 150)
            .lineTo(100, 250)
            .lineTo(200, 250)
            .fill("#FF3300");

        doc.scale(0.6)
            .translate(470, -380)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('red', 'even-odd')
            .restore();

        doc.addPage()
            .fillColor("blue")
            .text('Here is a link!', 100, 100)
            .underline(100, 100, 160, 27, {
                color: "#0000FF"
            })
            .link(100, 100, 160, 27, 'http://google.com/');

        // var filename = 'output.pdf';
        // res.set({
        //     "Content-Disposition": 'attachment; filename="' + filename + '"'
        // });
        doc.pipe(res);
        doc.end();

    });

    // // mongo TEST
    // var model = require('./model/mongotest');

    // app.get('/mongo', function(req, res) {
    //     var parent = new Parent({});
    //     parent.save();
    //     var child = new Child({parent:parent._id});
    //     child.save(); //the parent children property will now contain child's id 
    //     // var child2 = new Child({parent:parent._id});
    //     // child2.save(); //the parent children property will now contain child's id 
    //     child.remove();

    //     res.send("OK");
    // });

    // sqlite3 TEST
    moduleApp.get('/sqlite', function(req, res) {
        
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('niscloud.db');
        
        db.run("INSERT INTO messages (content) VALUES (?)", "TEST MESSGAE", function(err, rows){
          if (!err) {
            db.all("SELECT content FROM messages", function(err, rows){
              if (!err) {
                res.send(rows);
              } else {
                res.send(err);
              }   
            }); 
          } else {
            res.send(err);
          }  
        });
    });
};