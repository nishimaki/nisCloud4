// ---------------------------------
// Portalモジュール
// ---------------------------------
module.exports.init = function(moduleApp) {
    // Reportテスト(metalsmith)
    moduleApp.get('/metal', function(req, res) {

        console.log(__dirname);

        var swig = require('swig');
        var Metalsmith = require('metalsmith');
        var markdownit = require('metalsmith-markdownit');
        var templates = require('metalsmith-templates');

        var metalsmith = Metalsmith(__dirname);

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
                
                    var wkhtmltopdf = require('wkhtmltopdf');
                    var fs = require('fs');
            
                    var filename = "pdftest.pdf";
                    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
                    res.setHeader('Content-type', 'application/pdf');
            
                    // URL 
                    fs.readFile(__dirname + '/_build/index.html', 'utf8', function (err, text) {
                        wkhtmltopdf(text, {
                                pageSize: 'letter'
                            })
                            // .pipe(fs.createWriteStream('out.pdf'));
                            .pipe(res);
                    });
            });
    });
};
