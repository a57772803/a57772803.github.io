
(function ($) {
    $.fn.puregrid = function (settings) {
        var defaultSettings = {}
        var dateFieldIndex = function (field) {
            var result = -1;
            if (typeof (_settings['dateFields']) != 'undefined') {
                var t = _settings['dateFields'];
                result = t.indexOf(field);
            }
            return result;
        }

        this.readonlyIndex = function (aField) {
            var result = -1;
            if (typeof (_settings['readonlyFields']) != 'undefined') {
                var t = _settings['readonlyFields'];
                result = t.indexOf(aField);
            }
            return result;
        };
        var createHead = function () {
            var param = _settings;
            var th = $("<div class='row th'></div>").appendTo(_self);
            $.each(param.columns, function (index, d) {
                var col = $("<div class='col'>" + d.title + "</div>");
                if (d.template) {
                    $(col).addClass('text-center');
                }

                if (d.width) {
                    $(col).css({ 'width': d.width, 'min-width': d.width, 'max-width': d.width });
                }
                if (d.fieldKind && (d.fieldKind.indexOf('number') != -1 || d.fieldKind.indexOf('money') != -1)) {
                    $(col).addClass('text-right');
                }

                if (d.style)
                    $(d).css(d.style);

                if (index == 0) {
                    if (param["headCheckAll"]) {
                        var h = $('<input id="headCheckAll" type="checkbox"/>').appendTo(col);//.prop('checked', false);
                        $(h).on('click', function () {
                            $(_self).find('.row').find('input:checkbox:first').not(this).prop('checked', this.checked);
                            $.each($(_self).find('.row').find('input:checkbox:first').not(this), function (rIndex, d) {
                                setCheckedData($(d));
                            })
                        });
                        $(col).addClass('text-center');
                        //   }
                    }
                }

                $(col).appendTo(th);
            })
        };

        var getMaxNo = function (fieldClassName) {
            $(_self).find('.row').each(function (index, d) {
                var t = parseInt($(this).find('.' + fieldClassName).find('input[type=text]').val());
                if (t > max) max = t;
            });
        }
        var crateHiddenField = function (data, hdnFields, row) {
            if (hdnFields == null)
                return;

            $(hdnFields).each(function (index, item) {
                var field = item.split('=')[0];
                dataField = field;
                if (item.split('=').length > 1)
                    dataField = item.split('=')[1];
                value = data[dataField];
                if (!value)
                    value = -1;
                $('<input type="hidden" id="' + field + '" value="' + value + '"/>').appendTo($(row));
            })
        };
        var setIndex = function (row) {
            $(_self).find('.active').removeClass('active');
            $(row).addClass('active');
        };

        this.setActive = function (aIndex) {
            $(_self).find('.row').each(function (index, d) {
                if (aIndex == index)
                    $(d).addClass('active');
                else
                    $(d).removeClass('active');
            });
        }
        this.removeRows = function () {
            _self.find('.row').not('.th').remove();
        }

        var setCheckedData = function (sender) {
            var dIndex = -1;
            var d = $(sender).closest('.row').data('data');
            var u = $.grep(_checked, function (element, index) {
                if (element.RowNumber == d.RowNumber) {
                    dIndex = index;
                    return element;
                }
            });

            if ($(sender).prop('checked')) {
                if (dIndex == -1)
                    _checked.push(d);
            } else {
                if (dIndex != -1)
                    _checked.splice(dIndex, 1);
            }
         
        }

        this.append = function (data) {
            var row = null;
            $(data).each(function (index, d) {
                row = $('<div/>').addClass('row').data('data', d).appendTo(_self).click(function () {
                    rowClick(this);
                });

                $('<input type="hidden" id="uid" value="' + (d.uid || -1) + '"/>').appendTo(row);
                crateHiddenField(d, _settings['hdnFields'], row);
                $.each(_settings.columns, function (index, c) {
                    var fieldName = c.field.split(':')[0].split('=')[0];
                    var defaultValue = "";
                    if (c.field.split(':').length > 1)
                        defaultValue = c.field.split(':')[1];

                    var col = $('<div class="col p-0 m-0 ' + fieldName + '">  </div>').appendTo(row);
                    if (c.width)
                        $(col).css({ 'width': c.width, 'min-width': c.width, 'max-width': c.width });

                    if (c.style)
                        $(col).css(c.style);

                    var value = d[fieldName] || defaultValue;
                    if (c.fieldKind && (c.fieldKind.indexOf('number') != -1 || c.fieldKind.indexOf('money') != -1)) {
                        value = converter.toCommasNumber(value);
                    }

                    if (c.template) {
                        var m = $(c.template).attr('id', fieldName).clone(true, true).appendTo(col);
                        $(col).addClass('text-center');
                        //prevent bubble
                        $(col).click(function (e) { //function column                        
                            e.stopPropagation();
                        });
                        $(m).click(function (e) {
                            e.stopPropagation();
                        })

                        if ($(m).is(':checkbox')) {
                            if (index == 0) {
                                var u = $.grep(_checked, function (element, index) {
                                    return element.RowNumber == d.RowNumber;
                                });
                                if (u.length > 0) {
                                    $(m).prop("checked", true);
                                }
                                setCheckedData($(m));
                            }
                            else {
                                $(m).prop("checked", converter.toBoolean(value));
                            }

                            $(m).click(function () {
                                setCheckedData($(this));
                            })
                        } else {
                            if ($(m).is('a, a *')) {
                                $(m).addClass('form-control').text(value);
                            }
                        }
                        return;
                    }

                    var input = $('<input type="text" id="' + fieldName + '" class="form-control" value="' + value + '"/>').appendTo(col);
                    if (c.fieldKind && (c.fieldKind.indexOf('number') != -1 || c.fieldKind.indexOf('money') != -1)) {
                        $(input).addClass('text-right');
                    }
                    $(input).attr('autocomplete', 'off');
                    if (c.readonly || _settings.readonly)
                        $(input).attr('readonly', true);
                    if (c.readonly != null && c.readonly == false)
                        $(input).attr('readonly', false);

                    //額外的dialog 顯示
                    if (c.option) {
                        var h = ($(col).height() - 4) / 2;
                        var btn = $('<span class="fa-stack pointer"></span>').appendTo(col);
                        $(btn).css({ 'position': 'absolute', 'color': '#5bc0de', 'right': '10px', 'top': '2px', 'height': h * 2 + 'px', 'width': h * 2 + 'px', 'font-size': '0.5em !important;' });
                        $('<i style="margin-left:-5px !important;" class="fa fa-square fa-stack-2x"></i><i class="fas fa-search fa-stack-1x fa-1x fa-inverse"  style="font-size:2em"></i>').appendTo(btn);

                        $(btn).click(function () {
                            c.option(this);
                        })
                    }
                })

                var functionCol = null;
                if (_settings["showDetail"] != null) {
                    functionCol = $('<div class="col tdFunction"></div>').appendTo(row);
                    $('<input type="button" class="btn btn-info" value="明細"/>').data('data', d).appendTo(functionCol).click(function () {
                        _settings["showDetail"](this);
                    });
                }

                if (!_settings["readonly"]) {
                    if (!functionCol)
                        functionCol = $('<div class="col tdFunction"></div>').appendTo(row);
                    var btn = $('<input type="button" class="btn btn-default" value="刪除"/>').attr('uid', d.uid).appendTo(functionCol).click(function () {
                        deleteRow($(btn), { tableName: _settings["tableName"] || _settings['pageName'] });
                    });
                }
                if (functionCol) {
                    var t = $(_self).find('.th').find('.thFunction');
                    if (t.length == 0) {
                        $('<div/>').addClass('col thFunction').text('功能').appendTo($(_self).find('.th'))
                    }
                }

                if (_settings.itemCal) {
                    _settings.itemCal(row);
                    $.each(_settings.calcTrigFields, function (index, d) {
                        $(row).find('#' + d).on('input', function () {
                            _settings.itemCal($(this).closest('.row'));
                            if (_settings['totalCal'] != null)
                                _settings['totalCal'](_self);
                        })
                    });
                }
                if (_settings['rowComplete'] != null)
                    _settings['rowComplete'](row);

                if (_settings['totalCal'] != null)
                    _settings['totalCal'](_self);
            })
            if (_settings['totalCalTrigFields']) {
                $.each(_settings['totalCalTrigFields'], function (index, d) {
                    $('#' + d).on('change keydown paste input', function () {
                        if (_settings['totalCal'] != null)
                            _settings['totalCal'](_self);
                    })
                })
            }
        }

        var isReadonlyHdnField = function (aFieldName) {
            var found = $.inArray(aFieldName, _settings["readonlyHdnFields"]) > -1;
            return found;
        }

        var rowClick = function (sender) {
            var row = sender;
            if (!$(sender).hasClass('row'))
                row = $(sender).closest('.row');
            setIndex(row);

            if (typeof (_settings.rowAutoCheck) != 'undefined' && converter.toBoolean(_settings.rowAutoCheck) == false)
                return;

            var k = $(row).find('input[type=checkbox]').first();
            if (!k)
                return;
            var b = converter.toBoolean($(k).prop("checked"));
            if (_settings.singleCheck)
                $(_self).find('input:checkbox').removeAttr('checked');

            $(k).prop("checked", !b);
        }
        this.sum = function (fieldName) {
            var result = 0;
            $(_self).find('.row:not(.rowTh)').each(function () {
                if ($(this).css("display") !== "none") {
                    result += converter.toFloat($(this).find('#' + fieldName).val());
                }
            });
            return result;
        }

        this.getData = function (selectedOnly) {
            var fields = _settings.columns;
            var result = [];
            $(_self).find('.row').not('.th').each(function (index, row) {
                var uid = $(this).find("input[id$=uid]").val();
                var data = new Object();

                $.each(_settings.columns, function (index, d) {
                    var fieldname = d.field.split(":")[0].split('=')[0];
                    if (!fieldname || d.readonly)
                        return;
                    var value = $(row).find("#" + fieldname).val();
                    if (d.dateField) {
                        value = $(row).find('.' + fieldname).find(".datepicker").val();
                    }
                    if (d.template) {
                        if ($(d.template).is(':checkbox')) {
                            value = $(row).find('.' + fieldname).find("input[type=checkbox]").prop('checked');

                        }
                        if ($(d.template).is('select')) {
                            value = $(d.template).val();
                        }
                    }
                    data[fieldname] = value;
                    if (converter.isCommaNumber(fieldname, value))
                        data[fieldname] = converter.toNoCommas(value);
                })

                $(this).find("input[type=hidden]").each(function (index, d) {
                    var hdnfieldName = $(this).attr('id'); //.substring(3, $(this).attr('id').length);
                    if (hdnfieldName != "uid") {
                        var index = fields.indexOf(hdnfieldName);
                        if (index == -1 || fieldsType == null || fieldsType[index] != 'select')
                            if (!isReadonlyHdnField(hdnfieldName))
                                data[hdnfieldName] = $(d).val();
                    }
                });

                data.uid = uid;
                if (_settings.defaultData)
                    $.each(_settings.defaultData, function (key, value) {
                        data[key] = value;
                    });
                if (!$(this).is(":visible")) {
                    data['disabled'] = true;
                }
                if (selectedOnly) {
                    var ck = $(this).find('input:checkbox:first')[0];
                    if (ck && $(ck).prop('checked'))
                        result.push(data);
                }
                else
                    result.push(data);
            });
            return result;
        }


        this.updateDetail = function () {
            var data = _self.getData();
            var parentId = $('#hdnUid').val(); //index.cshtml

            var counter = new updateCounter({
                total: data.length, callback: function () {
                    message.success('Data Updated!');
                }
            });
            $.each(data, function (index, d) {
                if (d.disabled) {
                    disableDataEx({ "tableName": _settings.detailTableName, "uid": d.uid }, function () {
                        counter.count();
                    });
                }
                else {
                    d.parentId = parentId;
                    update(d, _settings.detailTableName, '', '', function () {
                        counter.count();
                    })

                }
            })
        }

        this.reset = function (paggingIndex) {

            $(_self).empty();
            createHead();
        }
        var _checked = [];

        this.checkedData = function () {
            return _checked;
        }

        this.clearCheckedData = function () {
            _checked = [];
        }

        this.init = function () {
            $(this).addClass('puregrid');
            $(this).addClass(_settings.css || '');
            $(this).empty();
            createHead();
            return this;
        }

        var _self = this;
        var _settings = $.extend(defaultSettings, settings);
        this.init();
        return this;
    }
})(jQuery);

