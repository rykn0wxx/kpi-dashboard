/**
 * Created by k.danovsky on 13.05.2016.
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .config(config);

  /** @ngInject */
  function config(baConfigProvider, colorHelper, $provide, $mdThemingProvider, $mdAriaProvider) {
    $provide.decorator('$uiViewScroll', uiViewScrollDecorator);
    //baConfigProvider.changeTheme({blur: true});
    //
    // baConfigProvider.changeColors({
    //  default: '#ff00ef',
    //  defaultText: '#ff0000',
    //  dashboard: {
    //    white: '#ffffff',
    //  },
    // });

    $mdThemingProvider
      .theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('grey')
      .warnPalette('pink')
      .backgroundPalette('blue-grey');
      // .dark();

    $mdAriaProvider.disableWarnings();

  }

  /** @ngInject */
  function uiViewScrollDecorator($delegate, $anchorScroll, baUtil) {
    return function (uiViewElement) {
      if (baUtil.hasAttr(uiViewElement, "autoscroll-body-top")) {
        $anchorScroll();
      } else {
        $delegate(uiViewElement);
      }
    };
  }
})();
