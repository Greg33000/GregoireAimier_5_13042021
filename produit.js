
// Création élément + ajout DOM
function creationEnfant(valeur,element){
    // création de la section
    let bloc_peluche = document.createElement("section");
    bloc_peluche.id = valeur._id;
    bloc_peluche.classList.add("container","box_peluche--dim");
    element.appendChild(bloc_peluche);

    // // création de l'élément lien
    // let lien = document.createElement("a");
    // lien.classList.add("stretched-link");
    // lien.setAttribute("href","produit.html");
    // bloc_peluche.appendChild(lien);

    // création de l'élément titre
    let titre = document.createElement("h2");
    titre.textContent=valeur.name;
    titre.classList.add("col","text-center","box_peluche--titre");
    bloc_peluche.appendChild(titre);

    // création de l'article
    let bloc_article = document.createElement("article");
    bloc_article.classList.add("row");
    bloc_peluche.appendChild(bloc_article);

    // création de l'élément image
    let image = document.createElement("img");
    image.classList.add("col","image--dim");
    image.setAttribute("src",valeur.imageUrl);
    bloc_article.appendChild(image);

    // création du bloc test
    let bloc_txt = document.createElement("div");
    bloc_txt.classList.add("col");
    bloc_article.appendChild(bloc_txt);

    // création de la description pour le bloc test
    let description = document.createElement("p");
    description.classList.add("row");
    description.textContent=valeur.description;
    bloc_txt.appendChild(description);

    // création du bloc des données supplémentaires
    let bloc_info = document.createElement("div");
    bloc_info.style.height = "60%";
    bloc_info.classList.add("row");
    bloc_txt.appendChild(bloc_info);

    // création de la liste des coloris possibles
    let txt_coloris = document.createElement("p");
    txt_coloris.textContent="Couleurs :";
    txt_coloris.classList.add("col-3");
    bloc_info.appendChild(txt_coloris);

    // création de la liste des coloris possibles
    let liste_coloris = document.createElement("ul");
    liste_coloris.classList.add("col-4");
    bloc_info.appendChild(liste_coloris);

    // création de la liste des coloris possibles avec boucle pour chaque couleur
    for (let j = 0; j < valeur.colors.length; j++) {
        let coloris = document.createElement("li");
        coloris.textContent=valeur.colors[j];
        // coloris.classList.add("row");
        liste_coloris.appendChild(coloris);
    }   

    // création du prix
    let prix = document.createElement("p");
    prix.textContent=valeur.price / 100 + " €";
    prix.classList.add("col","align-self-end","text-center","price");
    bloc_info.appendChild(prix);
 
}


// affichage des éléments
function afficherLaReponse(retour){
    let elt = document.getElementById("product-state");
        creationEnfant(retour,elt);
        console.log(retour.colors);
        // elt.textContent=retour[i].colors;
        
}


var request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        afficherLaReponse(response);
        console.log(response);
  }
};



var urlcourante = document.location.href; 
  
// Gardons dans la variable queue_url uniquement la portion derrière le dernier slash de urlcourante
queue_url = urlcourante.substring (urlcourante.lastIndexOf( "?" )+1 );
request.open("GET", "http://localhost:3000/api/teddies" + "/" + queue_url);
request.send();


