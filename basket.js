
const productTable = document.getElementById("productArray");
let buttonSupp = document.getElementById("btnSupp");
let buttonValid = document.getElementById("btnValid");
let form = document.getElementById("formBlock");
let myInput = document.getElementsByTagName("input");
let buttonFinalize = document.getElementById("btnFinalize");



// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Affichage de la page en fonction de l'état du panier
window.onload = function loadPage () {

    if (localStorage.getItem("basket") == null) {
        WarningEmptyBasket();
        blockVisible(false,buttonValid);
        blockVisible(false,buttonSupp);
        blockVisible(false,form);
    }
    else {
        seeTheStorageInTable();
        blockVisible(true,buttonValid);
        blockVisible(true,buttonSupp);
        blockVisible(false,form);
    }
};



// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - Affichage du formulaire lors du click sur le bouton de validation de la commande
buttonValid.addEventListener('click', function(event) {
    blockVisible(true,form);
    event.stopPropagation();
});

// EVENEMENT - Affichage du bouton de finalisation de la commande quand tous les champs sont valides 
// email pour "email" et champs non vides quand "texte"
for (let i = 0; i < myInput.length; i++) { 
    myInput[i].addEventListener('input', function(event) {
        let compt = 0;
        for (let j = 0; j < myInput.length; j++) { 
            if (myInput[j].getAttribute("type") == "email") {
                validEmail = false;
                for (let k = 1 ; k < myInput[j].value.length ; k++){
                    if (myInput[j].value.charAt(k) == "@") {
                        if (k < (myInput[j].value.length-4)) {
                            for (let l = k ; l < (myInput[j].value.length-2) ; l++){
                                if (myInput[j].value.charAt(l) == ".") {
                                    validEmail = true;
                                }
                            }
                        }
                    }
                }
                if (validEmail == true) {
                    compt += 1;
                }
            }
            else if (myInput[j].value != "")  {
                compt += 1;
            }
        }
        if (compt == 5) {
            buttonFinalize.disabled = false;
        }
        else {
            buttonFinalize.disabled=true;
        }
        event.stopPropagation();
    });
}


// ************************** FONCTIONS *************************//
// **************************************************************//

// FONCTION - affichage du panier 
function seeTheStorageInTable(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            createHtmlItems(response);
            // console.log(response);
        }
    };
    request.open("GET", "http://localhost:3000/api/teddies");
    request.send();
};

// FONCTION - affichage du panier vide
function WarningEmptyBasket(){
    productTable.textContent="Votre panier est vide";
}

// FONCTION - affichage de l'élément sélectionné
function blockVisible(booleanStatus,eltSelect){
    if (booleanStatus == true & eltSelect === form){
        eltSelect.style.display = "block";
    }
    else if (booleanStatus == false){
        eltSelect.style.display = "none";
    }
}


// FONCTION - affichage des éléments dans un tableau
function createHtmlItems(productItem){
    
    // création de l'item "carte"
    let carte = document.createElement("table");
    carte.classList.add("table","table-striped","table-bordered");
    carte.innerHTML = "<tr><th>Id</th><th>Nom</th><th>Prix</th></tr>";
    productTable.appendChild(carte);

    // création des éléments présents dans le local storage

    let countBasket = 0;
    for (let i = 0; i < localStorage.getItem("basket").length; i++) {
        for (let j = 0; j < productItem.length; j++) {
            if (JSON.parse(localStorage.getItem("basket"))[i] == productItem[j]._id) {
                let rowTable = document.createElement("tr");
                carte.appendChild(rowTable);

                // colonne ID
                let productId = document.createElement("td");
                productId.textContent=productItem[j]._id;
                rowTable.appendChild(productId);

                // colonne Name
                let productName = document.createElement("td");
                productName.textContent=productItem[j].name;
                rowTable.appendChild(productName);

                // colonne Prix
                let productPrice = document.createElement("td");
                productPrice.textContent=productItem[j].price  / 100 + " €";
                rowTable.appendChild(productPrice);

                countBasket += (productItem[j].price  / 100);
            }
        }
        
    }

    // création du tableau "total commande"

    carte = document.createElement("table");
    carte.classList.add("table","table-striped","table-bordered","col-6","text-center","ml-auto","mr-auto");
    productTable.appendChild(carte);

    // Total + prix
    let rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Total</th>";
    carte.appendChild(rowTable);

    let total = document.createElement("td");
    total.textContent= countBasket + " €";
    rowTable.appendChild(total);

    // TVA + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>dont TVA à 20%</th>";
    carte.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= Math.trunc(countBasket * 0.2) + " €";
    rowTable.appendChild(total);

    // coût de livraison + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Coût de livraison</th>";
    carte.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= "0 €";
    rowTable.appendChild(total);

    // Total commande + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Total de la commande</th>";
    carte.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= countBasket + " €";
    rowTable.appendChild(total);
}



// envoi du formulaire
function validationFormulaire(){
    let jsonBody = {
        "contact": {
            "firstName" : document.getElementById("firstName").value,
            "lastName" : document.getElementById("lastName").value,
            "email" : document.getElementById("email").value,
            "address" : document.getElementById("address").value,
            "city" : document.getElementById("city").value
        },
        "products": JSON.parse(localStorage.getItem("basket"))
    };
    console.log(JSON.stringify(jsonBody));
    
    let requete = new XMLHttpRequest();

    requete.open("POST", "http://localhost:3000/api/teddies/order");
    requete.setRequestHeader("Content-Type","application/json");
    requete.send(JSON.stringify(jsonBody));
    alert(JSON.stringify(jsonBody));
    alert(JSON.parse(responseText));
    alert(response.json().postData.text);
};

// Action lors du click du bouton du formulaire
btnFinalize.addEventListener('click', function(event) {
    validationFormulaire();
    event.stopPropagation();
    event.preventDefault();
});

// function send(e) {
//     e.preventDefault();
//     fetch("http://localhost:3000/api/teddies", {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json', 
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({firstName: document.getElementById("firstName").value})
//     })
//     .then(function(res) {
//       if (res.ok) {
//         return res.json();
//       }
//     })
//     .then(function(value) {
//         // document
//         //   .getElementById("result")
//         //   .innerText = value.postData.text;
//         console.log(value.postData.text);
//     });
//   }
  
//  let formulaire=document.getElementsByTagName("form");
//  formulaire[0].addEventListener("submit", send);
  