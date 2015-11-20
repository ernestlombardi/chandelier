var Application = Application || {};

Application.Services.service("userService",
    function userServiceFactory($rootScope, $http, $resource) {
        "use strict";

        var userService = {};		
		
		userService.new = function () {
			return  {
				"name": "",
				"channels" : ["all"],
				"read" : []
			};
        };		
		
		userService.getUsers = function () {
			var getUsers = $resource("/api/users", {}, {"get": {method: "GET", isArray: true}});
			userService.result = getUsers.get();
			userService.result.$promise.then(function () {
				$rootScope.$broadcast("HandleGetUsers");
			});			
			return userService.result.$promise;
		};
		
		userService.update = function (user) {				
			var updateUser = $resource("/api/new-user", {}, {"post": {method: "POST", request: user, isArray: true}});
			if(user._id){
				updateUser = $resource("/api/edit-user", {}, {"post": {method: "POST", request: user, isArray: true}});
			}
			userService.result = updateUser.post(user);
			userService.result.$promise.then(function () {
				$rootScope.$broadcast("HandleUserSaved");
			});			
            return userService.result.$promise;
        };		
		
        return userService;
    });
	