
function getUrlParams() {
    var search = location.search.substring(1);
    if (!search)
        return '';
    var param = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    return param;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function checkToken(){
    var userId = parseJwt(cookies.read("token")).userId;
    var macAddr = parseJwt(cookies.read("token")).macAddr;
    var emailStr = parseJwt(cookies.read("token")).email;
    
    //console.log("token = " + userId);
    if(userId == null){
        //showError("登入憑證失效!!請重新登入!!");
		//showExamMessage("登入憑證失效!!\r\n請重新登入!!",'');
		showExamMessage('登入憑證失效!!\r\n請重新登入!!', function () {
               $('#mdMessage .btn-answer').hide(); })
        setInterval(function(){
            logoff();
            },3000);
    }
    //console.log(emailStr);
    var url = '/api/userlogin/member';
    apiPost(url, {
        email: emailStr, password: '', auth: 0
    }, function (data) {       
        //console.log(data) ;
        var obj = parseJwt(data);
        //console.log(obj);
        //console.log(macAddr)
        if(macAddr != obj.macAddr){
            showExamMessage('目前有其他裝置用此帳號登入, 因此將您登出!!\n若要繼續使用, 請重新登入!!', function () {
                $('#mdMessage .btn-answer').hide(); })
         setInterval(function(){
             logoff();
             },3000);
        }
    });

    return;
}

function checkPermission(){
    var memberTypeId = parseJwt(cookies.read("token")).memberTypeId;
    var isValid = true;
    var path = window.location.pathname;
    var page = path.split("/").pop();
    //console.log(page);
    //examPractice -複習評量, examRandom-自我挑戰, classTest-課堂測驗, testAdd/examResult-教師功能
    /*if((page == "examPractice" || page == 'examRandom')
         && memberTypeId == 1){
        isValid = false;
    }
    if((page =='classTest' || page == 'testAdd' || page == 'examResult')
         && memberTypeId < 3){
            isValid = false;
    }*/

    //Modify by Linda
    if((page == "examPractice" || page == "examRandom" || page == "classTest" || page == "testAdd" || page == "examResult")
         && memberTypeId == ''){
        isValid = false;
    }
    if((page == "classTest" ||  page == "testAdd" || page == "examResult")
         && memberTypeId == 2){
        isValid = false;
    }
    if(( page == "testAdd" || page == "examResult")
         && memberTypeId == 4){
       isValid = false;
    }
 
    if(!isValid){
        window.location.href = "/home/examMain";
    }
    return;
}

function today() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return yyyy + "/" + mm + "/" + dd;
}

function tomorrow() {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
}

//remark 20150911
function addDays(aDay) {
    var today = new Date();
    var result = new Date(today);
    result.setDate(today.getDate() + aDay);
    return result;
}

function getYearFirstDay() {
    var result = getYear(new Date) + "/01/01";
    return result;
}

function getYear(aDate) {

    return String(aDate.getFullYear());
}

function getMonth(aDate) {

    return String(aDate.getMonth());
}

function getDay(aDate) {

    return String(aDate.getDate());
}


function thisYear() {
    var currentdate = new Date();
    return padLeft(String(currentdate.getFullYear()));
}

function thisMonth() {
    var currentdate = new Date();
    return padLeft(String(currentdate.getMonth() + 1), 2);
}

function thisDay() {
    var currentdate = new Date();
    return padLeft(String(currentdate.getDate() + 1), 2);
}

function thisHour() {
    var currentdate = new Date();
    return padLeft(String(currentdate.getHours() + 1), 2);
}

function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}
function padRight(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padRight(str + "0", lenght);
}

function getTimeNow() {
    var currentdate = new Date();
    var datetime = String(currentdate.getFullYear()) + "-"
        + padLeft(String(currentdate.getMonth() + 1), 2) + "-"
        + padLeft(String(currentdate.getDate()), 2) + " "
        + padLeft(String(currentdate.getHours()), 2) + ":"
        + padLeft(String(currentdate.getMinutes()), 2) + ":"
        + padLeft(String(currentdate.getSeconds()), 2);
    return datetime;
}


