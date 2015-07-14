
function validator(v) {
    return v.length > 0;
}

var Custmer = new Schema({
    code: {
        type: String,
        validate: [validator, "Empty Error"]
    },
    name_sei: {
        type: String,
        validate: [validator, "Empty Error"]
    },
    name_mei: {
        type: String,
        validate: [validator, "Empty Error"]
    },
    kananame_sei: {
        type: String,
    },
    kananame_mei: {
        type: String,
    },
    birthday: {
        type: String,
    },
    yuubin_no: {
        type: String,
    },
    addr: {
        type: String,
    },
    tel: {
        type: String,
    },
    email: {
        type: String,
    },
});
exports.Custmer = mongodb.model('Custmer', Custmer);
