import { plantilla_articulos } from "./js/template.js";
import { articles } from "../js/articles.js";

export const listadoArticulos = document.querySelector("#lista-articulos");
const contenedorCarrito = document.querySelector("#carrito tbody"),
  btnVaciar = document.querySelector(".btn-vaciar"),
  btnComprar = document.querySelector(".btn-comprar"),
  totalTxt = document.querySelector("#total"),
  divExito = document.querySelector("#exito");
let articulosCarrito = [];
let total = 0;

//Cargando Eventos
cargarEventListeners();
function cargarEventListeners() {
  cargarArticulos(articles);
  listadoArticulos.addEventListener("click", agregarArticulo);
  contenedorCarrito.addEventListener("click", eliminarArticulo);
  btnVaciar.addEventListener("click", vaciarCarrito);
  btnComprar.addEventListener("click", comprar);
  // Cargando localstorage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    sumarTotal(articulosCarrito);
    totalHtml();
    carritoHtml();
    habilitar_desabilitar_buttons();
  });
}

//Funciones
function agregarArticulo(e) {
  e.preventDefault();
  
  //seleccionando articulo
  if (e.target.classList.contains("agregar-carrito")) {
    const articuloSeleccionado = e.target.parentElement.parentElement;
    leerDatosArticulo(articuloSeleccionado);
  }

  habilitar_desabilitar_buttons();
  sincronizarStorage();
}


function eliminarArticulo(e) {
  if (e.target.classList.contains("borrar-articulo")) {
    let articuloId = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter(
      (articulo) => articulo.id !== articuloId
    );

    //limpiar el Html y cargar el nuevo array
    carritoHtml();
    SumaEliminar();
    totalHtml();
    sincronizarStorage();
  }

  habilitar_desabilitar_buttons();
}

//Vaciar Carrito
function vaciarCarrito() {
  articulosCarrito = [];
  limpiarHtml();
  sumarTotal(articulosCarrito);
  totalHtml();
  habilitar_desabilitar_buttons();
  sincronizarStorage();
}

//Armando objeto
function leerDatosArticulo(articulo) {
  const datosArticulos = {
    imagen: articulo.querySelector("img").src,
    nombre: articulo.querySelector("h5").textContent,
    precio: articulo.querySelector("p span").textContent,
    cantidad: 1,
    id: articulo.querySelector("a").getAttribute("data-id"),
  };

  //Verificar Articulos existentes
  const existe = articulosCarrito.some(
    (articulo) => articulo.id === datosArticulos.id
  );

  if (existe) {
    //actualizar cantidad
    const articuloVerificado = articulosCarrito.map((articulo) => {
      if (articulo.id === datosArticulos.id) {
        //Verifica si hay id iguales
        articulo.cantidad++;
        return articulo;
      } else {
        return articulo;
      }
    });

    articulosCarrito = [...articuloVerificado];
  } else {
    //Si no existe articulo iguales se añade al nuevo articulo al arreglo
    articulosCarrito = [...articulosCarrito, datosArticulos];
  }

  carritoHtml();
  sumarTotal(articulosCarrito);
  totalHtml();
  sincronizarStorage();
}

function carritoHtml() {
  limpiarHtml();

  //Armando el Html del articulo
  articulosCarrito.forEach((articulo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td><img src="${articulo.imagen}" width="50px"></td>
                <td>${articulo.nombre}</td>
                <td>$${articulo.precio}</td>
                <th scope="row">${articulo.cantidad}</th>
                <td><a href="#" class="btn btn-danger borrar-articulo" data-id="${articulo.id}">X</a></td>
        `;
    //Agrega al tr al Tbody
    contenedorCarrito.appendChild(row);
  });
}

function limpiarHtml() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function sumarTotal(lista) {
  if (lista.length > 0) {
    let longitud = lista.length - 1;
    let ultimoArticulo = articulosCarrito[longitud].precio;
    total += Number(ultimoArticulo);
  } else if (lista.length === 0) {
    total = 0;
  }
}

function SumaEliminar() {
  let suma = 0;
  articulosCarrito.forEach((articulo) => (suma += Number(articulo.precio)));
  return (total = suma);
}

function totalHtml() {
  totalTxt.innerHTML = `<span>Total $${total.toFixed(2)}</span>`;
}

function cargarArticulos(articulos) {
  let id = 1;
  for (const articulo of articulos) {
    let { title, description, precio, img } = articulo;
    plantilla_articulos(title, description, precio, img, id);
    id += 1;
  }
}

function habilitar_desabilitar_buttons() {
  if (articulosCarrito.length > 0) {
    btnVaciar.disabled = false;
    btnComprar.disabled = false;
  } else {
    btnVaciar.disabled = true;
    btnComprar.disabled = true;
  }
}

function exito(texto) {
  const exito = document.createElement("div");
  exito.className = "alert alert-success d-flex align-items-center anim";
  exito.innerText = `Compra Exitosa - Precio $${texto} ✓`;
  divExito.appendChild(exito);
}

function spinner() {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  divExito.appendChild(spinner);
}

function limpiarExito() {
  while (divExito.firstChild) {
    divExito.removeChild(divExito.firstChild);
  }
}

function comprar() {
  btnComprar.disabled = true;
  spinner();
  setTimeout(() => {
    limpiarExito();
    exito(total.toFixed(2));
    vaciarCarrito();
    sincronizarStorage();
  }, 3000);

  setTimeout(() => {
    limpiarExito();
  }, 7000);
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}