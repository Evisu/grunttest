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