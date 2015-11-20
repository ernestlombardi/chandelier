var Application = Application || {};

Application.Controllers
    .controller("AppCtrl",
    function ($scope, $mdSidenav) {
        "use strict";
        $scope.title = "CHANDELIER";

        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
    });
