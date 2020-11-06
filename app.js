(function() {

    'use strict';

    angular
    .module('AppController', [])
    .controller('Comission', function($scope, $http) {

        $scope.getPercent = function(array, value, key) {
            var max = 0;
            console.log(array, value);
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

        $scope.auth();
    });
})();