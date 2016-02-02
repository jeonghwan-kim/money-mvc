/**
 * Created by Chris on 2016. 2. 2..
 */

'use strict';

angular.module('money-mvc')
    .controller('LoginCtrl', function ($scope, $http) {
      $scope.user = {};

      $scope.submit = function (form) {
        if (form.$invalid) {
          return;
        }

        $scope.result = '';
        $http.post('/auth', $scope.user).then(function success(response) {
          console.log(1, response);
          // todo
        }, function error(response) {
          if (404 === response.status) {
            $scope.result = 'Login fail try again.';
          } else {
            $scope.result = 'Server error try again.';
          }
        })
      }
    });

