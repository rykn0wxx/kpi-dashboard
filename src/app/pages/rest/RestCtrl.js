/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';
  angular.module('BlurAdmin.pages.rest')
  .controller('RestCtrl', RestPageCtrl);

  /** @ngInject */
  function RestPageCtrl ($scope, $window, $timeout, i18nService, uiGridConstants, uiGridGroupingConstants, collection) {
    var _ = $window._;
    var d3 = $window.d3;
    var crossfilter = $window.crossfilter;
    var dc = $window.dc;
    var acc = $window.accounting;
    var o = this;
    o.$scope = $scope;
    var dateFormat = d3.time.format('%m/%d/%Y');

    $scope.gridOptions = {};
    $scope.gridOptions.data = [];
    // $scope.gridOptions.treeRowHeaderAlwaysVisible = true;
    $scope.gridOptions.enableCellEditOnFocus = false;
    $scope.gridOptions.enableColumnResizing = true;
    $scope.gridOptions.enableFiltering = true;
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.showGridFooter = true;
    $scope.gridOptions.showColumnFooter = true;
    $scope.gridOptions.fastWatch = true;
    $scope.gridOptions.paginationPageSize = 25;
    $scope.gridOptions.enablePaginationControls = false;
    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
    };

    $scope.gridOptions.rowIdentity = function(row) {
      return row.id;
    };
    $scope.gridOptions.getRowIdentity = function(row) {
      return row.id;
    };

    $scope.gridOptions.columnDefs = [
      { name:'Month',field:'month', sort: { priority: 0, direction: 'desc' }, grouping: { groupPriority: 0 }, type:'date', cellFilter: 'date:"yyyy MMM"' },
      { name:'Region',field:'region', sort: { priority: 1, direction: 'desc' }, grouping: { groupPriority: 1 } },
      { name:'Client',field:'client' },
      { name:'Revenue',field:'revenue', cellFilter:'currency:0', footerCellFilter: 'currency', aggregationType:uiGridConstants.aggregationTypes.sum },
      { name:'EBIT %',field:'ebit', type:'number', cellFilter:'number:2',footerCellFilter:'number', aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType:uiGridGroupingConstants.aggregation.AVG},
      { name:'IPH ',field:'iph', type:'number', cellFilter:'number',footerCellFilter:'number', aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType:uiGridGroupingConstants.aggregation.AVG},
      { name:'Cost p/Incident ',field:'costpertkt', type:'currency', cellFilter:'currency',footerCellFilter:'currency', aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType:uiGridGroupingConstants.aggregation.AVG},
      { name:'EBIT p/Incident ',field:'ebitpertkt',type:'currency', cellFilter:'currency',footerCellFilter:'currency', aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType:uiGridGroupingConstants.aggregation.AVG},
      { name:'Revenue p/Head ',field:'revperhead',type:'currency', cellFilter:'currency',footerCellFilter:'currency', aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType:uiGridGroupingConstants.aggregation.AVG}
    ];

    $scope.lang = '';
    $scope.pageLang = 'en';
    $scope.setNewLang = function () {
      $scope.pageLang = $scope.lang;
      i18nService.setCurrentLang($scope.pageLang);
      $scope.gridApi.core.refresh();
    };

    var nest = d3.nest()
      .key(function (d) {
        return d.region_name;
      })
      .key(function (d) {
        return d.client_name;
      })
      .key(function (d) {
        return dateFormat.parse(d.repmonth);
      })
      .rollup(function(leaves) {
        return {
          'revenue': d3.sum(leaves, function(d) { return parseFloat(d.revenue);}),
          'ebit': d3.sum(leaves, function(d) { return parseFloat(d.ebit);}) / d3.sum(leaves, function(d) { return parseFloat(d.revenue);}),
          'iph': d3.sum(leaves, function(d) { return parseFloat(d.ticket);}) / d3.sum(leaves, function(d) { return parseFloat(d.fte);}),
          'costpertkt': (d3.sum(leaves, function(d) { return parseFloat(d.revenue);}) - d3.sum(leaves, function(d) { return parseFloat(d.ebit);})) / d3.sum(leaves, function(d) { return parseFloat(d.ticket);}),
          'ebitpertkt': d3.sum(leaves, function(d) { return parseFloat(d.ebit);}) / d3.sum(leaves, function(d) { return parseFloat(d.ticket);}),
          'revperhead': d3.sum(leaves, function(d) { return parseFloat(d.revenue);}) / d3.sum(leaves, function(d) { return parseFloat(d.fte);})
        };
      })
      .entries(collection);
    $scope.flatNest = zFlatten(nest);
    _.forEach($scope.flatNest, function(row, ind) {
      row.id = ind;
      row.month = Date.parse(row.month);
      $scope.gridOptions.data.push(row);
    });
    // $scope.gridOptions.columnDefs = [
    //   { name:'Region',field:'',width:50 },
    //   { name:'name', width:100 },
    //   { name:'age', width:100, enableCellEdit: true, aggregationType:uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG },
    //   { name:'address.street', width:150, enableCellEdit: true },
    //   { name:'address.city', width:150, enableCellEdit: true },
    //   { name:'address.state', width:50, enableCellEdit: true },
    //   { name:'address.zip', width:50, enableCellEdit: true },
    //   { name:'company', width:100, enableCellEdit: true },
    //   { name:'email', width:100, enableCellEdit: true },
    //   { name:'phone', width:200, enableCellEdit: true },
    //   { name:'about', width:300, enableCellEdit: true },
    //   { name:'friends[0].name', displayName:'1st friend', width:150, enableCellEdit: true },
    //   { name:'friends[1].name', displayName:'2nd friend', width:150, enableCellEdit: true },
    //   { name:'friends[2].name', displayName:'3rd friend', width:150, enableCellEdit: true },
    //   { name:'agetemplate',field:'age', width:150, cellTemplate: '<div class="ui-grid-cell-contents"><span>Age 2:{{COL_FIELD}}</span></div>' },
    //   { name:'Is Active',field:'isActive', width:150, type:'boolean' },
    //   { name:'Join Date',field:'registered', cellFilter:'date', width:150, type:'date', enableFiltering:false },
    //   { name:'Month Joined',field:'registered', cellFilter: 'date:"MMMM"', filterCellFiltered:true, sortCellFiltered:true, width:150, type:'date' }
    // ];

    function zFlatten (data) {
      var result = [];
      _.forEach(data, function(region, iRegion) {
        _.forEach(region.values, function(client, iClient) {
          _.forEach(client.values, function(month, iMonth) {
            var tmp = {
              region: region.key,
              client: client.key,
              month: month.key,
            };
            _.forEach(month.values, function(val, ind) {
              tmp[ind] = val;
            })
            result.push(tmp);
          });
        });
      });
      return result;
    }

    $timeout(function () {
      angular.element(document.getElementsByClassName('grid')[0]).css('min-height', '450px');
    },1);
  }

})();