var updateCounter = function (settings) {
    var _settings = settings;
    this.total = settings.total;
    this.updateCount = 0;
    this.count = function () {
        _self.updateCount += 1;
        if (_self.total == _self.updateCount) {
            if (_settings.callback) {
                _settings.callback();
            }
        }
    }
    var _self = this;
};


(function ($) {
    $.fn.erpTreeMenu = function (settings) {
        var defaultSettings = {
            bind: 'mouseover',
            callback: function () {

            }
        }

        var _last = null;
        var setActive = function (t) {
            $('.prActive').removeClass('prActive');
            _last = t;
            $(_last).addClass('prActive');
        }

        this.init = function () {
            $(_self).empty();
            $('<div/>').addClass('h-100 d-flex flex-column').appendTo(_self).append([
                $('<div id="menuImgWrap" class="mt-3 mb-2 text-center"></div>'),
                $('<div class="text-center menuAppName"><small>' + _settings.appName + '</small></div>'),
                $('<div class="flex-grow-1 mt-3 " style="overflow:hidden"><div id="erpMenuArea" class="scrollable" style="overflow-x:hidden"></div></div>'),
                $('<div class="mt-auto"/>').append(
                    $('<div class="float-right mr-3"/>').append($('<i id="menuToggle"/>').addClass("fas fa-angle-double-left fa-2x")).click(function () {
                        var b = converter.toBoolean(cookies.read('sidebarCollapse'));
                        cookies.write('sidebarCollapse', !b, 9999);
                        toggleMenu();
                    })
                )
            ]
            );
            if (_settings.imgUrl)
                $('<img src ="' + _settings.imgUrl + '" style = "width:150px" />').appendTo($('#menuImgWrap'));
            this.bindMenu();
        }

        var isClose = function () {
            var b = converter.toBoolean(cookies.read('sidebarCollapse'));
            return b;
        }

        var toggleMenu = function () {
            if (isClose()) {
                $(_self).css({
                    'width': _settings.collapseWidth, 'max-width': _settings.collapseWidth
                });
            } else {
                $(_self).css({ 'width': _settings.expandWidth, 'max-width': _settings.expandWidth });
            }
            $(_self).find('.rootMenuWrap').toggleClass('d-none');
            $(_self).find('.memuLabel').toggleClass('d-none');
            $(_self).find('.menuAppName').toggleClass('d-none');
            $(_self).find('#menuImgWrap').toggleClass('d-none');

            $(_self).toggleClass('sidebar-collapsed', 'sidebar-expanded');
            $(_self).find('#menuToggle').toggleClass('fa-angle-double-right fa-angle-double-left');
        }

        this.bindMenu = function () {
            var _prevTypeNo = "";
            var root;
            var subWrap;
            var _popActive = false;
            $.each(_settings.data, function (index, d) {
                if (d.typeNo != _prevTypeNo) {
                    root = $('<div id="' + d.typeNo + '"/>').addClass('rootMenu pointer').appendTo($(_self).find('#erpMenuArea'));
                    $(root).addClass('d-flex').append([
                        $('<div/>').css({ 'text-align': 'center' }).append($('<i/>').addClass('fas fa-fw fa-lg ' + d.faIcon)),
                        $('<div/>').addClass('pl-2 memuLabel').text(d.formtypename)
                    ]
                    ).hover(function () {
                        if (!isClose())
                            return;
                        var id = $(this).attr('id');
                        if ($('#popMenu' + id).length == 0) {
                            var pop = $('#rootMenu' + id).clone(true, true).appendTo('body').removeAttr('class').attr('id', 'popMenu' + id).addClass('rounded p-3 bg-light text-dark').
                                css({ 'position': 'absolute', 'display': 'block', 'left': $(this).position().left + $(this).closest('.rootMenu').outerWidth(), 'top': $(this).position().top }).
                                hover(function () {
                                    _popActive = true;
                                }, function () {
                                    _popActive = false;
                                    $(this).hide();
                                });
                            $(pop).find('.itemMenuWrap').addClass('pl-3 pr-3');
                        }
                        $('#popMenu' + id).show();
                        $('#popMenu' + id).find('.subMenuWrap').show();
                        $('#popMenu' + id).find('.expendIcon').hide();
                    }, function () {
                        if (!isClose())
                            return;
                        var id = 'popMenu' + $(this).attr('id');
                        setTimeout(function () {
                            if (!_popActive)
                                $('#' + id).hide();
                        }, 100)

                    })

                    $(root).click(function () {
                        $('#rootMenu' + $(this).attr('id')).toggle();
                        var c = "";
                        $.each($(_self).find('.rootMenuWrap:visible'), function (index, d) {
                            c += $(d).attr('id').substring(8, $(d).attr('id').length) + ';';
                        })
                        cookies.write('activeRootMenu', c, 99999);
                    });
                    rootWrap = $('<div id="rootMenu' + d.typeNo + '"/>').addClass('rootMenuWrap').css({ 'display': 'none' }).appendTo($(_self).find('#erpMenuArea'));
                }

                var parent = rootWrap;

                if (d.subid) {
                    var t = $("#itemMenuWrap" + d.subid).find('#subMenuWrap' + d.subid);
                    if (t.length == 0) {
                        $('<div/>').appendTo($("#itemMenuWrap" + d.subid)).attr('id', 'subMenuWrap' + d.subid).addClass('subMenuWrap').css({ 'display': 'none' });
                        var k = $('#itemMenuWrap' + d.subid).addClass('subMenu').removeClass('itemMenuWrap');
                        $('<i class="expendIcon fas fa-plus mr-2"></i>').prependTo(k);
                    }
                    parent = $("#subMenuWrap" + d.subid);
                }

                var item = $('<div/>').attr('data', JSON.stringify(d)).attr('id', 'itemMenuWrap' + d.uid).css({}).addClass('itemMenuWrap pointer').text(d.formname).appendTo(parent);
                $(item).off('click');
                $(item).click(function (e) {
                    e.stopPropagation();
                    var t = JSON.parse($(this).attr('data'));
                    if (t.url)
                        window.open(t.url, t.formname);
                    else {
                        $(this).find('.expendIcon').toggleClass('fa-plus fa-minus');
                        $('#subMenuWrap' + t.uid).toggle();
                        var c = "";
                        $.each($('.subMenuWrap:visible'), function (index, d) {
                            c += $(d).attr('id').substring(11, $(d).attr('id').length) + ';';
                        });
                        cookies.write('activeSubMenu', c, 99999);
                    }
                })
                _prevTypeNo = d.typeNo;
            })

            if (cookies.read('activeRootMenu')) {
                var t = cookies.read('activeRootMenu').split(';') || [];
                for (i = 0; i < t.length; i++) {
                    $('#rootMenu' + t[i]).show();
                }
            }

            if (cookies.read('activeSubMenu')) {
                t = cookies.read('activeSubMenu').split(';') || [];
                for (i = 0; i < t.length; i++) {
                    //  $('#subMenuWrap' + t[i]).show();
                    $('#itemMenuWrap' + t[i]).click();
                }
            }

            if (converter.toBoolean(cookies.read('sidebarCollapse')))
                toggleMenu();
        }
        var _self = this;
        var _settings = $.extend(defaultSettings, settings);
        _self.css('background-color', _settings.backgroundColor || '#308bdb');
        return this.init();
        // return this;
    }
})(jQuery);

