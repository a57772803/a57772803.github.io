 ﻿var _token;

$(window).resize(function () {
    if ($('#sidebar').length == 0)
        return;
    if (window.innerWidth >= 800) {
        $('#sidebar').addClass('d-none');
        $('#sidebar').removeClass('sidebarPopup');
    }
});

function apiPost(url, param, callback) {
    ajaxPost(url, param, callback);
}

function ajaxGet(url, data, callback, auth) {
    var d = new Date();
    //   var param = encodeURIComponent(JSON.stringify(data));

    var settings = {
        type: 'GET',
        url: url,
        data: data,
        dataType: "JSON",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (result, status) {
            if (callback != null) {
                callback(result);
            }
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            showError(lUrl + " " + xhr.status + " " + err.Message);
            //      alert(JSON.stringify(xhr));
        }
    }

    if (auth)
        $.extend(settings.headers, {
            "Authorization": "Bearer " + _token
        })
    //        settings.headers = settings.headers + "Authorization": "Bearer eyJraWQiOiJBbWZJSXU3UFhhdXlUbHM3UmNyZmNIQUd1MUdCWkRab2I0U05GaVJuWUFJPSIsImFsZyI6IlYYYjU2In0.eyJzdWIiOiJjNTYyEEE1ZS05Zjc3LTQ2NDAtYTFmOS1hJJJ5Njk1OGE0MzUiLCJhdWQiOiI3Z2ZsZnNmMm1vNnQ4dXJpOG0xcHY5N3BnayIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImE2YWFjOTQxLTYzYWUtNGU5ZS1iYTE1LTRlYTNlOGIyZjQ5MSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTY4OTY0NDI2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9qanRiZFZkZEYiLCJjb2duaXRvOnVzZXJuYW1lIjoiYzU2MmFjNWUtOWY3Ny00NjQwLWExZjktYTgxOTY5NThhNDM1IiwiZXhwIjoxNTY4OTY4MDI2LCJpYXQiOjE1Njg5NjQ0MjcsImVtYWlsIjoiYnJ5YW5Ab3BlbndvbmsuY29tIn0.fV4bgaKwXx-HjrBmGtBnSzaDHdP0JEeJ0sbE6MzuOJYWafT5gWfh9pLtkpUv-mgsnX3cVIWDVKC0H8_XM4ziUhsulZIRBwTiSca0CfABvanuMdbdjk1iK70aUxsrjHX0gK4SDUi4Zl6JNGws_SRbVi9Yq_ntx7ttXfUpZHjimfZ2mLidOLUruYctG1V_gU-dLD6CARCUbGh5aRk5nwX_5-HBUTbBVPYK3sXcVg2YRk63d-p3TITA5hoOEj9lxtHs3ZM7ZqNPl0XPUGghxdbvWnpSIUKrFLugRHqCiWxC38ZYiBhP0NDYoEMaOI-UrnEH1W6j-kr3fnH2LD5wOMJ_8Q"

    $.ajax(settings).done(function (response) {
        //callback(response);

    })
}

function ajaxPost(url, data, callback) {
    var d = new Date();
    //   var param = encodeURIComponent(JSON.stringify(data));
    var ajaxObj = $.ajax(
        {
            type: 'POST',
            url: url,
            data: data,
            dataType: "JSON",
            //  contentType: "application/json; charset=utf-8,",
            success: function (result, status) {
                if (callback != null) {
                    callback(result);
                }
            },
            beforeSend: function (xhr) {
                // if (auth)
                xhr.setRequestHeader('Authorization', 'Bearer ' + _token || '');
            },
            error: function (xhr, status, error) {
                showError(url + " " + xhr.status + " " + error.Message);
            }
        });
    return ajaxObj;
}


function initDatePicker() {
    $('.daterangePicker').daterangepicker({
        locale: {
            format: 'YYYY/MM/DD'
        }
    });
    $(".datepicker").datepicker({
        dateFormat: "yy/mm/dd"
    });
}

function showPopup(sender) {
    var pos = $(sender).offset();
    $('.info-panel').css({ top: pos.top + 30, left: pos.left - 80 });
    $('.info-panel').toggle();
}

