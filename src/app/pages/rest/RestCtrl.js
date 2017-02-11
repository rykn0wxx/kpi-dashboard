/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';
  angular.module('BlurAdmin.pages.rest')
  .controller('RestCtrl', RestPageCtrl);

  /** @ngInject */
  function RestPageCtrl ($scope) {
    var o = this;
    o.$scope = $scope;
  }

})();