$.log = {
    init: function (aParam) {
        this.createWrap();
        if (converter.toBoolean(cookies.read('logView')))
            $('.logWrap').show();
        else
            $('.logWrap').hide();

    },
    createWrap: function () {
        if ($('.logWrap').length == 0) {
            var wrap = $('<div class="logWrap" style="display:none"></div>').appendTo(document.body);
            $(wrap).css({ position: 'fixed', width: '300px', right: '30px', bottom: '50px', height: '200px', 'z-index': 999999 });
            this.maxCount = 1000;
            this.textArea = $('<textarea style="width:100%;height:80%;padding-left:10px" />').appendTo(wrap);

            this.log("log start");
            document.addEventListener('keydown', function (e) {
                if (e.keyCode == 113) { //F2
                    var b = !converter.toBoolean(cookies.read('logView'));
                    cookies.write('logView', b, 999);
                    if (b)
                        $('.logWrap').show();
                    else
                        $('.logWrap').hide();
                }
            });

        };
    },
    log: function (value) {
        this.init();
        if (this.textArea) {
            this.textArea.append(value + '\n');
            this.textArea.scrollTop(this.textArea[0].scrollHeight - this.textArea.height());
        }
    }
};

(function ($) {
    $.fn.listData = function (settings) {
        var defaultSettings = {
            bind: 'mouseover',
            callback: function () {

            }
        }
        var deleteData = function (sender) {
            if (confirm("刪除嗎?")) {
                var uid = $(sender).attr('uid');
                if (uid == "-1")
                    $(sender).closest("tr").remove();
                else {
                    $(sender).closest('tr').addClass('collapse out');

                    disableDataEx({ "tableName": _settings.tableName || _settings.pageName, "uid": uid }, function () { window.location.href = window.location }, _settings.dbAlias || "");
                }

            }
        }
        this.batchDelete = function () {
            if (confirm("刪除嗎?")) {
                var t = $(_self).find('input:checkbox:checked');
                $.ajaxCount.setTotal($(t).length);
                $.ajaxCount.reset();

                $.each(t, function (index, d) {
                    var data = JSON.parse($(d).closest('tr').attr('data'));
                    disableMasterDataEx({ "tableName": _settings.tableName, "uid": data.uid }, function () {
                        $.ajaxCount.add();
                        if ($.ajaxCount.count == $.ajaxCount.total) {
                            window.location.href = window.location;
                        }
                    }, _settings.dbAlias || "");

                });
            }
        }

        this.batchStatus = function (fieldName, status) {
            if (confirm("確定嗎?")) {
                var t = $(_self).find('input:checkbox:checked');
                $.ajaxCount.setTotal($(t).length);
                $.ajaxCount.reset();
                $.each(t, function (index, d) {
                    var data = JSON.parse($(d).closest('tr').attr('data'));

                    //updateEx //aData, aTableName, aCallback, aExData, aDbAlias
                    var data = { 'uid': data.uid };
                    data[fieldName] = status;

                    updateEx(data, _settings.tableName, function () {
                        $.ajaxCount.add();
                        if ($.ajaxCount.count == $.ajaxCount.total) {
                            window.location.href = window.location;
                        }
                    }, '', _settings.dbAlias || "");
                });
            }
        }

        this.bindData = function (data) {
            $(_self).empty();
            $(_self).addClass("table-responsive table-sm");
            var table = $('<table/>').addClass('table').appendTo($(_self));
            var thead = $('<thead/>').appendTo(table);
            var tr = $('<tr/>').appendTo(thead);//  $.cr.add('tr', $.cr.add('thead', table));

            $.each(_settings.headFields, function (index, d) {
                if ($(d).is(':checkbox')) {
                    $(d).on('click', function () {

                        $(_self).find('input:checkbox').not(this).prop('checked', this.checked);
                    });
                    var th = $('<th/>').appendTo(tr);// $.cr.add('th', tr);
                    $(d).appendTo(th);
                }
                else
                    $('<th/>').appendTo(tr).text(d);
                //$.cr.add('th', tr, '', d);
            });
            //功能
            var thFunction = $('<th/>').addClass('thFunction text-center').text('功能').appendTo(tr);
            var tbody = $('<tbody/>').appendTo(table);// $.cr.add('tbody', table);
            $.each(data, function (index, d) {
                var tr = $('<tr/>').appendTo(tbody);//  $.cr.add('tr', tbody);
                //$(tr).attr('data', JSON.stringify(d));
                $(tr).data('data', d);

                $.each(_settings.fields, function (i, f) {
                    var dd = d[f];
                    if (!_settings.fieldsType[i])
                        $('<td/>').appendTo(tr).addClass(f).text(dd);
                    //   $.cr.add('td', tr, f, dd);
                    else {
                        var td = $('<td/>').appendTo(tr);// $.cr.add('td', tr, '');
                        var input = $(_settings.fieldsType[i]).clone(true).val(dd).appendTo(td);
                    }
                })
                var tdFunction = $('<td/>').addClass('tdFunction text-center').appendTo(tr);// $.cr.add('td', tr, 'tdFunction');

                if (_settings.editProc) {
                    var btn = $('<button/>').appendTo(tdFunction).addClass('btn btn-outline-info mr-1').text('明細');//   $.cr.add('button', tdFunction, 'btn btn-outline-info mr-1', '明細');
                    $(btn).click(function () {
                        //var m = JSON.parse($(this).closest('tr').attr('data'));
                        var m = $(this).closest('tr').data('data');

                        _settings.editProc(m);

                    })
                }
                if (!_settings.readonly) {
                    var btnDelete = $('<button/>').appendTo(tdFunction).addClass('btn btn-outline-secondary').text('刪除');// $.cr.add('button', tdFunction, 'btn btn-outline-secondary', '刪除');
                    $(btnDelete).attr('uid', d.uid);

                    $(btnDelete).click(function () {
                        deleteData(this)
                    });
                }

                if ($(tdFunction).html() == '') {
                    $(tdFunction).hide();
                    $(thFunction).hide();
                }


                if (_settings.rowComplete) {
                    _settings.rowComplete(tr);
                }
            })

            if (_settings.bindComplete)
                _settings.bindComplete();

        }
        this.init = function () {
            if (_settings.data)
                this.bindData(_settings.data);
        }
        var _settings = $.extend(defaultSettings, settings);
        var _self = this;
        this.init();
        return this;
    };

})(jQuery);

