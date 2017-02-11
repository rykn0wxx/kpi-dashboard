/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use script';

  angular.module('BlurAdmin.theme')
  .factory('calcUtil', CalcUtilFactory);

  function CalcUtilFactory ($w) {
    var _ = $w._, d3 = $w.d3;

    var dateFormat = d3.time.format('%m/%d/%Y');

    // helpers related to crossfilter
    var ndx = {
      dimension: function (val, typ) {
        var typer = {
          d: function (d) { return dateFormat.parse(d[val]); },
          n: function (d) { return _.number(d[val]); },
          s: function (d) { return  '' + d[val]; }
        };
        return typer[typ];
      },
      grpAdd: function grpAdd (p, v) {
        ++p.count;
        p.ebit += +v.ebitDollar;
        p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
        p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
        p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

        p.revenue += +v.revenueDollar;
        p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
        p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
        p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

        p.ebitPercent = (p.ebit/p.revenue) * 100;
        p.ebitPercentScore = p.ebitScore / p.revenueScore;

        p.expense = p.revenue - p.ebit;
        p.avgExpense = p.expense / p.count;

        p.tktVolume += +v.ticketVolume;
        p.avgTktVolume = p.tktVolume / p.count;

        p.tktFte += +v.fte;
        p.avgTktFte = p.tktFte / p.count;

        p.iph = p.tktVolume/p.tktFte;

        p.costPerTkt = p.expense / p.tktVolume;
        p.ebitPerTkt = p.ebit / p.tktVolume;
        p.revPerHead = p.revenue / p.tktFte;
        return p;
      },
      grpRemove: function (p, v) {
        --p.count;
        p.ebit -= +v.ebitDollar;
        p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
        p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
        p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

        p.revenue -= +v.revenueDollar;
        p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
        p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
        p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

        p.ebitPercent = (p.ebit/p.revenue) * 100;
        p.ebitPercentScore = p.ebitScore / p.revenueScore;

        p.expense = p.revenue - p.ebit;
        p.avgExpense = p.expense / p.count;

        p.tktVolume -= +v.ticketVolume;
        p.avgTktVolume = p.tktVolume / p.count;

        p.tktFte -= +v.fte;
        p.avgTktFte = p.tktFte / p.count;

        p.iph = p.tktVolume / p.tktFte;

        p.costPerTkt = p.expense / p.tktVolume;
        p.ebitPerTkt = p.ebit / p.tktVolume;
        p.revPerHead = p.revenue / p.tktFte;
        return p;
      },
      grpBase: function () {
        return {
          count: 0,
          ebit: 0,
          ebitMin: 0,
          ebitMax: 0,
          ebitScore: 0,

          revenue: 0,
          revenueMin: 0,
          revenueMax: 0,
          revenueScore: 0,

          ebitPercent: 0,
          ebitPercentScore: 0,

          expense: 0,
          avgExpense: 0,

          tktVolume: 0,
          avgTktVolume: 0,

          tktFte: 0,
          avgTktFte: 0,

          iph: 0,

          costPerTkt: 0,
          ebitPerTkt: 0,
          revPerHead: 0
        };
      },
      grpAddWithTrend: function (dteGrp) {
        var o = this;
        return function (p, v) {
          var c = dateFormat.parse(v[dteGrp]).yyyymmm();
          p[c] = p[c] ||  {};

          ++p[c].count;
          if (_.isUndefined(p[c].init)) {
            p[c] =grpBase();
            p[c].init = true;
          }
          p[c] = o.grpAdd(p[c], v);
          return p;
        };
      },
      grpRemoveWithTrend: function (dteGrp) {
        var o = this;
        return function (p, v) {
          var c = dFormat.parse(v[dteGrp]).yyyymmm();
          p[c] = p[c];
          p[c] = o.grpRemove(p[c], v);
          return p;
        };
      }
    };

    // date relater helpers
    var dtx = {
      stdDate: d3.time.format('%m/%d/%Y')
    };

    return {
      ndx: ndx,
      dtx: dtx
    };

  }

  CalcUtilFactory.$inject = ['$window'];

})();