function parseJwt(token) {
    if (!token)
        return '';
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


function initValidate(aContent) {
    if (typeof (aContent) == "undefined") {
        return
    }

    detachValidate(aContent);
    $(aContent).removeClass('validationEngineContainer');
    $(aContent).addClass('validationEngineContainer');


    jQuery(aContent).validationEngine('attach',
        {
            promptPosition: "bottomLeft",
            scroll: false,
            autoHidePrompt: true,
            //  Delay before auto-hide
            autoHideDelay: 3000,
            // Fade out duration while hiding the validations
            fadeDuration: 0.3,
            onsubmit: false
        });
};


function detachValidate(aContent) {
    try {
        $(aContent).validationEngine('detach');
    }
    catch (err) {
        alert(err);
    }
    finally {
        return true;
    }
}

function isValidate(aControlIdOrClass) {
    //aControll need to be form or element.hasClass("validationEngineContainer")
    var result = false;
    try {
        $(".formError").remove();
        result = $(aControlIdOrClass).validationEngine('validate');
    }
    catch (err) {
        showError("Validate Error:" + err.Message);
    }
    return result;
}


String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.lowerCaseFirstLetter = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.numberWithCommas = function () {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

String.prototype.lines = function () { return this.split(/\r*\n/); }
String.prototype.lineCount = function () { return this.lines().length; }



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

function bindFieldsData(tbClassName, aData) {
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
    var hidden = $(tab).find('input[type=hidden]:not(#tabItem input[type="hidden"]):not(.dataIgnore input[type="hidden"])');
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

    var ddl = $(tab).find('select:not(#tabItem select):not(.search):not(.dataIgnore textarea)');
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

var user = (function () {
    var data = function () {
        var t = parseJwt($.cookie("token"));
        return t;
    }
    return {
        id: function () {
            return data().userId;
        },
        token: function () {
            return $.cookie("token");
        },
        data: function () {
            return data();
        },
        validate: function (callback) {
            var result = false;
            if (!data() || !data().userId) {
                callback(false);
                return false;
            }
            var param = {}
            var url = '/api/userlogin/validateToken'
            apiPost(url, param, function (data) {
                callback(data);
            });
            return result;
        }
    }
})();


var message = (function () {
    /*<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>*/

    if ($('#alertBox').length == 0) {
        $('<div id="alertBox"></div>').css({ 'display': 'none', 'z-index': '99999', 'position': 'fixed', 'width': '50%', 'left': '25%', 'bottom': '20%' }).appendTo('body');
    }

    var create = function (type, msg) {
        $('#alertBox').empty();

        var t = $('<div class="alert alert-block alert-' + type + ' alert-dismissible fade show" role="alert"></div>').appendTo($('#alertBox'));
        $(t).append([$('<strong>Success!</strong>' + msg),
        $(' <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
        ]);
    }

    return {
        success: function (msg) {
            create('success', msg);
            $('#alertBox').show();
            setTimeout(function () {
                $('#alertBox').hide();
            }, 2000);

        }

    }
})();

function getWeekday(aDate) {
    var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var day = aDate.getDay();
    var result = weekday[day];
    return result;
}

function bindTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var month = now.getMonth();
    var weekday = getWeekday(now);
    var day = now.getDate();
    $('.weekDay').text(weekday);
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    $('.HH').text(hours);
    $('.mm').text(minutes);
    $('.ampm').text(ampm);
    $('.MM').text(month + 1);
    $('.dd').text(day);
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

var _examData = [];
function initMenuData() {
    var memberTypeId = user.data().memberTypeId;

    queryData('questionSource', 1, 99, '', '', function (data) {
        var d = { uid: 2, name: '模擬試題', url: '/home/examDetail?dataSource=sourceId', icon: 'fas fa-chalkboard-teacher fa-fw', items: JSON.parse(data) };
        _examData.push(d);
        if (memberTypeId > 1) {
            queryData('questionType', 1, 99, '', '', function (data) {
                var d = { uid: 1, name: '複習評量', url: '/home/examPractice?dataSource=typeId', icon: 'fas fa-book-reader', items: JSON.parse(data) };
                _examData.push(d);
                _examData.push({ uid: 3, name: '自我挑戰', icon: 'fas fa-laptop-code', href: '/home/examRandom?dataSource=random' });
                if (converter.toInt(memberTypeId) == 4 || converter.toInt(memberTypeId) == 3)
                    _examData.push({ uid: 4, name: '課堂測驗', icon: 'fas fa-school', href: '/home/classTest' });

                if (converter.toInt(memberTypeId) == 3) {
                    var tItems = [{ uid: '', name: '新增試卷', href: '/home/testAdd' }, { uid: '', name: '查詢試卷', href: '/home/examResult' }];
                    _examData.push({ uid: 5, name: '教師功能', icon: 'fas fa-graduation-cap fa-fw', items: tItems });
                }
                bindSideMenu();
            });
        } else
            bindSideMenu();
    });


}

var _sidebar;

function bindSideMenu(token) {
    checkPermission();
    checkToken();    
    if (_examData.length == 0)
        initMenuData()
    else {
        $('#userName').text(user.data().name);
        $('#userEmail').text(user.data().email);

        //gray
        _sidebar = $('#sidebar').verticalMenu({
            'color': '#1B4100',
            'brand': '/images/client/logo-vertical-b.png',
            'brandTitle': '模考評量系統',
            'brandTitleStyle': { 'font-size': '20px', 'font-weight': 700, 'margin-bottom': '20px', color: 'black' },
            'style': { 'width': '260px', 'font-size': '20px', 'padding-top': '20px', 'font-weight': 700, color: '#1B4100' },
            'css': 'd-none d-md-block shadow-r',
            'data': _examData, 'itemCss': "", 'subItemCss': '',
            'itemStyle': { 'border': 'none', 'padding': '10px', 'background-color': 'transparent', 'color': '#1B4100' },
            'subItemStyle': { 'border': 'none', 'margin': '0 20px 0 20px', 'padding': '10px 30px 10px 30px', 'background-color': 'transparent', 'color': '#1B4100', 'font-size': '15px', 'font-weight': 400 },
            toggle: function () {

            }
        });

        _sidebar.bottomWrap.addClass('pl-3').append(
            [$('<div/>').css({ 'font-size': '15px', 'font-weight': 400, 'color': '#1B4100' }).text(user.data().name),
            $('<div/>').css({ 'font-size': '15px', 'font-weight': 400, 'color': '#1B4100' }).addClass('mt-1 mb-1').text(user.data().email),
            $('<button/>').css({
                'font-size': '15px', 'font-weight': 400, 'color': 'white', 'background-color': '#64796E', 'padding': '10px 30px'
            }).text('登出模考').addClass('btn rounded mt-2 mb-3').click(function () {
                logoff();
            })]
        );
        
    }

    var t = $(location).attr('pathname') + $(location).attr('search');
    $.each($('a[href$="' + t + '"]'), function (index, d) {
        $(this).addClass('menuActive');
    });
}

function bindQuestion(sender) {
    $('.navQuestions').find('.active').removeClass('active');
    $(sender).addClass('active');
    _qIndex = $(sender).data('index') - 1;

    $('#questionNo').text(' 題目 ' + $(sender).data('index'));
    var d = $(sender).data('data');
    $('#question').text(d.question);

    //查詢試卷
    if (_viewMode) {
        $('#answerText').text('(' + d.answerNo + ')');
        if(d.rate === undefined){
            $('#answerRate').text('未有人答題');
        }else{
            $('#answerRate').text((d.rate || 0) + '%');            
        }
        //$('#answerRate').text((d.rate || 0) + '%');        
        if(d.courseRate === undefined){
            $('#answerCourseRate').text('未有人答題');
        }else{
            $('#answerCourseRate').text((d.courseRate || 0) + '%');            
        }
    }

    var t = $(sender).data('ans');
    //console.log(t);
    $('#answers').empty();
    $.each(t, function (index, a) {
        $('<div/>').append(
            $('<label/>').addClass('rb-1 bold').text(a.name).append(
                [$('<input type="radio" name="radio1" value="' + a.uid + '" />'),
                $('<span class="checkmark"></span>')]
            )
        ).appendTo($('#answers'));
    })
    //var a = $(sender).data('answer');
    var a = d.answerId;
    if (a && _viewMode)
        $("input:radio[name ='radio1']").filter('[value=' + a + ']').prop('checked', true);


    //會員作答
    var memberAnswer = $(sender).data('answer');
    if (memberAnswer)
        $("input:radio[name ='radio1']").filter('[value=' + memberAnswer + ']').prop('checked', true);

    if (_viewMode) {
        $.each($('#answers').find('input[type=radio]'), function (index, d) {
            $(d).prop('disabled', true)
        })
    }
    var top = $('.testArea').scrollTop();
    $.log.log(top);
    $('.testArea').scrollTop(0);
}

function bindScore(sender){
    var top = $('.scoreArea').scrollTop();
    $('#answers').empty();
    $.log.log(top);
    $('.scoreArea').scrollTop(0);
}

function getQuestionKindName(id) {
    var result = "普通卷";
    if (id == 1)
        result = "專業卷";
    return result;
}

function getQuestionDifficultName(id) {
    var result = '';
    switch (converter.toInt(id)) {
        case 0: {
            result = '難';
            break;
        }
        case 1: {
            result = '適中';
            break;
        }
        case 2: {
            result = '易';
            break;
        }
    }
    return result;
}

function bindQuestionTitle() {
    var title = '';
    var param = getUrlParams();
    switch (param.dataSource) {
        case 'typeId':
            {
                title = '複習評量';
                break;
            }
        case 'sourceId':
            {
                title = '模擬試題';
                break;
            }
    }
    $('#questionTitle').text(title + '-');
    $('#questionSubTitle').text(param.title || '');
}

var _viewMode = false;
function bindNavQuestions(data, viewMode) {
    showLoading();
    _viewMode = viewMode || false;
    var parent = $('.navQuestions');
    $(parent).empty();
    for (i = 0; i < data.length; i++) {
        var span = $('<span class="navQuestionsIcon " id="q' + i + '">' + (i + 1) + '</span > ').css("pointer-events", "none").data('index', i + 1).data('data', data[i]).appendTo(parent).click(function () {
            bindQuestion(this);
        });
        var j = i + 1;
        if (j >= 20 && j % 20 == 0)
            $('<br/>').appendTo(parent);
    }

    $('.navQuestions span').each(function () {
        var d = $(this).data('data');
        var uid = $(this).data('data').uid;
        if ($(this).data('data').questionsId)
            uid = $(this).data('data').questionsId;
        var self = this;
        queryData('answers', 1, 999, '', 'questionsId=' + uid, function (data) {
            $(self).data('ans', JSON.parse(data));

        })
    })
    setTimeout(function () {
        $('.navQuestions').find('#q0').trigger('click');
        closeLoading();
    }, 1500);
}

function viewAnswers() {
    $('.resultArea').addClass('d-none');
    $('.answerArea').removeClass('d-none');
    bindAnswer();
}

function nextAnswer() {
    if (_errorIndex + 1 < _error.length) {
        _errorIndex += 1;
        bindAnswer();
    } else
        showError('已到末題');

    if (_errorIndex > 0) {
        $('#btnPrevAnswer').removeClass('d-none');
    };
    $('.answerArea').scrollTop(0);

}

function prevAnswer() {
    if (_errorIndex - 1 >= 0) {
        _errorIndex -= 1;
        bindAnswer();
    } else {
        $('#btnPrevAnswer').addClass('d-none');
        showError('已到首題');
    }
    $('.answerArea').scrollTop(0);
}

function bindAnswer() {
    if (_errorIndex == _error.length - 1) {
        $('.answerArea #btnHome').removeClass('d-none');
        $('#btnNextAnswer').addClass('d-none');
    } else
        $('#btnNextAnswer').removeClass('d-none');

    var i = _error[_errorIndex];
    var t = $('.navQuestions').find('#q' + (i - 1));

    $('.answerArea #questionNo').text(' 題目 ' + $(t).data('index'));
    var d = $(t).data('data');
    $('.answerArea #question').text(d.question);

    $('.answerArea #answerText').text('(' + d.answerNo + ')');
    $('.answerArea #answerRate').text((d.rate || 0) + '%');

    var t = $(t).data('ans');
    $('.answerArea #answersVeiw').empty();
    $.each(t, function (index, a) {
        $('<div/>').append(
            $('<label/>').addClass('bold').text('(' + a.no + ')' + a.name)
        ).appendTo($('.answerArea #answersVeiw'));
    })

    var a = $(t).data('answer');
    if (a)
        $("input:radio[name ='radio1']").filter('[value=' + a + ']').prop('checked', true);

    //  answerText

    $('.imageWrap').empty();

    if (d.uniqueNo) {
        var file = '/images/answer/' + d.uniqueNo + '.jpg';
        if (imageExists(file)) {
            $('<img src="' + file + '" style=""/> ').appendTo($('.imageWrap'));
        }
    }
}

function checkNoAnswers() {
    var result = true;
    $.each($('.navQuestions span'), function (index, d) {
        var a = $(this).data('answer');
        if (!a) {
            result = false;
            return false;
        }
    });
    return result;
}

function returnExamMain() {
    window.location.href = '/home/exammain';
}

function showExamMessage(message, onShow) {
    var h = 0.5;
    var w = 0.5;
    if ($(window).width() < 780) {
        w = 0.8;
    }
    var t = {
        dialogId: 'mdMessage', title: '',
        height: h, width: w, top: '100px', onShow: function () {
            $('#mdMessage #lbMessage').text(message);
            if (onShow)
                onShow();
        }, onClose: function () {
            $('#mdMessage #lbMessage').text('');
            $('#mdMessage .btn-answer').hide();
        }
    }
    showModal(t);
}

function finishTest() {
    makeAnswer();

    if (checkNoAnswers() == false) {
        showExamMessage('尚有問題未完成作答\r\n請繼續完成未作答題目', function () {
            $('#mdMessage .btn-answer').show();
        });
        //showError('尚有問題未完成作答，請繼續完成未作答題目');
        return;
    }

    $('.testArea').addClass('d-none').removeClass('d-flex');
    $('.resultArea').removeClass('d-none');
    var txt = "";
    var t = calScore();
    _error = t.error.split(',');
    _errorIndex = 0;
    if (t.score >= 80)
        txt = '恭喜您，通過學科測驗！';
    else
        txt = '未通過學科測驗，再接再厲！';
    txt += '<br/> 總題數：' + $('.navQuestions span').length + '<br/> 分數：' + t.score + '<br/><br/>';
    if (t.score == 100) {
        txt += '恭喜你，全部答對喔！';// + t.error;        
        $('#btnViewAnswer').addClass('d-none');
        $('.btnRetunrExamMain').removeClass('d-none');

    } else
        txt += '答錯題號：';// + t.error;
    var k = $('<div/>').html(txt);


    $.each(_error, function (index, d) {
        $('<span/>').addClass('errorAnswer').text(d).appendTo($('.testErrorAnswers'));
    })

    $('.testResult').append([k]);

    saveExamResult();
}

function saveExamResult() {
    var data = {
        memberId: user.id(), data: getTimeNow()
    }

    var headData = $('#hdnHeadData').data('data');
    if (headData) {
        var ex = {
            courseQuestionId: headData.courseQuestionId || -1, courseId: headData.courseId || -1
        }
        $.extend(data, ex);
    }

    update(data, 'examResult', '', '', function (parentId) {
        var serialNo = 0;
        $('.navQuestions span').each(function () {
            var d = $(this).data('data');
            var uid = $(this).data('data').uid;
            if ($(this).data('data').questionsId)
                uid = $(this).data('data').questionsId;
            serialNo += 1;
            var a = { serialNo: serialNo, parentId: parentId, questionsId: uid, answer: $(this).data('answer') };
            update(a, 'examResultDetail', '', '', function (data) {

            });
        })
    })
}

function calScore() {
    var result = {};
    var u = 100 / $('.navQuestions span').length;

    var error = "";
    var ok = 0;
    $.each($('.navQuestions span'), function (index, d) {
        var a = $(this).data('answer');
        var data = $(this).data('data');
        if (data.answerId == a) {
            ok += 1;
        } else
            error += $(this).data('index') + ",";
    });
    error = error.slice(0, -1);
    var score = converter.toInt(ok * u);
    return { score: score, error: error };
}

var _expandAnsAreaFlag = false;



function firstQuestion(type) {
    makeAnswer();
    _qIndex = 0;
    $('.navQuestions').find('#q' + _qIndex).trigger('click');
    if(type == 1)
        getCourseMemberAnsStat();
}

function firstNoAnswer() {
    makeAnswer();
    $.each($('.navQuestions span'), function (index, d) {
        var a = $(this).data('answer');
        if (!a) {
            $(this).trigger('click');
            return false;
        }
    });
}

function lastQuestion(type) {
    makeAnswer();
    _qIndex = $('.navQuestions span').length - 1;
    $('.navQuestions').find('#q' + _qIndex).trigger('click');
    if(type == 1)
        getCourseMemberAnsStat();
}

function prevQuestion(type) {
    makeAnswer();
    if (_qIndex - 1 >= 0) {
        _qIndex -= 1;
        $('.navQuestions').find('#q' + _qIndex).trigger('click');
    } else
        showExamMessage('第一題', function () {

            $('#mdMessage .btn-answer').hide();

        })

        if(type == 1)
        getCourseMemberAnsStat();

}
function cancelAnswer() {
    $("input:radio[name ='radio1']").prop('checked', false);
    $('.navQuestions').find('#q' + _qIndex).removeClass('text-white bg-primary bg-danger').data('answer', '');
}

function makeAnswer() {
    if (!_viewMode) {
        var t = $("input:radio[name ='radio1']:checked").val();
        var css = 'bg-primary text-white';
        if (!t)
            css = 'bg-danger text-white';
        var q = $('.navQuestions').find('#q' + _qIndex).removeClass('text-white bg-primary bg-danger').data('answer', t).addClass(css);
    }
}

function nextQuestion(type) {
    makeAnswer();
    var c = $('.navQuestions span').length;
    if (c > _qIndex + 1) {
        _qIndex += 1;
        var t = $('.navQuestions').find('#q' + _qIndex);
        bindQuestion(t);
    } else {
        showExamMessage('最後一題', function () {
            $('#mdMessage .btn-answer').hide();
        })
    }
    if(type == 1)
        getCourseMemberAnsStat();
}

function round5(x) {
    return Math.ceil(x / 5) * 5;
}

function setExpandAnsAreaFlag(expandAnsFlag){
    _expandAnsAreaFlag = expandAnsFlag;
}

var _tableGrid;
function setTableGrid(grid){
    _tableGrid = grid;
}

function getQuestionIndex() {
        //return _qIndex;    
    var t = $('.navQuestions').find('#q' + _qIndex);
    var d = $(t).data('data');
    return d;
}

function getCourseMemberAnsStat(){
    if(_expandAnsAreaFlag){
    var data = getQuestionIndex();
    $.log.log('questionsId ' + i.questionsId);
    //console.log("site->getCourseMemberAnsStat->_expandAnsAreaFlag = "+_expandAnsAreaFlag);
    _tableGrid.empty();
    querySp('getExamAnsByCourseQuestionId', { courseExamId: data.parentId, courseQuestionId: data.questionsId }, {}, function (data) {
                                
        _tableGrid.append(JSON.parse(data));
    });
    }
}

function bindQuestionType() {
    queryData('questionType', 1, 999, '', '', function (data) {
        $.each(JSON.parse(data), function (index, d) {
            var row = $('<div/>').addClass('row w-100').append([$('<div/>').addClass('col-md-4  col-sm-12 text-right sm-left questionTypeName').text(d.name),
            $('<div/>').addClass('col-md-5 col-sm-12').append(
                $('<div class="input-group w-50"></div>').append([

                    $('<select/>').prop('disabled', 'disabled').addClass('form-control').append(['<option>0</option>', '<option>10</option>', '<option>20</option>',
                    '<option>30</option>', '<option>40</option>',
                        '<option>50</option>', '<option>60</option>', 
                        '<option>70</option>', '<option>80</option>',
                        '<option>90</option>', '<option>100</option>'])
                    , $('<div class="input-group-append"><span class="input-group-text">%</span></div>')
                ])
            )
            ]);

            var r = $('<div/>').addClass('col col-sm-12 typeScale').append(row).data('data', d);

            $('<div/>').addClass('form-group row').appendTo($('.questionTypeWrap')).append(
                [$('<div class="col-md-2 col-sm-12"/> '), r]
            );
        });

    })
}

function getTestRandomParam() {
    rate = [];
    var kind = $("input[name='rbType']:checked").val();
    var scale = $("input[name='rbScale']:checked").val();
    var avg = parseInt(100 / $('.questionTypeWrap .typeScale').length);

    var total = 0;
    $.each($('.questionTypeWrap .typeScale'), function (index, d) {
        var r = $(d).find('option:selected').text();
        if (scale == 0)
            r = avg;

        rate.push({ type: $(d).data('data').uid, 'rate': r });
        total += converter.toInt(r);
    });
    if (total != 100) {
        showError('客製分配比例需為100%');
        return false;
    }
    return { kind: kind, scaleType: scale, rate: JSON.stringify(rate), difficultType: $("input[name='rbLevel']:checked").val() }
}


function subscript() {
    initValidate($('#subscriptArea'));
    if (isValidate('#subscriptArea')) {
        var url = '/api/userLogin/subscript';
        ajaxPost(url, {
            email: $('#txSubscript').val()
        }, function () {
            showMessage('己成功訂閱');
            $('#txSubscript').val('');
        });
    }
}

