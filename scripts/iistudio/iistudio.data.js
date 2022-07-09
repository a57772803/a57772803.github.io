function queryData(pageName, pageIndex, pageSize, keyword, exWhere, callback, allFields) {
    var t = { pageName: pageName, pageIndex: pageIndex, pageSize: pageSize, queryFields: 'keyword=' + keyword, exWhere: exWhere, allFields: allFields };    
    var param = {
        'spName': 'queryData', 'params': JSON.stringify(t), 'exParams': ''
    };
    var url = '/api/data/query';
    ajaxPost(url, param, function (data) {
        callback(data);
    });
}

function querySp(spName, spParams, spExParams, callback) {
    var param = {
        'spName': spName, 'params': JSON.stringify(spParams), 'exParams': JSON.stringify(spExParams)
    };
    var url = '/api/data/query';
    ajaxPost(url, param, function (data) {
        callback(data);
    });
}

function update(aData, aTableName, aExData, aDbAlias, aCallback) {
    /* var url = '/Utils/IISService.asmx/updateEx';
      if (typeof (aExData) == "undefined")
          aExData = "";
             var param = '{data:"' + escape(JSON.stringify(aData)) + '",tableName:"' + aTableName + '",aExData:"' + escape(aExData) + '",aDbAlias:"' + aDbAlias || _dbAlias + '"}';
      //doAjax(url, param, function () { updateCallback(aCallback); });
      doAjax(url, param, aCallback);
      */
    var url = "/api/data/update";
    var param = {
        'data': escape(JSON.stringify(aData)), 'tableName': aTableName,
        exData: escape(aExData), dbAlias: aDbAlias || '', userId: user.id()
    };
    apiPost(url, param, aCallback);
}


//20181112 add dbAlias
function disableDataEx(data, callback, dbAlias) {
    var url = "/api/data/disableDataEx";
    var param = {
        "tableName": data.tableName, "uid": data.uid, "dbAlias": dbAlias || ''
    }
    ajaxPost(url, param, function (data) {
        if (typeof (callback) == 'function')
            callback(data);
    });
}

function getDataBySP(spName, params, exParam, callback) {
    var url = '/api/data/query';
    var t = {
        'spName': spName, 'params': JSON.stringify(params), 'exParams': exParam
    };
    ajaxPost(url, t, function (data) {
        callback(data);
    });
}

function bindDdlData(ddl, data, defaultId) {
    $(ddl).empty();
    $.each(JSON.parse(data), function (index, d) {
        $('<option></option>').data('data', d).val(d.uid).html(d.name).appendTo(ddl);
    });
    if (defaultId)
        $(ddl).val(defaultId);
}

function bindDdl(ddl, tableName, defaultId, nameFields, allFields) {
    $.log.log('bindDdl table ' + tableName)
    queryData(tableName, 1, 999, '', '', function (data) {
        //$.log.log(data);
        $(ddl).empty();
        $(ddl).append('<option value="-1"></option>');
        if (!nameFields)
            nameFields = ['name'];

        $.each(JSON.parse(data), function (index, d) {
            var value = "";
            $.each(nameFields, function (i, k) {
                if (value) value += ' ';
                value += d[k];
            })
            $('<option></option>').data('data', d).val(d.uid).html(value).appendTo(ddl);
        });
        if (defaultId)
            $(ddl).val(defaultId);
    }, allFields || false);
}

function clientCompleteSelected(event, ui) {
    $('.clientIdWrap').find("input[type=hidden]").val(ui.item.value);
    $('#ddlPaymentTypeId').val(ui.item.data.paymentTypeId);
    $('#ddlTransportTypeId').val(ui.item.data.transportTypeId);
    $('#ddlTaxTypeId').val(ui.item.data.taxTypeId);
    $('#ddlCurrencyId').val(ui.item.data.currencyId);
    queryData('contactPerson', 1, 99, '', '@pageUid=8020002,@parentId=' + ui.item.data.uid, function (data) {
        bindDdlData($('#ddlClientContactPersonId'), data);
        queryData('currencyDetail', 1, 5, '', '@currencyId=' + $('#ddlCurrencyId').val(), function (data) {
            $('#txCurrencyRate').val(1);
            var t = JSON.parse(data);
            if (t.length > 0) {
                $('#txCurrencyRate').val(t[0].rate);
                $('#txCurrencyRate').trigger('change');
            }
        })
    })

    //erp.getClientContactEx(ui.item.value);

    /* if (typeof (customBindClientDefault) == 'function') {
         var param = '{aParentField:"uid", aParentId:"' + aId + '",aTableName:"client"}';
         getDataList(param, customBindClientDefault);
     }*/
}

