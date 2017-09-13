var cht = angular.module("chat", [])
    .controller("flightCtrl", function ($scope, $state, $http, $stateParams, $window) {
        $scope.airports = [];
        $scope.airports1 = [];
        $scope.userid = $state.params.userid;
        $scope.fname = $state.params.fname;
        $scope.lname = $state.params.lname;
        $scope.img = $state.params.image;
        $scope.originCity;
        $scope.destinationCity;
        console.log("fbid " + $scope.userid);
        //        $(document).ready(function () {
        //            $("#MyModal").modal();
        //        });
        $scope.ht = $window.innerHeight;
        console.log("height" + $scope.ht);
        $scope.getCity = function () {
            $scope.city1 = "";
            $http.get("./airports.json")
                .then(function (response) {
                    /*console.log("others", JSON.stringify(response.data));*/
                    //for (var i = 0; i < response.data.length; i++) {
                    $scope.airports = response.data;
                    //console.log("arry" + JSON.stringify($scope.airports));
                    //}
                    console.log("length" + response.data.length);
                    /*$scope.airports = response;*/
                    /*console.log("arry" + JSON.stringify($scope.airports));*/

                }, function (response) {
                    console.log("error" + response);

                });
        }
        $scope.getCity1 = function () {
            $scope.city2 = "";
            $http.get("./airports.json")
                .then(function (response) {

                    /*console.log("others", JSON.stringify(response.data));*/
                    //for (var i = 0; i < response.data.length; i++) {
                    $scope.airports1 = response.data;
                    //console.log("arry" + JSON.stringify($scope.airports));
                    //}
                    console.log("length" + response.data.length);
                    /*$scope.airports = response;*/
                    /*console.log("arry" + JSON.stringify($scope.airports));*/

                }, function (response) {
                    console.log("error" + response);

                });
        }
        var d = new Date();
        var n = d.toISOString().split("T")[0];
        $scope.frmCityCode;
        $scope.toCityCode;
        $scope.fromcityname = function (name) {
            $scope.fromcity = name.city + "(" + name.code + ")";
            console.log("fromcode " + name.code);
            $scope.originCity = name.city;
            console.log("fromcode " + $scope.originCity);
            $scope.frmCityCode = name.code;

            //$scope.hidemodal = true;
        }
        $scope.tocityname = function (name) {

                $scope.tocity = name.city + "(" + name.code + ")";
                console.log("tocode " + name.code);
                $scope.destinationCity = name.city;
                console.log("tocode " + $scope.destinationCity);
                $scope.toCityCode = name.code;

                //$scope.hidemodal = true;
            }
            //        $scope.getDate = function () {
            //            $scope.dtTime = $scope.dateTime;
            //            console.log("dateTime " + $scope.dtTime);
            //        }
            //        $scope.getDate();
        $scope.createUser = function () {
            var data = {
                "id": $scope.userid,
                "firstname": $scope.fname,
                "lastname": $scope.lname,
                "image": $scope.img
            }
            var req = {
                method: 'POST',
                url: 'https://www.colourssoftware.com:3443/Create_User',
                data: data
            }
            $http(req).then(function (response) {
                console.log("created" + JSON.stringify(response.data));

            }, function (error) {
                console.log(error);
            });

        }
        $scope.createUser();
        $scope.dateTime;
        $scope.serachFlight = function () {
            $scope.dateTime = $scope.dateTime;
            console.log("date " + $scope.dateTime);
            console.log("org " + $scope.originCity);
            console.log("dest " + $scope.destinationCity);
            $scope.todayDate = new Date().toISOString().slice(0, 10);
            console.log("date " + $scope.todayDate);
            $state.go("chatGroups", {
                userid: $scope.userid,
                fname: $scope.fname,
                lname: $scope.lname,
                frmCityCode: $scope.frmCityCode,
                toCityCode: $scope.toCityCode,
                originCity: $scope.originCity,
                destinationCity: $scope.destinationCity,
                dateTime: $scope.todayDate
            });
        }

    });