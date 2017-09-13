var grp = angular.module("groups", [])
    .controller("groupsCtrl", function ($scope, $state, $http, $stateParams, $window) {
        $scope.frmCityCode = $state.params.frmCityCode;
        $scope.toCityCode = $state.params.toCityCode;
        $scope.fbId = $state.params.userid;
        $scope.fname = $state.params.fname;
        $scope.lname = $state.params.lname;
        console.log("fname " + $scope.fname);
        $scope.img = $state.params.image;
        $scope.dateTime = $state.params.dateTime;
        $scope.dt = [];
        var hrs = new Date().getHours();
        var min = new Date().getMinutes();
        $scope.time = hrs + ":" + min;
        console.log("time " + $scope.time);
        //        $scope.dt = $scope.dateTime.split(" ");
        //        var len = $scope.dt.length;
        //        $scope.date = $scope.dt[0];
        //        $scope.time = $scope.dt[len - 1];
        var d = new Date();
        var hrs = addZero(d.getHours() + 6);
        var min = addZero(d.getMinutes());
        $scope.ht = $window.innerHeight;

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        $scope.back = function () {
            $state.go("chat");
        }
        $scope.addedTime = hrs + ":" + min;
        console.log("addedtime " + $scope.addedTime);
        $scope.originCity = $state.params.originCity;
        $scope.destinationCity = $state.params.destinationCity;
        console.log("fb-id " + $scope.fbId);
        console.log("fname " + $scope.fname);
        console.log("lname " + $scope.lname);
        console.log("imglink " + $scope.img);
        console.log("origin " + $scope.originCity);
        console.log("destination " + $scope.destinationCity);
        console.log("origincode " + $scope.frmCityCode);
        console.log("destcode " + $scope.toCityCode);
        console.log("dateTime " + $scope.dateTime);
        console.log("Time " + $scope.time);
        $scope.flightsList = [];
        $scope.flights = {};
        $scope.grpArray = [];
        $scope.dArray = [];
        $scope.indGrp = [];
        $scope.saleTotal;
        $scope.duration;
        $scope.deptTime;
        $scope.origin;
        $scope.ariivalTime;
        $scope.destination;
        $scope.fareCalculation;
        //individual groups..................  
        $scope.individualGrps = function () {
                var data = {
                    members: $scope.fbId
                }
                var req = {
                    method: 'POST',
                    url: 'https://www.colourssoftware.com:3443/Groups_List',
                    data: data
                }
                $http(req).then(function (response) {
                    $scope.indGrp.length = 0;
                    console.log("individualgrpdata" + JSON.stringify(response.data));
                    $scope.indGrp = response.data;
                    for (var i = 0; i < $scope.indGrp.length; i++) {
                        $scope.arrTime = $scope.indGrp[i].arrivaltime;
                        $scope.arrTime0 = new Date($scope.arrTime);
                        $scope.arrTime01 = new Date($scope.arrTime0.getTime() + ($scope.arrTime0.getTimezoneOffset() * 60000));
                        //console.log("time" + $scope.arrTime01 + " " + $scope.arrTime);
                        $scope.arrTime1 = new Date($scope.arrTime01).toLocaleTimeString();
                        console.log('time' + $scope.arrTime + "  " + $scope.arrTime1);
                        $scope.arrTime2 = new Date($scope.arrTime01).toLocaleDateString();
                        $scope.arrTime3 = $scope.arrTime2 + " " + $scope.arrTime1;
                        $scope.indGrp[i].arrivaltime = $scope.arrTime3;
                        $scope.deptTime = $scope.indGrp[i].departuretime;
                        $scope.deptTime0 = new Date($scope.deptTime);
                        $scope.deptTime01 = new Date($scope.deptTime0.getTime() + ($scope.deptTime0.getTimezoneOffset() * 60000));
                        $scope.deptTime1 = new Date($scope.deptTime01).toLocaleTimeString();
                        $scope.deptTime2 = new Date($scope.deptTime01).toLocaleDateString();
                        $scope.deptTime3 = $scope.deptTime2 + " " + $scope.deptTime1;
                        $scope.indGrp[i].departuretime = $scope.deptTime3;
                    }


                    console.log("indgrp" + JSON.stringify($scope.indGrp));
                }, function (response) {
                    console.log("error" + response);
                });
            }
            //groups list..............................
        $scope.individualGrps();
        $scope.grpList = function () {
            $http.get("https://www.colourssoftware.com:3443/Groups_List")
                .then(function (response) {
                    //console.log("grps " + JSON.stringify(response));
                    $scope.grpArray = response.data;
                    //console.log("grpdata " + JSON.stringify($scope.grpArray));
                }, function (response) {
                    console.log("error" + response);
                });
        }
        $scope.grpList();
        $scope.flightData = function () {
            var data = {
                "request": {
                    "slice": [{
                        "origin": $scope.frmCityCode,
                        "destination": $scope.toCityCode,
                        "date": $scope.dateTime,
                        "permittedDepartureTime": {
                            "kind": $scope.dateTime,
                            "earliestTime": $scope.time,
                            "latestTime": $scope.addedTime
                        }
                                             }],
                    "passengers": {
                        "adultCount": 1
                    },
                    "refundable": false,
                    "saleCountry": ""
                }
            }
            console.log("data " + JSON.stringify(data))
            var req = {
                method: "POST",
                url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBE_S4DUE9Y74acsIBQZO4SlGsJBgkg2NI",
                data: data,
                //                headers: {
                //                    'Content-Type': 'application/json'
                //                }
            }
            $http(req).then(function (response) {

                console.log("printresponse" + JSON.stringify(response.data));
                $scope.dArray = response.data;
                console.log(JSON.stringify($scope.dArray));
                console.log($scope.dArray.trips.tripOption);

                for (var i = 0; i < $scope.dArray.trips.tripOption.length; i++) {
                    $scope.flights = {};
                    $scope.saleTotal = $scope.dArray.trips.tripOption[i].saleTotal;

                    console.log("saletotal    " + $scope.saleTotal);

                    console.log("hiiiiiiiii");
                    for (var j = 0; j < $scope.dArray.trips.tripOption[i].slice.length; j++) {
                        $scope.duration = $scope.dArray.trips.tripOption[i].slice[j].duration;
                        console.log("duration     " + $scope.duration);

                        if ($scope.dArray.trips.tripOption[i].slice[j].segment.length != 0) {

                            $scope.deptTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].departureTime;
                            $scope.deptTime0 = new Date($scope.deptTime);
                            $scope.deptTime01 = new Date($scope.deptTime0.getTime() + ($scope.deptTime0.getTimezoneOffset() * 60000));
                            $scope.deptTime1 = new Date($scope.deptTime01).toLocaleTimeString();
                            $scope.deptTime2 = new Date($scope.deptTime01).toLocaleDateString();
                            $scope.deptTime3 = $scope.deptTime2 + " " + $scope.deptTime1;
                            console.log("converted time string" + $scope.deptTime2);
                            console.log("departure time     " + $scope.deptTime);

                            $scope.origin = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].origin;
                            console.log("origin        " + $scope.origin);

                            $scope.segLength = $scope.dArray.trips.tripOption[i].slice[j].segment.length;
                            $scope.arrivalTime = $scope.dArray.trips.tripOption[i].slice[j].segment[$scope.segLength - 1].leg[0].arrivalTime;
                            console.log("arrivaltime     " + $scope.arrivalTime);
                            $scope.arrivalTime0 = new Date($scope.arrivalTime);
                            $scope.arrivalTime01 = new Date($scope.arrivalTime0.getTime() + ($scope.arrivalTime0.getTimezoneOffset() * 60000));
                            $scope.arrivalTime1 = new Date($scope.arrivalTime01).toLocaleTimeString();
                            $scope.arrivalTime2 = new Date($scope.arrivalTime01).toLocaleDateString();
                            $scope.arrivalTime3 = $scope.arrivalTime2 + " " + $scope.arrivalTime1;
                            $scope.destination = $scope.dArray.trips.tripOption[i].slice[j].segment[$scope.segLength - 1].leg[0].destination;
                            console.log("destination     " + $scope.destination);

                        } else {
                            $scope.deptTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].departureTime;
                            $scope.origin = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].origin;
                            $scope.ariivalTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].arrivalTime;
                            $scope.destination = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].destination;

                        }

                        $scope.fareCalculation = $scope.dArray.trips.tripOption[i].pricing[0].fareCalculation;
                        console.log("farecalculation     " + $scope.fareCalculation);
                        $scope.flights = {
                            "saletotal": $scope.saleTotal,
                            "duration": $scope.duration,
                            "departuretime": $scope.deptTime3,
                            "origin": $scope.origin,
                            "arrivaltime": $scope.arrivalTime3,
                            "destination": $scope.destination,
                            "farecalculation": $scope.fareCalculation
                        };
                        $scope.flightsList.push($scope.flights);


                    }



                }
                console.log("flightlist " + JSON.stringify($scope.flightsList));

            }, function (response) {
                console.log("error " + JSON.stringify(response));
            });
        }

        $scope.flightData();

        /* $scope.ftnSearch = function () {
       $.getJSON("data.json", function (data) {
           $scope.dArray = data;
           console.log($scope.dArray);
           console.log($scope.dArray.trips.tripOption);

           for (var i = 0; i < $scope.dArray.trips.tripOption.length; i++) {
               $scope.flights = {};
               $scope.saleTotal = $scope.dArray.trips.tripOption[i].saleTotal;

               console.log("saletotal    " + $scope.saleTotal);

               console.log("hiiiiiiiii");
               for (var j = 0; j < $scope.dArray.trips.tripOption[i].slice.length; j++) {
                   $scope.duration = $scope.dArray.trips.tripOption[i].slice[j].duration;
                   console.log("duration     " + $scope.duration);

                   if ($scope.dArray.trips.tripOption[i].slice[j].segment.length != 0) {

                       $scope.deptTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].departureTime;
                       $scope.deptTime0 = new Date($scope.deptTime);
                       $scope.deptTime01 = new Date($scope.deptTime0.getTime() + ($scope.deptTime0.getTimezoneOffset() * 60000));
                       $scope.deptTime1 = new Date($scope.deptTime01).toLocaleTimeString();
                       $scope.deptTime2 = new Date($scope.deptTime01).toLocaleDateString();
                       $scope.deptTime3 = $scope.deptTime2 + " " + $scope.deptTime1;
                       console.log("converted time string" + $scope.deptTime2);
                       //                             $scope.deptTime1 = ($scope.deptTime).toDateString();
                       console.log("departure time     " + $scope.deptTime);

                       $scope.origin = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].origin;
                       console.log("origin        " + $scope.origin);

                       $scope.segLength = $scope.dArray.trips.tripOption[i].slice[j].segment.length;
                       $scope.arrivalTime = $scope.dArray.trips.tripOption[i].slice[j].segment[$scope.segLength - 1].leg[0].arrivalTime;
                       console.log("arrivaltime     " + $scope.arrivalTime);
                       $scope.arrivalTime0 = new Date($scope.arrivalTime);
                       $scope.arrivalTime01 = new Date($scope.arrivalTime0.getTime() + ($scope.arrivalTime0.getTimezoneOffset() * 60000));
                       $scope.arrivalTime1 = new Date($scope.arrivalTime01).toLocaleTimeString();
                       $scope.arrivalTime2 = new Date($scope.arrivalTime01).toLocaleDateString();
                       $scope.arrivalTime3 = $scope.arrivalTime2 + " " + $scope.arrivalTime1;
                       $scope.destination = $scope.dArray.trips.tripOption[i].slice[j].segment[$scope.segLength - 1].leg[0].destination;
                       console.log("destination     " + $scope.destination);

                   } else {
                       $scope.deptTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].departureTime;
                       $scope.origin = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].origin;
                       $scope.ariivalTime = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].arrivalTime;
                       $scope.destination = $scope.dArray.trips.tripOption[i].slice[j].segment[0].leg[0].destination;

                   }

                   $scope.fareCalculation = $scope.dArray.trips.tripOption[i].pricing[0].fareCalculation;
                   console.log("farecalculation     " + $scope.fareCalculation);
                   $scope.flights = {
                       "saletotal": $scope.saleTotal,
                       "duration": $scope.duration,
                       "departuretime": $scope.deptTime,
                       "origin": $scope.origin,
                       "arrivaltime": $scope.arrivalTime,
                       "destination": $scope.destination,
                       "farecalculation": $scope.fareCalculation,

                   };
                   $scope.flightsList.push($scope.flights);


               }



           }
           console.log("flightlist " + JSON.stringify($scope.flightsList));

       });
   }*/
        //join group..............................
        //$scope.ftnSearch();
        $scope.joinTheGrp = function (flightData, index) {
                console.log("flightData " + JSON.stringify(flightData));
                var gname = flightData.farecalculation + "-" + flightData.duration;
                console.log("farecal " + gname);
                console.log("origin " + $scope.originCity);
                console.log("destination " + $scope.destinationCity);
                var data = {
                    "groupname": gname,
                    "groupdescription": "hai",
                    "members": $scope.fbId,
                    "origincode": flightData.origin,
                    "destinationcode": flightData.destination,
                    "duration": flightData.duration,
                    "price": flightData.saletotal,
                    "arrivaltime": flightData.arrivaltime,
                    "departuretime": flightData.departuretime,
                    "origincity": $scope.originCity,
                    "destinationcity": $scope.destinationCity

                }

                var req = {
                    method: 'POST',
                    url: 'https://www.colourssoftware.com:3443/Join_Group',
                    data: data
                }
                console.log("data" + JSON.stringify(data));
                $http(req).then(function (response) {
                    console.log("grpdata" + JSON.stringify(response.data));
                    $window.alert("Joined group Successfully");
                    $scope.flightsList.splice(index, 1);
                    $window.reload();
                }, function (response) {
                    console.log(response);
                });
            }
            // chat page.......................................
        $scope.chatPg = function (data) {
            console.log("data " + data);
            // console.log("groupname " + data.groupname);
            $state.go("chatPage", {
                userid: $scope.fbId,
                fname: $scope.fname,
                lname: $scope.lname,
                origin: data.origincode,
                destination: data.destinationcode,
                groupname: data.groupname
            });
        }
        $scope.back = function () {
            $state.go("chat");
        }
    });