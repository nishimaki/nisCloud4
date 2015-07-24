// ---------------------------------
// metalsmithモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {
    // Reportテスト(metalsmith)
    moduleApp.post('/report', function(req, res) {

        console.log(__dirname);

        var swig = require('swig');
        var Metalsmith = require('metalsmith');
        var markdownit = require('metalsmith-markdownit');
        var templates = require('metalsmith-templates');

        var metalsmith = Metalsmith(__dirname);

        // 指示ファイル作成
        console.log(req.body);
        var fs = require('fs');
        var writedata = "";
        writedata += "---\n";
        writedata += JSON.stringify(req.body, null, '    ');
        writedata += "\n";
        writedata += "---\n";
        fs.writeFile(__dirname + '/_source/index.md', writedata , function (err) {
            console.log(err);
        });

        // Html生成
        metalsmith
            .source('_source')
            .destination('_build')
            .use(markdownit('default'))
            .use(templates({
                engine: 'swig',
                directory: '_template'
            }))
            .build(function(err, files) {
                if (err) console.log(err);
                if (!err) {
                    var wkhtmltopdf = require('wkhtmltopdf');
                    var fs = require('fs');
            
                    var filename = "pdftest.pdf";
                    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
                    res.setHeader('Content-type', 'application/pdf');
            
                    // PDFの生成
                    fs.readFile(__dirname + '/_build/index.html', 'utf8', function (err, text) {
                        wkhtmltopdf(text, {
                                pageSize: 'A4'
                            })
                            // .pipe(fs.createWriteStream('out.pdf'))
                            .pipe(res);
                    });
                }
            });
    });
};
