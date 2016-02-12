"use strict";

describe("Post Component tests", function() {
    var scope, postService, form, httpBackend;

    var date = new Date();
    var testPost = {
        publishDate: date,
        expirationDate: date
    };

    beforeEach(module("app"));
    beforeEach(module("templates"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            postService = $injector.get("postService");
        });
    });

    beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $controller, $injector, $compile) {
        scope = $rootScope.$new();

        httpBackend = $httpBackend;

        $controller("PostCtrl", {$scope: scope, postService: postService});

        spyOn(postService, 'new');
        spyOn(postService, 'update');
        spyOn(postService, 'delete');
        spyOn(postService, 'getPosts').and.returnValue(testPost);
        spyOn(postService, 'getPostsByChannels');

        $templateCache.put("webclient/components/post/post-new.html", $templateCache.get("components/post/post-new.html"));
        $compile($templateCache.get("webclient/components/post/post-new.html"))(scope);

        scope.$digest();

        form = scope.postForm;
    }));

    describe("Post Functionality", function() {

        it("should call postService.delete when delete fires", function() {
            scope.delete(123);
            expect(postService.delete).toHaveBeenCalledWith(123);
        });

        it("should call postService.new when reset fires", function() {
            scope.reset();
            expect(postService.new).toHaveBeenCalled();
        });

        it("should reset form when reset fires", function() {
            form.title.$setViewValue('Some text');
            form.body.$setViewValue('Some text');
            expect(form.$dirty).toBeTruthy();
            scope.reset();
            expect(form.$pristine).toBeTruthy();
        });

        it("should validate to true given title and body", function() {
            form.title.$setViewValue('Some text');
            form.body.$setViewValue('Some text');
            expect(form.$valid).toBeTruthy();
            scope.reset();
        });

        it("should validate to false given invalid title and body", function() {
            form.title.$setViewValue('');
            form.body.$setViewValue('Some text');
            expect(form.$valid).toBeFalsy();
            scope.reset();
        });

        it("should call postService.getUsers when HandlePostSaved is caught", function() {
            httpBackend.expectGET("/api/post").respond({});
            scope.$broadcast("HandlePostSaved");
            expect(postService.getPosts).toHaveBeenCalled();
        });

        it("should define posts when HandleGetPosts is caught", function() {
            postService.result = "xyz";
            scope.$broadcast("HandleGetPosts");
            expect(scope.posts).toBeDefined();
        });

        it("should fill in values given a post via edit functionality", function() {
            scope.edit(testPost);
            expect(scope.post.publishDate).toEqual(testPost.publishDate);
            expect(scope.post.expirationDate).toEqual(testPost.expirationDate);
        });

        it("should call postService.update", function() {
            httpBackend.expectGET("/api/post/new-post");
            scope.post = testPost;
            scope.update();
            expect(postService.update).toHaveBeenCalledWith(testPost);
        });
    });
});
