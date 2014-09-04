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