var Application = Application || {};

Application.Services.service("accessService",
    function accessServiceFactory($rootScope, $http, $resource) {
        "use strict";

        var accessService = {};		
		
		accessService.readPost = function (id, postId) {	
			var updatePost = $resource("/api/user/:id/read-post", {id: id}, {"post": {method: "POST", request: postId, isArray: true}});
			accessService.result = updatePost.post({postId: postId});
			accessService.result.$promise.then(function () {
				$rootScope.$broadcast("HandlePostSaved");
			});			
            return accessService.result.$promise;
        };
		
		accessService.unreadPost = function (id, postId) {	
			var updatePost = $resource("/api/user/:id/unread-post", {id: id}, {"post": {method: "POST", request: postId, isArray: true}});
			accessService.result = updatePost.post({postId: postId});
			accessService.result.$promise.then(function () {
				$rootScope.$broadcast("HandlePostSaved");
			});			
            return accessService.result.$promise;
        };		
		
		accessService.getPosts = function (id) {
			var getPosts = $resource("/api/user/:id", {id: id}, {"get": {method: "GET", isArray: true}});
			accessService.result = getPosts.get();
			accessService.result.$promise.then(function () {
				$rootScope.$broadcast("HandleGetChannels");
			});			
			return accessService.result.$promise;
		};
		
        return accessService;
    });