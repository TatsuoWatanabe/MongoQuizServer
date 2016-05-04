"use strict";
var Pager = (function () {
    function Pager(results, pageCount, itemCount, paginateOption, paginateDefaults) {
        var _this = this;
        this.results = results;
        this.pageCount = pageCount;
        this.itemCount = itemCount;
        this.paginateOption = paginateOption;
        this.paginateDefaults = paginateDefaults;
        this.items = this.results || [];
        this.currentPage = this.paginateOption.page;
        this.currentLimit = this.paginateOption.limit;
        this.previousPage = (this.currentPage - 1) >= 1 ? (this.currentPage - 1) : 0;
        this.nextPage = (this.currentPage + 1) <= this.pageCount ? (this.currentPage + 1) : 0;
        this.isDefaultPage = function (page) { return page === _this.paginateDefaults.page; };
        this.isDefaultLimit = function (limit) { return limit === _this.paginateDefaults.limit; };
        this.isCurrentPage = function (page) { return page === _this.currentPage; };
        this.pageExists = function (page) { return page <= _this.pageCount; };
        this.indexFrom = ((this.currentPage - 1) * this.currentLimit) + 1;
        this.indexTo = (this.indexFrom - 1) + this.items.length;
        this.resultString = this.items.length ? this.itemCount + ' 件中 ' + this.indexFrom + ' 件目から ' + this.indexTo + ' 件目までを表示' : 'データがありません。';
    }
    Pager.prototype.queryString = function (page) {
        var buf = [];
        if (!this.isDefaultPage(page)) {
            buf.push('page=' + page);
        }
        if (!this.isDefaultLimit(this.currentLimit)) {
            buf.push('limit=' + this.currentLimit);
        }
        if (this.paginateOption.searchWords) {
            buf.push('search_words=' + encodeURIComponent(this.paginateOption.searchWords));
        }
        return '?' + buf.join('&');
    };
    return Pager;
}());
module.exports = Pager;
//# sourceMappingURL=Pager.js.map