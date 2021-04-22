

// affichage des éléments dans un tableau
function afficherLaReponse(retour){
    
    // création de l'item "carte"
    let carte = document.createElement("table");
    carte.classList.add("table","table-striped","table-bordered");
    carte.innerHTML = "<tr><th>Id</th><th>Nom</th><th>Prix</th></tr>";
    elt.appendChild(carte);

    // création des éléments présents dans le local storage

    let k = 0;
    for (let i = 0; i < localStorage.getItem("panier").length; i++) {
        for (let j = 0; j < retour.length; j++) {
            if (JSON.parse(localStorage.getItem("panier"))[i] == retour[j]._id) {
                let ligneTableau = document.createElement("tr");
                carte.appendChild(ligneTableau);

                // colonne ID
                let teddiesId = document.createElement("td");
                teddiesId.textContent=retour[j]._id;
                ligneTableau.appendChild(teddiesId);

                // colonne Name
                let teddiesName = document.createElement("td");
                teddiesName.textContent=retour[j].name;
                ligneTableau.appendChild(teddiesName);

                // colonne Prix
                let teddiesPrix = document.createElement("td");
                teddiesPrix.textContent=retour[j].price  / 100 + " €";
                ligneTableau.appendChild(teddiesPrix);

                k += (retour[j].price  / 100);
            }
        }
        
    }

    // création du tableau "total commande"

    carte = document.createElement("table");
    carte.classList.add("table","table-striped","table-bordered","col-6","text-center");
    elt.appendChild(carte);

    // Total + prix
    let ligneTableau = document.createElement("tr");
    ligneTableau.innerHTML = "<th>Total</th>";
    carte.appendChild(ligneTableau);

    let total = document.createElement("td");
    total.textContent= k + " €";
    ligneTableau.appendChild(total);

    // TVA + prix
    ligneTableau = document.createElement("tr");
    ligneTableau.innerHTML = "<th>dont TVA à 20%</th>";
    carte.appendChild(ligneTableau);

    total = document.createElement("td");
    total.textContent= Math.trunc(k * 0.2) + " €";
    ligneTableau.appendChild(total);

    // coût de livraison + prix
    ligneTableau = document.createElement("tr");
    ligneTableau.innerHTML = "<th>Coût de livraison</th>";
    carte.appendChild(ligneTableau);

    total = document.createElement("td");
    total.textContent= "0 €";
    ligneTableau.appendChild(total);

    // Total commande + prix
    ligneTableau = document.createElement("tr");
    ligneTableau.innerHTML = "<th>Total de la commande</th>";
    carte.appendChild(ligneTableau);

    total = document.createElement("td");
    total.textContent= k + " €";
    ligneTableau.appendChild(total);
}



  // affichage du panier rempli
function affichageTableau(){
    
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            afficherLaReponse(response);
            console.log(response);
        }
    };
    requete.open("GET", "http://localhost:3000/api/teddies");
    requete.send();
};

// affichage du panier vide
function WarningPanierVide(){
    elt.textContent="Votre panier est vide";
}

const elt = document.getElementById("product_tableau");

// vérifier l'état du panier
if (localStorage.getItem("panier") == null) {
    WarningPanierVide();
}
else {
    affichageTableau();
}

console.log(localStorage.getItem("panier"));