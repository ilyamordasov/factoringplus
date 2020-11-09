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
    app.controller('Comission', function($scope, $sce, $http) {

        $scope.plan = [{"count":1234,"date":"январь","portfolio":1.076209747191E7},{"count":856,"date":"февраль","portfolio":9749297.47191},{"count":2026,"date":"март","portfolio":9593297.47191},{"count":1612,"date":"апрель","portfolio":1.152769747191E7},{"count":1156,"date":"май","portfolio":1.122145747191E7},{"count":1356,"date":"июнь","portfolio":1.284865747191E7},{"count":1600,"date":"июль","portfolio":1.45785720382544E7},{"count":1800,"date":"август","portfolio":1.58546434543944E7},{"count":1960,"date":"сентябрь","portfolio":1.82066434543944E7},{"count":2352,"date":"октябрь","portfolio":2.02317074208544E7},{"count":2822.4,"date":"ноябрь","portfolio":2.36185874208544E7},{"count":3669.12,"date":"декабрь","portfolio":2.80215314208544E7}];

        $scope.getPercent = function(array, value, key) {
            var max = 0;
            array.forEach(function(item) {
                max = item[key] > max ? item[key] : max;
            });
            return value * 100 / max;
        }

        $scope.auth = function() {
            var settings = {
                url: "https://cors-anywhere.herokuapp.com/https://cloudfort.izumfin.com/api/auth",
                method: "OPTIONS",
                headers: {
                  "Content-Type": "application/json"
                },
                data: {request:{login:"dashboard_gar",password:"JJjhs7eejw"}},
              };
              
              $http(settings)
              .then(response => response.data.response)
              .then(result => {
                  $scope.sessionID = result.sessionID;
                  $scope.updateData();
              })
              .catch(error => console.log('error', error));
        }
          
        $scope.formatDate = function(value) {
              var day = new Date(value);
              var padZero = function(value) {
                return value < 10 ? '0' + value : value;
              }
              return padZero(day.getFullYear()) + "" + padZero(day.getMonth()+1) + "" + padZero(day.getDate())
          }

        $scope.getDataFromSlicedArray = function(array, key) {
            switch (key) {
                case "release_sdelki": return array.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                case "new_clients_sdelki": return array.reduce( ( sum, { new_clients_sdelki } ) => sum + new_clients_sdelki , 0);
            }
        }

        $scope.getDataFromAPI = function(start, end) {
            return new Promise(function(resolve,reject){
                
                var settings = {
                    "url": "https://cors-anywhere.herokuapp.com/https://cloudfort.izumfin.com/api/Dashboard/bg/gar_count?date_s="+end+"&date_e="+start,
                    "method": "GET",
                    "headers": {
                        "SessionID": $scope.sessionID
                    }
                };
                // console.log(settings.url)
                $http(settings)
                .then(response => response.data.gar_count)
                .then(result => {resolve(result)})
                .catch(error => console.log('error', error));
            });
        }

        $scope.updateData = function() {

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate()))) // с сегодня предыдущего года по сегодня
                .then(response => response)
                .then(result => {

                    $scope.comissions[0].value = Math.floor(result[0].comission);
                    $scope.comissions[1].value = Math.floor(result[1].comission);
                    $scope.comissions[2].value = Math.floor(result[7].comission);
                    $scope.comissions[3].value = Math.floor(result[result.length-1].comission);
                    $scope.sdelki[0] = {value: result[0].release_sdelki, avg_cheque: result[0].comission/result[0].release_sdelki};
                    $scope.sdelki[1] = {value: result[0].new_clients_sdelki, avg_cheque: result[0].comission_new_clients/result[0].new_clients_sdelki};
                    $scope.$apply();
                });

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear(),0,1))) // с 1 января по сегодня
                .then(response => response)
                .then(result => {
                    $scope.portfolio[0].value = result[0].portfolio;
                    $scope.portfolio[0].plan = Math.floor(100 * $scope.portfolio[0].value / ($scope.plan[new Date().getMonth()].portfolio * 1000) - 100);
                    $scope.$apply();
                    
                    var tmp = $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())); // год назад
                    $scope.getDataFromAPI(tmp, tmp)
                        .then(response => response)
                        .then(res => {
                            $scope.portfolio[0].year = Math.floor(100 * $scope.portfolio[0].value / res[0].portfolio - 100);
                            $scope.$apply();
                        });
                    
                    $scope.sdelki2[0].value = $scope.getDataFromSlicedArray(result, "release_sdelki");
                    var count = result.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                    var count_plan = 0;
                    for (var i=0; i<new Date().getDate(); i++) {
                        count_plan += $scope.plan[new Date().getMonth()-1].count;
                    }
                    $scope.sdelki2[0].plan = Math.floor(100 * count / count_plan - 100);
                    $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())), $scope.formatDate(new Date(new Date().getFullYear()-1, 0, 1))) // с 1 января предыдущего года по сегодня предыдущего года
                        .then(response => response)
                        .then(res => {
                            var count_ly = res.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);
                            console.log(count, count_ly)
                            $scope.sdelki2[0].year = Math.floor(100 * count / count_ly - 100);
                            $scope.$apply();
                        });
                    $scope.$apply();

                    $scope.new_sdelki[0] = {value: $scope.getDataFromSlicedArray(result, "new_clients_sdelki"), plan:90, year:-23};
                    $scope.$apply();
                    
                });

            $scope.getDataFromAPI($scope.formatDate(new Date()), $scope.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))) // с начала месяца по сегодня
                .then(response => response)
                .then(result => {
                    $scope.portfolio[1].value = result[0].portfolio - result[result.length-1].portfolio;
                    $scope.sdelki2[1].value = $scope.getDataFromSlicedArray(result, "release_sdelki");
                    $scope.new_sdelki[1].value = $scope.getDataFromSlicedArray(result, "new_clients_sdelki");
                    
                    $scope.getDataFromAPI($scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate())), $scope.formatDate(new Date(new Date().getFullYear()-1, new Date().getMonth(), 1))) // этот месяц год назад
                        .then(response => response)
                        .then(res => {
                            
                            var sdelki_1 = 0;
                            for (var i=0; i<new Date().getDate(); i++) {
                                sdelki_1 += result[i].release_sdelki;
                            }
                            var sdelki = res.reduce( ( sum, { release_sdelki } ) => sum + release_sdelki , 0);

                            var portfolio = result[0].portfolio - result[new Date().getDate()-1].portfolio;
                            var sum_1 = 0;
                            for (var i=0; i<new Date().getMonth()+1; i++)
                            {
                                sum_1 += $scope.plan[new Date().getMonth()].count;
                            }

                            $scope.portfolio[1].plan = Math.floor(100 * portfolio / (1000 * ($scope.plan[new Date().getMonth()+1].portfolio - $scope.plan[new Date().getMonth()].portfolio)) - 100);
                            $scope.portfolio[1].year = Math.floor(100 * portfolio / (res[0].portfolio - res[res.length-1].portfolio) - 100);
                            $scope.sdelki2[1].plan = Math.floor(100 * sdelki / sum_1 - 100);
                            $scope.sdelki2[1].year = Math.floor(100 * sdelki_1 / sdelki - 100);
                            
                            $scope.$apply();
                            
                            $("#spinner").addClass('d-none');
                            $("#dashboard").addClass('in');

                        });
                    $scope.$apply();
                });
        };

        $scope.today = new Date().getDate() + " " + ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][new Date().getMonth()] + " " + new Date().getFullYear();
        $scope.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][new Date().getMonth()];

        $scope.comissions = [
            {label: "Сегодня", value: ""},
            {label: "Вчера", value: ""},
            {label: "Неделю назад", value: ""},
            {label: "Год назад", value: ""}
        ];
        
        $scope.sdelki = [
            {value: "", avg_cheque: ""},
            {value: "", avg_cheque: ""}
        ];

        $scope.auth();
        let timerId = setInterval($scope.auth(), 5 * 60 * 1000);
    //});

    //app.controller('Values', function($scope, $sce, $http) {
        $scope.portfolio = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
            //{value: 1790258456, plan:1, year:-67}
        ];
        $scope.sdelki2 = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
            //{value: 2156, plan:1, year:-67}
        ];
        $scope.new_sdelki = [
            {value: "", plan:"", year:""},
            {value: "", plan:"", year:""},
            //{value: 124, plan:1, year:-67}
        ];

        $scope.htmlDecode = function(input) {
            console.log(input);
            var e = document.createElement('span');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
          }

        $scope.abbreviateNumber = function(num, fixed) {
            var sign = (num < 0) ? "-" : "";
            num = Math.abs(num);
            if (num === null) { return null; } // terminate early
            if (num === 0) { return '0'; } // terminate early
            fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(fixed), // divide by power
                d = c < 0 ? c : c, // enforce -0 is 0
                e = ((num < 1000) ? sign+(num/1000).toFixed(fixed) : sign+d) + "<span style='font-size:16px;'>" + [' тыс.', ' тыс.', ' млн.', ' млрд.', ' трлн.'][k] + "</span>"; // append power
            return (num < 100) ? num.toFixed(fixed) : $sce.trustAsHtml(e);
        }
    });
})();