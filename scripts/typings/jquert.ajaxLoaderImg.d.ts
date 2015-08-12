// --- extend the jQuery ---
interface JQueryStatic {
  ajaxLoaderImg: {
    show   : () => JQuery;
    fadeIn : () => JQuery;
    hide   : () => JQuery;
    fadeOut: () => JQuery;
  };
}
// ------------------------- 