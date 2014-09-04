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
