var log = angular.module("login", [])
    .controller("loginCtrl", function ($scope, $state, $window) {
        window.fbAsyncInit = function () {
            // FB JavaScript SDK configuration and setup
            FB.init({
                appId: '214238962389773', // FB App ID
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.8' // use graph api version 2.8
            });

            // Check whether the user already logged in
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    //display user data
                    getFbUserData();
                }
            });
        };

        // Load the JavaScript SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Facebook login with JavaScript SDK
        $scope.fbLogin = function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    // Get and display the user profile data
                    getFbUserData();
                } else {
                    document.getElementById('status').innerHTML = 'User cancelled login or did not fully authorize.';
                }
            }, {
                scope: 'email'
            });
        }

        // Fetch the user profile data from facebook
        function getFbUserData() {
            FB.api('/me', {
                    locale: 'en_US',
                    fields: 'id,first_name,last_name,email,link,gender,locale,picture'
                },
                function (response) {
                    console.log("res " + JSON.stringify(response));
                    document.getElementById('fbLink').innerHTML = 'Logout from Facebook';
                    document.getElementById('fbLink').style.display = 'none';
                    document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
                    console.log("userid " + response.id);
                    console.log("fname " + response.first_name);
                    console.log("lname " + response.last_name);
                    console.log("imglink " + response.picture.data.url);
                    $state.go("chat", {
                        userid: response.id,
                        fname: response.first_name,
                        lname: response.last_name,
                        image: response.picture.data.url
                    });
                });
        }


        $scope.hig = $window.innerHeight;
        console.log("height" + $scope.hig);
        // Logout from facebook
        //        function fbLogout() {
        //            FB.logout(function () {
        //                FB.Auth.setAuthResponse(null, 'unknown');
        //                document.getElementById('fbLink').setAttribute("onclick", "fbLogin()");
        //                document.getElementById('fbLink').innerHTML = '<img src="fblogin.png"/>';
        //                document.getElementById('userData').innerHTML = '';
        //                document.getElementById('status').innerHTML = 'You have successfully logout from Facebook.';
        //            });
        //        }


    });