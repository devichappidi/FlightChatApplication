var chatApp = angular.module("grpApp", [])
    .controller("grpChatCtrl", function ($scope, $http, $stateParams, $state, $window) {
        $scope.fname = $state.params.fname;
        $scope.lname = $state.params.lname;
        $scope.user = $scope.fname + " " + $scope.lname;
        console.log("username " + $scope.user);
        $scope.grpName = $state.params.origin + "to" + $state.params.destination;
        $scope.groupname = $state.params.groupname;
        $scope.frndId = $state.params.frndId;
        $scope.fbId = $state.params.userid;
        console.log("origin " + $scope.origin);
        console.log("destination " + $scope.destination);
        $scope.memData = [];
        $scope.membersId = [];
        $scope.membersList = [];
        $scope.oldData = [];
        $scope.arrData = [];
        $scope.userObj = {};
        $scope.userList = [];
        $scope.welcomePg = false;
        $scope.group = true;
        $("#chatForm").hide();
        $('#mySidenav').hide();
        //Enter Option
        document.getElementById("myMsg").addEventListener("keyup", function (event) {
            if (event.keyCode == 13) {
                document.getElementById("sendBtn").click();

            }
        });

        function do_resize(textbox) {
            var maxrows = 10;
            var txt = textbox.value;
            var cols = textbox.cols;
            var arraytxt = txt.split('\n');
            var rows = arraytxt.length;
            for (i = 0; i < arraytxt.length; i++)
                rows += parseInt(arraytxt[i].length / cols);
            if (rows > maxrows) textbox.rows = maxrows;
            else textbox.rows = rows;
        }
        $scope.sideFn = function () {
            if ($window.innerWidth > 768) {
                $('#sideShow').hide();
                $('.chatWidth').css({
                    "width": "100%"
                });
            } else {
                $('#sideShow').show();
                //                var w = $(window).width();
                //                $('.chatWidth').css('width', w);
            }
        }
        $scope.sideFn();

        $(window).resize(function () {
            console.log("screeeeeeen " + window.innerWidth);
            if (window.innerWidth <= 768) {
                $("#sideShow").show();
                document.getElementById("inputBox").style.marginTop = "0";
                //                var w = $(window).width();
                //                $('.chatWidth').css('width', w);
            } else {
                $("#sideShow").hide();
                document.getElementById("mySidenav").style.width = "0";
                $('.chatWidth').css({
                    "width": "100%"
                });
            }
        });
        $scope.screenHeight = $window.innerHeight;
        $scope.members = function () {
            var data = {
                "groupname": $scope.groupname

            }

            var req = {
                method: 'POST',
                url: 'https://www.colourssoftware.com:3443/Groups_List/groupname',
                data: data
            }
            $http(req).then(function (response) {
                console.log("membersid" + JSON.stringify(response.data));
                for (var i = 0; i < response.data.length; i++) {

                    $scope.membersInfo(response.data[i].members);

                }
                //console.log("membersid " + $scope.membersId);

            }, function (response) {
                console.log(response);
            });
        }
        $scope.members();
        $scope.membersInfo = function (memArray) {

            var data = {
                "members": memArray

            }
            console.log("memid " + memArray);
            var req = {
                method: 'POST',
                url: 'https://www.colourssoftware.com:3443/Users_Info',
                data: data
            }
            $http(req).then(function (response) {
                console.log("membersdata" + JSON.stringify(response.data));
                for (var i = 0; i < response.data.length; i++) {
                    $scope.membersList.push(response.data[i]);
                }
                console.log("members " + $scope.membersList);
            }, function (response) {
                console.log(response);
            });
        }
        $scope.userInfo = function (data) {
            console.log("userdata " + JSON.stringify(data));
            $state.go("userPg", {
                userData: data,
                userfbid: $scope.fbId
            })
        }

        //        function openNav() {
        //            document.getElementById("mySidenav").style.width = "250px";
        //        }
        //
        //        function closeNav() {
        //            document.getElementById("mySidenav").style.width = "0";
        //        }
        $scope.sideOpenNav = function () {
            $('#mySidenav').show();
            $('#sideShow').hide();
            document.getElementById("mySidenav").style.width = "300px";
            document.getElementById("div1").style.marginLeft = "300px";
            var wd = window.innerWidth - 280;
            console.log("sidewidthhhh " + wd);
            $('.chatWidth').css('width', wd);
            $(window).resize(function () {
                if (window.innerWidth <= 768) {
                    //                    $("#sideShow").show();
                    //                    document.getElementById("div1").style.marginLeft = "300px";
                    //                    var wd = window.innerWidth + 300;
                    //                    console.log("sidewidthhhh " + wd);
                    //                    $('.chatWidth').css('width', wd);
                } else
                    document.getElementById("div1").style.marginLeft = "0";

            });
        }
        $scope.sideCloseNav = function () {
            $('#mySidenav').hide();
            $('#sideShow').show();
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("div1").style.marginLeft = "0";
            $('.chatWidth').css({
                "width": "100%"
            });
            //            var wd = window.innerWidth;
            //            console.log("sidewidthhhh " + wd);
            //            $('.chatWidth').css('width', wd);
            $(window).resize(function () {
                if (window.innerWidth <= 768) {
                    $('.chatWidth').css({
                        "width": "100%"
                    });
                    //                    $("#sideShow").show();
                    document.getElementById("div1").style.marginLeft = "0";
                    //                    var wd = window.innerWidth;
                    //                    $('.chatWidth').css('width', wd);

                }
            });
        }


        //socket....................................................................................................
        var socket = io('https://colourssoftware.com:3443/chat');
        var username = $scope.fbId;
        console.log("socketuser " + username);
        var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
        var msgCount = 0; //counting total number of messages displayed.
        var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
        var roomId; //variable for setting room.
        var toUser;

        //passing data on connection.
        socket.on('connect', function () {
            socket.emit('set-user-data', username);
        }); //end of connect event.

        //receiving onlineStack.
        socket.on('onlineStack', function (stack) {


            console.log("online data " + JSON.stringify(stack));
            $scope.group = false;
            $('#list').empty();

            $('#list').append($('<button  class="btn btn-primary" id = "gname1"></button>').text($scope.grpName).css({
                "font-size": "13px"
            }));
            var totalOnline = 0;
            $scope.userList.length = 0;
            for (var i = 0; i < $scope.membersList.length; i++) {
                for (var user in stack) {

                    if (user == $scope.membersList[i].id) {
                        var text1 = $scope.membersList[i].firstname;

                        if (stack[user] == "Online") {

                            var txt2 = $('<span></span>').text("*" + stack[user]).css({
                                "float": "right",
                                "color": "#009933",
                                "font-size": "18px"
                            });
                            totalOnline++;
                        } else {
                            var txt2 = $('<span></span>').text("*" + stack[user]).css({
                                "float": "right",
                                "color": "#009933",
                                "font-size": "18px"
                            });
                        }
                        //listing all users.

                        $('#status').append(txt2).css({

                            "font-size": "20px",
                            "float": "right"

                        });

                        $('#img').html('<img src="' + $scope.membersList[i].image + '" class = "img-circle"/>').css({
                            "width": "25",
                            "height": "25"
                        });
                        $('#name').append(txt2).css({
                            "color": "black",
                            "font-size": "20px",


                        });

                        $('#totalOnline').text(totalOnline);
                    } //end of for.
                    $('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));

                }
                $scope.userObj = {
                        firstname: $scope.membersList[i].firstname,
                        lastname: $scope.membersList[i].lastname,
                        image: $scope.membersList[i].image,
                        id: $scope.membersList[i].id,
                        aboutme: $scope.membersList[i].aboutme,
                        status: stack[user]

                    }
                    //console.log("print object" + JSON.stringify($scope.userObj));
                $scope.userList.push($scope.userObj);
                $scope.$apply();
                console.log("print objectarray" + JSON.stringify($scope.userList));

            }
        }); //end of receiving onlineStack event.



        $scope.member;

        //on button click function.
        $scope.memname = function (data) {
            var name;
            toUser = "";
            if (data) {
                console.log("data " + JSON.stringify(data));
                $scope.grpName = data.firstname + " " + data.lastname;
                $scope.member = data.id;
                toUser = $scope.member;
            } else {

                $scope.grpName = document.getElementById("gname1").innerHTML;
                toUser = $scope.grpName;
            }
            console.log("print group name" + $scope.grpName);
            $('#frndName').text($scope.grpName);
            //$(document).on("click", "#ubtn", function () {
            //            $(window).resize(function () {
            //                console.log("screeeeeeen " + window.innerWidth);
            //                if (window.innerWidth <= 768) {
            //                    $("#sideShow").show();
            ////                    var w = $(window).width();
            // //                    $('.chatWidth').css('width', w);
            //
            //                } else {
            //                    $("#sideShow").hide();
            //                    document.getElementById("mySidenav").style.width = "0";
            //                    $('.chatWidth').css({
            //                        "width": "100%"
            //                    });
            //                }
            //            });
            $scope.arrData.length = 0;
            $scope.welcomePg = true;
            $("#chatForm").show();
            document.getElementById("scrl2").style.height = $scope.screenHeight - 190 + "px";
            /*$scope.$apply();*/
            //empty messages.
            $('#messages').empty();
            $('#typing').text("");
            msgCount = 0;
            noChat = 0;
            oldInitDone = 0;
            /*toUser = $(this).text();*/
            console.log("touser " + toUser);
            $('#initMsg').hide();
            $('#chatForm').show();
            //var name = document.getElementById("uname").innerHTML;
            //            console.log("name " + name);
            if (toUser == $scope.grpName) {

                $('#myMsg').show();
                var currentRoom = $scope.groupname + "-" + $scope.groupname;
                var reverseRoom = $scope.groupname + "-" + $scope.groupname;
                /*$('#frndName').text($scope.grpName);*/

            } else {
                var currentRoom = username + "-" + toUser;
                var reverseRoom = toUser + "-" + username;

            }
            //event to set room and join.
            socket.emit('set-room', {
                name1: currentRoom,
                name2: reverseRoom
            });

            console.log("memberid " + $scope.member);
        }


        //}); //end of on button click event.

        //event for setting roomId.
        socket.on('set-room', function (room) {
            //empty messages.
            $('#messages').empty();
            $('#typing').text("");
            msgCount = 0;
            noChat = 0;
            oldInitDone = 0;
            //assigning room id to roomId variable. which helps in one-to-one and group chat.
            roomId = room;
            console.log("roomId : " + roomId);
            //event to get chat history on button click or as room is set.
            socket.emit('old-chats-init', {
                room: roomId,
                username: username,
                msgCount: msgCount
            });

        }); //end of set-room event.

        //on scroll load more old-chats.
        $('#scrl2').scroll(function () {

            if ($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1) {
                $('#loading').show();
                socket.emit('old-chats', {
                    room: roomId,
                    username: username,
                    msgCount: msgCount
                });
            }

        }); // end of scroll event.


        //listening old-chats event
        socket.on('old-chats', function (data) {
            //            $scope.oldmsg = true;
            //            $scope.newmsg = false;
            msgCount = 0;
            console.log("userIds " + JSON.stringify($scope.membersList));
            console.log("oldmessages" + JSON.stringify(data));

            $scope.merid;
            $scope.arrData.length = 0;
            if (data.room == roomId) {
                console.log("arrlength:" + $scope.arrData.length);
                //            $scope.arrData.length = 0;
                console.log("length" + data.result.length);
                oldInitDone = 1; //setting value to implies that old-chats first event is done.
                if (data.length != 0) {
                    $scope.arrData.length = 0;
                    $('#noChat').hide(); //hiding no more chats message.
                    for (var i = data.result.length - 1; i >= 0; i--) {
                        for (var j = 0; j < $scope.membersList.length; j++) {
                            if (data.result[i].msgFrom == $scope.membersList[j].id) {
                                var name = $scope.membersList[j].firstname + " " + $scope.membersList[j].lastname;
                                console.log("username " + name);
                                data.result[i].msgFrom = name;
                                console.log("msgFrom " + data.result[i].msgFrom);
                                break;
                            }
                        }
                        var tdate = moment(data.result[i].createdOn, "x").format("DD MMM YYYY hh:mm a");
                        data.result[i].createdOn = tdate;
                        console.log("createdOn:" + data.result[i].createdOn);
                        $scope.arrData.push(data.result[i]);
                        $scope.$apply();
                        msgCount++;

                    } //end of for
                    console.log("messages" + msgCount);
                    console.log("modified data " + JSON.stringify($scope.arrData));
                } else if (data.length == 0) {

                    $('#noChat').show(); //displaying no more chats message.
                    noChat = 1; //to prevent unnecessary scroll event.
                }
                //hiding loading bar.
                $('#loading').hide();
                //setting scrollbar position while first 5 chats loads.
                if (msgCount <= 5) {
                    $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
                }
            }

        });

        // keyup handler.
        $('#myMsg').keyup(function () {
            if ($('#myMsg').val()) {
                //                                $('#sendBtn').show(); //showing send button.
                socket.emit('typing');
            } else {
                //                                $('#sendBtn').hide(); //hiding send button to prevent sending empty messages.
            }
        }); //end of keyup handler.

        //receiving typing message.
        socket.on('typing', function (msg) {
            console.log("msgs " + msg);
            var arr = [];
            arr = msg.split(" ");
            console.log("arr " + arr[0]);
            console.log("mem " + JSON.stringify($scope.membersList));
            for (var i = 0; i < $scope.membersList.length; i++) {
                console.log("hiii" + typeof ($scope.membersList[i].id));
                console.log("hello" + typeof (arr[0]));
                if ($scope.membersList[i].id === arr[0]) {
                    console.log("haii" + arr[0]);
                    var name = $scope.membersList[i].firstname;
                    msg = name + ":" + "is typing...";
                    console.log("message " + msg);
                    $('#typing').text(msg);
                    break;
                }
            }

            var setTime;
            //clearing previous setTimeout function.
            clearTimeout(setTime);
            //showing typing message.

            //showing typing message only for few seconds.
            setTime = setTimeout(function () {
                $('#typing').text("");
            }, 2000);
        }); //end of typing event.

        //sending message.
        $('form').submit(function () {
            socket.emit('chat-msg', {
                msg: $('#myMsg').val(),
                msgTo: toUser,
                date: Date.now()
            });
            $('#myMsg').val("");
            //                            $('#sendBtn').hide();
            return false;
        }); //end of sending message.

        //receiving messages.
        socket.on('chat-msg', function (data) {
            //styling of chat message.
            console.log("memDATA " + JSON.stringify($scope.membersList));
            console.log("received data" + JSON.stringify(data));
            for (var i = 0; i < $scope.membersList.length; i++) {
                if ($scope.membersList[i].id == data.msgFrom) {
                    var name = $scope.membersList[i].firstname + " " + $scope.membersList[i].lastname;
                    data.msgFrom = name;
                    console.log("msgFrom " + data.msgFrom);
                    break;
                }
            }
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = dd + '/' + mm + '/' + yyyy;
            console.log("today date:" + today);
            var datatime = new Date(Date.now()).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            var date = today + " " + datatime;
            console.log("date&time:" + date);
            data.date = date;
            //            data.date = datatime;
            $scope.arrData.push(data);
            console.log("chatdata:" + JSON.stringify($scope.arrData));
            $scope.$apply();
            msgCount++;
            console.log(msgCount);
            $('#typing').text("");
            $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
        });
        //end of receiving messages.

        //on disconnect event.
        //passing data on connection.
        socket.on('disconnect', function () {
            //showing and hiding relevant information.
            $('#list').empty();
            $('#messages').empty();
            $('#typing').text("");
            $('#frndName').text("Disconnected..");
            $('#loading').hide();
            $('#noChat').hide();
            $('#initMsg').show().text("...Please, Refresh Your Page...");
            $('#chatForm').hide();
            msgCount = 0;
            noChat = 0;
        }); //end of connect event.

    }); //end of function.