function getClientContact(clientId) {
    if (!clientId)
        return;
    queryData('contactperson', 1, 99, '', '@clientId=' + clientId, function (data) {
        bindClientContact(data, clientId);
    });
}

function bindClientContact(data, aClientId) {
    $('.ddlClientContactPersonId').find('option').remove();
    $('.ddlClientContactPersonId').append($('<option></option>'));
    var a = JSON.parse(data);
    $(a).each(function (index, d) {
        var name = d.name;
        var id = d.uid;
        $('.ddlClientContactPersonId').append($('<option value="' + id + '">' + name + '</option>'));
    })

    $('.ddlClientContactPersonId').change(function () {
        $('.ClientConatcePersonIdWrap').find('input[type=hidden]').val($(this).val());
    });

    var personId = $('.ClientConatcePersonIdWrap').find('input[type=hidden]').val();
    if (personId != "") {
        $('.ddlClientContactPersonId option[value="' + personId + '"]').prop('selected', true);
    }
    else {
        if ($('.ddlClientContactPersonId').find('option').length > 1) {
            $('.ddlClientContactPersonId option:eq(1)').prop('selected', true);
            $('.ClientConatcePersonIdWrap').find('input[type=hidden]').val($('.ddlClientContactPersonId option:selected').val());
        }
    }
}

/*
function getClientDefaultEx(aClientId) {
    if (typeof (aClientId) == "undefined" || aClientId == "")
        return;
    var t = '{parentField:"uid", parentId:"' + aClientId + '",tableName:"client"}';
    var param = { "aParam": t, "aDbAlias": _dbAlias };

    getDataListExa(param, _self.bindClientDefaultEx);
}

function bindClientDefaultEx(d) {
    var data = JSON.parse(d)[0];
    $('.ddlSalesId').val(data.salesId);

    if (data.paymentTypeId)
        $('.ddlPaymentTypeId').val(data.paymentTypeId);

    if (data.transportTypeId)
        $('.ddlTransportTypeId').val(data.transportTypeId);

    if (data.taxTypeId)
        $('.ddlTaxTypeId').val(data.taxTypeId);

    if (data.currencyId)
        $('.ddlCurrencyId').val(data.currencyId);

    _self.getCurrencyRateEx($('.ddlCurrencyId option:selected').val());
}*/

function materialCompleteSelected(event, ui) {
    if (_detailGrid) {
        var t = ui.item.data;
        var d = { materialId: t.uid, materialNo: t.no, materialName: t.name, unitId: t.unitId, price: t.price }
        _detailGrid.append(d);
    }
    $('.materialSearchBox').val("");
}

function materialRowComplete(sender) {
    var ddl = $(sender).find("#unitId");
    if ($(sender).find("#unitId").length > 0) {
        getDataBySP('getMaterialUnits', { materialId: $(sender).find("#materialId").val() }, '', function (data) {
            bindDdlData($(ddl), data, $(ddl).val());
        })
    }
}

function bindAutocomplete(input, tableName, selectedCallback) {
    $(input).autocomplete({
        source: function (request, response) {
            queryData(tableName, 1, 20, $(input).val(), '', function (data) {
                var json = JSON.parse(data);
                response($.map(json, function (item) {
                    return {
                        label: item.name,
                        value: item.uid,
                        data: item
                    };
                }));
            });
        },
        minLength: 1,
        focus: function (event, ui) {
            return false;
        },
        select: function (event, ui) {
            this.value = ui.item.label;
            //   this.value = "";
            this.focus();
            selectedCallback(event, ui);
            return false;
        }
    });
}

function deleteRow(sender, data) {
    if (confirm("刪除嗎?")) {
        $(sender).closest('.row').attr('delete', true);
        var uid = $(sender).attr('uid');
        if (uid == "-1")
            $(sender).closest(".row").remove();
        else {
            $(sender).closest(".row").hide();
            if (data != null) {
                data.uid = uid;
                disableDataEx(data, null);
            }
        }
    }
}

