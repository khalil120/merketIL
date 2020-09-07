let auth = firebase.auth();
let first_time = true;
var currentUser = null;
var cartShopCnt = 0;
let User_id = null;
let mobileMode = false;


function openPage(pageName) {

    $('#mainframe').attr('src', pageName + ".html");
}

function openPage2(pageName) {

    $('#mainframe2').attr('src', pageName + ".html");
}


function showSignIn() {

    var user = getUserFromCookies();
    if (user == null) {
        $('#signInModal').modal('toggle');
    } else {
        currentUser = user;
        showUserInfoModal();
        setUserOrders();
    }
}

/*---------   sign in function  ---------*/
function signIn() {
    var mail = $("#email_input").val();
    var pass = $("#password_input").val();
    auth.signInWithEmailAndPassword(mail, pass).then(function(user) {

        if (user) {
            getUser(user);
        }
    }, function(error) {
        var errorCode = error.code;
        alert(errorCode)

        if (errorCode == "auth/user-not-found" || errorCode == "auth/invalid-email" || errorCode == "auth/wrong-password") {
            $("#sign_in_error").show();
            $("#sign_in_error").text("user not found please sign up")
            $("#email_input").css("border-color", "red")
            $("#password_input").css("border-color", "red")
        }
    });

    $('#signInModal').modal('hide');

}


/*---------   sign up function  ---------*/
function signUp() {

    $("#sign_up_success").hide();
    $("#fullname_signup").css("border-color", "#ccc");
    $("#email_signup").css("border-color", "#ccc");
    $("#password_signup").css("border-color", "#ccc");
    var email = $("#email_signup").val();
    var pass = $("#password_signup").val();
    var shoPass = false
    if (pass.length < 6) {
        shortPass = true;
        pass = "";
    }
    var fullname = $("#fullname_signup").val();
    let res = /^[a-zA-Z ]+$/.test(fullname);
    if (res == false) {
        $("#sign_up_error").text("enter your name");
        $("#fullname_signup").css("border-color", "red");
        $("#sign_up_error").show();
        return;
    }



    auth.createUserWithEmailAndPassword(email, pass).then(function(user) {

        if (user) {
            let brand = $('#phone_brand_selector').val();
            uid = auth.currentUser.uid;
            firebase.database().ref('users/' + uid).set({
                fullname: fullname,
                brand: brand
            });

            $("#sign_up_toast").toast('show');
            currentUser = user;
            currentUser.fullname = fullname;
            currentUser.brand = brand;

            window.alert("Signup is Done - Welcome: " + fullname);
        }
    }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == "auth/email-already-in-use") {
            $("#sign_up_error").text("email already in use")
            $("#email_signup").css("border-color", "red")
            $("#sign_up_error").show();
        }
        if (errorCode == "auth/invalid-email") {
            $("#sign_up_error").text("invalid email")
            $("#email_signup").css("border-color", "red")
            $("#sign_up_error").show();
        }
        if (errorCode == "auth/weak-password" || shortPass) {
            $("#sign_up_error").text("weak password")
            $("#password_signup").css("border-color", "red")
            $("#sign_up_error").show();
        }
    });
    $('#signUpModal').modal('hide');
    $('#signInModal').modal('hide');

}




function getUserFromCookies() {
    var cookies = decodeURIComponent(document.cookie);
    var arr = cookies.split(";");
    for (var i = 0; i < arr.length; i++) {
        var cookie = arr[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf("user=") == 0) {
            userJson = cookie.substring("user=".length, cookie.length);
            return JSON.parse(userJson);
        }
    }
    return null;
}

function getUser(user) {
    currentUser = user;
    uid = auth.currentUser.uid;
    return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
        currentUser.fullname = snapshot.val().fullname;
        currentUser.brand = snapshot.val().brand;
        saveUserCookie(currentUser);
        $('#signInModal').hide();
        $("#myacc").html("Hi " + currentUser.fullname);
    });
}


function saveUserCookie(user) {
    var jsonUser = 'user={"uid":"' + user.uid + '","fullname":"' + user.fullname + '","brand":"' + user.brand + '"}';
    document.cookie = jsonUser;
}

function logout() {
    deleteAllCookies();
    $("#msgContent").html("bye bye " + currentUser.fullname)
    $('.toast').toast('show');
    currentUser = null;
    $('#userInfoModal').modal('hide');
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


function showUserInfoModal() {
    $("#user_full_name_header").text("Hi " + currentUser.fullname)
    $("#userInfoModal").modal("toggle");


}

function getUserFromCookies() {
    var cookies = decodeURIComponent(document.cookie);
    var arr = cookies.split(";");
    for (var i = 0; i < arr.length; i++) {
        var cookie = arr[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf("user=") == 0) {
            userJson = cookie.substring("user=".length, cookie.length);
            return JSON.parse(userJson);
        }
    }
    return null;
}

function setUserOrders() {
    $('#ordersTableBody').empty();

    return firebase.database().ref('/orders/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            $('#ordersTableBody').append($(' <tr>\n' +
                '                                    <td>' + childData.named + '</td>\n' +
                '                                    <td>' + childKey + '</td>\n' +
                '                                    <td>' + childData.date + '</td>\n' +
                '                                    <td>' + childData.qtyd + '</td>\n' +
                '                                    <td>' + childData.totald + '</td>\n' +
                '                                </tr>'));


        });

    })
}


function secure() {

    if (currentUser.fullname == "Admin")
        openPage('adminPage');
    else
        window.alert("Sorry " + currentUser.fullname + "You cant access this page");


}


function addToCart(index) {
    var company = String(items[index].brand);
    var m = String(items[index].model);
    var phone = company + m;
    var quanity = 1;
    var price = items[index].price;
    addlist(index, phone, price, 1, parseInt(price));
}

function onResizeWindow() {
    var w = window.outerWidth;
    if (w <= 1050 && mobileMode == false) {
        mobileMode = true;
        $('#full_page_header').hide();
        $('#mobile_page_header').show();
    }
    if (w > 1050) {
        mobileMode = false;
        $('#full_page_header').show();
        $('#mobile_page_header').hide();
    }


}