import { listadoArticulos } from "../app.js";
export function plantilla_articulos(
  title,
  description,
  precio,
  img,
  id
) {
  const articulo = document.createElement("div");
  articulo.className = 'col-md-6 col-xl-4 mt-4'
  articulo.innerHTML = `
                    <div class="card h-100 w-100 p-2">
                      <img src="${img}" class="card-img-top m-auto w-75" height='auto' alt="...">

                      <div class="card-body row align-items-end">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <p>Precio: US$ <span>${precio}</span></p>
                        <a href="#" class="col-6 col-xxl-5 mx-auto btn buttons text-white agregar-carrito" data-id="${id}">Agregar al Carrito</a>
                      </div>
                    </div>`;
  listadoArticulos.appendChild(articulo);
}
