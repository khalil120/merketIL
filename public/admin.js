function addDevice() {
    let name = $("input#partname").val();
    let brand = $("#brand").val();
    let os = $("#OS").val();
    let model = $("input#model").val();
    let price = $("input#price").val();
    let url = $("input#picurl").val();

    var db = firebase.firestore();
    db.collection("shop_list").add({
            OS: os,
            brand: brand,
            model_name: name,
            pic_link: url,
            price: price
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}




function list_items() {

    console.log("testingggggggggg" + "\n");

    let element = document.getElementById("items_div");
    var database = firebase.firestore();
    database.collection('shop_list').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let img = document.createElement('img');
            let para = document.createElement("p");
            let newLine = document.createElement("br");
            let os = document.createTextNode(doc.data().OS);
            let brand = document.createTextNode(doc.data().brand);
            let mname = document.createTextNode(doc.data().model_name);
            img.src = document.createTextNode(doc.data().pic_link);
            let price = document.createTextNode(doc.data().price);

            let node = document.createTextNode("text us test");




            para.appendChild(os);
            para.appendChild(newLine);
            para.appendChild(brand);
            para.appendChild(newLine);
            para.appendChild(mname);
            para.appendChild(newLine);
            para.appendChild(newLine);
            para.appendChild(price);
            para.appendChild(newLine);
            para.appendChild(newLine);
            para.appendChild(img);
            para.appendChild(node);
            element.appendChild(para);

            para.style.backgroundColor = "LimeGreen";
            para.style.borderRadius = "5px";
            para.style.margin = "10px"
        });
    });
}