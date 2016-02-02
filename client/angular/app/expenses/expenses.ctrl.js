/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

angular.module('money-mvc')
    .controller('ExpensesCtrl', function ($scope, $http) {
      $http.get('/api/echo?message=halo')
          .then(function success(response) {
            $scope.data = response.data;
          }, function error(response) {
            console.error(response);
          });
    });


