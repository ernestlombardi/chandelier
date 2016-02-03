"use strict";

describe("User Component tests", function() {

    var scope, el, userService;

    beforeEach(module("app"));
    beforeEach(module("templates"));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            userService = $injector.get("userService");
        });
    });

    beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $controller, $injector, $compile) {
        scope = $rootScope.$new();

        $controller("UserCtrl", {$scope: scope, userService: userService});

        $httpBackend.expectGET("/api/user").respond({});

        spyOn(userService, 'update');
        spyOn(userService, 'new');
        spyOn(userService, 'getUsers');

        $templateCache.put("components/user/user.html", $templateCache.get("webclient/components/user/user.html"));
        el = $compile($templateCache.get("webclient/components/user/user.html"))(scope);

        scope.$digest();
    }));

    describe("UserCtrl", function() {
        it("should be defined", function() {
            expect(scope).toBeDefined();
        });

        it("should call userService.update when update fires", function() {
            scope.update();
            expect(userService.update).toHaveBeenCalled();
        });

        it("should call userService.new when reset fires", function() {
            scope.reset();
            expect(userService.new).toHaveBeenCalled();
        });

        it("should call userService.getUsers when HandleUserSaved is caught", function() {
            scope.$broadcast("HandleUserSaved");
            expect(userService.getUsers).toHaveBeenCalled();
        });

        it("should define users HandleGetUsers is caught", function() {
            scope.$broadcast("HandleGetUsers");
            expect(scope.users).toBeDefined();
        });
    });
});
