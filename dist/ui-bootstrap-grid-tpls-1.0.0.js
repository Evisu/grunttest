/*
 * ui-bootstrap
 * https://github.com/hxkinggil/AngularBootStrap

 * Version: 1.0.0 - 2014-09-04
 * License: ISC
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.tpls","ui.bootstrap.paging","ui.bootstrap.grid"]);
angular.module("ui.bootstrap.tpls", ["template/paging/paging.html","template/grid/grid-column.html","template/grid/grid-header.html","template/grid/grid-row.html","template/grid/grid.html"]);
(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.paging' , [] )

        .constant( 'pagingConfig' , {

        } )
        //控制器
        .controller( 'PagingController' , ['$scope', '$element', '$attrs', '$q', '$log', function ( $scope , $elm , $attrs , $q , $log )
        {

            console.log( 'paging controller' );


        }] )
        //指令
        .directive( 'paging' , function ()
        {
            return {
                restrict : 'EA' ,
                controller : 'PagingController' ,
                templateUrl : 'template/paging/paging.html' ,
//            transclude:true,
                replace : true ,
                require : '^?grid' ,
                scope : {
                    pagingOptions : '=pagingOptions'
                } ,
                link : function ( scope , element , attrs , gridCtrl )
                {

                    console.log( 'paging link' );

                    scope.webPage = gridCtrl.grid.options.webpage;

                }
            };
        } );


})();

/**
 * Created by gc on 2014/7/10.
 * 
 * 分页组件
 * 
 * 
 */
function getWebPage(options)
{
	var webPage =
		{
			// 总记录数
			total : 0,
			// 总页数数组
			pageTotal : new Array(),
			// 总页数
			pageTotalNum : 0,
			// 当前页
			curPage : 1,
			// 记录数开始
			start : 0,
			// 每页最大记录数
			limit : (options && options.limit) ? options.limit : 5,
			// 分页码开始
			pageMin : 1,
			// 分页码结束
			pageMax : 10,
			// 分页显示个数
			pageNum : (options && options.pageNum) ? options.pageNum : 10,
			// 分页索引
			pageIndex : 0,
			// 初始化方法
			initWebPage : function( opition )
			{
		
				this.total = opition.total;

                this.query = opition.query;
		
				this.pageTotalNum = 0;
				// 计算总页数
				if ( this.total % this.limit == 0 || this.total < this.limit )
					this.pageTotalNum = parseInt( this.total / this.limit ) < 1 ? 1 : parseInt( this.total / this.limit );
				else
					this.pageTotalNum = parseInt( this.total / this.limit ) + 1;
		
				this.curPage = parseInt( this.start ) / parseInt( this.limit ) + 1;
		
				if ( this.curPage > this.pageMax )
				{
					this.pageIndex++;
				}
		
				if ( this.curPage < this.pageMin )
				{
					this.pageIndex--;
				}
		
				this.pageMin = parseInt( this.pageIndex * this.pageNum ) + 1;
				this.pageMax = parseInt( this.pageIndex * this.pageNum ) + this.pageNum;
		
				if ( this.pageMax > this.pageTotalNum )
					this.pageMax = this.pageTotalNum;
		
				this.pageTotal.length = 0;
				for ( var i = this.pageMin; i <= this.pageMax; i++ )
				{
					this.pageTotal.push( i );
				}
			},
			// 下一页
			nextPage : function( page )
			{
		
				if ( parseInt( this.start ) + parseInt( this.limit ) >= parseInt( this.total ) )
					return false;
				if ( page == '...' )
				{
					this.start = ( this.pageMax ) * parseInt( this.limit );
				} else
				{
					this.start = parseInt( this.start ) + parseInt( this.limit );
				}

                if(this.query){
                    this.query();
                }
		
			},
			// 上一页
			lastPage : function( page )
			{
				if ( parseInt( this.start ) - parseInt( this.limit ) < 0 )
					return false;
				if ( page == '...' )
				{
					this.start = ( this.pageMin - 2 ) * parseInt( this.limit );
				} else
				{
					this.start = parseInt( this.start ) - parseInt( this.limit );
				}
                if(this.query){
                    this.query();
                }
			},
			// 当前页
			clickPage : function( page )
			{
				this.start = ( page - 1 ) * parseInt( this.limit );
                if(this.query){
                    this.query();
                }
			},
			deleteOneRow : function(){
			    //计算出最大页数 取当前页数和最大页数的最小值为新的当前页数
			    var maxNum = Math.round((this.total-1)/this.limit);
			    var currentPage = Math.min(maxNum,this.curPage);
			    if(currentPage==0){
			        currentPage = 1;
			    }
			    webPage.start = (currentPage-1)*this.limit;
			},
            changePage : function(limit)
            {
                this.start = 0;
                this.limit = limit;
                if(this.query){
                    this.query();
                }
            }
		};

		return webPage;

}
 

