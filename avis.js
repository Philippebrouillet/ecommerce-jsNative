export function ajoutListenersAvis() {
  const piecesElements = document.getElementsByClassName("btn");

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      const id = event.target.dataset.id;
      let avis = window.localStorage.getItem("avis");
      if (avis === null) {
        // Récupération des pièces depuis l'API
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        avis = await reponse.json();
        // Transformation des pièces en JSON
        const valeurAvis = JSON.stringify(avis);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("avis", valeurAvis);
      } else {
        avis = JSON.parse(avis);
      }

      const pieceElement = event.target.parentElement;
      const avisElement = document.createElement("p");
      avisElement.className = "text";
      for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `${avis[i].utilisateur}: ${avis[i].commentaire} <br>`;
      }
      console.log(avisElement);

      pieceElement.appendChild(avisElement);
    });
  }
}

export function ajoutListenerEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: event.target.querySelector("[name=note]").value,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    });
    /* ... */
  });
}

export async function afficherGraphiqueAvis() {
  // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
  const avis = await fetch("http://localhost:8081/avis").then((avis) =>
    avis.json()
  );

  const nb_commentaires = [0, 0, 0, 0, 0];

  for (let commentaire of avis) {
    nb_commentaires[commentaire.nbEtoiles - 1]++;
  }
  // Légende qui s'affichera sur la gauche à côté de la barre horizontale
  const labels = ["5", "4", "3", "2", "1"];
  // Données et personnalisation du graphique
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Étoiles attribuées",
        data: nb_commentaires.reverse(),
        backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
      },
    ],
  };
  // Objet de configuration final
  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y",
    },
  };
  // Rendu du graphique dans l'élément canvas
  const graphiqueAvis = new Chart(
    document.querySelector("#graphique-avis"),
    config
  );

  // Récupération des pièces depuis le localStorage
  const piecesJSON = window.localStorage.getItem("pieces");
  //const pieces = piecesJSON ? JSON.parse(piecesJSON) : [];
  const pieces = JSON.parse(piecesJSON);
  // Calcul du nombre de commentaires
  let nbCommentairesDispo = 0;
  let nbCommentairesNonDispo = 0;
  //if(pieces.length > 0){
  for (let i = 0; i < avis.length; i++) {
    const piece = pieces.find((p) => p.id === avis[i].pieceId);

    if (piece) {
      if (piece.disponibilite) {
        nbCommentairesDispo++;
      } else {
        nbCommentairesNonDispo++;
      }
    }
  }

  // Légende qui s'affichera sur la gauche à côté de la barre horizontale
  const labelsDispo = ["Disponibles", "Non dispo."];

  // Données et personnalisation du graphique
  const dataDispo = {
    labels: labelsDispo,
    datasets: [
      {
        label: "Nombre de commentaires",
        data: [nbCommentairesDispo, nbCommentairesNonDispo],
        backgroundColor: "rgba(0, 230, 255, 1)", // turquoise
      },
    ],
  };

  // Objet de configuration final
  const configDispo = {
    type: "bar",
    data: dataDispo,
  };

  // Rendu du graphique dans l'élément canvas
  new Chart(document.querySelector("#graphique-dispo"), configDispo);
}