function extractFieldName(aFullName, aLeadLength) {
    if (typeof (aFullName) == "undefined")
        return;
    var list = aFullName.split("_");
    var temp = list[list.length - 1];
    var result = "";
    if (temp.substring(0, 2) == "tx" || temp.substring(0, 2) == "ck")
        result = temp.substring(aLeadLength, temp.length);
    return result;
}

function extractHiddenFieldName(aFullName) {
    var list = aFullName.split("_");
    var temp = list[list.length - 1];
    return temp.substring(3, temp.length);
}

function extractDdlName(aFullName) {
    var list = aFullName.split("_");
    var temp = list[list.length - 1];
    return temp.substring(3, temp.length);
}

function bindFieldsValue(tbClassName, aData) {

    $('.' + tbClassName).find('input[type=text]').val('');
    $('.' + tbClassName).find('input[type=hidden]').val('-1');
    if (!aData)
        return;

    var hidden = $('.' + tbClassName).find('input[type=hidden]');
    var data = aData;
    //var data = aData[0];
    $(hidden).each(function (index, d) {
        if ($(this).attr('id')) {
            var hdnFieldName = extractHiddenFieldName($(this).attr('id')).lowerCaseFirstLetter();
            if (hdnFieldName.toLowerCase() != "id" && hdnFieldName != "") {
                var value = data[hdnFieldName];
                $(this).val(value);
            }
        }
    });

    var checkbox = $('.' + tbClassName).find('input[type=checkbox]');
    $(checkbox).each(function (index, d) {
        if (!$(this).attr('id'))
            return;
        var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
        var value = converter.toBoolean(data[fieldName]);
        if ($(d).hasClass('switch'))
            $(d).bootstrapSwitch('state', value);
        else
            $(d).prop('checked', value);

        //todo  
    });

    var input = $('.' + tbClassName).find('input[type=text]');
    $(input).each(function (index, d) {
        if ($(this).attr('id')) {
            var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
            var value = data[fieldName];
            $(this).val(value);
        }
    });

    var input = $('.' + tbClassName).find('input[type=password]');
    $(input).each(function (index, d) {
        if ($(this).attr('id')) {
            var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
            var value = data[fieldName];
            $(this).val(value);
        }
    });

    var textarea = $('.' + tbClassName).find('textarea');
    $(textarea).each(function (index, d) {
        if ($(this).attr('id')) {
            var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
            var value = data[fieldName];
            $(this).val(value);
        }
    });

    var ddl = $('.' + tbClassName).find('select');
    $(ddl).each(function (index, d) {
        var ddlId = $(this).attr('id');
        if (typeof (ddlId) == "undefined")
            return true;
        var fieldName = extractDdlName(ddlId).lowerCaseFirstLetter();

        var value = data[fieldName];
        $(this).val(value);
    });
}

function getFieldsValue(aTBClassName) {
    var data = {};
    var tab = $('.' + aTBClassName);
    var hidden = $(tab).not('.modal').not('.dataIgnore').find('input[type=hidden]:not(#tabItem input[type="hidden"]):not(.dataIgnore input[type="hidden"])');
    $(hidden).each(function (index, d) {
        if ($(this).attr('id')) {
            var hdnFieldName = extractHiddenFieldName($(this).attr('id')).lowerCaseFirstLetter();
            if (hdnFieldName.toLowerCase() != "id" && hdnFieldName != "") {
                data[hdnFieldName] = $(this).val();
            }
        }
    });

    var checkbox = $(tab).find('input[type=checkbox]:not(#tabItem input[type="checkbox"]):not(".searchBox"):not(.dataIgnore input[type="checkbox"])');
    $(checkbox).each(function (index, d) {
        if ($(this).attr('id')) {
            var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
            var value = $(this).prop('checked');
            if (fieldName != "")
                data[fieldName] = value;
        }
    });

    var input = $(tab).find('input[type=text]:not(#tabItem input[type="text"]):not(".searchBox"):not(.insertWrap  input[type="text"]):not(.dataIgnore input[type="text"])');
    $(input).each(function (index, d) {
        if ($(this).attr('id') != null) {
            if (!$(this).is('[readonly]')) {
                var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
                //     alert($(this).is('[readonly]'));
                var value = $(this).val();
                if (fieldName != "")
                    data[fieldName] = value;
            }
        }
    });

    var password = $(tab).find('input[type=password]:not(#tabItem input[type="password"]):not(".searchBox"):not(.insertWrap  input[type="password"]):not(.dataIgnore input[type="password"])');
    $(password).each(function (index, d) {
        if ($(this).attr('id') != null) {
            if (!$(this).is('[readonly]')) {
                var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
                //     alert($(this).is('[readonly]'));
                var value = $(this).val();
                if (fieldName != "")
                    data[fieldName] = value;
            }
        }
    });

    var textarea = $(tab).find('textarea:not(#tabItem textarea):not(.dataIgnore textarea)');
    $(textarea).each(function (index, d) {
        if ($(this).attr('id')) {
            var fieldName = extractFieldName($(this).attr('id'), 2).lowerCaseFirstLetter();
            var value = $(this).val();
            if (fieldName != "")
                data[fieldName] = value;
        }
    });

    var ddl = $(tab).find('div').not('.dataIgnore').find('select:not(#tabItem select):not(.search):not(.dataIgnore)');
    $(ddl).each(function (index, d) {
        var ddlId = $(this).attr('id');
        if (typeof (ddlId) == "undefined")
            return true;
        var fieldName = extractDdlName(ddlId).lowerCaseFirstLetter();
        var value = $(this).val();
        if (fieldName != "")
            data[fieldName] = value;
    });
    return data;
}


