

// affichage des éléments dans un tableau
function afficherLaReponse(retour,EltAModifier){
    
    // création de l'item "carte"
    let carte = document.createElement("table");
    carte.classList.add("table","table-striped","table-bordered");
    carte.innerHTML = "<tr><th>Id</th><th>Nom</th><th>Prix</th></tr>";
    EltAModifier.appendChild(carte);

    // création des éléments présents dans le local storage
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
                teddiesPrix.textContent=retour[j].price;
                ligneTableau.appendChild(teddiesPrix);


            }
        }
        
    }
}



  // affichage du panier rempli
function affichageTableau(elemt){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        afficherLaReponse(response,elemt);
    }
    request.open("GET", "http://localhost:3000/api/teddies");
    request.send();
};


}

// affichage du panier vide
function WarningPanierVide(elemt){
    elemt.textContent="Votre panier est vide";
}

const elt = document.getElementById("product_tableau");

// vérifier l'état du panier
if (localStorage.getItem("panier") == null) {
    WarningPanierVide(elt);
}
else {
    affichageTableau(elt);
}
console.log(elt);
console.log(localStorage.getItem("panier"));