(function ($) {
    $.fn.pagging = function (settings) {
        var defaultSettings = {
            pageIndex: 1,
            pageSize: 30,
            queryFields: {},
            callback: function () {
            }
        }

        var _totalCount = 0;

        var getDataPagging = function () {
            var param = { "name": $('#hdnPageName').val(), "dbAlias": $('#hdnDbAlias').val() };
            var url = '/api/data/getDataCount';
            ajaxPost(url, param, function (data) {
                _totalCount = data;
                bindPagging();
            });
            /*  var url = "/Utils/WebService1.asmx/getDataCount";
              var temp = { "name": $('#hdnPageName').val(), "dbAlias": $('#hdnDbAlias').val() };
              doAjax(url, temp, function (data) {
                  _totalCount = data;
                  bindPagging();
              });*/
        }
        this.hidePageing = function () {
            _self.hide();

        }

        this.refresh = function () {
            _settings.queryFields.keyword = $(_settings.txSearch).val();
            //todo extend getAdvanceSearch       

            var j = { "queryFields": _settings.queryFields };
            var t = escape(JSON.stringify(j));

            cookies.write('q' + _settings.name, t, 365);

            getDataPagging();

            /*            var o = getAdvSearch();
                        $.extend(t, o);
                        $.log.log(JSON.stringify(t));
            
                        var name = $('#hdnPageName').val();*/
        }

        var setPageIndex = function (index) {

            var c = {};
            if (cookies.read('q' + _settings.name))
                c = JSON.parse(unescape(cookies.read('q' + _settings.name)));

            c.pageIndex = index;

            var t = escape(JSON.stringify(c));
            cookies.write('q' + _settings.name, t, 365);

            _settings.getData();
        }

        var setTabIndex = function (index) {
            var c = {};
            if (cookies.read('q' + _settings.name))
                c = JSON.parse(unescape(cookies.read('q' + _settings.name)));

            c.tabIndex = converter.toInt(c.tabIndex) + index || 0;
            c.pageIndex = (_settings.pageSize * c.tabIndex) + 1;

            var t = escape(JSON.stringify(c));
            cookies.write('q' + _settings.name, t, 365);

            bindPagging();
        }

        var bindPagging = function () {
            _settings.getData();

            $(_self).empty();

            var pageSize = _settings.pageSize;
            var count = _totalCount;
            var maxPage = 10;

            var lastPage = converter.toInt((count / pageSize));
            if (count % pageSize != 0)
                lastPage += 1;

            var c = {};
            if (cookies.read('q' + _settings.name))
                c = JSON.parse(unescape(cookies.read('q' + _settings.name)));
            //if c.pageTab 
            var pageIndex = c.pageIndex || _settings.pageIndex;
            var tabIndex = c.tabIndex || 0;
            var startIndex = tabIndex * pageSize;
            var endIndex = startIndex + pageSize;
            var totalTab = count / (pageSize * maxPage);

            if (lastPage < endIndex)
                endIndex = lastPage;

            var ul = $('<ul/>').addClass('pagination justify-content-center').appendTo(_self)
            $(ul).append(
                $('<li/>').addClass("page-item").append(
                    $('<a/>').addClass('page-link').text('Total ' + count)
                )
            );
            //prev     

            if (tabIndex > 0) {
                var li = $('<li/>').addClass('page-item').appendTo(ul);
                var a = $('<a href="#"/>').addClass('page-link').text('PREV').appendTo(li).click(function () {
                    setTabIndex(-1);
                })
            }

            for (i = startIndex; i < endIndex; i++) {
                var t = i + 1;
                var li = $('<li/>').addClass('page-item').appendTo(ul);
                if (t == pageIndex)
                    li.addClass('active');
                var a = $('<a/>').addClass('page-link').text(t).appendTo(li).click(function () {
                    $('.page-item').removeClass('active');
                    $(this).closest('li').addClass('active');
                    setPageIndex($(this).text());
                });
            }

            if (totalTab > tabIndex + 1) {
                var li = $('<li/>').addClass('page-item').appendTo(ul);
                $('<a href="#"/>').addClass('page-link').text('Next').appendTo(li).click(function () {
                    setTabIndex(1);
                })
            }

            _self.show();
        }

        this.showPagging = function () {
            _self.show();
        }

        this.init = function () {
            var c = cookies.read('q' + _settings.name);
            var j = {};
            if (typeof (c) != 'undefined') {
                j = JSON.parse(unescape(c));
            }

            _settings.queryFields = j.queryFields || {};
            $(_settings.txSearch).val(_settings.queryFields.keyword);


            $(this).empty();
            $(this).show();
            $(this).addClass("");
            getDataPagging();
            return this;
        }
        var _settings = $.extend(defaultSettings, settings);
        var _self = this;
        return this.init();
    };
})(jQuery);

