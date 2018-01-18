angular.module('bitcoinApp',['ngMaterial','chart.js'])
  .controller('bitcoinCtrl',function($scope,$http,$sce, $timeout, $mdSidenav, $log){
    $scope.toggleLeft = buildDelayedToggler('left');
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
    // 请求所有币种
    function getAllCoins(){
      var coinsUrl = $sce.trustAsResourceUrl('https://api.coinmarketcap.com/v1/ticker/?convert=CNY')
      $http({
        url:coinsUrl
      })
        .then(function(res){
          $scope.coins = res.data
        })
    }
    getAllCoins()

    // 根据币种查询详情
    $scope.getCoinDetails=function(name){
      var coinsUrl = $sce.trustAsResourceUrl('https://api.coinmarketcap.com/v1/ticker/'+name+'/?convert=CNY')
      $http({
        url:coinsUrl
      })
        .then(function(res){
          $scope.coinDetails = res.data[0]
          $scope.data = [
            [$scope.coinDetails.percent_change_7d,$scope.coinDetails.percent_change_24h,$scope.coinDetails.percent_change_1h],
          ];
        })
    }
    $scope.getCoinDetails('Bitcoin')

    /**
     * ChartJS
     */
    $scope.colors = ['#9C27B0'];
    //  
  
    $scope.labels = ['7-days', '24-hours', '1-hour'];

    $scope.datasetOverride = [
      {
        label: "Line chart",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: 'line'
      }
    ];

    /**
     * 根据币的名称搜索详情
     */
    $scope.search = function(){
      $scope.getCoinDetails($scope.title)
    }

  })
