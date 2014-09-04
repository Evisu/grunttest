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