var DataBinderEx = function (settings) {
    var defaultSettings = {};
    var getting = false;
    var pageIndex = 1;
    var pageSize = 30;
    var moreData = true;
    var serching = null; //timer

    this.setSpParam = function (aParam) {
        _settings.spParam = aParam;
    };
    this.setDefaultSpParam = function (aParam) {
        _settings.defaultSpParam = aParam;
    };
    this.setDefaultData = function (aDefaultData) {
        _settings.defaultData = aDefaultData;
    }
    var bindScroll = function (aWrapClass) {
        var parent = $('.' + aWrapClass).parent();
        $(parent).off('scroll');

        $(parent).scroll(function () {

            var wrapHeight = $(parent).height();
            var top = $(this).scrollTop();
            var h = $('.' + aWrapClass).height();
            if ((h - top - wrapHeight) <= 100) {
                if (moreData) {
                    _self.getNext();
                }
            }
        });
    };
    this.getNext = function (aParam, aCallback) {
        if (getting)
            return;
        getting = true;

        if (aCallback != null)
            _self.getCallback = aCallback;
        showLoading();

        var keyword = '';
        if ($('.txDataSearch').val())
            keyword = $('.txDataSearch').val();

        if (_settings.spName) {
            //spQuery
            //  var t = $.extend(_settings.defaultSpParam, { 'pageIndex': pageIndex, 'pageSize': pageSize });
            querySp(_settings.spName, _settings.spParams, _settings.spExParam, bindNext);

        }
        else //default query
            queryData(_settings.pageName, pageIndex, 30, keyword, _settings.exWhere, bindNext);
    };

    var bindNext = function (aData, aExParam) {
        //iis.dataBinder bindNext
        closeLoading();
        pageIndex += 1;
        getting = false;
        var data = JSON.parse(aData);
        _self.grid.append(data);
        var singleCheck = _settings['singleCheck'];
        /*  if (_settings['autoCheck'] != false)
              bindRowClick(_settings['tbClassName'], singleCheck);*/
        if (_settings['customRowClick']) {
            $('.' + _settings['tbClassName']).find('.row').click(function (e) {
                _settings['customRowClick'](this);
            })
        }

        initDatePickerEx();
        if (_settings.customDblClick) {
            $('.' + _settings['tbClassName']).find('.row').off('dblclick');

            $('.' + _settings['tbClassName']).find('.row').bind('dblclick', function (e) {
                _settings.customDblClick(JSON.parse($(this).attr('data')));
                if (_settings.caller)
                    $(_settings.caller).modal('hide');
            });
        }
    };

    this.reset = function () {
        $('.' + _settings['tbClassName']).empty();
        pageIndex = 1;
    };

    this.refresh = function () {
        _self.reset();
        _self.getNext();
    }

    this.gridData = function () {
        return _self.grid.getData();
    }

    this.getRowData = function () {
        var result = [];
        $('.' + _settings["tbClassName"]).find('.row').not(".th").each(function () {
            if ($(this).find('input[type="checkbox"]').length > 0) {
                if ($(this).find('input[type="checkbox"]').is(':checked') == false) {
                    {
                        return;
                    }
                }
            }
            var row = $(this);
            var t = new Object;
            appendObject(t, _settings.defaultData);
            t.uid = $(row).find('#uid').val();
            $(_settings['hdnFields']).each(function (index, d) {
                var field = d.split(':')[0];
                var value = $(row).find('#' + field).val();
                t[field] = value;
            });

            $(_settings['columns']).each(function (index, d) {
                if (d.field != "" && !d.readonly) {
                    var field = d.field.split(':')[0];
                    var value = $(row).find('#' + field).val();
                    t[field] = value;
                    if (converter.isCommaNumber(field, value))
                        t[field] = converter.toNoCommas(value);
                }
            });
            if (!$(row).is(':visible'))
                t.status = -1;

            result.push(t);
            //  }
        });
        return result;
    };
    var _self = this;
    this.init = function () {
        /*   if (!_settings.search)
               $('.txDataSearch').hide();
           else {*/
        $('.txDataSearch').val('');
        $('.txDataSearch').focus();
        $('.txDataSearch').off("input propertychange");
        $('.txDataSearch').on("input propertychange", function () {
            if (serching)
                clearTimeout(serching);
            serching = setTimeout(function () {
                _self.reset();
                _self.getNext();
            }, 1000);
        });
        if (_settings.checkAll) {
            $('.checkAllWrap').show();
        } else
            $('.checkAllWrap').hide();

        if (_settings.typeSearchFields) {
            $('#ddlTypeSearch').show();
            $('#ddlTypeSearch').change(function () {
                _self.reset();
                _self.getNext();
            });
        }

        _self.grid = $('.' + _settings.tbClassName).puregrid(_settings);
        this.getNext();

        bindScroll(_settings.tbClassName);
    }
    var _settings = $.extend(defaultSettings, settings);
    this.init();
    return this;
}

