angular.module("template/grid/grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid.html",
    "<div class=\"panel panel-default\">\n" +
    "    <!-- header -->\n" +
    "    <grid-header></grid-header>\n" +
    "    <!-- Table -->\n" +
    "    <table ng-class=\"grid.options.class\" grid-column></table>\n" +
    "\n" +
    "    <paging ng-show=\"grid.options.webpage\"></paging>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);
