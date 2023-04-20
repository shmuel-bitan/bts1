const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
async function fetchApi() {    
let basketArrayFull = []; 
let basketClassFull = JSON.parse(localStorage.getItem("kanapLs"));
if (basketClassFull !== null) {
for (let g = 0; g < basketClassFull.length; g++) {
	await fetch("https://kanap-rfoz.onrender.com/api/products/" + basketClassFull[g].idSelectedProduct)
		.then((res) => res.json())
		.then((canap) => {
			const article = {
				_id: canap._id,
				name: canap.name,
				price: canap.price,
				color: basketClassFull[g].colorSelectedProduct,
				quantity: basketClassFull[g].quantity,
				alt: canap.altTxt,
				img: canap.imageUrl,
			};
			basketArrayFull.push(article); 
		})
		.catch(function (err) {
			console.log(err);
		});
}
}
return basketArrayFull;
};


async function showBasket() {
	const responseFetch = await fetchApi(); 
	const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
	if (basketValue !== null && basketValue.length !== 0) {
		const zonePanier = document.querySelector("#cart__items");
		responseFetch.forEach((product) => { 
			zonePanier.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src= "${product.img}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
		});
	} else {
		return messagePanierVide(); 
	}

};
function getBasket() {  
    return JSON.parse(localStorage.getItem("kanapLs"));
};