(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.grid' , ['ngSanitize','ui.bootstrap.tpls','ui.bootstrap.paging'] )

        .constant( 'gridConfig' , {

        } )
        //控制器
        .controller( 'GridController' , ['$scope', '$element', '$attrs', '$q', '$log', 'gridClassFactory','gridConstants', function ( $scope , $elm , $attrs , $q , $log , gridClassFactory ,gridConstants)
        {

            console.log( 'grid controller' );

            var self = this;

            //构造表格对象
            self.grid = gridClassFactory.createGrid( $scope.gridOptions );

            $scope.grid = self.grid;


            //表格选中行
            self.grid.selectedRowEntity = {};

            gridConstants.grid = $scope.grid;


            //监听选中行数据模型
            $scope.$watch('grid.selectedRowEntity',function(){
//                alert('==========watch:grid.selectedRowEntity=======:'+JSON.stringify($scope.grid.selectedRowEntity))

                $scope.gridOptions.selectedRowEntity = $scope.grid.selectedRowEntity;

            })


            //构造列对象
            if ( $attrs.gridColumns )
            {
                $attrs.$observe( 'gridColumns' , function ( value )
                {
                    self.grid.options.columnDefs = value;
                    self.grid.buildColumns()
                        .then( function ()
                        {

                        } );
                } );
            }
            else
            {
                if ( self.grid.options.columnDefs.length > 0 )
                {
                    self.grid.buildColumns();
                }
            }

            var dataWatchCollectionDereg;
            if ( angular.isString( $scope.gridOptions.data ) )
            {
                dataWatchCollectionDereg = $scope.$parent.$watchCollection( $scope.gridOptions.data , dataWatchFunction );
            }
            else
            {
                dataWatchCollectionDereg = $scope.$parent.$watchCollection( function ()
                {
                    return $scope.gridOptions.data;
                } , dataWatchFunction );
            }

            var columnDefWatchCollectionDereg = $scope.$parent.$watchCollection( function ()
            {
                return $scope.gridOptions.columnDefs;
            } , columnDefsWatchFunction );

            function columnDefsWatchFunction( n , o )
            {
                if ( n && n !== o )
                {
                    self.grid.options.columnDefs = n;
                    self.grid.buildColumns()
                        .then( function ()
                        {

                        } );
                }
            }

            function dataWatchFunction( n )
            {
                $log.debug(' --------dataWatch fired--------- ');
                var promises = [];

                if ( n )
                {
                    if ( self.grid.columns.length === 0 )
                    {
                        $log.debug( 'loading cols in dataWatchFunction' );
                        if ( !$attrs.gridColumns && self.grid.options.columnDefs.length === 0 )
                        {
                            self.grid.buildColumnDefsFromData( n );
                        }
                        promises.push( self.grid.buildColumns()
                            .then( function ()
                            {

                            }
                        ) );
                    }
                    $q.all( promises ).then( function ()
                    {
                        self.grid.addRows( n );
                    } );
                }
            }

            $scope.$on( '$destroy' , function ()
            {
                dataWatchCollectionDereg();
                columnDefWatchCollectionDereg();
            } );

        }] )
        //指令
        .directive( 'grid' , function ()
        {
            return {
                restrict : 'EA' ,
                controller : 'GridController' ,
                templateUrl : 'template/grid/grid.html' ,
//            transclude:true,
                replace : true ,
//                scope : {
//                    gridOptions : '=gridOptions'
//                } ,
                scope:false,
                link : function ( scope , element , attrs , GridCtrl )
                {

                    console.log( 'grid link' );

                }
            };
        } );


})();

/**
 * Created by gc on 2014/8/19.
 */
(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.grid' )

        .constant( 'gridColumnConfig' , {

        } )

        .controller( 'GridColumnController' , ['$scope', '$element', '$attrs', '$log', 'gridConstants', function ( $scope , $elm , $attrs , $log , gridConstants )
        {
            console.log( 'column controller' );

            $scope.selectAll = {};

            $scope.selectedRowEntity = new Array();




        }] )

        .directive( 'gridColumn' , function (gridConstants)
        {
            return {
                restrict : 'EA' ,
                controller : 'GridColumnController' ,
                templateUrl : 'template/grid/grid-column.html' ,
                transclude : true ,
                scope : true ,
//                replace:true,
                require : '^?grid' ,
                link : function ( scope , element , attrs , gridCtrl )
                {
                    console.log( 'column link' );

                    scope.columns = gridCtrl.grid.columns;

                    scope.rows = gridCtrl.grid.rows;

                    scope.single = gridCtrl.grid.options.single;

                    //监听全选属性
                    scope.$watch( 'selectAll.checked' , function ()
                    {
                        console.log( '监听全选属性' );

                        gridCtrl.grid.rows.forEach( function ( row , index )
                        {

                            if ( scope.selectAll.checked !== undefined )
                            {

                                row.selected = scope.selectAll.checked;
                                if ( row.selected )
                                {
                                    row.style = {'background-color' : gridConstants.ROW_SELECT_COLOR};
                                    scope.selectedRowEntity.push( row.entity );
                                }
                                else
                                {
                                    row.style = null;
                                    scope.selectedRowEntity.length = 0;
                                }

                            }
                        } )
                    } )


                    scope.$watchCollection( 'selectedRowEntity' , function ()
                    {
                        console.log( '监听全选数据数组' );

                        gridCtrl.grid.selectedRowEntity = scope.selectedRowEntity;

                    } )


                }
            };
        } )


})();
/**
 * Created by gc on 2014/8/19.
 */
(function () {
    'use strict';

    angular.module('ui.bootstrap.grid')

        .constant('gridHeaderConfig', {

        })

        .controller('GridHeaderController',['$scope', '$element', '$attrs', '$log', function ($scope, $elm, $attrs, $log) {
            $scope.title = "111";
        }])

        .directive('gridHeader', function () {
            return {
                restrict:'E',
                controller:'GridHeaderController',
                templateUrl:'template/grid/grid-header.html',
                transclude:true,
                replace:true,
                require: '^?grid',
                scope: {
                },
                link: function (scope, element, attrs,gridCtrl) {
                    scope.title = gridCtrl.grid.options.title;
                    scope.isHeaderShow = gridCtrl.grid.isHeaderShow;
                }
            };
        });



})();
/**
 * Created by gc on 2014/8/19.
 */
