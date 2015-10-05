(function ($) {
  var arrayInit = function(count, item) {
    return Array.apply(null, Array(count)).map(function () {
      return item;
    });
  };

  $.arrayInit = arrayInit;
})(jQuery);
