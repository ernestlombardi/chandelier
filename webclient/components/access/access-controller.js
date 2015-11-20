var Application = Application || {};

Application.Controllers
    .controller("AccessCtrl",
    function ($scope, $routeParams, accessService, postService) {
        "use strict";       
		
		$scope.id = $routeParams.id;			
		
		accessService.getPosts($scope.id);	
		$scope.$on("HandleGetChannels", function(){
			$scope.read = accessService.result[0].read;
			$scope.channels = accessService.result[0].channels;	
			postService.getPostsByChannels($scope.id, $scope.channels);
		});
		
		$scope.$on("HandleGetPosts", function(){			
			$scope.posts = postService.result;
		});	
		
		$scope.$on("HandlePostSaved", function(){			
			accessService.getPosts($scope.id);
		});	
		
		$scope.readPost = function (postId) {
			accessService.readPost($scope.id, postId);
		};
		
		$scope.unreadPost = function (postId) {
			accessService.unreadPost($scope.id, postId);
		};
		
		$scope.isExpired = function(post) {
			if(!post.expireDate){return false;}
			return (new Date(post.expireDate).getTime() <= new Date().getTime());
		};
		
		$scope.isPublished = function(post) {
			if(!post.publishDate){return false;}
			return (new Date(post.publishDate).getTime() <= new Date().getTime());
		};
    });
