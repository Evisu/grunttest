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
