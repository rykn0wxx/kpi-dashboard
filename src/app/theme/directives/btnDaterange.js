(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .directive('inpDaterange', btnDaterange);

  /** @ngInject */
  function btnDaterange($timeout, $parse) {
    function BtnDaterangeLink ($scope, element, attrs, ctrl) {
      $scope.initRun = false;
      var ngModelCtrl = ctrl[0];
      var btnCtrl = ctrl[1];
      ngModelCtrl.$viewChangeListeners.push(function() {
        btnCtrl.updateRoot(ngModelCtrl.$modelValue);
      });
      $scope.$watch(function() {
        return ngModelCtrl.$modelValue;
      }, function (nVal, oVal) {
        if (!isNaN(nVal) && !$scope.initRun) {
          btnCtrl.updateRoot(ngModelCtrl.$modelValue);
          $scope.initRun = true;
        }
      }, true);
    }
    function BtnDaterangeCtrl ($scope, $element, $attrs, $compile, $log, $parse, $window, $document, $rootScope) {
      var o = this;
      o.updateRoot = function (ngVal) {
        $rootScope.globals.filterMonth =  ngVal;
      };
    }
    // ngModel.$viewChangeListeners.push(function() {
    //   $scope.date = parseDateString(ngModel.$viewValue);
    // });
    return {
      restrict: 'C',
      require: ['ngModel', 'inpDaterange'],
      controller: BtnDaterangeCtrl,
      controllerAs: 'vmBtnDate',
      link: BtnDaterangeLink
    };
  }

})();
