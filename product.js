let btnOrdered = document.getElementById("btnOrder");
let selection = document.getElementsByTagName("select");
let productBlock = document.getElementById("productSelection");


// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Récupère l'id transmis dans l'url et lance la récupération du produit + l'affichage sur la page
window.onload = function loadPage () {

     // Récupérer l'id présent dans l'url
     let actualUrl = document.location.href; 
     endOfUrl = actualUrl.substring (actualUrl.lastIndexOf( "?" )+1 );

    // lancement de la requete (promesse) et si "ok", on créé le html
    getItemWithId(endOfUrl).then((value) => {
        createProductContainer(value);
    });
};


// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - bouton "commander" non clickable si une couleur n'est pas sélectionnée
setTimeout(() => { // on décale dans le temps le addEventListener car les éléments ne sont pas encore créé.
    // Quand une nouvelle <option> est selectionnée on rend le bouton "commander" disponible
    selection[0].addEventListener('change', function() {
        if (selection[0].selectedIndex == 0) {
            btnOrdered.disabled=true;
        }
        else {
            btnOrdered.disabled=false;
        }
    });
}, 100);



// ************************** FONCTIONS *************************//
// **************************************************************//

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


// FONCTION - Création fiche produit + ajout DOM => les numéros correspondent à l'emplacement dans l'architecture à partir du bloc "section" (n°0)
function createProductContainer(product){ 
    
    // 0 -- création de la section "produit" qui créé et affiche les données produit dans le html (rajout au DOM). l'ID de la section = l'ID du produit
    let productContainer = document.createElement("section");
    productContainer.id = product._id;
    productContainer.classList.add("container","box__product");
    productBlock.appendChild(productContainer);

    // 1 -- création de l'élément titre => le nom du produit
    let title = document.createElement("h2");
    title.textContent=product.name;
    title.classList.add("col","text-center","box__title");
    productContainer.appendChild(title);

    // 1 -- création d'un bloc pour toutes les autres informations
    let blockArticle = document.createElement("div");
    blockArticle.classList.add("row");
    productContainer.appendChild(blockArticle);

    // 2 -- création de l'élément image => image du produit = taille prédéfinie dans le css
    let image = document.createElement("img");
    image.classList.add("col","image--dim");
    image.setAttribute("src",product.imageUrl);
    image.setAttribute("alt","image de l'ours en peluche : " & product.name);
    blockArticle.appendChild(image);

    // 2 -- création du bloc qui va contenir la désignation / les couleurs et le prix
    let blockText = document.createElement("div");
    blockText.classList.add("col");
    blockArticle.appendChild(blockText);

    // 3 -- création de la description du produit 
    let description = document.createElement("p");
    // description.classList.add("row");
    description.textContent=product.description;
    blockText.appendChild(description);

    // 3 -- création du bloc des données supplémentaires (couleurs et coloris)
    let blockInfo = document.createElement("div");
    // blockInfo.style.height = "60%";
    blockInfo.classList.add("row","justify-content-between");
    blockText.appendChild(blockInfo);

    // 4 -- création d'un paragraphe qui contient le mot "couleur"
    let colorText = document.createElement("p");
    colorText.textContent="Couleurs";
    colorText.classList.add("col");
    blockInfo.appendChild(colorText);

    // 4 -- création du bloc (selection) des couleurs
    let blockColor = document.createElement("select");
    blockColor.classList.add("col", "form-control","mr-3");
    blockInfo.appendChild(blockColor);

    // 5 -- création de la première ligne (option) selectionnée par défaut => qui demande à choisire une couleur
    let option = document.createElement("option");
    option.setAttribute("selected","selected");
    option.textContent="Choisissez";
    blockColor.appendChild(option);

    // 5 -- création d'une ligne (option) qui boucle sur chaque couleur disponibles du produit
    for (let j = 0; j < product.colors.length; j++) {
        let colorList = document.createElement("option");
        colorList.textContent=product.colors[j];
        blockColor.appendChild(colorList);
    }   

    // 4 -- création du prix
    let price = document.createElement("p");
    price.textContent=product.price / 100 + " €";
    price.classList.add("col","align-self-end","text-center","price");
    blockText.appendChild(price);

}