var DataImporterEx = function (settings) {
    var defaultSettings = {};
    var _settings = {};
    var _self = this;
    this.showDialog = function () {
        var dialogId = '#mdDataImporter'; //CrMdDataImporter.ascx
        $(dialogId).on('hidden.bs.modal', function () {
            $(dialogId).find('.txDataSearch').val('');
        });

        $(dialogId).on('shown.bs.modal', function () {
            $('.modal .modal-body').css('overflow-y', 'auto');
            var height = $(window).height() * 0.7;
            if (_settings.height)
                height = $(window).height() * _settings.height;
            height += 'px';

            var width = $(window).width() * 0.6;
            if (_settings.width) {
                width = $(window).width() * _settings.width;
            }
            width += 'px';
            $('.modal .modal-body').css('max-height', height);
            $('.modal .modal-body').css('height', height);
            $(dialogId).find('.modal-dialog').css({ width: width, margin: 'auto', 'max-width': width });
            $('.modal .pre-scrollable').css('max-height', '100%');
            $('.modal .pre-scrollable').css('height', '100%');
            $('.modal-title').text(_settings.dialogTitle);

            if (!_self.dataBinder) {
                _settings.caller = $('#mdDataImporter');
                _self.dataBinder = new DataBinderEx(_settings);
            }
            _self.dataBinder.reset();
            _self.dataBinder.getNext();
            setSearchUI();
            $('.modal .modal-footer').find(".btnOk").off("click");

            $('.modal .modal-footer').find(".btnOk").click(function () {
                okCallback()
            });

            $('.modal .modal-footer').find(".btnCancel").off("click");

            $('.modal .modal-footer').find(".btnCancel").click(function () {
                onCancel()
            });

            $(this).off('shown.bs.modal');
        }).modal();
    };

    var setSearchUI = function () {
        $('.txDataSearch').val('');
        $('.txDataSearch').focus();
        $('.txDataSearch').off("input propertychange");
        $('.txDataSearch').on("input propertychange", function () {
            clearTimeout(_self.serching);
            _self.serching = setTimeout(function () {
                _self.dataBinder.reset();
                _self.dataBinder.getNext();
            }, 1000);
        });

        if (_settings.checkAll) {
            $('.checkAllWrap').show();
        } else
            $('.checkAllWrap').hide();

        $('.ddlTypeSearch').hide();

        if (typeof (_settings.typeSearch) == "function") {
            $('.ddlTypeSearch').show();
            $('#ddlTypeSearch').change(function () {
                _self.reset();
                _self.getDataList();
            });
            _settings.typeSearch($('#ddlTypeSearch'));
        }
    };
    var getRowData = function (row) {
        //取搜尋視窗資料
        var d = $(row).data('data') || JSON.parse($(row).attr('data'));
        var result = d;

        //有對應detail importField
        result = {};
        var data = _settings.defaultData || d;
        if (typeof (data.serialNo) != 'undefined')
            data.serialNo += 1;
        var fields = _settings.importFields;
        for (i = 0; i < fields.length; i++) {
            if (fields[i].indexOf('=') != -1) {
                var t = d[fields[i].split('=')[1]];
                var b = fields[i].split('=')[0];
                result[b] = t;
            } else
                result[fields[i]] = d[fields[i]];
        }

        return result;
    };
    var onCancel = function () {
        if (_settings.onCancel) {
            _settings.onCancel();
        }
    };
    var okCallback = function () {
        var ary = [];
        _self.updateCount = 0;

        $('.tbDataImpoter').find('.row :has(:checkbox:checked)').each(function () {
            var row = $(this).closest('.row');
            var data = getRowData(row);

            var counter = new updateCounter({
                total: data.length, callback: function () {



                }
            });

            /*    if (_settings.updateNow) {
                    update(data, _settings.tableName, function () {
                        counter.count();
                        if (sender.updateCount >= count) {
                            if (typeof (sender.param.customGet) != 'undefined')
                                sender.param.customGet();
                            else
                                sender.binder.get();
                            $('#mdDataImporter').modal('hide');
                        }
                    }, "");
                }
                else*/

            if (_settings.okCallback) {
                ary.push(data);
            }
            else {
                //沒有定義客製方法 
                if (_detailGrid)
                    _detailGrid.append(data);

                $('#mdDataImporter').modal('hide');
            }
        })
        if (_settings.okCallback) {
            //   sender.dataParam.okCallback(data);
            _settings.okCallback(ary);
            //   $('#mdDataImporter').modal('hide');
        }
        if (_settings.autoClose != false)
            $('#mdDataImporter').modal('hide');

    };

    this.init = function () {

    }
    var _settings = $.extend(defaultSettings, settings);
    this.init();
    return this;
}