var bi = function () {
    return {
        attach: function () {
            $('#ddlCurrencyId').change(function () {
                queryData('currencyDetail', 1, 5, '', '@currencyId=' + $('#ddlCurrencyId').val(), function (data) {
                    $('#txCurrencyRate').val(1);
                    var t = JSON.parse(data);
                    if (t.length > 0) {
                        $('#txCurrencyRate').val(t[0].rate);
                        $('#txCurrencyRate').trigger('change');
                    }
                })
            });
        }/*,
        getCurrencyRate: function (aCurrencyId, aCallback) {

            var url = "/Utils/CitymanServices.asmx/getCurrencyRate";
            var param = '{aCurrencyId:"' + aCurrencyId + '"}';
            doAjax2(url, param, bindGetCurrencyRate, aCallback);
        }*/,
        calTaxTotal: function (grid) {
            var taxRate = 0;
            var t = $('.ddlTaxTypeId option:selected').data('data');
            if (t) {
                taxRate = t.taxRate;
            }

            var totalQty = 0;
            var totalAmt = 0;
            var rowCount = 0;
            var discount = 0;
            var fee = 0;
            var clientRate = $('#hdnClientRate').val() / 100 || 0;
            var amt = grid.sum('amt');
            var rate = 1;
            if ($('.txCurrencyRate').length > 0)
                rate = $('.txCurrencyRate').val();
            if ($('.txDiscount').length > 0)
                discount = converter.toNoCommas($('.txDiscount').val());
            if ($('.txFee').length > 0)
                fee = converter.toNoCommas($('.txFee').val());
            $.log.log(' amt: ' + amt + ' fee: ' + fee + ' discount: ' + discount);
            totalAmt = Math.round(amt * rate);
            var taxAmt = 0;
            taxRate = taxRate / 100;
            if (taxRate > 0) {
                taxAmt = Math.abs(Math.round((totalAmt - discount) * taxRate));
            } else
                if (taxRate < 0) {
                    t = Math.round(totalAmt / (1 + Math.abs(taxRate)));
                    taxAmt = totalAmt - t;
                    totalAmt = totalAmt - taxAmt;
                }

            var a = converter.toCommasNumber(Math.round(totalAmt, 0));
            $('.txAmt').val(a);
            $('.txTax').val(converter.toCommasNumber(taxAmt));
            $.log.log(' totalAmt: ' + totalAmt + ' taxAmt: ' + taxAmt + ' fee: ' + fee + ' discount: ' + discount);
            $('.txTotal').val(converter.toCommasNumber(Math.round(totalAmt + taxAmt + parseInt(fee) - discount, 0)));
            $('.txTotalQty').val(converter.toCommasNumber(totalQty));

            var totalView = '';
            if (clientRate > 0) {
                totalView = '折扣' + clientRate * 100 + '% ';
                totalAmt = Math.round(totalAmt);
            }
            totalView += rowCount + " Record";
            totalView = totalView + " Total " + converter.toCommasNumber(totalAmt);
            if (totalQty > 0)
                totalView = totalView + "  Qty " + converter.toCommasNumber(totalQty);
            $('.lbTotalView').text(totalView);
        }
    }
}();
