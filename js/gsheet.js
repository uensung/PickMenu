var GSheet = (function () {
    function GSheet(key, header) {
        if (key === void 0) { key = null; }
        if (header === void 0) { header = 1; }
        this.qurl = "https://docs.google.com/spreadsheets/d/{key}/gviz/tq?";
        this.key = null;
        this.tqx = 'out:json';
        this.header = 1;
        this.setKey(key);
        this.header = header;
    }
    GSheet.prototype.setKey = function (key) {
        this.key = key;
    };
    GSheet.prototype.parse = function (json) {
        var data = JSON.parse(json);
        var cols = data.table.cols;
        var rows = data.table.rows;
        var column_length = cols.length;
        if (!column_length || !rows.length) {
            return false;
        }
        var columns = [], result = [], row_length, value;
        var column_idx, rows_idx, row_idx;
        for (column_idx in cols) {
            columns.push(cols[column_idx].id);
        }
        for (rows_idx in rows) {
            row_length = rows[rows_idx]['c'].length;
            if (column_length != row_length) {
                return false;
            }
            for (row_idx in data.table.rows[rows_idx]['c']) {
                if (!result[rows_idx]) {
                    result[rows_idx] = {};
                }
                value = !!rows[rows_idx]['c'][row_idx] ? rows[rows_idx]['c'][row_idx].v : null;
                result[rows_idx][columns[row_idx]] = value;
            }
        }
        return result;
    };
    GSheet.prototype.query = function (option) {
        return this.dquery(this.key, option);
    };
    GSheet.prototype.request = function (option) {
        return this.drequest(this.key, option);
    };
    GSheet.prototype.drequest = function (dkey, option) {
        if (dkey == null) {
            throw new Error("key가 없습니다.");
        }
        var params = {
            tq: encodeURIComponent(option.sql),
            header: this.header,
            tqx: this.tqx
        };
        if (option.sheetName) {
            params.sheet = encodeURIComponent(String(option.sheetName));
        }
        else if (option.gid) {
            params.gid = option.gid;
        }
        else {
            throw new Error("gid또는 sheet 이름이 잘못됨");
        }
        var qs = [];
        for (var key in params) {
            qs.push(key + '=' + params[key]);
        }
        return $.ajax((this.qurl.replace("{key}", dkey) + qs.join('&')), {
            type: "get",
            crossDomain: true,
            dataType: "text",
            success: function (data) {
                try {
                    data = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
                }
                catch (e) {
                    console.log(e);
                    throw "request data error";
                }
                if (option.callback)
                    option.callback(data);
            },
            error: function (e) {
                console.error("ERROR", e);
            }
        });
    };
    GSheet.prototype.dquery = function (dkey, option) {
        var self = this;
        if (option.callback) {
            var fn = option.callback;
            option.callback = function (jsonStr) {
                try {
                    var p = self.parse(jsonStr);
                }
                catch (e) {
                    throw new Error("파싱오류");
                }
                fn.call(null, p);
            };
        }
        return this.drequest(dkey, option);
    };
    return GSheet;
}());