function getNowToStr() {
    var currentdate = new Date();
    var datetime = String(currentdate.getFullYear())
        + padLeft(String(currentdate.getMonth() + 1), 2)
        + padLeft(String(currentdate.getDate()), 2)
        + padLeft(String(currentdate.getHours()), 2)
        + padLeft(String(currentdate.getMinutes()), 2)
        + padLeft(String(currentdate.getSeconds()), 2);
    return datetime;
}



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

function getFileExtension(aFileName) {
    var result = aFileName.substr(aFileName.lastIndexOf('.') + 1).toLowerCase();
    return result;
}

function isImageFile(aFileName) {
    var extensions = ["jpg", "jpeg", "bmp", "gif", "png"];
    var ext = getFileExtension(aFileName);
    var result = false;
    $(extensions).each(function (index, d) {
        if (d == ext) {
            result = true;
            return false;
        }
    });
    return result;
}

function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

function simulateKeyPress(character) {
    jQuery.event.trigger({ type: 'keypress', which: character.charCodeAt(0) });
}


function escapeRegExp(string) {
    return string.replace(/-([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function openUrl(aUrl) {
    if (!aUrl)
        return;
    if (aUrl.indexOf("http") == -1)
        aUrl = "http://" + aUrl;
    window.open(aUrl, '_blank');
}

function openEmail(address) {
    if (!address)
        return;
    var url = 'mailto:' + address;
    window.open(url);
}

function imageExists(imageUrl) {
    var http = new XMLHttpRequest();
    http.open('HEAD', imageUrl, false);
    http.send();
    return http.status != 404;
}

function getPartial(aController, aAction, aParam, aCallback) {
    showLoading();
    $.ajax({
        type: 'POST',
        url: '/' + aController + '/' + aAction,
        data: aParam,
        success: function (data) {
            aCallback(data);
            closeLoading();
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            showError(lUrl + " " + xhr.status + " " + err.Message);
            //      alert(JSON.stringify(xhr));
        }
    });
}

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
                var t = user.token();
                xhr.setRequestHeader('Authorization', 'Bearer ' + t);
            },
            error: function (xhr, status, error) {
                if (xhr.status == 200) {
                    if (callback != null) {
                        callback();
                    }
                } else
                    showError(url + " " + xhr.status + " " + error.Message);
            }
        });
    return ajaxObj;
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



var user = (function () {
    var data = function () {
        var t = parseJwt(cookies.read("adminToken"));
        return t;
    }
    return {
        id: function () {
            return data().userId;
        },
        companyId: function () {
            return data().companyId;
        },
        token: function () {
            return cookies.read("adminToken");
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

function initUpload(target, callback) {
    $(target).fileupload({
        dataType: 'json',
        //    dropZone: $('target'),
        //   formData: { 'id': $this.attr('id') },
        add: function (e, data) {
            var t = data.files[0].name;
            $('.uploadWrap').find('.info').hide();
            $('<div class="fileItem">' + t + '</div>').appendTo($('.uploadWrap'));
            data.submit();
        },
        progress: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var l = ($('.bar').length);
            $('.progress-bar').css('width', progress + '%');
        },

        done: function (e, data) {
            //      $.log.log(data.result.filename);// && data.result.status == 'ok'
            var t = JSON.parse(data.result);
            callback(t.filename);

            $('.progress-bar').hide();
            $('.uploadWrap').find('.fileItem').remove();
            $('.uploadWrap').find('.info').show();
        }, fail: function (e, data) {
            alert('fail');
        }
    });
}


var ajaxManager = (function () {
    var requests = [];

    return {
        addReq: function (opt) {
            requests.push(opt);
        },
        removeReq: function (opt) {
            if ($.inArray(opt, requests) > -1)
                requests.splice($.inArray(opt, requests), 1);
        },
        reset: function () {
            requests = [];
        },
        run: function () {
            var self = this,
                oriSuc;

            if (requests.length) {
                oriSuc = requests[0].complete;

                requests[0].complete = function () {
                    if (typeof (oriSuc) === 'function') oriSuc();
                    requests.shift();
                    self.run.apply(self, []);
                };

                $.ajax(requests[0]);
            } else {
                self.tid = setTimeout(function () {
                    self.run.apply(self, []);
                }, 1000);
            }
        },
        stop: function () {
            requests = [];
            clearTimeout(this.tid);
        }
    };
}());


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
