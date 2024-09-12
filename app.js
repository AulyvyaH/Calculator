'use strict';

let donnees = ''; //chaine de caract�re qui va contenir les donn�es entr�es au clavier et sur les boutons 
let input = document.querySelector("input");
let form = document.querySelector("form");
const buttons = document.querySelectorAll("button");

//flag pour d�terminer si on a appuy� sur Enter ou non pour valider un calcul 
let pressedEqual = false;

//Ajout d'un eventlistener sur l'input, put d�tecter les entr�es clavier
input.addEventListener("keypress", (e) => {
    calc();
})

form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Emp�che le formulaire de se soumettre, et donc de se r�initialisaer,quand on appuie sur Enter
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
    //R�cup�ration des �l�ments entr�s dans l'input, que �a soit par click ou keypressed, dans un string "donnees"
    donnees = document.getElementById("textArea").value;

    if (pressedEqual == true) {
        pressedEqual = false;
        donnees += "=";
    }
    //R�cup�ration du dernier �l�ment entr�
    let donnees_index = donnees.length;
    let dernier_caractere = donnees[donnees_index - 1];

    /*
        Si le dernier �l�ment est un "=" (fin du calcul), on le retire de la string pour �valuation

        Utilisation de la fonction Eval() pour �valuer une expression en string. 
        
        Si le r�sultat de la fonction eval() est Infinity, cela veut dire qu'on a fait une division par 0. 
        On affiche alors un message d'erreur et l'input et la chaine de donn�es sont vid�s.

        Sinon, On affiche le r�sultat dans l'input. On ne vide pas la chaine de donn�es, car on veut pouvoir continuer � calculer. 
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

//On clear la string de donn�es et l'input 
function clear_input() {
    donnees = '';
    document.getElementById("textArea").value = "";
}

//On retire un �l�ment de la string de donn�es et de l'input
function goback() {
    document.getElementById("textArea").value = document.getElementById("textArea").value.slice(0, -1);
    donnees = donnees.slice(0, - 1);
}

/*Fen�tre d'alerte custom, pour g�rer les cas o� il y a division par 0 ou des caract�res 
non reconnus (alphab�tiques), exception non g�r�e si on mix entr�es clavier et boutons*/
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
    /*blur de l'�l�ment input pour mettre le focus sur la fen�tre d'alerte, 
    et permettre � l'utilisateur de fermer la fen�tre d'alerte en appuyant sur Enter (en plus du clic sur le bouton OK)*/
    document.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            document.body.removeChild(alertBox);
            document.querySelector("input").focus();
        }
    });
}