//檢查Form是否己存檔
function checkSavedEx(aUid) {
    if (!aUid) {
        return true;
    }
    var id = $(aUid).val();
    var result = true;
    if (id == "" || id == -1) {
        showError("請先儲存資料!");
        result = false;
    }
    return result;
}

function dataInsert() {
    $('.txData').val(today);
    var url = "/api/data/getNo";
    var param = { pageUid: $('#hdnPageUid').val(), dbAlias: _dbAlias };
    apiPost(url, param, function (data) {
        $('.txNo').val(data);
    });
}

(function ($) {
    $.fn.verticalMenu = function (settings) {
        var defaultSettings = {
            callback: function () {
            }
        }

        var togglePlusIcon = function (uid) {
            var t = $('#a' + uid);
            var s = "sumbMenu" + uid;
            $(t).find('.iconPlus').removeClass('fa-plus fa-minus');
            if ($('#' + s).is(':visible')) {
                $(t).find('.iconPlus').addClass('fa-minus');
            } else
                $(t).find('.iconPlus').addClass('fa-plus');
            // $(this).find('.iconPlus').toggleClass('fa-plus fa-minus');
        }

        this.bottomWrap;

        var bind = function () {
            var j = _settings.data;
            // var bar = $('<div id="sidebar-container" class="sidebar-expanded d-none d-md-block"></div>').addClass(_settings.barCss || '').css(_settings.barStyle || {}).appendTo(_self);
            if (_settings.brand) {
                $(_self.container).append(
                    $('<div />').addClass('brand text-center').append(
                        [$('<img id="brandIcon" src="' + _settings.brand + '">'), $('<div/>').text(_settings.brandTitle).addClass('p-1 brandText').css(_settings.brandTitleStyle || {})]
                    )
                )
            }
            var t = $('<div/>').addClass('flex-grow-1 overflow-auto').appendTo(_self.container);
            var u = $('<div/>').addClass('').css({ 'overflow': 'hidden' }).appendTo(t);
            var ul = $('<ul class="list-group mt-1"></ul>').appendTo(u);

            if (_settings.title) {
                $('<li class="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed"><small>' + _settings.title + '</small></li>').appendTo(ul);
            }

            $.each(j, function (index, d) {
                var id = 'sumbMenu' + d.uid;
                var a = $('<a id="a' + d.uid + '" href="#' + id + '" data-toggle="collapse" aria-expanded="false" class="list-group-item list-group-item-action flex-column align-items-start"></a>').data('data', d).addClass(_settings.itemCss).appendTo(ul).click(function () {

                    if ($(this).data('data').href)
                        window.location.href = $(this).data('data').href;

                    var t = '#sumbMenu' + $(this).data('data').uid;

                    setTimeout(function () {
                        var s = '';
                        $.each($(_self).find('.collapse.show'), function (index, d) {
                            s += $(d).attr('id') + ';';
                        });
                        cookies.write('activeSideMenus', s, 999);
                    }, 500);

                    if ($(_self).hasClass('sidebar-collapsed'))
                        sidebarCollapse();
                });
                $(a).css(_settings.itemStyle || {});

                var k = $('<div class="d-flex w-100 justify-content-start align-items-center"></div>').appendTo(a).click(function () {
                    var r = this;
                    setTimeout(function () {
                        var t = $(r).closest('a').data('data');
                        togglePlusIcon(t.uid);
                    }, 500);
                });
                var w = $('<span class="p-0 mr-1" ></span>').appendTo(k).click(function (e) {
                    sidebarCollapse();
                    e.stopPropagation();
                    e.preventDefault();
                });

                var s = $('<span class="fa-lg fa-fw" ></span>').appendTo(w);

                $(s).addClass(d.icon || '');
                $('<span class="menu-collapsed">' + d.name + '</span>').appendTo(k);
                //$('<span class="menu-collapsed"> ' + d.name + '</span>').appendTo(k);
                if (d.items) {
                    $('<span class="text-secondary ml-auto pl-3" style="font-size:10px;color:red;font-weight:light" ><i class="fas fa-plus iconPlus"></i></span>').appendTo(k);

                    var sub = $('<div id="' + id + '" class="collapse sidebar-submenu"></div>').appendTo(ul);
                    $.each(d.items, function (index, m) {
                        var url = m.href || encodeURI(d.url + "&id=" + m.uid + "&title=" + m.name);
                        var a = $('<a href="' + url + '" class="list-group-item list-group-item-action "></a>').addClass(_settings.subItemCss || '').css(_settings.subItemStyle || {}).appendTo(sub);
                        $('<span class= "menu-collapsed" > ' + m.name + '</span >').appendTo(a);
                    })
                }
            });

            /*     $(_self.container).append(
                     $('<div/>').addClass('mt-auto').append(
                         $('<a href="#top" data-toggle="sidebar-colapse" class="list-group-item list-group-item-action ali  d-flex align-items-center">').css(_settings.itemStyle).append(
                             $('<div class="d-flex w-100 justify-content-start align-items-center mt-1">').append(
                                 $('<span id="collapse-icon" class="fa fa-2x mr-3"></span><span id="collapse-text" class="menu-collapsed">Collapse</span>')
                             )
                         )
                     )
                 );*/


            _self.bottomWrap = $('<div/>').addClass('mt-auto').appendTo($(_self.container));

            $(_self).find('[data-toggle=sidebar-colapse]').click(function () {
                sidebarCollapse();
            });

            $(_self).find('#collapse-icon').addClass('fa-angle-double-left');

            /*  20201129 flyadvisor disabled
             if (!converter.toBoolean(cookies.read('sidebarExpanded')) || $(window).width() < 768)
                   sidebarCollapse();*/
        };

        this.collapse = function () {
            sidebarCollapse();
        }

        var sidebarCollapse = function () {
            $(_self).find('.menu-collapsed').toggleClass('d-none');
            $(_self).find('.sidebar-submenu').toggleClass('d-none');
            $(_self).find('.submenu-icon').toggleClass('d-none');
            $(_self).find('.brandText').toggleClass('d-none');


            $(_self).toggleClass('sidebar-expanded sidebar-collapsed');

            cookies.write('sidebarExpanded', $(_self).hasClass('sidebar-expanded'), 999);

            // Treating d-flex/d-none on separators with title
            var SeparatorTitle = $(_self).find('.sidebar-separator-title');
            if (SeparatorTitle.hasClass('d-flex')) {
                SeparatorTitle.removeClass('d-flex');
            } else {
                SeparatorTitle.addClass('d-flex');
            }
            // Collapse/Expand icon
            $(_self).find('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
            $(_self).find('#brandIcon').toggleClass('smallIcon');
            $(_self).find('.brand').toggleClass('smallBrand');
        }

        this.init = function () {
            $(this).addClass('sidebar-container sidebar-expanded').addClass(_settings.color || '').addClass(_settings.css || '').css(_settings.style || {});
            this.container = $('<div/>').css({
            }).addClass('h-100 d-flex flex-column').appendTo(_self);

            //    param = { aSPName: "getPages", aParams: "{menu:1}", aExParam: "{}" };
            //    getDataListBySP(param, bind, _self);
            bind();
            setTimeout(opendMenu, 100);

            return this;
        }
        var opendMenu = function () {
            var t = cookies.read('activeSideMenus');
            if (t) {
                t = t.split(';')
                for (i = 0; i < t.length; i++) {
                    $('#' + t[i]).collapse('toggle');
                    togglePlusIcon(t[i].substring(t[i].length - 1));
                }
            }
        }

        var _self = this;
        var _settings = $.extend(defaultSettings, settings);
        this.init();
        return this;
    }

})(jQuery);

var remeberMe = (function (settings) {
    var defaultSettings = {};
    var _settings = $.extend(settings, defaultSettings);
    $(_settings.checkbox).change(function () {
        if ($(this).is(":checked") == false) {
            cookies.remove(_settings.name);
            //$.removeCookie(_settings.name, { path: '/' });
            $(_settings.wrap).find('input[type=text],input[type=password]').val('');
        }
    });

    return {
        load: function () {
            $(_settings.checkbox).prop('checked', converter.toBoolean(cookies.read($(_settings.checkbox).attr('id'))));
            if (!cookies.read(_settings.name))
                return;
            var t = { me: cookies.read(_settings.name) };
            var url = "/api/userlogin/loadMe";
            apiPost(url, t, function (data) {
                var t = JSON.parse(data);
                $.each(t, function (key, val) {
                    $('#' + key).val(val);
                })
            });
        },
        remeber: function () {
            cookies.write($(_settings.checkbox).attr('id'), $(_settings.checkbox).prop('checked'), 30);
            if ($(_settings.checkbox).prop('checked') == true) {
                var url = "/api/userlogin/remeberMe";
                var param = {};
                $.each($(_settings.wrap).find('input').not(_settings.checkbox), function (index, d) {
                    param[$(d).attr('id')] = $(d).val();
                });
                apiPost(url, param, function (data) {

                    cookies.write(_settings.name, data, 30);
                });
            };
            //        var user = { 'companyNo': $("#txCompanyNo").val(), 'no': $("#txUserNo").val(), 'pass': $("#txPassword").val() }
            //       var param = user;
        }
    }
});
