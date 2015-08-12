(function ($) {
  $.fn.tempAddClass = function(cls, duration) {
    var $el = $(this);

    return $el.addClass(cls).delay(duration).queue(function (next) {
      $(this).removeClass(cls);
      next();
    });
  };
})(jQuery);
