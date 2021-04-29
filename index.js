let clickProduct = document.getElementsByTagName("section");
let productBlock = document.getElementById("productBlock");
let maxProductPerPage = 10;

// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Lancement de la récupération des produit afin de les afficher 
window.onload = function loadPage () {

   // lancement de la requete (promesse) et si "ok", on créé le html
    getAllItems().then((value) => {
        let maxItemOfThisPage = 0;

        // vérification qu'on ne dépasse pas le nombre de produit max défini par page et on créé les fiches articles
        if (value.length > maxProductPerPage) {
            maxItemOfThisPage = maxProductPerPage;
        } else {
            maxItemOfThisPage = value.length;
        }
        for (let i = 0; i < maxItemOfThisPage; i++) {
            createProductContainer(value[i]);
        }
    });
};

// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - Au click sur un produit, on affiche la page du produit
setTimeout(() => { // Set time out : attend que la page soit créée avant de vérifier le add Event listener    
    for (let i = 0; i < clickProduct.length; i++) {
        clickProduct[i].addEventListener('click', function(event) {
            
            // recherche de l'Id du produit cliqué
            let productId = clickProduct[i].getAttribute("id");
            event.stopPropagation();
            
            // ouverture de la page produit en y incluant l'id du produit cliqué (pour être récupérable lors du chargement de la page produit)
            window.location.assign("product.html?"+ productId);
        });
    }
}, 100);



// ************************** FONCTIONS *************************//
// **************************************************************//


// FONCTION - récupération des produits (get) avec une promesse
function getAllItems() {
    return new Promise((resolve, reject) => { // peut aussi s'écrire si pas besoin du product id : const getItemWithId = new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", "http://localhost:3000/api/teddies");
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

    // 1 -- création d'un bloc pour toutes les autres informations ("article")
    let blockArticle = document.createElement("article");
    blockArticle.classList.add("row");
    productContainer.appendChild(blockArticle);

    // 2 -- création de l'élément image => image du produit = taille prédéfinie dans le css
    let image = document.createElement("img");
    image.classList.add("col","image--dim");
    image.setAttribute("src",product.imageUrl);
    blockArticle.appendChild(image);

    // 2 -- création du bloc qui va contenir la désignation / les couleurs et le prix
    let blockText = document.createElement("div");
    blockText.classList.add("col");
    blockArticle.appendChild(blockText);

    // 3 -- création de la description du produit 
    let description = document.createElement("p");
    description.classList.add("row");
    description.textContent=product.description;
    blockText.appendChild(description);

    // 3 -- création du bloc des données supplémentaires (couleurs et coloris)
    let blockInfo = document.createElement("div");
    blockInfo.style.height = "60%";
    blockInfo.classList.add("row");
    blockText.appendChild(blockInfo);

    // 4 -- création d'un paragraphe qui contient le mot "couleur"
    let colorText = document.createElement("p");
    colorText.textContent="Couleurs :";
    colorText.classList.add("col-3");
    blockInfo.appendChild(colorText);

    // 4 -- création du bloc (liste) des couleurs
    let blockColor = document.createElement("ul");
    blockColor.classList.add("col-4");
    blockInfo.appendChild(blockColor);

    // 5 -- création d'une ligne (liste) qui boucle sur chaque couleur disponibles du produit
    for (let j = 0; j < product.colors.length; j++) {
        let colorList = document.createElement("li");
        colorList.textContent=product.colors[j];
        blockColor.appendChild(colorList);
    }   
    // 4 -- création du prix
    let price = document.createElement("p");
    price.textContent=product.price / 100 + " €";
    price.classList.add("col","align-self-end","text-center","price");
    blockInfo.appendChild(price);
}