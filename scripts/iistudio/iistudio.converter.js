
var cookies = function () {
    var _secure;
    read = function (key) {
        var result = $.cookie(key);
        return result;
    };

    //remark
    write = function (key, value, day) {
        var p = { expires: (day || 1), path: '/', secure: _secure };
  
        $.cookie(key, value, p);
    };
    remove = function (key) {
        //  $.cookie(key, '', { expires: -1 });
        $.removeCookie(key, { path: '/' });
        $.log.log('after del' + $.cookie(key));

    }
    _secure = ('https:' == document.location.protocol);
    return this;
}();

function appendObject(aObj, aData) {
    result = aObj;
    if (aData != null) {
        for (var propertyName in aData) {
            result[propertyName] = aData[propertyName];
        }
    }
}

function roundNumber(num, scale) {
    var number = Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);
    if (num - number > 0) {
        return (number + Math.floor(2 * Math.round((num - number) * Math.pow(10, (scale + 1))) / 10) / Math.pow(10, scale));
    } else {
        return number;
    }
}


var converter = {
    removeCommon: function (s) {
        return s.replace(/\,/g, "")
    },
    toString: function (s) {
        if (!s)
            s = "";
        var t = String(s);
        return t.replace(/^\s+|\s+$/g, '');
    },
    toBoolean: function (s) {
        if (typeof (s) == 'undefined')
            return false;

        if (typeof (s) == "string") {
            s = s.toLowerCase();
            return (s == "true" || s == "1");
        } else
            return s;
    },
    toFloat: function (s) {
        if (!s || typeof (s) == 'undefined' || s == "" || s == "NaN")
            s = '0';
        else {
            if (typeof (s) == "string") {
                s = s.replace(/\,/g, "");
                s = this.toNoCommas(s);
            }
        }
        return parseFloat(s);
    }, toNumber: function (s, digit) {
        if (typeof (s) == 'undefined' || s == "")
            s = '0';
        else {
            if (typeof (s) == "string")
                s = s.replace(/\,/g, "");
        }
        return parseFloat(s).toFixed(digit);

    },
    toNoTagString: function (html) {
        return html.replace(/<[^>]*>?/gm, '');
    }
    , toBR: function (s, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (s + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }, toInt: function (s) {
        if (typeof (s) == 'undefined' || s == "")
            s = '0';
        if (typeof (s) == 'string')
            s = s.replace(/\,/g, "");
        return parseInt(s);

    }, toPositive: function (s) {
        //�����
        if (typeof (s) == 'undefined' || s == "")
            s = 0;
        var t = parseInt(s);
        if (t < 0)
            t = 0;
        return t;
    }, toCommasNumber: function (s) {
        var t = s || "";
        var parts = t.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
        return parts.join(".");
    }, toNoCommas: function (s) {
        if (typeof (s) == 'undefined' || s == "")
            s = '0';
        var result = s;
        if (s.toString().indexOf(',') > -1)//modify by nico for no comma exception 20181225
            result = s.replace(/,/g, '');
        return result;
    }, isCommaNumber: function (fieldsName, s, customNumberFields) {
        var numberFields = ["qty", "price", "amt", "scheduledQty", "total", "tax", "wgt", "stockQty", "stockWgt", "avaliableQty"];
        if (numberFields.indexOf(fieldsName) == -1)
            if (customNumberFields == null || customNumberFields.indexOf(fieldsName) == -1)
                return false;
        var t = String(s).replace(/,/g, '');
        if (!isNaN(t)) {
            return true;
        } else
            return false;
    }, removeDoubleQuotes: function (s) {
        return s.replace(/['"]+/g, '');
    },
    toSingleQuote: function (s) {
        return s.replace(/"/g, '\'');
    },

    toDoubleQuote: function (s) {
        return s.replace(/'/g, '"');
    }

}

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);
}


function Convert() { };
Convert.toBR = function (s, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (s + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

var DateConvert = {
    dayAfter: function (aDate, days) {
        var last = new Date(aDate + (days * 24 * 60 * 60 * 1000));
        var day = last.getDate();
        var month = last.getMonth() + 1;
        var year = last.getFullYear();
        return year + "/" + month + "/" + day;
    },
    monthAfter: function (aDate, aMonth) {
        aDate.setMonth(aDate.getMonth() - aMonth);
        var year = aDate.getFullYear();
        var month = aDate.getMonth() + 1;
        var day = aDate.getDate();
        return year + "/" + month + "/" + day;
    },
    addDays: function (days) {
        var d = new Date();
        d.setDate(d.getDate() + days);
        return d.format("yyyy/MM/dd");
    },
    today: function () {
        var d = new Date();
        var result = d.format("yyyy/MM/dd");
        return result;
    }
}

