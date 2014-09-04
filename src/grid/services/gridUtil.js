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