async function modifyQuantity() {
	await fetchApi();
	const quantityInCart = document.querySelectorAll(".itemQuantity");
	for (let input of quantityInCart) {
		input.addEventListener("change", function () {
			let basketValue = getBasket();
			let idModif = this.closest(".cart__item").dataset.id;
			let colorModif = this.closest(".cart__item").dataset.color;
			let findId = basketValue.filter((e) => e.idSelectedProduct === idModif);
			let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
			if (this.value > 0) {
				findColor.quantity = this.value;
				localStorage.setItem("kanapLs", JSON.stringify(basketValue));
				calculQteTotale();
				calculPrixTotal();
			} else {
				calculQteTotale();
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

async function removeItem() {
	await fetchApi();
	const kanapDelete = document.querySelectorAll(".deleteItem"); //crée un tableau avec les boutons suppr
	kanapDelete.forEach((article) => {
		article.addEventListener("click", function (event) {
			let basketValue = getBasket();
			//On récupère l'ID de la donnée concernée
			const idDelete = event.target.closest("article").getAttribute("data-id");
			//On récupère la couleur de la donnée concernée
			const colorDelete = event.target
				.closest("article")
				.getAttribute("data-color");
			const searchDeleteKanap = basketValue.find(  // on cherche l'élément du Ls concerné 
				(element) => element.idSelectedProduct == idDelete && element.colorSelectedProduct == colorDelete
			);
			basketValue = basketValue.filter(  // et on filtre le Ls avec l'élément comme modèle
				(item) => item != searchDeleteKanap
			);
			localStorage.setItem("kanapLs", JSON.stringify(basketValue)); // on met à jour le Ls
			const getSection = document.querySelector("#cart__items");
			getSection.removeChild(event.target.closest("article")); // on supprime l'élément du DOM
			alert("article supprimé !");
			calculQteTotale();
			calculPrixTotal();  // on met à jour les qty et prix dynamiquement
		});
	});
	if (getBasket() !== null && getBasket().length === 0) {
		localStorage.clear();       //////// si le Ls est vide, on le clear et on affiche le message 
		return messagePanierVide();
	}
};
removeItem();

/// Initialisation des fonctions ///////////

main();

async function main() {
showBasket();         
removeItem();		 
modifyQuantity();	 

calculQteTotale();	 
calculPrixTotal();
};


function calculQteTotale() {
	let basketValue = getBasket();
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; 
	if (basketValue === null || basketValue.length === 0) {
		messagePanierVide();
	} else {
	for (let kanap of basketValue) {
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		zoneTotalQuantity.textContent = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	}
}};

async function calculPrixTotal() {
	const responseFetch = await fetchApi();
	let basketValue = getBasket();
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    for (let p = 0; p < responseFetch.length; p++) { //produit du prix unitaire et de la quantité
	let sousTotal = parseInt(responseFetch[p].quantity) * parseInt(responseFetch[p].price);
	finalTotalPrice.push(sousTotal);

	const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des prix du tableau par reduce
	zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
}};

modifyQuantity();
removeItem();



localStorage.setItem("kanapLs", JSON.stringify(basketValue));

const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");

const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/; 
const regexCity = regexFirstName;
const regexEmail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

function messagePanierVide() {
	const cartTitle = document.querySelector(
		"#limitedWidthBlock div.cartAndFormContainer > h1"
	);
	const emptyCartMessage = "Oups ! Votre panier est vide !";
	cartTitle.textContent = emptyCartMessage;
	cartTitle.style.fontSize = "40px";

	document.querySelector(".cart__order").style.display = "none"; 
	document.querySelector(".cart__price").style.display = "none";
};

const zoneOrderButton = document.querySelector("#order");

zoneOrderButton.addEventListener("click", function(e) {
    e.preventDefault(); // on empeche le formulaire de fonctionner par defaut si aucun contenu

    // recupération des inputs du formulaire //

    let checkFirstName = inputFirstName.value;
    let checkLastName = inputLastName.value;
    let checkAddress = inputAddress.value;
    let checkCity = inputCity.value;
    let checkEmail = inputEmail.value;

    // mise en place des conditions de validation des champs du formulaire //

function orderValidation() {
	zoneFirstNameErrorMsg.innerHTML = "";
	zoneLastNameErrorMsg.innerHTML = "";
	zoneAddressErrorMsg.innerHTML = "";
	zoneCityErrorMsg.innerHTML = "";
	zoneEmailErrorMsg.innerHTML = "";


    let basketValue = getBasket();

    if (regexFirstName.test(checkFirstName) == false || checkFirstName === "") {
        zoneFirstNameErrorMsg.innerHTML = "Merci de renseigner un prénom valide";
        return false;
    } else if (
        regexLastName.test(checkLastName) == false ||
        checkLastName === ""
    ) {
        zoneLastNameErrorMsg.innerHTML = "Merci de renseigner un nom de famille valide";
        return false;
    } else if (
        regexAddress.test(checkAddress) == false ||
        checkAddress === ""
    ) {
        zoneAddressErrorMsg.innerHTML =
            "Merci de renseigner une adresse valide (Numéro, voie, nom de la voie, code postal)";
        return false;
    } else if (regexCity.test(checkCity) == false || checkCity === "") {
        zoneCityErrorMsg.innerHTML = "Merci de renseigner un nom de ville valide";
        return false;
    } else if (regexEmail.test(checkEmail) == false || checkEmail === "") {
        zoneEmailErrorMsg.innerHTML =
            "Merci de renseigner une adresse email valide";
        return false;
    }
    // si tous les champs du formulaire sont correctement remplis //
    else {
		let contact = {
            firstName: checkFirstName,
            lastName: checkLastName,
            address: checkAddress,
            city: checkCity,
            email: checkEmail,
        };
        let products = [];
		
		for (let canapId of basketValue) {
            products.push(canapId.idSelectedProduct);
        }

        let finalOrderObject = { contact, products };
		const orderId = fetch("https://kanap-rfoz.onrender.com/api/products/order", {
            method: "POST",
            body: JSON.stringify(finalOrderObject),
            headers: {
                "Content-type": "application/json",
            },
        });
        orderId.then(async function (response) {
            // réponse de l'API //
            const retour = await response.json();
            //renvoi vers la page de confirmation avec l'ID de commande //
            window.location.href = `confirmation.html?orderId=${retour.orderId}`;
        }) 
    }
}

orderValidation();
});
