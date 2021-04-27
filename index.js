// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Lance la fonction qui affiche la quantité du panier (basket)
window.onload = function loadPage () {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let response = JSON.parse(this.responseText);
            // boucle sur chaque "item" récupéré et création de la structure html pour chaque élément
            for (let i = 0; i < response.length; i++) {
                createProductContainer(response[i]);
            }
        }
    };
    request.open("GET", "http://localhost:3000/api/teddies");
    request.send();
};



// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - définir l'élément cliqué dans les sections créées => Utiliser une promise?
var clickPage1 = document.getElementsByTagName("section");
setTimeout(() => {
    
    for (let i = 0; i < clickPage1.length; i++) {
        clickPage1[i].addEventListener('click', function(event) {
            let click_id = clickPage1[i].getAttribute("id");
            console.log(click_id);
            event.stopPropagation();
            
            // rajout à l'url du fichier "product" l'id du produit choisi pour pouvoir l'afficher
            window.location.assign("product.html?"+ click_id);
        });
    }
}, 100);


// ************************** FONCTIONS *************************//
// **************************************************************//

// FONCTION - Création élément + ajout DOM

let productBlock = document.getElementById("productBlock");

function createProductContainer(product){ //product 
    
    // création de la section et rajout au DOM
    let productContainer = document.createElement("section");
    productContainer.id = product._id;
    productContainer.classList.add("container","box__product");
    productBlock.appendChild(productContainer);

    // création de l'élément titre
    let title = document.createElement("h2");
    title.textContent=product.name;
    title.classList.add("col","text-center","box__title");
    productContainer.appendChild(title);

    // création de l'article
    let blockArticle = document.createElement("article");
    blockArticle.classList.add("row");
    productContainer.appendChild(blockArticle);

    // création de l'élément image
    let image = document.createElement("img");
    image.classList.add("col","image--dim");
    image.setAttribute("src",product.imageUrl);
    blockArticle.appendChild(image);

    // création du bloc test
    let blockText = document.createElement("div");
    blockText.classList.add("col");
    blockArticle.appendChild(blockText);

    // création de la description pour le bloc test
    let description = document.createElement("p");
    description.classList.add("row");
    description.textContent=product.description;
    blockText.appendChild(description);

    // création du bloc des données supplémentaires
    let blockInfo = document.createElement("div");
    blockInfo.style.height = "60%";
    blockInfo.classList.add("row");
    blockText.appendChild(blockInfo);

    // création de la liste des coloris possibles
    let colorText = document.createElement("p");
    colorText.textContent="Couleurs :";
    colorText.classList.add("col-3");
    blockInfo.appendChild(colorText);

    // création de la liste des coloris possibles
    let blockColor = document.createElement("ul");
    blockColor.classList.add("col-4");
    blockInfo.appendChild(blockColor);

    // boucle pour chaque couleur
    for (let j = 0; j < product.colors.length; j++) {
        let colorList = document.createElement("li");
        colorList.textContent=product.colors[j];
        blockColor.appendChild(colorList);
    }   

    // création du prix
    let price = document.createElement("p");
    price.textContent=product.price / 100 + " €";
    price.classList.add("col","align-self-end","text-center","price");
    blockInfo.appendChild(price);

}