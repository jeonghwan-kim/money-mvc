/**
 * Created by Chris on 2/3/16.
 */

'use strict';

angular.module('money-mvc')
.controller('RegisterCtrl', function ($scope, $http, $window, $state) {
    $scope.user = {};

    $scope.submit = function (form) {
        if (form.$invalid) return;

        $scope.result = '';
        delete $scope.user.repassword;
        $http.post('/api/users', $scope.user).then(function success(response) {
            $window.alert('Success to register. Go to login page');
            $state.go('login');
        }, function error(response) {
            // duplicate
            if (409 === response.status) {
                $scope.result = 'Already registered email';
            } else {
                $scope.result = 'Server error';
            }

        });
    }
});