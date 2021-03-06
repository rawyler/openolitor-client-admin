'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProduzentenOverviewController', ['$q', '$scope', '$filter',
    'ProduzentenModel', 'NgTableParams',
    function($q, $scope, $filter, ProduzentenModel, NgTableParams) {

      $scope.entries = [];
      $scope.loading = false;


      $scope.search = {
        query: ''
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope
              .search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ProduzentenModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });

        //$scope.entries = $scope.dummyEntries;

      }

      search();

    }
  ]);
