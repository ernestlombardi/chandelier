var Application = Application || {};
var angular = angular || {};

Application.Services = angular.module("app.services", []);
Application.Controllers = angular.module("app.controllers", []);
Application.Directives = angular.module("app.directives", []);
Application.Constants = angular.module("app.constants", []);

var app = angular.module("app",
    ["ngRoute",
    "ngResource",
    "ngAnimate",
    "ngAria",
    "ngMaterial",        
    "app.controllers",
    "app.services",
    "app.directives",
    "app.constants"]);

app.config([
    "$routeProvider",
	"$mdThemingProvider",
    function ($routeProvider, $mdThemingProvider) {
        "use strict";
        $routeProvider
			.when("/post", {
                templateUrl: "components/post/posts.html",
                controller: "PostCtrl",
                resolve: "PostCtrl".resolve
            })
			.when("/access/:id", {
                templateUrl: "components/access/access.html",
                controller: "AccessCtrl",
                resolve: "AccessCtrl".resolve
            })		
			.when("/admin", {
                templateUrl: "components/user/user.html",
                controller: "UserCtrl",
                resolve: "UserCtrl".resolve
            })				
            .otherwise({
                redirectTo: "/post"
            });
			

		$mdThemingProvider.theme("default")
			.primaryPalette("grey", {
			  "default": "900", // by default use shade 400 from the pink palette for primary intentions
			  "hue-1": "100", // use shade 100 for the <code>md-hue-1</code> class
			  "hue-2": "600", // use shade 600 for the <code>md-hue-2</code> class
			  "hue-3": "A100" // use shade A100 for the <code>md-hue-3</code> class
			})
			.accentPalette("blue-grey");
    }]);

app.run(["$rootScope",
    function ($rootScope) {
        "use strict";
        $rootScope.title = "Chandelier";
        $rootScope.brand = "Quicksilver Workshop";
        $rootScope.copyrightYear = new Date().getFullYear();

        //Push route change event to google analytics
        /*
        $rootScope.$on("$routeChangeSuccess", function(event) {
            $window.ga("set", "page", $location.path());
            $window.ga("send", "pageview");
        });
        */
    }]);
