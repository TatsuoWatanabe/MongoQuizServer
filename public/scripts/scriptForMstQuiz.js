$(function () {
    $('table.mst').on('click', '#btnAddChoice', function (evt) {
        var $btn = $(evt.target);
        var $invisibleRow = $btn.closest('.panel').find('li.list-group-item.hide');
        var $newChoiceRow = $invisibleRow.clone().removeClass('hide');
        var $choicesList = $btn.closest('.panel').find('ul.list-group');
        $choicesList.append($newChoiceRow)
            .append($invisibleRow);
        $newChoiceRow.find('input').each(function (index, elem) {
            var $el = $(elem);
            var newIndex = $choicesList.find('li:visible').length - 1;
            var newName = $el.attr('name').replace(/(choices)\[(.+?)\]\[(.+?)\]/, '$1[' + newIndex + '][$3]');
            $el.prop('disabled', false).attr('name', newName);
        });
    });
    $('table.mst').on('click', 'button.choice-delete', function (evt) {
        var $btn = $(evt.target);
        $btn.closest('li').remove();
    });
    /* panel-collapse */
    $(document).on('click', '.panel-heading', function (e) {
        var $head = $(e.target);
        var $panel = $head.closest('.panel');
        var $body = $panel.children('.panel-body');
        if ($panel.is('.panel-collapse')) {
            $body.collapse('toggle');
        }
    });
    /* point input */
    $(document).on('change keyup', 'input[name$="[point]"]', function (e) {
        var $textbox = $(e.target);
        var $panel = $textbox.closest('.panel');
        var point = Number($textbox.val());
        if (isNaN(point)) {
            return;
        }
        var colorClass = (point > 0 ? 'panel-primary' : 'panel-danger');
        $panel.removeClass('panel-primary panel-danger').addClass(colorClass);
    });
});
//# sourceMappingURL=scriptForMstQuiz.js.map