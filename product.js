// ******************** CHARGEMENT DE LA PAGE *******************//
// **************************************************************//

// CHARGEMENT - Lance la fonction qui affiche la quantité du panier (basket)
window.onload = function loadPage () {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let response = JSON.parse(this.responseText);
            createProductContainer(response);
        }
    };

    // Récupérer l'id présent dans l'url
    let actualUrl = document.location.href; 
    endOfUrl = actualUrl.substring (actualUrl.lastIndexOf( "?" )+1 );
    // Lancement de la requete "get"
    request.open("GET", "http://localhost:3000/api/teddies" + "/" + endOfUrl);
    request.send();
};


// ************************* EVENEMENTS *************************//
// **************************************************************//

// EVENEMENT - bouton "commander" non clickable si une couleur n'est pas sélectionnée
let btnOrdered = document.getElementById("btnOrder");
let selection = document.getElementsByTagName("select");

setTimeout(() => {
    // Quand une nouvelle <option> est selectionnée
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

// FONCTION - Création élément + ajout DOM

let productBlock = document.getElementById("productSelection");

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

    // création de la liste des coloris possibles avec une selection
    let blockColor = document.createElement("select");
    blockColor.classList.add("col-4", "form-control");
    blockInfo.appendChild(blockColor);

    // Création de la séléction par défaut à l'ouverture de la page
    let option = document.createElement("option");
    option.setAttribute("selected","selected");
    option.textContent="Choisissez";
    blockColor.appendChild(option);

    // boucle pour chaque couleur
    for (let j = 0; j < product.colors.length; j++) {
        let colorList = document.createElement("option");
        colorList.textContent=product.colors[j];
        blockColor.appendChild(colorList);
    }   

    // création du prix
    let price = document.createElement("p");
    price.textContent=product.price / 100 + " €";
    price.classList.add("col","align-self-end","text-center","price");
    blockInfo.appendChild(price);

}

