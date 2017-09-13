var app = angular.module("logApp", [])
    .controller("logCtrl", function ($scope, $http, $state, $window) {
        window.fbAsyncInit = function () {
            FB.init({
                appId: "214238962389773",
                status: true,
                cookie: true,
                xfbml: true,
                oauth: true
            });
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(function (response) {
                        $window.location.reload();
                        //                        FB.Auth.setAuthResponse(null, 'unknown');
                        /** Afer logout, Refresh the Page **/
                        console.log('Logout Successfully.');
                        document.getElementById('currentStatus').innerHTML = 'Logout from facebook Successfully.';
                        $window.location.reload();
                        $state.go("login");
                        //document.location.href='/';
                        /** Afer logout, Refresh the Page **/

                    });
                } else {
                    //                    document.location.href = '/login';
                    document.getElementById('currentStatus').innerHTML = 'You are NOT LOGIN in Facebook.';
                    console.log('You are not login in Facebook.')
                }
            });


        };
        (function (d) {
            var js, id = 'facebook-jssdk';
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            d.getElementsByTagName('head')[0].appendChild(js);
        }(document));

    })