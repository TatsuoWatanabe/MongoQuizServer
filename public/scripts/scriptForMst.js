/// <reference path="../../src/typings/jquery.d.ts" />
(function ($) {
    $.fn.toggleDisabled = function (swtch) {
        return this.each(function (i, el) {
            el.disabled = (typeof swtch === 'boolean') ? swtch : !el.disabled;
        });
    };
})(jQuery);
// -------------------------
$(function () {
    $.ajaxSetup({
        beforeSend: function () { $.ajaxLoaderImg.fadeIn(); },
        complete: function () { $.ajaxLoaderImg.fadeOut(); }
    });
    var btnsDisabledStateChange = (function () {
        var func = function (flg) { return $('table.mst').find('.insert-btn, .edit-btn, .child-btn').toggleDisabled(flg); };
        func(false); // enable all buttons.
        return func;
    })();
    var ajaxFailedAlert = function () {
        alert("読み込みに失敗しました");
    };
    var scrollToBottom = function () { $('html, body').animate({ scrollTop: $('body').height() }); };
    // edit row.
    $('table.mst').on('click', '.insert-btn, .edit-btn, .cancel-btn', function (evt) {
        evt.preventDefault();
        var $btn = $(evt.target);
        var url = $btn.data('url');
        var otherBtnsDisabled = !!$btn.data('other_btns_disabled');
        if ($btn.is('.insert-btn')) {
            scrollToBottom();
        }
        btnsDisabledStateChange(otherBtnsDisabled);
        $.ajax(url).done(function (response) {
            $btn.closest('tr').html(response);
        }).fail(ajaxFailedAlert);
    });
    // execute row
    $('table.mst').on('click', '.exec-btn', function (evt) {
        evt.preventDefault();
        var $btn = $(evt.target);
        var $row = $btn.closest('tr');
        var url = $btn.data('url');
        var isNew = !!$btn.data('isnew');
        var otherBtnsDisabled = !!$btn.data('other_btns_disabled');
        $.ajax({
            url: url,
            type: 'POST',
            beforeSend: function () { return $btn.toggleDisabled(true); },
            complete: function () { return $btn.toggleDisabled(false); },
            data: $btn.closest('form').serialize()
        }).done(function (response) {
            $row.html(response);
            //@* バリデーションエラーではない場合の処理 *@
            if (!$row.find('input[name]').length) {
                //@* 新規追加の場合は新しい新規追加用の行を追加 *@
                if (isNew) {
                    $row.after($row.next('tr').clone().show());
                    scrollToBottom();
                }
                btnsDisabledStateChange(otherBtnsDisabled);
            }
        }).fail(ajaxFailedAlert);
    });
    // delete row
    $('table.mst').on('click', '.delete-btn', function (evt) {
        evt.preventDefault();
        var $btn = $(evt.target);
        var url = $btn.data('url');
        var otherBtnsDisabled = !!$btn.data('other_btns_disabled');
        if (!confirm('This item is deleted. Will that be all right?')) {
            return false;
        }
        $.ajax(url).done(function (response) {
            btnsDisabledStateChange(otherBtnsDisabled);
            location.reload();
        }).fail(ajaxFailedAlert);
    });
});
//# sourceMappingURL=scriptForMst.js.map