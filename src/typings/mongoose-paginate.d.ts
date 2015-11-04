declare module "mongoose" {
  
  interface Model<T extends Document> {
    
     /**
      * MySchema.paginate(query, options, callback)
      * 
      * Arguments
      * 
      * query - An object for the Mongoose query.
      * options - An object with options for the Mongoose query, such as sorting and population
      *   page - Default: 1
      *   limit - Default: 10
      *   columns - Default: null
      *   sortBy - Default: null
      *   populate - Default: null
      * callback(err, results, pageCount, itemCount) - A callback which is called once pagination results are retrieved, or when an error has occurred.
      */
      paginate(query: Object, options: PaginateOption, callback: (err: any, results: any, pageCount: number, itemCount: number) => void): void
  }

  export interface PaginateOption {
    page?        : number;
    limit?       : number;
    searchWords? : string;
    columns?     : Object;
    sortBy?      : Object;
    populate?    : Object;
  }

}
