
const productTable = document.getElementById("productArray");
let buttonSupp = document.getElementById("btnSupp");
let buttonValid = document.getElementById("btnValid");
let form = document.getElementById("formBlock");
let myInput = document.getElementsByTagName("input");
let buttonFinalize = document.getElementById("btnFinalize");
let totalPrice = 0;


// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Affichage de la page en fonction de l'état du panier
window.onload = function loadPage () {

    if (localStorage.getItem("basket") == null) {
        warningEmptyBasket();
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
        const numberOfInputComplete = inputVerification();
        // si le compteur = 5 alors c'est que tous les inputs sont remplis correctement : le boutton devient clickable
        if (numberOfInputComplete == 5) {
            buttonFinalize.disabled = false;
        }
        else {
            buttonFinalize.disabled=true;
        }
        event.stopPropagation();
    });
}

// EVENEMENT - Envoi du formulaire si click (avec vérification : appel fonction avec fetch) 
document.getElementById("form").addEventListener("submit", send);



// ************************** FONCTIONS *************************//
// **************************************************************//

// FONCTION - affichage du panier 
function seeTheStorageInTable(){
    createHtmlTableHeader();
    createTableBody();
    setTimeout(() => { // nécessaire pour avoir le total "correct" sinon il retourne le résultat : 0;
        createHtmlTableTotal(totalPrice);
    }, 100);
}


// FONCTION - récupération du produit (get) avec une promesse
function getItemWithId(productId) {
    return new Promise((resolve, reject) => { // peut aussi s'écrire si pas besoin du product id : const getItemWithId = new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", "http://localhost:3000/api/teddies" + "/" + productId);
        request.onload = () => resolve(JSON.parse(request.responseText));
        request.onerror = () => reject(request.statusText);
        request.send();
    });
}

// FONCTION - Vérification de tous les champs du formulaire
function inputVerification(){
    let counter = 0;
    // boucle pour vérifier que tous les inputs sont remplis
    for (let j = 0; j < myInput.length; j++) { 

        // si l'input est l'email, on va rechercher les caractères "@", le "." apres le arobase et on ne doit pas avoir d'espace (" ").
        if (myInput[j].getAttribute("type") == "email") { 
            if (myInput[j].value.indexOf("@") >= 1 & myInput[j].value.indexOf(".",myInput[j].value.indexOf("@")) != -1 & myInput[j].value.indexOf(" ") == -1) {
                counter += 1;
            }
        }
        else if (myInput[j].value != "")  {
            counter += 1;
        }
    }
    return counter;
}


// FONCTION - affichage du panier vide
function warningEmptyBasket(){
    productTable.textContent="Votre panier est vide";
}

// FONCTION - affichage de l'élément sélectionné (bouton / formulaire)
function blockVisible(booleanStatus,eltSelect){
    if (booleanStatus == true & eltSelect === form){
        eltSelect.style.display = "block";
    }
    else if (booleanStatus == false){
        eltSelect.style.display = "none";
    }
}

// FONCTION - Utilisation d'un fetch pour envoyer la requete du "post" (et récupération de l'orderId)
function send(e) {
    e.preventDefault();

    // vérification des données qui vont être envoyées au serveur : formulaire + panier non vide) 
    if (inputVerification()==5 & localStorage.getItem("basket") != null) {
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
        fetch("http://localhost:3000/api/teddies/order", {
          method: "POST",
          headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonBody)
        })
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function(value) {
            
            // calcul du totalPrice revenu avec le "post"
            let orderPrice = 0;
            for (let i = 0; i < value.products.length; i++) {
                orderPrice += value.products[i].price / 100;
            }
            // rajout à l'url de la page "order.html" la référence de la commande (revenue du "post") et du prix total calculé (totalPrice)
            window.location.assign("order.html?"+ "order=" + value.orderId + "&price=" + orderPrice);
        });
    }
    // si les données transmises ne sont pas bonnes, alors on affiche un message d'erreur et on raffraichit la page (si erreur du localstorage)
    else {
        alert("Une erreur est survenue, merci de bien vouloir essayer de nouveau");
        location.reload();
    }
  }
  


// FONCTION - Création du corps du tableau (avec tous les éléments du panier) 
function createTableBody() {
    
    let itemId = JSON.parse(localStorage.getItem("basket"));
    
    for (let i = 0; i < itemId.length; i++) {
        getItemWithId(itemId[i]).then((value) => {
            createHtmlItems(value);
            totalPrice += value.price / 100; 
        });
    }
    
}

// FONCTION - création de l'item "carte" et de l'entête du tableau
function createHtmlTableHeader(){
    let array = document.createElement("table");
    array.classList.add("table","table-striped","table-bordered");
    array.innerHTML = "<thead><tr><th>Id</th><th>Nom</th><th>Prix</th></tr></thead><tbody></tbody>";
    productTable.appendChild(array);
    let headOfTable = document.getElementsByTagName("thead");
    headOfTable[0].classList.add("bg-secondary");
}

// FONCTION - Création des éléments du storage => les numéros correspondent à l'emplacement dans l'architecture à partir du bloc "tbody" 
function createHtmlItems(productItem){
    let array = document.getElementsByTagName("tbody"); // c'est le 0
    
    // 1 -- Création d'une ligne du tableau
    let rowTable = document.createElement("tr");
    array[0].appendChild(rowTable);

    // 2 -- colonne ID
    let productId = document.createElement("td");
    productId.textContent=productItem._id;
    rowTable.appendChild(productId);

    // 2 -- colonne Name
    let productName = document.createElement("td");
    productName.textContent=productItem.name;
    rowTable.appendChild(productName);

    // 2 -- colonne Prix
    let productPrice = document.createElement("td");
    productPrice.textContent=productItem.price  / 100 + " €";
    rowTable.appendChild(productPrice);
    
}

// FONCTION - création du tableau "total commande"
function createHtmlTableTotal(price){

    // 0 -- création de la table 
    let array = document.createElement("table");
    array.classList.add("table","table-striped","table-bordered","col-6","text-center","ml-auto","mr-auto");
    productTable.appendChild(array);

    // 1 -- création du corp de la table
    let bodyOfArray = document.createElement("tbody");
    array.appendChild(bodyOfArray);

    // 2 -- total + prix
    let rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Total</th>";
    bodyOfArray.appendChild(rowTable);

    let total = document.createElement("td");
    total.textContent= price + " €";
    rowTable.appendChild(total);

    // 2 -- TVA + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>dont TVA à 20%</th>";
    bodyOfArray.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= Math.trunc(price * 0.2) + " €";
    rowTable.appendChild(total);

    // 2 -- coût de livraison + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Coût de livraison</th>";
    bodyOfArray.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= "0 €";
    rowTable.appendChild(total);

    // 2 -- Total commande + prix
    rowTable = document.createElement("tr");
    rowTable.innerHTML = "<th>Total de la commande</th>";
    bodyOfArray.appendChild(rowTable);

    total = document.createElement("td");
    total.textContent= price + " €";
    rowTable.appendChild(total);
}
