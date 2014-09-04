angular.module("template/paging/paging.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/paging/paging.html",
    "<div class=\"pagelist\">\n" +
    "\n" +
    "\n" +
    "    <ul class=\"pagination  pull-left \">\n" +
    "        <li class=\"{{webPage.curPage == 1 ? 'disabled' : ''}}\"><a title=\"上一页\" href=\"#\" class=\"{{webPage.curPage == 1 ? 'disabled' : ''}}\" ng-click=\"lastPage();\">&laquo;</a></li>\n" +
    "\n" +
    "        <li  ng-if=\"webPage.curPage > webPage.pageNum\">\n" +
    "            <a title=\"更多页\" href=\"#\" ng-click=\"webPage.lastPage('...');\">...</a>\n" +
    "        </li>\n" +
    "        <li class=\"{{webPage.curPage == page ? 'active' : ''}}\"  ng-repeat=\"page in webPage.pageTotal\">\n" +
    "            <a title=\"{{'第'+page+'页'}}\" href=\"#\" ng-click=\"webPage.clickPage(page);\">{{page}}</a>\n" +
    "        </li>\n" +
    "        <li  ng-if=\"webPage.pageMax < webPage.pageTotalNum\">\n" +
    "            <a title=\"更多页\" href=\"#\" ng-click=\"webPage.nextPage('...');\">...</a>\n" +
    "        </li>\n" +
    "        <li class=\"{{webPage.curPage == webPage.pageTotalNum ? 'disabled' : ''}}\"><a title=\"下一页\" href=\"#\" ng-click=\"webPage.nextPage();\">&raquo;</a></li>\n" +
    "    </ul>\n" +
    "    <div class=\"page_num  pull-left dropdown\">\n" +
    "        每页 <div dir=\"ltr\" class=\"num-info dropdown-toggle\" data-toggle=\"dropdown\">{{webPage.limit}}</div>条； 共  <span>{{webPage.pageTotalNum}}</span>  页 <span>{{webPage.total}}</span> 条记录\n" +
    "        <ul class=\"dropdown-menu num-sel\" role=\"menu\">\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(1);\">1</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(5);\">5</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(10);\">10</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(20);\">20</a></li>\n" +
    "            <li><a href=\"#\" ng-click=\"webPage.changePage(30);\">30</a></li>\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
