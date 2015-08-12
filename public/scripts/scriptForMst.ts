/// <reference path="../../src/typings/jquery.d.ts" />

// --- extend the jQuery ---
interface JQuery {
  /**
   * toggle the disabled attribute for input field.
   * @see http://php.quicoto.com/how-to-toggle-disabled-with-jquery/
   */
  toggleDisabled(swtch?: boolean): JQuery;
}
interface JQueryStatic {
  ajaxLoaderImg: {
    show   : () => JQuery;
    fadeIn : () => JQuery;
    hide   : () => JQuery;
    fadeOut: () => JQuery;
  };
}
(($) => {
  $.fn.toggleDisabled = function(swtch?: boolean) {
    return this.each((i, el) => {
      el.disabled = (typeof swtch === 'boolean') ? swtch : !el.disabled;
    });
  };
})(jQuery);
// -------------------------

$(() => {
  $.ajaxSetup({
    beforeSend: () => { $.ajaxLoaderImg.fadeIn();  },
    complete  : () => { $.ajaxLoaderImg.fadeOut(); }
  });

  var btnsDisabledStateChange = (() => {
    var func = (flg: boolean) => $('table.mst').find('.insert-btn, .edit-btn, .child-btn').toggleDisabled(flg);
    func(false); // enable all buttons.
    return func;
  })();

  var ajaxFailedAlert = function() {
    alert("読み込みに失敗しました");
  };

  var scrollToBottom = () => { $('html, body').animate({ scrollTop: $('body').height() });};
  
  // edit row.
  $('table.mst').on('click', '.insert-btn, .edit-btn, .cancel-btn', (evt: Event) => {
    evt.preventDefault();
    var $btn              = $(evt.target);
    var url               = $btn.data('url');
    var otherBtnsDisabled = !!$btn.data('other_btns_disabled');
    
    if ($btn.is('.insert-btn')) { scrollToBottom(); }

    btnsDisabledStateChange(otherBtnsDisabled);

    $.ajax(url).done((response) => {
      $btn.closest('tr').html(response);
    }).fail(ajaxFailedAlert);
  });

  // execute row
  $('table.mst').on('click', '.exec-btn', (evt: Event) => {
    evt.preventDefault();
    var $btn              = $(evt.target);
    var $row              = $btn.closest('tr');
    var url               = $btn.data('url');
    var isNew             = !!$btn.data('isnew');
    var otherBtnsDisabled = !!$btn.data('other_btns_disabled');

    $.ajax({
      url       : url,
      type      : 'POST',
      beforeSend: () => $btn.toggleDisabled(true), // @* ボタン押下時点でボタン無効化(二度押し防止) *@
      complete  : () => $btn.toggleDisabled(false),
      data      : $btn.closest('form').serialize()
    }).done((response) => {
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
  $('table.mst').on('click', '.delete-btn', (evt: Event) => {
    evt.preventDefault();
    var $btn              = $(evt.target);
    var url               = $btn.data('url');
    var otherBtnsDisabled = !!$btn.data('other_btns_disabled');

    if (!confirm('This item is deleted. Will that be all right?')) { return false; }

    $.ajax(url).done((response) => {
      btnsDisabledStateChange(otherBtnsDisabled);
      location.reload();
    }).fail(ajaxFailedAlert);
  });

});