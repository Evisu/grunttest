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
