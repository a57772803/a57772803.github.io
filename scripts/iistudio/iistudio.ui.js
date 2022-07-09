
function showError(text) {

    if ($('#errorPanel').length == 0) {
        var w = $('<div id="errorPanel"></div>').css({
			'background-color': 'red',
            'color': 'white', 'position': 'absolute',
            'padding': '100px', 'top': '50%', 'left': '50%',
            'transform': 'translateX(-50%) translateY(-50%)',
            'font-size': '1.5em', 'text-align': 'center', 'z-index': '999999'
        }).appendTo('body');
    }
    $('#errorPanel').text(text);
    $('#errorPanel').show();
    setTimeout(function () { $('#errorPanel').hide(); }, 3000);
}

function showMessage(text) {

    if ($('#messagePanel').length == 0) {
        var w = $('<div id="messagePanel"></div>').css({
            'background-color': '#009944',
            'color': 'white', 'position': 'absolute',
            'padding': '100px', 'top': '50%', 'left': '50%',
            'transform': 'translateX(-50%) translateY(-50%)',
            'font-size': '1.5em', 'text-align': 'center', 'z-index': '999999'
        }).appendTo('body');
    }
    $('#messagePanel').text(text);
    $('#messagePanel').show();
    setTimeout(function () { $('#messagePanel').hide(); }, 3000);
}

function showLoading() {
    if ($('#loadingmessage').length == 0) {
        var k = $('<div id="loadingmessage" class=""></div>').appendTo('body');
        $(k).css({
            'display': 'none', 'position': 'absolute', 'left': '50%', 'margin-left': '-16px', 'top': '50%', 'margin-top': '-16px', 'width': '32px', 'height': '32px',
            'z-index': '99999999', 'background-image': 'url("/images/ajax-loader.gif")'
        })
    }
    $('#loadingmessage').show();
}

function closeLoading() {
    $('#loadingmessage').hide();
}

function showModal(aParam) {
    var dialogId = aParam.dialogId;
    var title = aParam.title;
    var onShow = aParam.onShow;
    showLoading();
    $('#' + dialogId).off('shown.bs.modal');
    $('#' + dialogId).on('shown.bs.modal', function () {
        $('.modal .modal-body').css('overflow-y', 'auto');
        var h = '50%';
        if (aParam.height) {
            if (aParam.height > 0 && aParam.height <= 1)
                h = $(window).height() * aParam.height + "px";
            else
                h = aParam.height;
        }
        $('.modal .modal-body').css('max-height', h);
        $('.modal .modal-body').css('height', h);

        var w = '50%';
        if (aParam.width) {
            if (aParam.width > 0 && aParam.width <= 1)
                w = (aParam.width * 100) + '%';
            else
                w = aParam.width;

            $('#' + dialogId).find('.modal-dialog').css({ 'margin': 'auto', 'max-width': w, 'width': w });
        }

        if (aParam.height) {
            if (aParam.height < 1)
                aParam.height = (aParam.height * 100) + '%';

            $('#' + dialogId).find('.modal-dialog').css({ 'height': aParam.height });
        }

        if (typeof (aParam.top) != 'undefined') {

            $('#' + dialogId).find('.modal-dialog').css({ 'margin-top': aParam.top });
        }

        $('.modal .pre-scrollable').css('max-height', '100%');
        $('.modal .pre-scrollable').css('height', '100%');
        $('.modal-title').text(aParam.title);

        if (aParam.data != null) {
            //
            var h = $('#' + dialogId).find('#hdnData');
            if (h.length == 0)
                h = $('<input type="hidden" id="hdnData" />').appendTo($('#' + dialogId));
            $(h).attr('data', aParam.data);
        }

        if (typeof (onShow) == 'function')
            onShow();

        $('#' + dialogId + ' .modal-footer').find(".btnOk").off("click");
        //$('.modal .modal-footer').find(".btnOk").bind("click", sender.okCallback);
        $('#' + dialogId + ' .modal-footer').find(".btnOk").click(function () {
            aParam.okCallback($('#' + dialogId));
            $('#' + dialogId).modal('hide');
        });
        $(this).off('shown.bs.modal');
        $(document).off('focusin.modal');
        closeLoading();
    }).modal();
    $('#' + dialogId).off('hidden.bs.modal');
    $('#' + dialogId).on('hidden.bs.modal', function () {
        if (aParam.onClose)
            aParam.onClose();
    })
}

function initDatePickerEx(aCallback, aControl) {
    $('.datepicker').datepicker('destroy');
    var c = $(".datepicker");
    if (aControl) {
        c = aControl;
        $(aControl).datepicker('destroy');
    }

    $(c).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy/mm/dd",
        onSelect: function (selected, event) {
            if (aCallback)
                aCallback();
        }
    });
    try {
        $('.timepicker').timepicker();
    }
    catch (exception) {

    }


}




$.listDataUI = {
    init: function (param) {
        this.param = param;
        this.reset();
        this.param.btnCancel.hide();
        if (this.param.exWrap)
            this.param.exWrap.hide();
        if (this.param.customToolbar) {
            this.param.customToolbar.appendTo($('.customToolbar'));
            this.param.customToolbar.show();
        }

    },
    insert: function () {
        this.param.listWrap.hide();
        this.param.editWrap.show();
        this.param.btnNew.hide();
        this.param.btnCancel.show();
        this.param.btnSave.show();
        if (this.param.exWrap)
            this.param.exWrap.hide();
    },
    edit: function () {
        this.param.listWrap.hide();
        this.param.editWrap.show();
        this.param.btnNew.hide();
        this.param.btnCancel.show();
        this.param.btnSave.show();
        if (this.param.exWrap)
            this.param.exWrap.show();
    },
    reset: function () {
        this.param.listWrap.show();
        this.param.editWrap.hide();
        this.param.btnNew.show();
        this.param.btnCancel.hide();
        this.param.btnSave.hide();
        if (this.param.exWrap)
            this.param.exWrap.hide();

        this.param.editWrap.find('input[type=text]').val('');
        this.param.editWrap.find('input[type=password]').val('');
        this.param.editWrap.find('input[type=hidden]').val('-1');
        this.param.editWrap.find('textarea').val('');
        this.param.editWrap.find('select').val('-1');
    }
}