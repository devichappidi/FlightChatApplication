var user = angular.module("userApp", [])
    .controller("userCtrl", function ($scope, $http, $stateParams, $state, $window) {
        $scope.userData = $state.params.userData;
        $scope.fbId = $state.params.userfbid;
        console.log("userinfo " + JSON.stringify($scope.userData));
        $scope.data = true;
        $scope.addbtn = true;
        $scope.about;
        $scope.showText = function () {
            document.getElementById("data").value = "";
            $scope.data = false;
        }
        $scope.screenHeight = $window.innerHeight;
        $scope.save = function () {
            $scope.about = document.getElementById("data").value;
            $scope.data = true;
            console.log("aboutme" + $scope.about);
            /* $("#butn").hide();*/

            /*$("#adbtnn").hide();*/
            var data = {
                "aboutme": $scope.about,
                "id": $scope.fbId
            }
            var req = {
                method: 'PUT',
                url: 'https://www.colourssoftware.com:3443/Add_Aboutme',
                data: data
            }
            $http(req).then(function (response) {
                console.log("addedbyadmin" + JSON.stringify(response.data));
                document.getElementById("abt").innerHTML = $scope.about;
                window.alert("description about you added Successfully");
            }, function (response) {
                console.log("error" + response);
            });
            /*$scope.$apply();*/
        }
        $scope.cancel = function () {
            /*$("#butn1").hide();*/
            $scope.data = true;
        }

    })