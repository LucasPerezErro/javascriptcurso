const divProductos = document.getElementById("divProductos")


const consultarProductos = async () => {
    const response = await fetch('../json/comingsoon.json')
    const productos = await response.json()
    return productos
}

consultarProductos().then(productos => {
    productos.forEach((producto) => {
        divProductos.innerHTML += `
        <div data-id=${producto.id} class="pro card-item">
        <img src="../img/products/${producto.img}" alt="">
        <div class="details">
            <h3>${producto.title}</h3>
            <span class="Description:">${producto.desc}</span>
        </div>
        </div>
        `
    });
})