let items = new Array(); ///this array contain items list
let selcted_items = new Array(); // contain th ides of the selcted buttons!!!
const auth1 = firebase.auth();

function addDevice() {
    let name = $("input#partname").val() + " ";
    let brand = $("#brand").val(+" ");
    let os = $("#OS").val() + " ";
    let price = "$" + $("input#price").val();
    let url = "pics/catalog/" + $("input#picurl").val();

    var db = firebase.firestore();
    db.collection("shop_list").add({
            OS: os,
            brand: brand,
            model_name: name,
            pic_link: url,
            price: price
        })
        .then(function(docRef) {
            window.alert("DEVICE " + brand + " added successfuly");

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}



function list_items() {


    let element = document.getElementById("catalog");
    var database = firebase.firestore();
    database.collection('shop_list').get().then(function(querySnapshot) {
        let i = 0;
        querySnapshot.forEach(function(doc) {
            let img = document.createElement('img');
            let para = document.createElement("p");
            let os = document.createTextNode(doc.data().OS);
            let brand = document.createTextNode(doc.data().brand);
            let mname = document.createTextNode(doc.data().model_name);
            let price = document.createTextNode(doc.data().price);

            let phone = {
                brand: doc.data().brand,
                model: doc.data().model_name,
                price: handlePrice(doc.data().price)
            };

            items.push(phone);

            img.src = doc.data().pic_link;
            img.style.display = "block";
            img.height = "auto";
            img.width = "100%";
            img.style.border = "solid black";

            let cartbtn = document.createElement("button");

            cartbtn.className = "btn btn-secondary";
            cartbtn.id = i;
            cartbtn.type = "button";
            cartbtn.style.position = "relative";
            cartbtn.style.left = "40%";
            cartbtn.appendChild(document.createTextNode("Add To Cart 🛒"));

            para.appendChild(os);
            para.appendChild(brand);
            para.appendChild(mname);
            para.appendChild(price);
            para.appendChild(img);
            para.appendChild(cartbtn);
            element.appendChild(para);

            para.style.backgroundColor = "white";
            para.style.borderRadius = "5px";
            para.style.margin = "10px"

            i++;
        });

        $("button").click(function() {
            selcted_items.push(this.id);
            addToCart(this.id);
            window.alert(items[this.id].model + "added to your cart - dont forget to confirm your order!");
        });

    });
}




function handlePrice(str) {
    //deleting $ to convert price from string to integer
    var res = "";
    for (var j = 1; j < str.length; j++) {
        res += str[j];
    }
    return res;
}