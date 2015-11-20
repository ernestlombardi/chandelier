"use strict";

describe("Dialog Component tests", function() {
    var scope, mdDialog;

    beforeEach(module("app"));

    beforeEach(inject(function($rootScope, $httpBackend, $templateCache, $controller, $mdDialog) {
        scope = $rootScope.$new();
        mdDialog = $mdDialog;

        $controller("DialogCtrl", {$scope: scope});

        spyOn(mdDialog, 'hide');
        spyOn(mdDialog, 'cancel');

        scope.$digest();
    }));


    describe("DialogCtrl", function() {
        it("should be defined", function() {
            expect(scope).toBeDefined();
        });

        it("should call mdDialog.hide when submitForgotPassword fires", function() {
            scope.submitForgotPassword();
            expect(mdDialog.hide).toHaveBeenCalled();
        });

        it("should call mdDialog.cancel when cancel fires", function() {
            scope.cancel();
            expect(mdDialog.cancel).toHaveBeenCalled();
        });
    });
});
