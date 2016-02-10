"use strict";

describe("Access Component tests", function() {
    var scope, postService, accessService;

    beforeEach(module("app"));

    beforeEach(module('templates'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            postService = $injector.get("postService");
            accessService = $injector.get("accessService");
        });
    });

    beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $controller) {
        scope = $rootScope.$new();

        $controller("AccessCtrl", {$scope: scope});

        $httpBackend.expectGET("/api/user").respond({});

        spyOn(postService, 'getPostsByChannels');
        spyOn(accessService, 'getPosts');
        spyOn(accessService, 'readPost');
        spyOn(accessService, 'unreadPost');

        postService.result = {};
        accessService.result = [{
            "channels": [],
            "read": []
        }];
        scope.id = "xyz";

        scope.$digest();
    }));


    describe("AccessCtrl", function() {
        it("should be defined", function() {
            expect(scope).toBeDefined();
        });

        it("should call postService.getPostsByChannels when HandleGetChannels is caught", function() {
            scope.$broadcast("HandleGetChannels");
            expect(postService.getPostsByChannels).toHaveBeenCalledWith(scope.id, scope.channels);
        });

        it("should set scope.posts when HandleGetPosts is caught", function() {
            scope.$broadcast("HandleGetPosts");
            expect(scope.posts).toBeDefined();
        });

        it("should call accessService.getPosts when HandlePostSaved is caught", function() {
            scope.$broadcast("HandlePostSaved");
            expect(accessService.getPosts).toHaveBeenCalledWith("xyz");
        });

        it("should call accessService.readPost when readPost fires", function() {
            scope.readPost(123);
            expect(accessService.readPost).toHaveBeenCalledWith(scope.id, 123);
        });

        it("should call accessService.unreadPost when unreadPost fires", function() {
            scope.unreadPost(456);
            expect(accessService.unreadPost).toHaveBeenCalledWith(scope.id, 456);
        });

        it("should resolve isExpired to false when no post.expireDate present", function() {
            var post = {
                "expireDate": ''
            };
            expect(scope.isExpired(post)).toBeFalsy();
            post = {};
            expect(scope.isExpired(post)).toBeFalsy();
        });

        it("should resolve isExpired to false when post.expireDate in future", function() {
            var post = {
                "expireDate": new Date("12/12/2999")
            };
            expect(scope.isExpired(post)).toBeFalsy();
        });

        it("should resolve isExpired to true when post.expireDate in past/now", function() {
            var post = {
                "expireDate": new Date("12/12/1980")
            };
            expect(scope.isExpired(post)).toBeTruthy();
            post = {
                "expireDate": new Date()
            };
            expect(scope.isExpired(post)).toBeTruthy();
        });

        it("should resolve isPublished to false when no post.publishDate present", function() {
            var post = {
                "publishDate": ''
            };
            expect(scope.isPublished(post)).toBeFalsy();
            post = {};
            expect(scope.isPublished(post)).toBeFalsy();
        });

        it("should resolve isPublished to false when post.publishDate in future", function() {
            var post = {
                "publishDate": new Date("12/12/2999")
            };
            expect(scope.isPublished(post)).toBeFalsy();
        });

        it("should resolve isPublished to true when post.publishDate in past/now", function() {
            var post = {
                "publishDate": new Date("12/12/1980")
            };
            expect(scope.isPublished(post)).toBeTruthy();
            post = {
                "publishDate": new Date()
            };
            expect(scope.isPublished(post)).toBeTruthy();
        });
    });
});
