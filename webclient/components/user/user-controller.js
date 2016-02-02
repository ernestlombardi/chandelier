var Application = Application || {};
var angular = angular || {};

Application.Controllers
    .controller("UserCtrl",
    function ($scope, userService) {
        "use strict";       

		$scope.users = [];
		$scope.user = angular.copy(userService.new());
		
		$scope.$on("HandleUserSaved", function(){
			$scope.reset();
			userService.getUsers();				
		});
			
		userService.getUsers();
		$scope.$on("HandleGetUsers", function(){
			$scope.users = userService.result;
		});
		
		$scope.update = function () {
			userService.update($scope.user);
		};

		$scope.reset = function() {				
			$scope.user = angular.copy(userService.new());
            if($scope.userForm){
                $scope.userForm.$setUntouched();
            }
		};		
	});
