

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
    carte.classList.add("table","table-striped","table-bordered","col-6","text-center","ml-auto","mr-auto");
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
            // console.log(response);
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
let btnVide = document.getElementById("btn-vide");
let btnValid = document.getElementById("btn-valid");
let form = document.getElementById("formulaire");
let myInput = document.getElementsByTagName("input");
let btnFinalize = document.getElementById("btn-finalize");


// affichage de l'élément sélectionné
function eltVisible(retour,eltSelect){
    if (retour == true & eltSelect === form){
        eltSelect.style.display = "block";
    }
    else if (retour == false){
        eltSelect.style.display = "none";
    }
}

// Affichage de la page en fonction de l'état du panier
if (localStorage.getItem("panier") == null) {
    WarningPanierVide();
    eltVisible(false,btnValid);
    eltVisible(false,btnVide);
    eltVisible(false,form);
}
else {
    affichageTableau();
    eltVisible(true,btnValid);
    eltVisible(true,btnVide);
    eltVisible(false,form);
}

// Affichage du formulaire lors du click sur le bouton de validation de la commande
btnValid.addEventListener('click', function(event) {
    eltVisible(true,form);
    event.stopPropagation();
});

// Affichage du bouton de finalisation de la commande quand tous les champs sont valides 
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
                    // myInput[j].classList.add("bg-success");
                }
            }
            else if (myInput[j].value != "")  {
                compt += 1;
                // myInput[j].classList.add("bg-success");
            }
        }
        if (compt == 5) {
            btnFinalize.disabled = false;
        }
        else {
            btnFinalize.disabled=true;
        }
        event.stopPropagation();
    });
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
        "products": JSON.parse(localStorage.getItem("panier"))
    };
    console.log(JSON.stringify(jsonBody));
    
    var requete = new XMLHttpRequest();
    requete.open("POST", "http://localhost:3000/api/teddies/order");
    requete.setRequestHeader("Content-Type","application/json");
    requete.send(JSON.stringify(jsonBody));
    // alert(JSON.stringify(jsonBody));
    alert(JSON.parse(responseText));
};

// Action lors du click du bouton du formulaire
btnFinalize.addEventListener('click', function(event) {
    validationFormulaire();
    event.stopPropagation();
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
  