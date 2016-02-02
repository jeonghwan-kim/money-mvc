/**
 * Created by Chris on 2016. 2. 1..
 */

'use strict';

angular.module('money-mvc', [
  'ui.router'
]).config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/expenses');

  $stateProvider.state('expenses', {
    url: '/expenses',
    templateUrl: 'app/expenses/expenses.tpl.html',
    controller: 'ExpensesCtrl'
  });

  $stateProvider.state('expense', {
    url: '/expenses/:id',
    templateUrl: 'app/expense/expense.tpl.html',
    controller: 'ExpenseCtrl'
  });

}]);