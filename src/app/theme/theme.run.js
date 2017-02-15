/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .run(themeRun);

  /** @ngInject */
  function themeRun($timeout, $rootScope, layoutPaths, preloader, $q, baSidebarService, themeLayoutSettings) {
    var Highcharts = window.Highcharts;

    var whatToWait = [
      preloader.loadAmCharts(),
      $timeout(2000)
    ];

    $rootScope.globals = {};
    $rootScope.globals.isLoggedIn = false;
    var theme = themeLayoutSettings;
    if (theme.blur) {
      if (theme.mobile) {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-mobile.jpg'));
      } else {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg.jpg'));
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-blurred.jpg'));
      }
    }

    $q.all(whatToWait).then(function () {
      $rootScope.$pageFinishedLoading = true;
    });

    $timeout(function () {
      if (!$rootScope.$pageFinishedLoading) {
        $rootScope.$pageFinishedLoading = true;
      }
    }, 2000);

    Highcharts.theme = {
  		chart: {
  			backgroundColor: {
  				linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
  				stops: [
  					[0, '#313035'],
  					[1, '#515054']
  				]
  			},
  			style: {
  				fontFamily: 'Roboto',
  				fontSize: '12px'
  			}
  		},
  		lang: {
  			contextButtonTitle: 'ACA context menu',
  			decimalPoint: '.',
  			downloadJPEG: 'Export as JPG',
  			downloadPDF: 'Export as PDF',
  			downloadSVG: 'Export as SVG',
  			drillUpText: 'Back to {series.name}',
  			loading: 'This will be awesome...',
  			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  			noData: 'No data to display',
  			numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
  			printChart: 'Export Chart',
  			resetZoom: 'Reset zoom',
  			resetZoomTitle: 'Reset zoom level 1:1',
  			shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  			thousandsSep: ',',
  			weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  		},
  		credits: {
  			enabled: true,
  			href: 'mailto:ariel.andrade@stefanini.com?subject=Stefanini Dashboard Query',
  			text: 'Created by ACAndrade',
  			style: {
  				fontSize: '10px',
  				fontFamily: 'Roboto, sans-serif',
  				color: 'rgba(255,255,255,0.2)'
  			}
  		},
  		title: {
  			style: {
  				fontFamily: 'Roboto, sans-serif',
  				color: 'rgba(255,255,255,0.8)',
  				textTransform: 'uppercase',
  				fontSize: '16px',
  				fontWeight: 'medium'
  			}
  		},
  		subtitle: {
  			style: {
  				textTransform: 'uppercase',
  				fontSize: '12px',
  				fontFamily: 'Roboto, sans-serif',
  				fontStyle: 'italic',
  				color: 'rgba(255,255,255,0.4)'
  			}
  		},
  		legend: {
  			itemStyle: {
  				color: 'rgba(255,255,255,0.5)',
  				fontWeight: 300
  			},
  			itemHiddenStyle: {
  				color: 'rgba(255,255,255,0.1)'
  			},
  		},
  		plotOptions: {
  			bar: {
  				borderWidth: 1,
  				borderColor: 'rgba(0,0,0,0.1)'
  			},
  			series: {
  				borderWidth: 1,
  				borderColor: 'rgba(0,0,0,0.1)',
  				groupPadding: 0.01,
  				dataLabels: {
  					style: {
  						backgroundColor: 'rgba(0,0,0,0.4)',
  						color: 'rgba(255,255,255,0.7)'
  					}
  				}
  			},
  			column: {
  				groupPadding: 0.1,
  				pointPadding: 0.05,
  				borderWidth: 0,
  				borderColor: 'rgba(0,0,0,0.1)',
  				borderRadius: 1,
  				states: {
  					hover: {
  						enabled: true
  					}
  				},
  				dataLabels: {
  					style: {
  						backgroundColor: 'rgba(0,0,0,0.4)',
  						color: 'rgb(255,0,0)'
  					}
  				}
  			},
  			spline: {
  				lineWidth: 2,
  				marker: {
  					lineWidth: 2,
  					fillColor: '#fff',
  					lineColor: '#484343',
  					symbol: 'circle'
  				},
  				dataLabels: {
  					style: {
  						color: '#808080',
  						fontWeight: 'regular',
  						fontSize: '10px',
  						fontFamily: 'Roboto, sans-serif',
  					}
  				}
  			},
  			line: {
  				lineWidth: 1
  			}
  		},
  		tooltip: {
  			backgroundColor: 'rgba(0, 0, 0, 0.5)',
  			style: {
  				fontSize: '11px',
  				color: '#F0F0F0'
  			}
  		},
  		yAxis: {
  			gridLineColor: 'rgba(0,0,0,0.1)',
  			labels: {
  				style: {
  					color: 'rgba(255,255,255,0.4)'
  				}
  			},
  			lineColor: 'rgba(0,0,0,0.1)',
  			lineWidth: 0,
  			tickColor: 'rgba(0,0,0,0.4)',
  			title: {
  				style: {
  					color: 'rgba(255,255,255,0.5)'
  				},
  				text: null
  			}
  		},
  		xAxis: {
  			gridLineColor: '#707073',
  			labels: {
  				style: {
  					color: 'rgba(255,255,255,0.4)',
  					fontSize: '10px'
  				}
  			},
  			lineColor: 'rgba(0,0,0,0.1)',
  			lineWidth: 0,
  			tickColor: 'rgba(0,0,0,0.4)',
  			title: {
  				style: {
  					color: 'rgba(255,255,255,0.5)'
  				}
  			}
  		},
  		exporting: {
  			buttons: {
  				contextButton: {
  					menuItems: [{
  						text: 'Export to PNG (small)',
  						onclick: function() {
  							this.exportChart({
  								width: 250
  							});
  						}
  					}, {
  						text: 'Export to PNG (large)',
  						onclick: function() {
  							this.exportChart();
  						},
  						separator: false
  					}, {
  						text: 'Export as SVG',
  						onclick: function() {
  							this.exportChartLocal({
  								type: 'image/svg+xml'
  							});
  						},
  						separator: false
  					}]
  				}
  			}
  		},
  		colors: ['#5DA3E7', '#686868', '#75E95D', '#F9953A', '#7077FF', '#F15A60', '#E4D354', '#B8D2EC', '#D98880', '#87CEFA', '#CCCCCC', '#E7B2D4']
  	};
    Highcharts.setOptions(Highcharts.theme);

    $rootScope.$baSidebarService = baSidebarService;
    $rootScope.globals.isLoggedIn = true;

  }

})();
