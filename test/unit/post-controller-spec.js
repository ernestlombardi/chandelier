"use strict";

describe("Post Component tests", function() {
    var scope, el, postService;

    beforeEach(module("app"));
    beforeEach(module("templates"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            postService = $injector.get("postService");
        });
    });

    beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $controller, $injector, $compile) {
        scope = $rootScope.$new();

        $controller("PostCtrl", {$scope: scope, postService: postService});

        $httpBackend.expectGET("/api/post").respond({});

        spyOn(postService, 'delete');
        spyOn(postService, 'new');
        spyOn(postService, 'getPosts').and.returnValue({0: "post"});

        $templateCache.put("components/post/post-new.html", $templateCache.get("webclient/components/post/post-new.html"));
        el = $compile($templateCache.get("webclient/components/post/post-new.html"))(scope);

        scope.$digest();
    }));

    describe("PostCtrl", function() {
        it("should be defined", function() {
            expect(scope).toBeDefined();
        });

        it("should call postService.delete when delete fires", function() {
            scope.delete(123);
            expect(postService.delete).toHaveBeenCalledWith(123);
        });

        it("should call postService.new when reset fires", function() {
            scope.reset();
            expect(postService.new).toHaveBeenCalled();
        });

        it("should call postService.getUsers when HandlePostSaved is caught", function() {
            scope.$broadcast("HandlePostSaved");
            expect(postService.getPosts).toHaveBeenCalled();
        });

        it("should define posts when HandleGetPosts is caught", function() {
            postService.result = "xyz";
            scope.$broadcast("HandleGetPosts");
            expect(scope.posts).toBeDefined();
        });

        it("should fill in values given a post via edit functionality", function() {
            var date = new Date();
            var post = {
                publishDate: date,
                expirationDate: date
            };
            scope.edit(post);
            expect(scope.post.publishDate).toEqual(post.publishDate);
            expect(scope.post.expirationDate).toEqual(post.expirationDate);
        });

    });
});
