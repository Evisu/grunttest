  (function(){

angular.module('ui.bootstrap.grid')
.factory('GridOptions', [function() {

  /**
   * @ngdoc function
   * @name ui.grid.class:GridOptions
   * @description Default GridOptions class.  GridOptions are defined by the application developer and overlaid
   * over this object.
   *
   * @example To provide default options for all of the grids within your application, use an angular
   * decorator to modify the GridOptions factory.
   * <pre>app.config(function($provide){
   *    $provide.decorator('GridOptions',function($delegate){
   *      return function(){
   *        var defaultOptions = new $delegate();
   *        defaultOptions.excludeProperties = ['id' ,'$$hashKey'];
   *        return defaultOptions;
   *      };
   *    })
   *  })</pre>
   */
  function GridOptions() {

    this.onRegisterApi = angular.noop();

    /**
     * @ngdoc object
     * @name data
     * @propertyOf  ui.grid.class:GridOptions
     * @description Array of data to be rendered to grid.  Array can contain complex objects
     */
    this.data = [];

    /**
     * @ngdoc object
     * @name columnDefs
     * @propertyOf  ui.grid.class:GridOptions
     * @description (optional) Array of columnDef objects.  Only required property is name.
     * _field property can be used in place of name for backwards compatibilty with 2.x_
     *  @example

     var columnDefs = [{name:'field1'}, {name:'field2'}];

     */
    this.columnDefs = [];

    this.excludeProperties = ['$$hashKey'];

    this.headerRowHeight = 30;

    // Sorting on by default
    this.enableSorting = true;

    // Filtering off by default
    this.enableFiltering = false;

    this.selectedRowEntity = {};

    //默认是单选
    this.single = true;

  }

  return GridOptions;

}]);

})();