(function ()
{
    'use strict';
    angular.module( 'ui.bootstrap.grid' )

        .constant( 'gridRowConfig' , {

        } )

        .controller( 'GridRowController' , ['$scope', '$element', '$attrs', '$log', 'gridConstants', '$compile', function ( $scope , $elm , $attrs , $log , gridConstants , $compile )
        {
            console.log( 'gridRow controller' );

            //选中的数据
            $scope.selectedRows = new Array();
            $scope.selectedRowEntity = new Array();


        }] )

        .directive( 'gridRow' , function ( gridConstants )
        {
            return {
                restrict : 'EA' ,
                controller : 'GridRowController' ,
                templateUrl : 'template/grid/grid-row.html' ,
                transclude : true ,
                replace : true ,
                scope : true ,
                require : '^?grid' ,
                compile : function ( elm , attr )
                {

                    //重新编译模板内容
                    var a =
                        '<tr ng-repeat=" row in rows " ng-click="selectRow(row);" ng-style="row.style">' +
                        '<td ng-if="!single"><input type="checkbox" name="rowCheck" ng-model="row.selected"/></td>' +
                        '<td ng-repeat=" col in columns " ng-show="col.visible" >';

                    var b = '';

                    var c = '</td>' +
                        '</tr>';


                    gridConstants.grid.columns.forEach( function ( col , index )
                    {

                        if ( col.colDef.render )
                        {
                            b += '<div ng-if="$index == ' + index + ' ">' + col.columnRender() + '</div>';
                        }
                        else
                        {
                            if(  col.colDef.filter )
                            {
                                b += '<div ng-if="$index == ' + index + ' " ng-bind="$eval( row.getQualifiedColField( col )+\'|'+col.colDef.filter+'\') "></div>';
                            }else
                            {
                                b += '<div ng-if="$index == ' + index + ' " ng-bind="$eval( row.getQualifiedColField( col )) "></div>';
                            }
                        }


                    } )

                    $( elm ).html( a + b + c );

                    return {
                        post : function ( scope , element , attrs , gridCtrl )
                        {

                            console.log( 'gridRow link' );

                            scope.grid = gridCtrl.grid;

                            scope.columns = gridCtrl.grid.columns;

                            scope.rows = gridCtrl.grid.rows;

                            scope.single = gridCtrl.grid.options.single;

//                            scope.selectAll = gridCtrl.grid.options.selectAll;

                            /**
                             * 选择行
                             * @param selectedRow
                             */
                            scope.selectRow = function ( selectedRow )
                            {


                                console.log( ' grid-row.js : 选择行方法 ' );

                                scope.rows.forEach( function ( row , index )
                                {

                                    //单选
                                    if ( scope.single )
                                    {

                                        if ( selectedRow.uid != row.uid )
                                        {
                                            row.style = {};
                                        }
                                        else
                                        {
                                            //选中后改变行样式,并返回该行数据
                                            row.style = {'background-color' : gridConstants.ROW_SELECT_COLOR};
                                            scope.grid.selectedRowEntity = selectedRow.entity;
//                                            scope.selectedRows.length = 0;
//                                            scope.selectedRows.push( row.entity );
                                        }

                                    }
                                    else
                                    {
                                        //复选
                                        if ( selectedRow.uid != row.uid )
                                        {
                                            if ( row.selected )
                                            {
                                                var flag = true;
                                                for ( var i = 0; i < scope.selectedRows.length; i++ )
                                                {
                                                    if ( row.uid == scope.selectedRows[i].uid )
                                                    {
                                                        flag = false;
                                                    }
                                                }
                                                if ( flag )
                                                {
                                                    scope.selectedRows.push( row );

                                                    scope.sortSelectedRows( scope.selectedRows );
                                                }

                                            }
                                            else
                                            {
                                                for ( var i = 0; i < scope.selectedRows.length; i++ )
                                                {
                                                    if ( row.uid == scope.selectedRows[i].uid )
                                                    {
                                                        scope.selectedRows.splice( i , 1 );
                                                    }
                                                }

                                                scope.sortSelectedRows( scope.selectedRows );

                                            }
                                        }
                                        else
                                        {
                                            row.style = {'background-color' : gridConstants.ROW_SELECT_COLOR};
                                            row.selected = !row.selected;
                                            if ( row.selected )
                                            {
                                                var flag = true;
                                                if( scope.selectedRows.length > 0 )
                                                {
                                                    for ( var i = 0; i < scope.selectedRows.length; i++ )
                                                    {
                                                        if ( row.uid == scope.selectedRows[i].uid )
                                                        {
                                                            flag = false;
                                                        }
                                                    }
                                                }
                                                if ( flag )
                                                {
                                                    scope.selectedRows.push( row );

                                                    scope.sortSelectedRows( scope.selectedRows );
                                                }
                                            }
                                            else
                                            {
                                                for ( var i = 0; i < scope.selectedRows.length; i++ )
                                                {
                                                    if ( row.uid == scope.selectedRows[i].uid )
                                                    {
                                                        scope.selectedRows.splice( i , 1 );
                                                    }
                                                }

                                                scope.sortSelectedRows( scope.selectedRows );
                                            }
                                        }

                                        if ( !row.selected )
                                        {
                                            row.style = {};
                                        }

                                    }

                                } )

                                if ( !scope.single )
                                {
                                    scope.selectedRowEntity.length = 0;
                                    for ( var i = 0; i < scope.selectedRows.length; i++ )
                                    {
                                        scope.selectedRowEntity.push( scope.selectedRows[i].entity );
                                    }
                                    scope.grid.selectedRowEntity = scope.selectedRowEntity;
                                }

//                                alert(JSON.stringify(scope.grid.selectedRowEntity));

                            }

                            //选中数据排序
                            scope.sortSelectedRows = function ( selectedRows )
                            {
                                if ( selectedRows.length > 0 )
                                {
                                    selectedRows.sort( function ( v1 , v2 )
                                    {
                                        if ( v1.index < v2.index )
                                        {
                                            return -1;
                                        }
                                        else if ( v1.index > v2.index )
                                        {
                                            return 1;
                                        }
                                        else
                                        {
                                            return 0;
                                        }

                                    } )
                                }


                            }


                        }
                    };
                }
            };
        } )


})();
(function ()
{

    angular.module( 'ui.bootstrap.grid' )
        .factory( 'Grid' , ['$log', '$q', '$compile', '$parse', 'gridConstants', 'GridOptions', 'GridColumn', 'GridRow', 'gridUtil',
            function ( $log , $q , $compile , $parse , gridConstants , GridOptions , GridColumn , GridRow , gridUtil )
            {

                var Grid = function Grid( options )
                {
                    // Get the id out of the options, then remove it
                    if ( options !== undefined && typeof(options.id) !== 'undefined' && options.id )
                    {
                        if ( !/^[_a-zA-Z0-9-]+$/.test( options.id ) )
                        {
                            throw new Error( "Grid id '" + options.id + '" is invalid. It must follow CSS selector syntax rules.' );
                        }
                    }
                    else
                    {
                        throw new Error( 'No ID provided. An ID must be given when creating a grid.' );
                    }

                    this.id = options.id;
                    delete options.id;

                    // Get default options
                    this.options = new GridOptions();

                    // Extend the default options with what we were passed in
                    angular.extend( this.options , options );

                    this.headerHeight = this.options.headerRowHeight;
                    this.gridHeight = 0;
                    this.gridWidth = 0;
                    this.columnBuilders = [];
                    this.rowBuilders = [];
                    this.rowsProcessors = [];
                    this.columnsProcessors = [];
                    this.styleComputations = [];
                    this.viewportAdjusters = [];

                    //如果有标题就显示表头,没有就不显示
                    this.options.title ? this.isHeaderShow = true : this.isHeaderShow = false;


                    // this.visibleRowCache = [];

                    // Set of 'render' containers for this grid, which can render sets of rows
                    this.renderContainers = {};


                    //representation of the rows on the grid.
                    //these are wrapped references to the actual data rows (options.data)
                    this.rows = [];

                    //represents the columns on the grid
                    this.columns = [];

                    //current rows that are rendered on the DOM
                    this.renderedRows = [];
                    this.renderedColumns = [];

                };

                Grid.prototype.buildColumns = function buildColumns()
                {
                    $log.debug( 'buildColumns' );
                    var self = this;
                    var builderPromises = [];

                    self.options.columnDefs.forEach( function ( colDef , index )
                    {
                        self.preprocessColDef( colDef );
                        var col = self.getColumn( colDef.name );

                        if ( !col )
                        {
                            col = new GridColumn( colDef , index , self );
                            self.columns.splice( index , 0 , col );
                        }
                        else
                        {
                            col.updateColumnDef( colDef , col.index );
                        }

                        self.columnBuilders.forEach( function ( builder )
                        {
                            builderPromises.push( builder.call( self , colDef , col , self.options ) );
                        } );

                    } );

                    return $q.all( builderPromises );
                };

                Grid.prototype.preprocessColDef = function preprocessColDef( colDef )
                {
                    if ( !colDef.field && !colDef.name )
                    {
                        throw new Error( 'colDef.name or colDef.field property is required' );
                    }

                    //maintain backwards compatibility with 2.x
                    //field was required in 2.x.  now name is required
                    if ( colDef.name === undefined && colDef.field !== undefined )
                    {
                        colDef.name = colDef.field;
                    }

                };

                Grid.prototype.getColumn = function getColumn( name )
                {
                    var columns = this.columns.filter( function ( column )
                    {
                        return column.colDef.name === name;
                    } );
                    return columns.length > 0 ? columns[0] : null;
                };

                Grid.prototype.buildColumnDefsFromData = function ( dataRows )
                {
                    this.options.columnDefs = gridUtil.getColumnsFromData( dataRows , this.options.excludeProperties );
                };

                Grid.prototype.addRows = function ( newRawData )
                {
                    var self = this;
                    var existingRowCount = self.rows.length;
                    //添加前清空数据集
                    self.rows.length = 0;
                    for ( var i = 0; i < newRawData.length; i++ )
                    {
//                        var newRow = self.processRowBuilders(new GridRow(newRawData[i], i + existingRowCount, self));
//
//                        if (self.options.enableRowHashing) {
//                            var found = self.rowHashMap.get(newRow.entity);
//                            if (found) {
//                                found.row = newRow;
//                            }
//                        }
                        var a = new GridRow( newRawData[i] , i + existingRowCount , self );
                        self.rows.push( a );
                    }
                };

                Grid.prototype.assignTypes = function ()
                {
                    var self = this;
                    self.options.columnDefs.forEach( function ( colDef , index )
                    {

                        //Assign colDef type if not specified
                        if ( !colDef.type )
                        {
                            var col = new GridColumn( colDef , index , self );
                            var firstRow = self.rows.length > 0 ? self.rows[0] : null;
                            if ( firstRow )
                            {
                                colDef.type = gridUtil.guessType( self.getCellValue( firstRow , col ) );
                            }
                            else
                            {
                                $log.log( 'Unable to assign type from data, so defaulting to string' );
                                colDef.type = 'string';
                            }
                        }
                    } );
                };

                Grid.prototype.columnRender = function (html)
                {
                    return gridUtil.trustAsHtml(html);
                }

                return Grid;

            }] );

})();
(function(){

angular.module('ui.bootstrap.grid')
.factory('GridColumn', ['gridConstants','gridUtil',function(gridConstants,gridUtil) {

  /**
   * @ngdoc function
   * @name ui.grid.class:GridColumn
   * @description Represents the viewModel for each column.  Any state or methods needed for a Grid Column
   * are defined on this prototype
   * @param {ColDef} colDef Column definition.
   * @param {number} index the current position of the column in the array
   * @param {Grid} grid reference to the grid
   <br/>Required properties
   <ul>
   <li>
   name - name of field
   </li>
   </ul>

   <br/>Optional properties
   <ul>
   <li>
   field - angular expression that evaluates against grid.options.data array element.
   <br/>can be complex - employee.address.city
   <br/>Can also be a function - employee.getFullAddress()
   <br/>see angular docs on binding expressions
   </li>
   <li>displayName - column name when displayed on screen.  defaults to name</li>
   <li>sortingAlgorithm - Algorithm to use for sorting this column. Takes 'a' and 'b' parameters like any normal sorting function.</li>
   <li>todo: add other optional fields as implementation matures</li>
   </ul>
   *
   */
  function GridColumn(colDef, index, grid) {
    var self = this;

    self.grid = grid;
    colDef.index = index;

    self.updateColumnDef(colDef);
  }

  GridColumn.prototype.setPropertyOrDefault = function (colDef, propName, defaultValue) {
    var self = this;

    // Use the column definition filter if we were passed it
    if (typeof(colDef[propName]) !== 'undefined' && colDef[propName]) {
      self[propName] = colDef[propName];
    }
    // Otherwise use our own if it's set
    else if (typeof(self[propName]) !== 'undefined') {
      self[propName] = self[propName];
    }
    // Default to empty object for the filter
    else {
      self[propName] = defaultValue ? defaultValue : {};
    }
  };

  GridColumn.prototype.updateColumnDef = function(colDef, index) {
    var self = this;

    self.colDef = colDef;

    //position of column
    self.index = (typeof(index) === 'undefined') ? colDef.index : index;

    if (colDef.name === undefined) {
      throw new Error('colDef.name is required for column at index ' + self.index);
    }

    var parseErrorMsg = "Cannot parse column width '" + colDef.width + "' for column named '" + colDef.name + "'";

    // If width is not defined, set it to a single star
    if (gridUtil.isNullOrUndefined(colDef.width)) {
      self.width = '*';
    }
    else {
      // If the width is not a number
      if (!angular.isNumber(colDef.width)) {
        // See if it ends with a percent
        if (gridUtil.endsWith(colDef.width, '%')) {
          // If so we should be able to parse the non-percent-sign part to a number
          var percentStr = colDef.width.replace(/%/g, '');
          var percent = parseInt(percentStr, 10);
          if (isNaN(percent)) {
            throw new Error(parseErrorMsg);
          }
          self.width = colDef.width;
        }
        // And see if it's a number string
        else if (colDef.width.match(/^(\d+)$/)) {
          self.width = parseInt(colDef.width.match(/^(\d+)$/)[1], 10);
        }
        // Otherwise it should be a string of asterisks
        else if (!colDef.width.match(/^\*+$/)) {
          throw new Error(parseErrorMsg);
        }
      }
      // Is a number, use it as the width
      else {
        self.width = colDef.width;
      }
    }

    // Remove this column from the grid sorting
    GridColumn.prototype.unsort = function () {
      this.sort = {};
    };

    self.minWidth = !colDef.minWidth ? 50 : colDef.minWidth;
    self.maxWidth = !colDef.maxWidth ? 9000 : colDef.maxWidth;

    //use field if it is defined; name if it is not
    self.field = (colDef.field === undefined) ? colDef.name : colDef.field;

    // Use colDef.displayName as long as it's not undefined, otherwise default to the field name
    self.displayName = (colDef.displayName === undefined) ? gridUtil.readableColumnName(colDef.name) : colDef.displayName;

    //self.originalIndex = index;

    self.cellClass = colDef.cellClass;
    self.cellFilter = colDef.cellFilter ? colDef.cellFilter : "";

    //是否显示列
    self.visible = gridUtil.isNullOrUndefined(colDef.visible) || colDef.visible;

    self.renderClick = colDef.renderClick;

    self.headerClass = colDef.headerClass;
    //self.cursor = self.sortable ? 'pointer' : 'default';

    // Turn on sorting by default
    self.enableSorting = typeof(colDef.enableSorting) !== 'undefined' ? colDef.enableSorting : true;
    self.sortingAlgorithm = colDef.sortingAlgorithm;

    // Turn on filtering by default (it's disabled by default at the Grid level)
    self.enableFiltering = typeof(colDef.enableFiltering) !== 'undefined' ? colDef.enableFiltering : true;

    // self.menuItems = colDef.menuItems;
    self.setPropertyOrDefault(colDef, 'menuItems', []);

    // Use the column definition sort if we were passed it
    self.setPropertyOrDefault(colDef, 'sort');

    /*

      self.filters = [
        {
          term: 'search term'
          condition: uiGridContants.filter.CONTAINS
        }
      ]

    */

    self.setPropertyOrDefault(colDef, 'filter');
    self.setPropertyOrDefault(colDef, 'filters', []);
  };


    /**
     * @ngdoc function
     * @name getColClass
     * @methodOf ui.grid.class:GridColumn
     * @description Returns the class name for the column
     * @param {bool} prefixDot  if true, will return .className instead of className
     */
    GridColumn.prototype.getColClass = function (prefixDot) {
      var cls = gridConstants.COL_CLASS_PREFIX + this.index;

      return prefixDot ? '.' + cls : cls;
    };

    /**
     * @ngdoc function
     * @name getColClassDefinition
     * @methodOf ui.grid.class:GridColumn
     * @description Returns the class definition for th column
     */
    GridColumn.prototype.getColClassDefinition = function () {
      return ' .grid' + this.grid.id + ' ' + this.getColClass(true) + ' { width: ' + this.drawnWidth + 'px; }';
    };

    /**
     * @ngdoc function
     * @name getRenderContainer
     * @methodOf ui.grid.class:GridColumn
     * @description Returns the render container object that this column belongs to.
     *
     * Columns will be default be in the `body` render container if they aren't allocated to one specifically.
     */
    GridColumn.prototype.getRenderContainer = function getRenderContainer() {
      var self = this;

      var containerId = self.renderContainer;

      if (containerId === null || containerId === '' || containerId === undefined) {
        containerId = 'body';
      }

      return self.grid.renderContainers[containerId];
    };

    /**
     * @ngdoc function
     * @name showColumn
     * @methodOf ui.grid.class:GridColumn
     * @description Makes the column visible by setting colDef.visible = true
     */
    GridColumn.prototype.showColumn = function() {
        this.colDef.visible = true;
    };

    /**
     * @ngdoc function
     * @name hideColumn
     * @methodOf ui.grid.class:GridColumn
     * @description Hides the column by setting colDef.visible = false
     */
    GridColumn.prototype.hideColumn = function() {
        this.colDef.visible = false;
    };
    /**
     * 列render
     *
     * @returns {*}
     */
    GridColumn.prototype.columnRender = function ()
    {
        return gridUtil.trustAsHtml(this.colDef.render);
    }

    return GridColumn;
}]);

})();
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
(function(){

angular.module('ui.bootstrap.grid')
.factory('GridRow', ['gridUtil',function(gridUtil) {

   /**
   * @ngdoc function
   * @name ui.grid.class:GridRow
   * @description GridRow is the viewModel for one logical row on the grid.  A grid Row is not necessarily a one-to-one
   * relation to gridOptions.data.
   * @param {object} entity the array item from GridOptions.data
   * @param {number} index the current position of the row in the array
   * @param {Grid} reference to the parent grid
   */
   var GridRow = function GridRow(entity, index, grid) {

     /**
      *  @ngdoc object
      *  @name grid
      *  @propertyOf  ui.grid.class:GridRow
      *  @description A reference back to the grid
      */
     this.grid = grid;

     /**
      *  @ngdoc object
      *  @name entity
      *  @propertyOf  ui.grid.class:GridRow
      *  @description A reference to an item in gridOptions.data[]
      */
    this.entity = entity;

     /**
      *  @ngdoc object
      *  @name index
      *  @propertyOf  ui.grid.class:GridRow
      *  @description the index of the GridRow. It should always be unique and immutable
      */
    this.index = index;


     /**
      *  @ngdoc object
      *  @name uid
      *  @propertyOf  ui.grid.class:GridRow
      *  @description  UniqueId of row
      */
     this.uid = gridUtil.nextUid();

     /**
      *  @ngdoc object
      *  @name visible
      *  @propertyOf  ui.grid.class:GridRow
      *  @description If true, the row will be rendered
      */
    // Default to true
    this.visible = true;

    //是否选中,默认是false
    this.selected = false;
  }

  /**
   * @ngdoc function
   * @name getQualifiedColField
   * @methodOf ui.grid.class:GridRow
   * @description returns the qualified field name as it exists on scope
   * ie: row.entity.fieldA
   * @param {GridCol} col column instance
   * @returns {string} resulting name that can be evaluated on scope
   */
  GridRow.prototype.getQualifiedColField = function(col) {
    return 'row.entity.' + col.field;
  };

    /**
     * @ngdoc function
     * @name getEntityQualifiedColField
     * @methodOf ui.grid.class:GridRow
     * @description returns the qualified field name minus the row path
     * ie: entity.fieldA
     * @param {GridCol} col column instance
     * @returns {string} resulting name that can be evaluated against a row
     */
  GridRow.prototype.getEntityQualifiedColField = function(col) {
    return 'entity.' + col.field;
  };

  return GridRow;
}]);

})();
(function () {
  'use strict';
  angular.module('ui.bootstrap.grid').constant('gridConstants', {
    CUSTOM_FILTERS: /CUSTOM_FILTERS/g,
    COL_FIELD: /COL_FIELD/g,
    DISPLAY_CELL_TEMPLATE: /DISPLAY_CELL_TEMPLATE/g,
    TEMPLATE_REGEXP: /<.+>/,
    COL_CLASS_PREFIX: 'ui-grid-col',
    events: {
      GRID_SCROLL: 'uiGridScroll',
      GRID_SCROLLING: 'uiGridScrolling',
      COLUMN_MENU_SHOWN: 'uiGridColMenuShown',
      ITEM_DRAGGING: 'uiGridItemDragStart' // For any item being dragged
    },
    // copied from http://www.lsauer.com/2011/08/javascript-keymap-keycodes-in-json.html
    keymap: {
      TAB: 9,
      STRG: 17,
      CTRL: 17,
      CTRLRIGHT: 18,
      CTRLR: 18,
      SHIFT: 16,
      RETURN: 13,
      ENTER: 13,
      BACKSPACE: 8,
      BCKSP: 8,
      ALT: 18,
      ALTR: 17,
      ALTRIGHT: 17,
      SPACE: 32,
      WIN: 91,
      MAC: 91,
      FN: null,
      UP: 38,
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39,
      ESC: 27,
      DEL: 46,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123
    },
    ASC: 'asc',
    DESC: 'desc',
    filter: {
      STARTS_WITH: 2,
      ENDS_WITH: 4,
      EXACT: 8,
      CONTAINS: 16,
      GREATER_THAN: 32,
      GREATER_THAN_OR_EQUAL: 64,
      LESS_THAN: 128,
      LESS_THAN_OR_EQUAL: 256,
      NOT_EQUAL: 512
    },

    // TODO(c0bra): Create full list of these somehow. NOTE: do any allow a space before or after them?
    CURRENCY_SYMBOLS: ['ƒ', '$', '£', '$', '¤', '¥', '៛', '₩', '₱', '฿', '₫'],

    //表格选中行颜色
//    ROW_SELECT_COLOR : '#f5f5f5',
    ROW_SELECT_COLOR : '#DFE8F6',
    ROW_SELECT_COLOR_INFO : '#DFE8F6'

  });

})();
(function ()
{
    'use strict';

    angular.module( 'ui.bootstrap.grid' ).service( 'gridClassFactory' , ['$q', '$compile', '$templateCache', 'gridConstants', '$log', 'Grid', 'GridColumn', 'GridRow',
        function ( $q , $compile , $templateCache , gridConstants , $log , Grid , GridColumn , GridRow )
        {
            console.log( 'gridClassFactory service' );

            var service = {

                newId : function ()
                {
                    var seedId = new Date().getTime();
                    return seedId += 1;
                } ,

                createGrid : function ( options )
                {
                    options = (typeof(options) !== 'undefined') ? options : {};
                    options.id = options.id === undefined || options.id === null ? this.newId() : options.id;
                    var grid = new Grid( options );


                    return grid;
                }

            };

            //class definitions (moved to separate factories)

            return service;
        }] );

})();
(function ()
{
    var uid = ['0', '0', '0'];
    var uidPrefix = 'uiGrid-';

    angular.module( 'ui.bootstrap.grid' ).service( 'gridUtil' , ['$log', '$window', '$document', '$http', '$templateCache', '$timeout', '$injector', '$q', '$sce', function ( $log , $window , $document , $http , $templateCache , $timeout , $injector , $q , $sce )
    {
        console.log( 'gridUtil service' );

        var s = {

            getColumnsFromData : function ( data , excludeProperties )
            {
                var columnDefs = [];

                if ( !data || typeof(data[0]) === 'undefined' || data[0] === undefined )
                {
                    return [];
                }
                if ( angular.isUndefined( excludeProperties ) )
                {
                    excludeProperties = [];
                }

                var item = data[0];

                angular.forEach( item , function ( prop , propName )
                {
                    if ( excludeProperties.indexOf( propName ) === -1 )
                    {
                        columnDefs.push( {
                            name : propName
                        } );
                    }
                } );

                return columnDefs;
            } ,
            newId : (function ()
            {
                var seedId = new Date().getTime();
                return function ()
                {
                    return seedId += 1;
                };
            })() ,
            isNullOrUndefined : function ( obj )
            {
                if ( obj === undefined || obj === null )
                {
                    return true;
                }
                return false;
            } ,
            readableColumnName : function ( columnName )
            {
                // Convert underscores to spaces
                if ( typeof(columnName) === 'undefined' || columnName === undefined || columnName === null )
                {
                    return columnName;
                }

                if ( typeof(columnName) !== 'string' )
                {
                    columnName = String( columnName );
                }

                return columnName.replace( /_+/g , ' ' )
                    // Replace a completely all-capsed word with a first-letter-capitalized version
                    .replace( /^[A-Z]+$/ , function ( match )
                    {
                        return angular.lowercase( angular.uppercase( match.charAt( 0 ) ) + match.slice( 1 ) );
                    } )
                    // Capitalize the first letter of words
                    .replace( /(\w+)/g , function ( match )
                    {
                        return angular.uppercase( match.charAt( 0 ) ) + match.slice( 1 );
                    } )
                    // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
                    // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
                    // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
                    .replace( /(\w+?(?=[A-Z]))/g , '$1 ' );
            } ,
            guessType : function ( item )
            {
                var itemType = typeof(item);

                // Check for numbers and booleans
                switch ( itemType )
                {
                    case "number":
                    case "boolean":
                    case "string":
                        return itemType;
                    default:
                        if ( angular.isDate( item ) )
                        {
                            return "date";
                        }
                        return "object";
                }
            } ,
            nextUid : function nextUid()
            {
                var index = uid.length;
                var digit;

                while ( index )
                {
                    index--;
                    digit = uid[index].charCodeAt( 0 );
                    if ( digit === 57 /*'9'*/ )
                    {
                        uid[index] = 'A';
                        return uid.join( '' );
                    }
                    if ( digit === 90  /*'Z'*/ )
                    {
                        uid[index] = '0';
                    }
                    else
                    {
                        uid[index] = String.fromCharCode( digit + 1 );
                        return uid.join( '' );
                    }
                }
                uid.unshift( '0' );

                return uidPrefix + uid.join( '' );
            } ,
            /**
             * 转义html
             * @param html
             * @returns {*}
             */
            trustAsHtml:function trustAsHtml(html)
            {
                return $sce.trustAsHtml(html);
            }

    }


    return s;
}
] );




})
();
angular.module("template/paging/paging.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/paging/paging.html",
    "<div class=\"pagelist\">\n" +
    "\n" +
    "\n" +
    "    <ul class=\"pagination  pull-left \">\n" +
    "        <li class=\"{{webPage.curPage == 1 ? 'disabled' : ''}}\"><a title=\"上一页\" href=\"#\" class=\"{{webPage.curPage == 1 ? 'disabled' : ''}}\" ng-click=\"lastPage();\">&laquo;</a></li>\n" +
    "\n" +
    "        <li  ng-if=\"webPage.curPage > webPage.pageNum\">\n" +
    "            <a title=\"更多页\" href=\"#\" ng-click=\"webPage.lastPage('...');\">...</a>\n" +
    "        </li>\n" +
    "        <li class=\"{{webPage.curPage == page ? 'active' : ''}}\"  ng-repeat=\"page in webPage.pageTotal\">\n" +
    "            <a title=\"{{'第'+page+'页'}}\" href=\"#\" ng-click=\"webPage.clickPage(page);\">{{page}}</a>\n" +
    "        </li>\n" +
    "        <li  ng-if=\"webPage.pageMax < webPage.pageTotalNum\">\n" +
    "            <a title=\"更多页\" href=\"#\" ng-click=\"webPage.nextPage('...');\">...</a>\n" +
    "        </li>\n" +
    "        <li class=\"{{webPage.curPage == webPage.pageTotalNum ? 'disabled' : ''}}\"><a title=\"下一页\" href=\"#\" ng-click=\"webPage.nextPage();\">&raquo;</a></li>\n" +
    "    </ul>\n" +
    "    <div class=\"page_num  pull-left dropdown\">\n" +
    "        每页 <div dir=\"ltr\" class=\"num-info dropdown-toggle\" data-toggle=\"dropdown\">{{webPage.limit}}</div>条； 共  <span>{{webPage.pageTotalNum}}</span>  页 <span>{{webPage.total}}</span> 条记录\n" +
    "        <ul class=\"dropdown-menu num-sel\" role=\"menu\">\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(1);\">1</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(5);\">5</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(10);\">10</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(20);\">20</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(30);\">30</a></li>\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/grid/grid-column.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid-column.html",
    "<table>\n" +
    "<thead>\n" +
    "<!--<tr class=\"sequence\" style=\"background-color: #f5f5f5\">-->\n" +
    "<tr class=\"sequence\">\n" +
    "    <th ng-if=\"!single\">\n" +
    "        <input title=\"全选\" type=\"checkbox\" name=\"rowCheckAll\" ng-model=\"selectAll.checked\"/>\n" +
    "    </th>\n" +
    "    <th ng-repeat=\"col in columns\" ng-if=\"col.visible\" ng-class=\"col.colDef.class\">\n" +
    "        {{col.displayName}}\n" +
    "    </th>\n" +
    "</tr>\n" +
    "</thead>\n" +
    "    <div grid-row></div>\n" +
    "</table>");
}]);

