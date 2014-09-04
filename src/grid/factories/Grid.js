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