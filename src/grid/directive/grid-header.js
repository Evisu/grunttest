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