angular.module("template/grid/grid-header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid-header.html",
    "<div class=\"panel-heading\" align=\"center\" ng-show=\"isHeaderShow\"><h4>{{title}}</h4></div>\n" +
    "");
}]);

angular.module("template/grid/grid-row.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid-row.html",
    "<tbody>\n" +
    "<tr ng-repeat=\" row in rows \" ng-click=\"selectRow(row)\"  ng-style=\"row.style\">\n" +
    "    <td ng-repeat=\" col in columns \" ng-show=\"col.visible\">\n" +
    "        <div ng-show=\"col.colDef.render\"  ng-bind-html=\"col.columnRender()\" ng-click=\"col.colDef.renderClick(row.entity)\"></div>\n" +
    "        <div ng-show=\"!col.colDef.render\"  ng-bind=\"$eval( row.getQualifiedColField( col ))\"></div>\n" +
    "    </td>\n" +
    "</tr>\n" +
    "</tbody>");
}]);

angular.module("template/grid/grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid.html",
    "<div class=\"panel panel-default\">\n" +
    "    <!-- header -->\n" +
    "    <grid-header></grid-header>\n" +
    "    <!-- Table -->\n" +
    "    <table ng-class=\"grid.options.class\" grid-column></table>\n" +
    "\n" +
    "    <paging ng-show=\"grid.options.webpage\"></paging>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);
