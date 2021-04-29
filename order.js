let orderRow = document.getElementById("orderId");
let priceRow = document.getElementById("totalPrice");

// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// récupération de l'url (et des paramètres)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Récupération de chaque paramètre de l'url
const orderIdNumber = urlParams.get('order');
orderRow.textContent = "Votre commande porte le numéro : " + orderIdNumber;

const orderTotalPrice = urlParams.get('price');
priceRow.textContent = "Le total de votre commande est de : " + orderTotalPrice + " €";


// si les paramètres sont OK, on vide le panier, sinon non (histoire de ne pas avoir à tout refaire si jeamais il y a un pb)
if (orderIdNumber != "" & orderTotalPrice != "" ) {
    localStorage.clear();
}


// ************************* EVENEMENTS *************************//
// **************************************************************//




// ************************** FONCTIONS *************************//
// **************************************************************//

