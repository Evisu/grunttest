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
