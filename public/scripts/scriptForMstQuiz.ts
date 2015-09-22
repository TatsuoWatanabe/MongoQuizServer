$(() => {
  $('table.mst').on('click', '#btnAddChoice', (evt) => {
    var $btn          = $(evt.target);
    var $invisibleRow = $btn.closest('.panel').find('li.list-group-item.hide');
    var $newChoiceRow = $invisibleRow.clone().removeClass('hide');
    var $choicesList  = $btn.closest('.panel').find('ul.list-group');
    $choicesList.append($newChoiceRow)
                .append($invisibleRow);
    $newChoiceRow.find('input').each((index, elem) => {
      var $el      = $(elem);
      var newIndex = $choicesList.find('li:visible').length - 1;
      var newName  = $el.attr('name').replace(/(choices)\[(.+?)\]\[(.+?)\]/, '$1[' + newIndex + '][$3]');
      $el.prop('disabled', false).attr('name', newName);
    });
  });

  $('table.mst').on('click', 'button.choice-delete', (evt) => {
    var $btn = $(evt.target);
    $btn.closest('li').remove();
  });

  /* panel-collapse */
  $(document).on('click', '.panel-heading', (e) => {
    var $head  = $(e.target);
    var $panel = $head.closest('.panel');
    var $body  = $panel.children('.panel-body');
    if ($panel.is('.panel-collapse')) {
      $body.collapse('toggle');
    }
  });
  
});
