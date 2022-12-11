const divProductos = document.getElementById("divProductos")

const consultarProductos = async () => {
    const response = await fetch('../json/remeras.json')
    const productos = await response.json()
    return productos 
}

consultarProductos().then(productos => {
    productos.forEach((producto) => {
        divProductos.innerHTML += `
        <div class="card cardProducto">
            <img src="./img/${producto.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Modelo: ${producto.modelo}</p>
                    <p class="card-text">Marca: ${producto.marca}</p>
                    <p class="card-text">Precio:$ ${producto.precio}</p>
                    <p class="card-text">Stock: ${producto.stock}</p>
                    <button class="btn btn-dark">Agregar al carrito</button>
                </div>
        </div>
        
        `
    });
})