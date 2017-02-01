(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .directive('btnDaterange', btnDaterange);

  /** @ngInject */
  function btnDaterange($timeout, $parse) {
    function BtnDaterangeLink ($scope, element, attrs, modelCtrl) {

    }
    function BtnDaterangeCtrl ($scope, $element, $attrs, $compile, $log, $parse, $window, $document, $rootScope) {

    }
    return {
      require: ['ngModel', 'btnDaterange'],
      restrict: 'E',
      controller: BtnDaterangeCtrl,
      controllerAs: 'vmBtnDate',
      scope: {
        model: '=ngModel',
        opts: '=options'
      },
      link: BtnDaterangeLink,
      template: '<button type="button" class="btn btn-primary pull-left btn-daterange" id="daterange-btn">' +
        '<span><i class="fa fa-calendar"></i> Date range picker </span> <i class="fa fa-caret-down"></i>' +
        '</button>'
    };
  }

})();
