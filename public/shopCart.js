var database = firebase.database();


function addlist(id, name, price, qty, total) {
    var randid = Math.floor(Math.random() * 99999999) + 9999;
    var d = new Date();
    randid = randid + d.getTime();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    firebase.database().ref('/cart/' + randid).set({
        named: name,
        priced: price,
        qtyd: qty,
        totald: total


    });
}

function submitOrder() {
    $('#orderModal').modal('toggle');
    var randid = Math.floor(Math.random() * 99999999) + 9999;
    var d = new Date();
    randid = randid + d.getTime();

    return firebase.database().ref('/cart/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            console.log(childKey);
            $('#orderShopTableBody').append($(
                '<tr id="' + childKey + '">\n' +
                '        <td>  ' + childData.named + '  </td> \n ' +
                '        <td>' + childData.priced + '  </td> \n' +
                '        <td>   ' + childData.qtyd + '</td>\n' +
                '        <td>   ' + childData.totald + '$' + '</td>\n' +

                +'</tr>'
            ));
            firebase.database().ref('/orders/' + randid).set({
                named: childData.named,
                priced: childData.priced,
                qtyd: childData.qtyd,
                totald: childData.totald,
                date: d.getDate()
            });
        });
    })

}

$(document).ready(function() {
    var tt = 0;
    return firebase.database().ref('/cart/').once('value').then(function(snapshot) {


        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            $('#shopCartTableBody').append($(
                '<tr id="' + childKey + '">\n' +
                '        <td>  ' + childData.named + '  </td> \n ' +
                '        <td>' + childData.priced + '  </td> \n' +
                '        <td>   ' + childData.qtyd + '</td>\n' +
                '        <td>   ' + childData.totald + '$' + '</td>\n' +

                +'</tr>'
            ));
            tt += childData.totald;
        });
        $("#totalll").text("Total " + tt + "$");
    })

});