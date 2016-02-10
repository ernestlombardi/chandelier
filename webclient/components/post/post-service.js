var Application = Application || {};

Application.Services.service("postService",
    function postServiceFactory($rootScope, $http, $resource) {
        "use strict";

        var postService = {};		
		
		postService.update = function (post) {				
			var updatePost = $resource("/api/post/new-post", {}, {"post": {method: "POST", request: post, isArray: true}});
			if(post._id){
				updatePost = $resource("/api/post/edit-post", {}, {"post": {method: "POST", request: post, isArray: true}});
			}
			postService.result = updatePost.post(post);
			postService.result.$promise.then(function () {
				$rootScope.$broadcast("HandlePostSaved");
			});			
            return postService.result.$promise;
        };

		postService.delete = function (postId) {
			var deletePost = $resource("/api/post/:id/delete", {id: "@id"}, {"delete": {method: "DELETE", isArray: true}});
			postService.result = deletePost.delete({id: postId});
			postService.result.$promise.then(function () {
				postService.getPosts();
			});			
            return postService.result.$promise;
        };
		
		postService.new = function () {
			return  {
					"author" : "ADMIN",
					"createDate" : new Date(),
					"publishDate" : null,
					"expireDate" : null,
					"title" : "",
					"body" : "",
					"channels" : ["all"],
					"sticky" : false
				};
        };
		
		postService.getPosts = function (maxShow) {
			var getPosts = $resource("/api/post", {maxShow: "@maxShow"}, {"get": {method: "GET", request: maxShow, isArray: true}});
			postService.result = getPosts.get({maxShow: maxShow});
			postService.result.$promise.then(function () {
				$rootScope.$broadcast("HandleGetPosts");
			});			
			return postService.result.$promise;
		};
		
		postService.getPostsByChannels = function (id, channels) {		
			var getPosts = $resource("/api/post/:id", {id: id, channels: "@channels"}, {"get": {method: "GET", request: channels, isArray: true}});
			postService.result = getPosts.get({channels: channels});
			postService.result.$promise.then(function () {
				$rootScope.$broadcast("HandleGetPosts");
			});			
			return postService.result.$promise;
		};		
		
        return postService;
    });