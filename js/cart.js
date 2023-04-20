const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
async function fetchApi() {    
let basketArrayFull = []; 
let basketClassFull = JSON.parse(localStorage.getItem("kanapLs"));
if (basketClassFull !== null) {
for (let g = 0; g < basketClassFull.length; g++) {
	await fetch("https://kanap-rfoz.onrender.com:10000/api/products/" + basketClassFull[g].idSelectedProduct)
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
showBasket();         ////// affichage du DOM ( avec rappel du fetchApi //////
removeItem();		  ////// suppression dynamique des articles du panier et 
modifyQuantity();	  ////// modification des quantités

calculQteTotale();	  ////// mise à jour dynamique des quantités et prix totaux
calculPrixTotal();
};


function calculQteTotale() {
	let basketValue = getBasket();
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
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

/**functionmessagePanierVide(){
	const cartTitle = document.querySelector(
		" div.cart"
	)
};*/

localStorage.setItem("kanapLs", JSON.stringify(basketValue));

