class CartItem {
    constructor(name, desc, img, price) {
        this.name = name
        this.desc = desc
        this.img = img
        this.price = price
        this.quantity = 1
    }
}

class LocalCart {
    static key = "cartItems"

    static getLocalCartItems() {
        let cartMap = new Map()
        const cart = localStorage.getItem(LocalCart.key)
        if (cart === null || cart.length === 0) return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item) {
        let cart = LocalCart.getLocalCartItems()
        if (cart.has(id)) {
            let mapItem = cart.get(id)
            mapItem.quantity += 1
            cart.set(id, mapItem)
        }
        else
            cart.set(id, item)
        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()

    }

    static removeItemFromCart(id) {
        let cart = LocalCart.getLocalCartItems();
        if (cart.has(id)) {
            let mapItem = cart.get(id)
            if (mapItem.quantity > 1) {
                mapItem.quantity -= 1
                cart.set(id, mapItem)
                //console.log(mapItem.name)
                //eliminarProductoCarritoRepetido(mapItem.name, mapItem.quantity);
            }
            else {
                //eliminarProductoCarrito(mapItem.name);
                cart.delete(id)
            }
        }
        if (cart.length === 0)
            localStorage.clear()
        else
            localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUI()
    }
}

document
    .getElementsByClassName("checkout")[0]
    .addEventListener("click", buyButtonClicked);

// PRODUCTOS

let productosTotales = [];

const cartIcon = document.querySelector('.fa-cart-arrow-down')
const wholeCartWindow = document.querySelector('.whole-cart-window')
wholeCartWindow.inWindow = 0
const divProductoss = document.getElementById('divProductos')
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
console.log(addToCartBtns)
//console.log(addToCartBtns)
addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', addItemFunction)
})

function addItemFunction(e) {
    const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id")
    const img = e.target.parentElement.parentElement.previousElementSibling.src
    const name = e.target.parentElement.previousElementSibling.textContent
    const desc = e.target.parentElement.children[0].textContent
    let price = e.target.parentElement.children[1].textContent
    price = price.replace("Price: $", '')
    const item = new CartItem(name, desc, img, price);
    LocalCart.addItemToLocalCart(id, item)
    
}


cartIcon.addEventListener('mouseover', () => {
    if (wholeCartWindow.classList.contains('hide'))
        wholeCartWindow.classList.remove('hide')
})

cartIcon.addEventListener('mouseleave', () => {
    
    setTimeout(() => {
        if (wholeCartWindow.inWindow === 0) {
            wholeCartWindow.classList.add('hide')
        }
    }, 500)

})

wholeCartWindow.addEventListener('mouseover', () => {
    wholeCartWindow.inWindow = 1
})

wholeCartWindow.addEventListener('mouseleave', () => {
    wholeCartWindow.inWindow = 0
    wholeCartWindow.classList.add('hide')
})


function updateCartUI() {
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML = ""
    const items = LocalCart.getLocalCartItems()
    //console.log(items);
    if (items === null) return
    let count = 0
    let total = 0
    for (const [key, value] of items.entries()) {
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price * value.quantity
        price = Math.round(price * 100) / 100
        count += 1
        total += price
        total = Math.round(total * 100) / 100
        cartItem.innerHTML =
            `
        <img src="${value.img}"> 
                       <div class="details">
                           <h3>${value.name}</h3>
                           <p>${value.desc}
                            <span class="quantity">Quantity: ${value.quantity}</span>
                               <span class="price">Price: $ ${price}</span>
                           </p>
                       </div>
                       <div class="cancel"><i class="fas fa-window-close"></i></div>
        `
        cartItem.lastElementChild.addEventListener('click', () => {
            LocalCart.removeItemFromCart(key)
        })
        cartWrapper.append(cartItem)
    }

    if (count > 0) {
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `SubTotal: $${total}`
    }
    else
        cartIcon.classList.remove('non-empty')

    return items
}
document.addEventListener('DOMContentLoaded', () => { updateCartUI() })


// Buy Button
function buyButtonClicked() {
    const itemsFinales = updateCartUI();
    let mensaje = '';
    let i = 0;
    let precioFinal = 0;
    for (const [key, value] of itemsFinales.entries()) {
        mensaje += (i + 1) + ") " + value.name + " x" + value.quantity + " " + value.price + " -- "
        precioFinal += value.quantity * parseFloat(value.price.replace('$', ''));
        i++
    }
    //setTimeout(function () { localStorage.clear() }, 1000)
    localStorage.clear()
    location.href = "https://api.whatsapp.com/send?phone=5491162518551&text=Hola ¿cómo estas? Me gustaria realizar el siguiente pedido: " + mensaje + " -------> TOTAL: $" + precioFinal.toFixed(2);
}