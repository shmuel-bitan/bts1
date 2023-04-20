fetch("https://kanap-rfoz.onrender.com/api/products")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })

 
  .then(function (elements) {
    // Boucle pour afficher chaque produits present dans l'API.
    for (let element of elements) {
      //Utilisation de la structure HTML utile pour l'affichage des produits. 
      // Appel de l'element parent.
      const items = document.getElementById("items");
      
      let newElt = document.createElement("a");
      newElt.href = `./product.html?id=${element._id}`;
      
      let article = document.createElement("article");
      
      newElt.appendChild(article);
     
      let image = document.createElement("img");
      image.src = element.imageUrl;
      image.alt = element.altTxt;
     
      article.appendChild(image);
      
      let h3 = document.createElement("h3");
      h3.className = "productName";
      h3.textContent = element.name;
      
      article.appendChild(h3);
     
      let p = document.createElement("p");
      p.className = "productDescription";
      p.textContent = element.description;
      
      article.appendChild(p);
      items.appendChild(newElt);
    }
  })
  
  