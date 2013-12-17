angular.module('templates.app', ['accounting/account-list.tpl.html', 'accounting/transfer-form.tpl.html', 'accounting/transfer-list.tpl.html', 'header.tpl.html']);

angular.module("accounting/account-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/account-list.tpl.html",
    "Account LIst\n" +
    "");
}]);

angular.module("accounting/transfer-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/transfer-form.tpl.html",
    "Transfer form\n" +
    "");
}]);

angular.module("accounting/transfer-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/transfer-list.tpl.html",
    "Transfer list\n" +
    "");
}]);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\" ng-controller=\"HeaderCtrl\">\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"navbar-header\">\n" +
    "    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-8\">\n" +
    "      <span class=\"sr-only\">Toggle navigation</span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "    </button>\n" +
    "    <a class=\"navbar-brand\" href=\"/\">HoPan</a>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "  <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-8\">\n" +
    "    <ul ng-if='userAuth.currentUser' class=\"nav navbar-nav\">\n" +
    "      <li><a href=\"/accounting\">Accounting</a></li>\n" +
    "      <li><a href=\"#\">Link</a></li>\n" +
    "    </ul>\n" +
    "    <ul class=\"nav navbar-nav navbar-right\">\n" +
    "      <li ng-if='!userAuth.currentUser'><a href=\"/auth/google\" onClick=\"window.open('/auth/google','new','width=800,height=600,scrollbars=no,menubar=no,status=no,toolbar=no')\">Login</a></li>\n" +
    "      <li ng-if='userAuth.currentUser'><a href='/' ng-bind=\"userAuth.currentUser.displayName\"></a></li>\n" +
    "      <li ng-if='userAuth.currentUser'><button class=\"btn btn-default navbar-btn\" ng-click=\"userAuth.logout()\" >Logout</button></li>\n" +
    "    </ul>\n" +
    "  </div><!-- /.navbar-collapse -->\n" +
    "</div>\n" +
    "</nav>\n" +
    "");
}]);
