var Application = Application || {};
var angular = angular || {};

Application.Controllers
    .controller("PostCtrl",
    function ($scope, postService) {
        "use strict";       
		
		$scope.post = angular.copy(postService.new());



		$scope.$on("HandlePostSaved", function(){
			$scope.reset();
			postService.getPosts();
		});
		
		$scope.$on("HandleGetPosts", function(){
			$scope.posts = postService.result;
		});		
				
		$scope.delete = function(postId) {			
			postService.delete(postId);
		};
		
		$scope.reset = function() {				
			$scope.post = angular.copy(postService.new());
            if($scope.postForm){
                $scope.postForm.$setUntouched();
            }
		};
		
		$scope.edit = function(post) {	
			$scope.post = angular.copy(post);			
			//Angular Material Datepicker doesn't like string dates :(
			$scope.post.publishDate = new Date($scope.post.publishDate);
			$scope.post.expireDate = new Date($scope.post.expireDate);
		};
		
		$scope.copy = function(post) {							
			var postCopy = angular.copy(post).toJSON();
			postCopy._id = null;
			postCopy.title = "Copy of - " + postCopy.title;		
			$scope.post = postCopy;
		};

    });
