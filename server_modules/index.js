// Global
__ = require('underscore');
ncmb = require('./ncmb');
// util = require('./util');
PDFDocument = require('pdfkit'); 
sqlite3 = require('sqlite3').verbose();

/***
mongoose = require('mongoose');
mongodb = mongoose.connect('mongodb://localhost/niscloud');
Schema = mongoose.Schema,
         relationship = require("mongoose-relationship");
***/

// exports
module.exports = {
    user: require('./user'),
    chat: require('./chat'),
    portal: require('./portal'),
    bizmitsumori: require('./bizMitsumori'),
    mntcustmer: require('./mntCustmer'),
    mntitem: require('./mntItem'),
};