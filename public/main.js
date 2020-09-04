const auth = firebase.auth();
var currentUser = null;
var cartShopCnt = 0;


function openPage(pageName) {

    $('#mainframe').attr('src', pageName + ".html")
}

function openPage2(pageName) {

    $('#mainframe2').attr('src', pageName + ".html")
}


function showSignIn() {

    console.log("clicked")

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
        var errorMessage = error.message;
        alert(errorCode)

        if (errorCode == "auth/user-not-found" || errorCode == "auth/invalid-email" || errorCode == "auth/wrong-password") {
            $("#sign_in_error").show();
            $("#sign_in_error").text("user not found please sign up")
            $("#email_input").css("border-color", "red")
            $("#password_input").css("border-color", "red")
        }
    });
}


/*---------   sign up function  ---------*/
function signUp() {

    $("#sign_up_error").hide();
    $("#sign_up_success").hide();
    $("#fullname_signup").css("border-color", "#ccc");
    $("#email_signup").css("border-color", "#ccc");
    $("#password_signup").css("border-color", "#ccc");
    var email = $("#email_signup").val();
    var pass = $("#password_signup").val();
    var fullname = $("#fullname_signup").val();
    let res = /^[a-zA-Z ]+$/.test(fullname);
    if (res == false) {
        $("#sign_up_error").text("enter your name");
        $("#fullname_signup").css("border-color", "red");
        $("#sign_up_error").show();
        return;
    }

    $("#sign_up_success").show();

    auth.createUserWithEmailAndPassword(email, pass).then(function(user) {

        if (user) {
            let brand = $('#phone_brand_selector').val();
            firebase.database().ref('users/' + user.uid).set({
                fullname: fullname,
                brand: brand
            });

            $("#sign_up_toast").toast('show');
            currentUser = user;
            currentUser.fullname = fullname;
            currentUser.brand = brand;
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
        if (errorCode == "auth/weak-password") {
            $("#sign_up_error").text("weak password")
            $("#password_signup").css("border-color", "red")
            $("#sign_up_error").show();
        }
    });
    $('signUpModal').hide();
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
    return firebase.ref('/users/' + user.uid).once('value').then(function(snapshot) {
        currentUser.fullname = snapshot.val().fullname;
        currentUser.brand = snapshot.val().brand;
        saveUserCookie(currentUser);
        $('#signInModal').hide();
        $("#myacc").html(currentUser.fullname + "שלום");
    });
}


function saveUserCookie(user) {
    var jsonUser = 'user={"uid":"' + user.uid + '","fullname":"' + user.fullname + '","car":"' + user.car + '"}';
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
    $("#user_full_name_header").text("hi " + currentUser.fullname)
    $("#userInfoModal").modal("toggle");
    var car = currentUser.car.split("_");
    $("#car_year_info").val(car[2]);
    $("#car_make_info").val(car[0]);
    $("#car_model_info").val(car[1]);
    //alert();

}

function getUserFromCookies() {
    var cookies = decodeURIComponent(document.cookie);
    var arr = cookies.split(";");
    for (var i = 0; i < arr.length; i++) {
        //console.log(arr[i])
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