(function() {

    'use strict';

    jQuery(document).bind('keyup', function(e) {
            
        if(e.which == 39){
            $('.carousel').carousel('next');
        }
        else if(e.which == 37){
            $('.carousel').carousel('prev');
        }
    
    });

    var app = angular.module('App', []);
    app.controller('Comission', function($scope, $http) {

        $scope.getPercent = function(array, value, key) {
            var max = 0;
            array.forEach(function(item) {
                max = item[key] > max ? item[key] : max;
            });
            return value * 100 / max;
        }

        $scope.auth = function() {
            var settings = {
                url: "https://cloudfort.izumfin.com/api/auth",
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                data: {request:{login:"dashboard_gar",password:"JJjhs7eejw"}},
              };
              
              $http(settings)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
        }

        $scope.updateData = function() {
            $scope.comissions.forEach(function(item) {
                item.value = Math.floor(Math.random() * 1000000) + 100000;
            });

            $scope.sdelki.forEach(function(item) {
                item.value = Math.floor(Math.random() * 1000) + 5;
                item.avg_cheque = $scope.comissions[0].value / item.value;
            });
        };

        $scope.comissions = [
            {label: "Сегодня", value: 1098754},
            {label: "Вчера", value: 2572712},
            {label: "Неделю назад", value: 1007432},
            {label: "Год назад", value: 536744}
        ];
        
        $scope.sdelki = [
            {value: 70, avg_cheque: 16800},
            {value: 19, avg_cheque: 8700}
        ];

        //$scope.auth();
    });

    app.controller('Values', function($scope, $http) {
        $scope.portfolio = [
            {value: 1790258456, plan:32, year:101},
            {value: 1100255658, plan:-23, year:-45},
            {value: 1790258456, plan:1, year:-67}
        ];
        $scope.sdelki = [
            {value: 12562, plan:32, year:101},
            {value: 256, plan:-23, year:-45},
            {value: 2156, plan:1, year:-67}
        ];
        $scope.new_sdelki = [
            {value: 2656, plan:32, year:101},
            {value: 789, plan:-23, year:-45},
            {value: 124, plan:1, year:-67}
        ];

        $scope.htmlDecode = function(input) {
            console.log(input);
            var e = document.createElement('span');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
          }

        $scope.abbreviateNumber = function(num, fixed) {
            if (num === null) { return null; } // terminate early
            if (num === 0) { return '0'; } // terminate early
            fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
                d = c < 0 ? c : c, // enforce -0 is 0
                e = ((num < 1000) ? (num/1000).toFixed(fixed) : d) + "<span style='font-size:16px;'>" + [' тыс.', ' тыс.', ' млн.', ' млрд.', ' трлн.'][k] + "</span>"; // append power
            return (num < 100) ? num.toFixed(fixed) : e;
        }
    });
})();