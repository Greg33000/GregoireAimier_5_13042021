
// Attention, si on utilise "get", il faut absolument vérifier si l'url est bonne car les clients peuvent modifier l'url 
//=> prendre en compte l'id de l'élément créé plutot
// retrouver l'id du produit (pour ne pas faire confiance à l'url)


// définir l'élément cliqué dans les sections créées => Utiliser une promise?
let bouton = document.getElementById("btn-cde");
if (bouton != null) {
    bouton.addEventListener('click', function(event) {
        var setEltName = document.getElementsByTagName("section");
        let setEltId = setEltName[0].getAttribute("id");
        AjouterAuPanier(setEltId);
        event.stopPropagation();        
    });
}


// Vider le panier avec message de confirmation
let videPanier = document.getElementById("btn-vide");
if (videPanier != null) {
    videPanier.addEventListener('click', function(event) {
        if (confirm("Voulez-vous vraiment supprimer l'ensemble de votre panier?")) {
            localStorage.clear();
            affichagePanier(0);
            document.location.reload();
        }
        event.stopPropagation();
    });
}

// Fonction : Affichage de la quantité du panier
function affichagePanier(QtyPanier){
    let valPanier = document.getElementById("qty-cde");
    if (QtyPanier == 0) {
        valPanier.textContent="";
    }
    else {
        valPanier.textContent=QtyPanier;
    }
}

// Fonction : ajouter au panier
function AjouterAuPanier(Teddies_id){
    // récupération des données du local storage
    const str = localStorage.getItem("panier");
    let parsedObj = JSON.parse(str);

    // Définition d'un tableau à intégrer dans le local storage
    let panier = new Array();
    
    if (parsedObj == null) {
        panier[0] = Teddies_id;
        console.log(panier);
    }
    else {
        let doublon = false;
        for (let i = 0; i < parsedObj.length; i++) {

            // vérification si l'id existe déjà dans le local storage
            if (parsedObj[i] == Teddies_id) {
                doublon= true;
            }
            panier[i]=parsedObj[i];
        }
        if (doublon == false) {
            panier[parsedObj.length] = Teddies_id;
        }
        else{
            alert("Cet article est déjà dans votre panier")
        }
        console.log(panier);
    }
    // convert object to JSON string
    // using JSON.stringify()
    const jsonObj = JSON.stringify(panier);

    // save to localStorage
    localStorage.setItem("panier", jsonObj);

    // get the string
    // from localStorage
    const verif = localStorage.getItem("panier");
  
    // convert string to valid object
    parsedObj = JSON.parse(verif);
  
    console.log(parsedObj);

    affichagePanier(parsedObj.length)
}


// Afficher panier à l'ouverture de la page
if (localStorage.getItem("panier") == null) {
    affichagePanier(0);
}
else {
    affichagePanier(JSON.parse(localStorage.getItem("panier")).length);
}

let valPanier = document.getElementById("btn-panier");
valPanier.addEventListener('click', function(event) {
    window.location.assign("panier.html");
    event.stopPropagation();
});