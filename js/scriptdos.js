// PRODUCTOS

let productosTotales = [];
let cantidadProd = 0

//  Carrito
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Abrir Carrito
cartIcon.onclick = () => {
  cart.classList.add("active");
};

// Cerrar Carrito
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// carrito JS
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

// Making Function
function ready() {
  // Remover Items del Carrito
  let reomveCartButtons = document.getElementsByClassName("cart-remove");
  console.log(reomveCartButtons);
  for (let i = 0; i < reomveCartButtons.length; i++) {
    let button = reomveCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  // cambia la cantidad
  let quantityInputs = document.getElementsByClassName("cart-quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  // agregar al carrito
  let addCart = document.getElementsByClassName("add-cart");
  for (let i = 0; i < addCart.length; i++) {
    let button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  // botton compra
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}
// botton compra
function buyButtonClicked() {
  alert("Your Order is placed");
  let mensaje = '';
  let precioFinal = 0;
  const itemsFinales = getCartItems();
  for (let i = 0; i < itemsFinales.length; i++) {
    mensaje += (i + 1) + ") " + itemsFinales[i].titulo + " x" + itemsFinales[i].cantidad + " " + itemsFinales[i].precio + " -- "
    precioFinal += itemsFinales[i].cantidad * parseFloat(itemsFinales[i].precio.replace('$', ''));
  }

  location.href = "https://api.whatsapp.com/send?phone=5491162518551&text=Hola ¿cómo estas? Me gustaria realizar el siguiente pedido: \n" + mensaje + " -------> \n TOTAL: $" + precioFinal.toFixed(2)

}

// Reomver Items del carrito
function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  const button = event.target;
  let shopProducts = button.parentElement;
  let title = shopProducts.getElementsByClassName("cart-product-title")[0].innerText;
  let pos = 0;
  for (let i = 0; i < productosTotales.length; i++) {
    if (title == productosTotales[i].titulo) {
      pos = i;
    }
  }
  if (pos != 0) {
    productosTotales.splice(pos, 1);
  }

  updatetotal();
}
// cambia la cantidad
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updatetotal();
  return
}
// agregar al carrito
function addCartClicked(event) {
  let button = event.target;
  let shopProducts = button.parentElement;
  let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  let price = shopProducts.getElementsByClassName("price")[0].innerText;
  let productImg = shopProducts.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, productImg);
  updatetotal();

}
function addProductToCart(title, price, productImg) {
  let cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  let cartItems = document.getElementsByClassName("cart-content")[0];
  let cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
  for (let i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      alert("You have already add this item to cart");
      return;
    }
  }
  let cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity font-size:30px">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bxs-trash-alt cart-remove' ></i>`;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);

  productosTotales.push({
    titulo: title,
    precio: price,
    cantidad: 1
  })
}

// Update Total
function updatetotal() {
  let cartContent = document.getElementsByClassName("cart-content")[0];
  let cartBoxes = cartContent.getElementsByClassName("cart-box");
  let total = 0;
  let quantity;
  for (let i = 0; i < cartBoxes.length; i++) {
    let cartBox = cartBoxes[i];
    let titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
    let priceElement = cartBox.getElementsByClassName("cart-price")[0];
    let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    let title = titleElement.innerText;
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    quantity = quantityElement.value;
    total = total + price * quantity;
    for (let i = 0; i < productosTotales.length; i++) {
      if (title == productosTotales[i].titulo) {
        productosTotales[i].cantidad = quantity;
      }
      
    }
  }
  // si el precio tiene centavos
  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

function getCartItems() {
  return productosTotales;
}

