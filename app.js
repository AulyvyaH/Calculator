'use strict';

let donnees = ''; //chaine de caractère qui va contenir les données entrées au clavier et sur les boutons 
let input = document.querySelector("input");
let form = document.querySelector("form");
const buttons = document.querySelectorAll("button");

//flag pour déterminer si on a appuyé sur Enter ou non pour valider un calcul 
let pressedEqual = false;

//Ajout d'un eventlistener sur l'input, put détecter les entrées clavier
input.addEventListener("keypress", (e) => {
    calc();
})

form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Empêche le formulaire de se soumettre, et donc de se réinitialisaer,quand on appuie sur Enter
        pressedEqual = true;
        calc();
    }
})

//Ajout d'un eventlistener onclick sur chaque bouton
buttons.forEach(function (button) {
    button.addEventListener("click", (e) => {
        document.getElementById("textArea").value += e.target.value;
        calc();
    });
});


function calc() {
    //Récupération des éléments entrés dans l'input, que ça soit par click ou keypressed, dans un string "donnees"
    donnees = document.getElementById("textArea").value;

    if (pressedEqual == true) {
        pressedEqual = false;
        donnees += "=";
    }
    //Récupération du dernier élément entré
    let donnees_index = donnees.length;
    let dernier_caractere = donnees[donnees_index - 1];

    /*
        Si le dernier élément est un "=" (fin du calcul), on le retire de la string pour évaluation

        Utilisation de la fonction Eval() pour évaluer une expression en string. 
        
        Si le résultat de la fonction eval() est Infinity, cela veut dire qu'on a fait une division par 0. 
        On affiche alors un message d'erreur et l'input et la chaine de données sont vidés.

        Sinon, On affiche le résultat dans l'input. On ne vide pas la chaine de données, car on veut pouvoir continuer à calculer. 
    */
    try {
        if (dernier_caractere == "=") {
            donnees = donnees.slice(0, - 1);
            if (eval(donnees) == "Infinity") {
                clear_input();
                errorMessage("Division par 0 impossible!");
            } else {
                let result = eval(donnees);
                input.value = result.toFixed(2);
            }
        }
    }
    catch (SyntaxError) {
        clear_input();
        errorMessage("Il faudrait peut-\u00EAtre entrer des chiffres entre les op\u00E9rateurs, ou v\u00E9rifier les caract\u00E8res entr\u00E9s?");
    }
}

//On clear la string de données et l'input 
function clear_input() {
    donnees = '';
    document.getElementById("textArea").value = "";
}

//On retire un élément de la string de données et de l'input
function goback() {
    document.getElementById("textArea").value = document.getElementById("textArea").value.slice(0, -1);
    donnees = donnees.slice(0, - 1);
}

/*Fenêtre d'alerte custom, pour gérer les cas où il y a division par 0 ou des caractères 
non reconnus (alphabétiques), exception non gérée si on mix entrées clavier et boutons*/
function errorMessage(message) {
    const alertBox = document.createElement('div');
    alertBox.id = 'custom-alert';
    alertBox.innerHTML = `
      <h2>Oups!</h2>
      <p>${message}</p>
      <button onclick="document.body.removeChild(this.parentElement)">OK</button>
    `;
    document.body.appendChild(alertBox);
    document.querySelector("input").blur();
    /*blur de l'élément input pour mettre le focus sur la fenêtre d'alerte, 
    et permettre à l'utilisateur de fermer la fenêtre d'alerte en appuyant sur Enter (en plus du clic sur le bouton OK)*/
    document.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            document.body.removeChild(alertBox);
            document.querySelector("input").focus();
        }
    });
}