import mongoose = require('mongoose');

class Pager {

  constructor(
    private results        : Object[]               ,
    public pageCount       : number                 ,
    public itemCount       : number                 ,
    public paginateOption  : mongoose.PaginateOption,
    public paginateDefaults: { page: number; limit: number; }) {
  }

  public items       : Object[] = this.results || [];
  public currentPage : number   = this.paginateOption.page;
  public currentLimit: number   = this.paginateOption.limit;
  public previousPage: number   = (this.currentPage - 1) >= 1              ? (this.currentPage - 1) : 0;
  public nextPage    : number   = (this.currentPage + 1) <= this.pageCount ? (this.currentPage + 1) : 0;
  public isDefaultPage  = (page: number)  => page  === this.paginateDefaults.page;
  public isDefaultLimit = (limit: number) => limit === this.paginateDefaults.limit;
  public isCurrentPage  = (page: number)  => page  === this.currentPage;
  public pageExists     = (page: number)  => page  <=  this.pageCount;
  public indexFrom      = ((this.currentPage - 1) * this.currentLimit) + 1;
  public indexTo        = (this.indexFrom - 1) + this.items.length;
  public resultString   = this.items.length ? this.itemCount + ' 件中 ' + this.indexFrom + ' 件目から ' + this.indexTo + ' 件目までを表示' : 'データがありません。';
  
  public queryString(page: number) {
    var buf = [];
    if (!this.isDefaultPage(page))               { buf.push('page=' + page); }
    if (!this.isDefaultLimit(this.currentLimit)) { buf.push('limit=' + this.currentLimit); }

    return '?' + buf.join('&');
  }
  
}

export = Pager;