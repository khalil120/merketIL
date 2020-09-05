const auth = firebase.auth();
//var database = firebase.database();

var currentUser = null;
var cartShopCnt = 0;
let User_id = null;


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
        var errorMessage = error.message;
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
            firebase.database().ref('users/' + user.uid).set({
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
        if (errorCode == "auth/weak-password") {
            $("#sign_up_error").text("weak password")
            $("#password_signup").css("border-color", "red")
            $("#sign_up_error").show();
        }
    });
    $('#signUpModal').modal('hide');

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
    return firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
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

    console.log("11111111111111111111111111111111");
    return firebase.database.ref('/orders/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            $('#ordersTableBody').append($(' <tr>\n' +
                '                                    <td>' + childSnapshot.val().model + '</td>\n' +
                '                                    <td>' + childSnapshot.val().date + '</td>\n' +
                '                                    <td>' + childSnapshot.val().status + '</td>\n' +
                '                                    <td>' + childSnapshot.val().price + '</td>\n' +
                '                                    <td>' + '<button type="button" class="btn btn-primary delete_btn" onclick="showOrder(' + "'" + childKey + "'" + ')">show</button>' + '</td>\n' +
                '                                </tr>'));


        });

    })
}

function showEditCarDiv() {
    $("#car_info_div").hide();
    $("#car_update_div").show();
}




function showOrder(order_id) {
    $("#orderShopTableBody").empty();
    $('#orderModal').modal('toggle');
    return database.ref('/orders/' + order_id).once('value').then(function(snapshot) {
        var shopArr = JSON.parse(snapshot.val().shop)
        for (var i = 0; i < shopArr.shop.length; i++) {
            $('#orderShopTableBody').append($(' <tr id="' + shopArr.shop[i].part_id + '">\n' +
                '                                    <td class="partname">' + '' + '</td>\n' +
                '                                    <td class="partprice">' + '' + '</td>\n' +
                '                                    <td class="qty">' + shopArr.shop[i].qty + '</td>\n' +
                '                                    <td class="totalQtyPrice">' + '' + '</td>\n' +
                '                                </tr>'));
            firebase.database().ref('/parts/' + shopArr.shop[i].part_id).once('value').then(function(snapshot2) {
                $('#' + snapshot2.key + ' .partname').html(snapshot2.val().name)
                $('#' + snapshot2.key + ' .partprice').html(snapshot2.val().price)
                var qty = $('#' + snapshot2.key + ' .qty').html();
                $('#' + snapshot2.key + ' .totalQtyPrice').html(snapshot2.val().price * qty)

                totalPrice = snapshot2.val().price * qty + totalPrice;
                $("#totalPrice").text("total price: " + totalPrice)
                if (totalPrice > 0) {
                    $('#payBtn').attr("disabled", false);
                }
            });


        }
    });

}


function secure() {

    if (currentUser.fullname == "Admin")
        openPage('adminPage');
    else
        window.alert("Sorry " + currentUser.fullname + "You cant access this page");

    openPage('adminPage');

}