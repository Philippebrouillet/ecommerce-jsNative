// Récupération des pièces depuis le fichier JSON

import {
  ajoutListenersAvis,
  ajoutListenerEnvoyerAvis,
  afficherGraphiqueAvis,
} from "./avis.js";

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");
if (pieces === null) {
  // Récupération des pièces depuis l'API
  const reponse = await fetch("http://localhost:8081/pieces");
  pieces = await reponse.json();
  console.log(pieces);
  // Transformation des pièces en JSON
  const valeurPieces = JSON.stringify(pieces);
  // Stockage des informations dans le localStorage
  window.localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

// Creation Affiche de base
function newTab(pieces) {
  pieces.map((piece) => {
    const pieceElement = document.createElement("article");

    const imageElement = document.createElement("img");
    imageElement.src = piece.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = piece.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${piece.prix} € (${
      piece.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = piece.categorie ?? "";
    const paraGraphElement = document.createElement("p");
    paraGraphElement.innerText = piece.description ?? "";
    const dispoElement = document.createElement("p");
    dispoElement.innerText = piece.disponibilite ? "dispo" : "non";

    const avisBouton = document.createElement("button");
    avisBouton.className = "btn";
    avisBouton.dataset.id = piece.id;
    avisBouton.textContent = "Afficher les avis";

    const sectionFiches = document.querySelector(".fiches");
    sectionFiches.appendChild(pieceElement);

    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(paraGraphElement);
    pieceElement.appendChild(dispoElement);
    pieceElement.appendChild(avisBouton);
  });

  ajoutListenersAvis();
}

newTab(pieces);
// suppression du tableau de base et ajout d'un nouveau tableau trié dans l'ordre croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
  const piecesTrier = pieces.sort(function (a, b) {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  newTab(piecesTrier);
});

// suppression du tableau de base et ajout d'un nouveau tableau trié dans l'ordre décroissant
const boutonTrierDecroissant = document.querySelector(".btn-trier2");
boutonTrierDecroissant.addEventListener("click", function () {
  const piecesTrier2 = pieces.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  newTab(piecesTrier2);
});

const boutonFiltrerPrix = document.querySelector(".btn-filtrer");

boutonFiltrerPrix.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
  document.querySelector(".fiches").innerHTML = "";
  newTab(piecesFiltrees);
});

const boutonFiltrerDescription = document.querySelector(".btn-filtrer2");

boutonFiltrerDescription.addEventListener("click", function () {
  const piecesFiltrees2 = pieces.filter(function (piece) {
    return piece.description ? piece : "";
  });
  document.querySelector(".fiches").innerHTML = "";
  newTab(piecesFiltrees2);
});

const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= inputPrixMax.value;
  });
  document.querySelector(".fiches").innerHTML = "";
  newTab(piecesFiltrees);
});

const noms = pieces.map((piece) => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}

//Création de l'en-tête

const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables";

//Création de la liste
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = noms[i];
  abordablesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres

const doc = document.querySelector(".abordables");
doc.appendChild(pElement);
doc.appendChild(abordablesElements);

//Code Exercice
const nomsDisponibles = pieces.map((piece) => piece.nom);

const prixDisponibles = pieces.map((piece) => piece.prix);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].disponibilite === false) {
    nomsDisponibles.splice(i, 1);
    prixDisponibles.splice(i, 1);
  }
}
const disponiblesElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = `${nomsDisponibles[i]}`;
  disponiblesElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles:";
document
  .querySelector(".disponibles")
  .appendChild(pElementDisponible)
  .appendChild(disponiblesElement);

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});

afficherGraphiqueAvis();
