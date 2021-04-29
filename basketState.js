let btnOrder = document.getElementById("btnOrder");
let basketSuppression = document.getElementById("btnSupp");
let clickBasket = document.getElementById("btnBasket");

// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// Lance la fonction qui affiche la quantité du panier (basket)
seeQtyInBasket();


// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - Click sur le bouton "Ajouter au panier"
if (btnOrder != null) {
    btnOrder.addEventListener('click', function(event) {
        let containerSelection= document.getElementsByTagName("section");
        let productId = containerSelection[0].getAttribute("id");
        addToBasket(productId);
        event.stopPropagation();        
    });
}

// EVENEMENT - Click sur le bouton "Vider le panier"
if (basketSuppression != null) {
    basketSuppression.addEventListener('click', function(event) {
        if (confirm("Voulez-vous vraiment supprimer l'ensemble de votre panier?")) { // message de confirmation de la suppression du panier
            localStorage.clear();
            // seeQtyInBasket();
            location.reload();
        }
        event.stopPropagation();
    });
}

// EVENEMENT - Click sur l'icone panier (qui accède à la page "basket.html")
clickBasket.addEventListener('click', function(event) {
    window.location.assign("basket.html");
    event.stopPropagation();
});



// ************************** FONCTIONS *************************//
// **************************************************************//

// FONCTION - Affichage de la quantité du panier
function seeQtyInBasket() {
    let visuOfBasketQty = document.getElementById("poQty");
    
    // si le local storage est vide, nous n'affichons rien
    if (localStorage.getItem("basket") == null) {
        visuOfBasketQty.textContent="";
    }
    // sinon nous affichons la quantité d'éléments présents dans le local storage
    else {
        visuOfBasketQty.textContent=JSON.parse(localStorage.getItem("basket")).length;
    }
}

// Fonction - ajouter au panier
function addToBasket(productId){
    // récupération des données du local storage
    let storageData = JSON.parse(localStorage.getItem("basket"));

    // Définition d'un tableau à intégrer dans le local storage
    let basket = new Array();
    
    if (storageData == null) {
        basket[0] = productId;
    }
    else {
        let doubleData = false;
        for (let i = 0; i < storageData.length; i++) {

            // vérification si l'id existe déjà dans le local storage
            if (storageData[i] == productId) {
                doubleData= true;
            }
            basket[i]=storageData[i];
        }
        if (doubleData == false) {
            basket[storageData.length] = productId;
        }
        else{
            alert("Cet article est déjà dans votre panier")
        }
    }
    // Sauvegarder dans le local storage
    localStorage.setItem("basket", JSON.stringify(basket));

    // lancer l'affichage du panier (quantité)
    seeQtyInBasket();
}