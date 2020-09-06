function addDevice() {
    let name = $("input#partname").val();
    let brand = $("#brand").val();
    let os = $("#OS").val();
    let model = $("input#model").val();
    let price = $("input#price").val();
    let tmp = $("input#picurl").val();

    let url = "pics/catalog/" + tmp;

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
            $("#admin-insert")[0].reset(); //check if working ////////////////////////////////

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}



function list_items() {


    let element = document.getElementById("catalog");
    var database = firebase.firestore();
    database.collection('shop_list').get().then(function(querySnapshot) {

        //height="400" width="1000"
        querySnapshot.forEach(function(doc) {
            let img = document.createElement('img');
            let para = document.createElement("p");
            let newLine = document.createElement("br");
            let os = document.createTextNode(doc.data().OS);
            let brand = document.createTextNode(doc.data().brand);
            let mname = document.createTextNode(doc.data().model_name);
            img.src = doc.data().pic_link;
            img.style.display = "block";
            img.height = "auto";
            img.width = "100%";
            img.style.border = "solid black";
            let price = document.createTextNode(doc.data().price);

            let cartbtn = document.createElement("button");

            cartbtn.className = "btn btn-dark";
            cartbtn.type = "button";
            cartbtn.appendChild(document.createTextNode("Add To Cart 🛒"));

            para.appendChild(os);
            para.appendChild(brand);
            para.appendChild(mname);
            para.appendChild(price);
            para.appendChild(img);
            para.appendChild(cartbtn);
            element.appendChild(para);

            para.style.backgroundColor = "darkcyan";
            para.style.borderRadius = "5px";
            para.style.margin = "10px"
        });
    });
}