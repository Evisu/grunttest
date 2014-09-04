angular.module("template/grid/grid-header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/grid/grid-header.html",
    "<div class=\"panel-heading\" align=\"center\" ng-show=\"isHeaderShow\"><h4>{{title}}</h4></div>\n" +
    "");
}]);
