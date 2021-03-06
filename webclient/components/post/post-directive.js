var Application = Application || {};
var angular = angular || {};

Application.Directives
	.directive("post", function ( postService ) {
        "use strict";
        return {
            restrict: "E",
            templateUrl: "components/post/post.html",
			scope: {
				post: "="
			}
        };
    })
    .directive("newpost", function ( postService ) {
        "use strict";
        return {
            restrict: "E",
            resolve: "AppCtrl",
			controller: "PostCtrl",
            templateUrl: "components/post/post-new.html",
			scope: {
				post: "="
			},
            link: function ($scope) {
                postService.getPosts();
            }
        };
    });