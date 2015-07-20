// ---------------------------------
// ORDER句の生成
// ---------------------------------
module.exports.makeSqlWhere = function(orgWhere, ReqBody) {
    var where = "";
    var logic = " AND";
    // search指定が存在するか？
    if (ReqBody.hasOwnProperty("searchLogic")) {
        logic = " " + ReqBody.searchLogic;
    }
    
    if (ReqBody.hasOwnProperty("search")) {
        if (ReqBody.sort != undefined && ReqBody.search.length != 0) {
            __.each(ReqBody.search, function(search) {
                var field = search.field;
                var type = search.type;
                var operator = search.operator;
                var value = search.value;
                
                var jyouken = "";
                var textMark = "";
                var textLikeL = "";
                var textLikeR = "";
                // 完全一致
                if (operator == "is") {
                    jyouken = " == ";
                }
                // 以上
                if (operator == "begins") {
                    jyouken = " >= ";
                }
                // 前方一致
                if (operator == "begins with") {
                    jyouken = " LIKE ";
                    textLikeL = "%";
                }
                // 含む
                if (operator == "contains") {
                    jyouken = " LIKE ";
                    textLikeL = "%";
                    textLikeR = "%";
                }
                // 未満
                if (operator == "ends") {
                    jyouken = " <= ";
                }
                // 後方一致
                if (operator == "ends with") {
                    jyouken = " LIKE ";
                    textLikeR = "%";
                }
                // 範囲
                if (operator == "between") {
                    jyouken = " BETWEEN ";
                }
                // 文字列型
                if (type == "text"){
                    textMark = "'";
                }
                
                if (where != "") {
                    where += logic;
                }
                // 比較条件文連結
                where += " " + field + jyouken + textMark + textLikeL + value + textLikeR + textMark;
            });
        }
    }
    if (where == "") {
        return where;
    }
    if (orgWhere != "") {
        return " AND (" + where + ")";
    } else {
        return "(" + where + ")";
    }
};
// ---------------------------------
// ORDER句の生成
// ---------------------------------
module.exports.makeSqlOrder = function(ReqBody) {
    // ORDER句
    var order = "";
    // sort指定が存在するか？
    if (ReqBody.hasOwnProperty("sort")) {
        if (ReqBody.sort != undefined && ReqBody.sort.length != 0) {
            __.each(ReqBody.sort, function(sort) {
                if (order != "") {
                    order += " ,";
                }
                else {
                    order += " ORDER BY ";
                }
                order += " " + sort.field + " " + sort.direction;
            });
        }
    }
    return order;
};
