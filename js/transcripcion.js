document.addEventListener("DOMContentLoaded", () => {

    /*
     * Busca el contenedor que tiene la transcripción.
     * En tu HTML debe existir:
     *
     * <div class="texto-transcripcion">
     *     <p>...</p>
     * </div>
     */

    const contenedor = document.querySelector(".texto-transcripcion");

    if (!contenedor) {
        console.warn(
            "No se encontró el contenedor .texto-transcripcion"
        );

        return;
    }


    /*
     * Elementos que podrán seleccionarse y resaltarse.
     */

    const elementos = Array.from(
        contenedor.querySelectorAll(
            "p, h2, h3, h4, blockquote, li"
        )
    );


    if (elementos.length === 0) {
        console.warn(
            "No se encontraron párrafos dentro de la transcripción."
        );

        return;
    }


    /*
     * Convierte cada párrafo en un elemento accesible
     * mediante teclado.
     */

    elementos.forEach((elemento, indice) => {

        elemento.classList.add("parrafo-transcripcion");

        elemento.setAttribute("tabindex", "0");

        elemento.setAttribute(
            "data-indice",
            indice
        );

        elemento.setAttribute(
            "aria-label",
            `Fragmento ${indice + 1} de ${elementos.length}`
        );


        /*
         * Seleccionar al hacer clic.
         */

        elemento.addEventListener("click", () => {

            seleccionarElemento(
                elemento,
                true
            );

        });


        /*
         * También se resalta cuando recibe el foco
         * mediante Tab.
         */

        elemento.addEventListener("focus", () => {

            seleccionarElemento(
                elemento,
                false
            );

        });


        /*
         * Navegación mediante teclado.
         */

        elemento.addEventListener("keydown", (evento) => {

            const indiceActual = elementos.indexOf(elemento);


            /*
             * Flecha abajo:
             * avanzar al siguiente párrafo.
             */

            if (
                evento.key === "ArrowDown" ||
                evento.key === "PageDown"
            ) {

                evento.preventDefault();

                enfocarElemento(
                    indiceActual + 1
                );

            }


            /*
             * Flecha arriba:
             * regresar al párrafo anterior.
             */

            if (
                evento.key === "ArrowUp" ||
                evento.key === "PageUp"
            ) {

                evento.preventDefault();

                enfocarElemento(
                    indiceActual - 1
                );

            }


            /*
             * Flecha derecha:
             * avanzar al siguiente fragmento.
             */

            if (evento.key === "ArrowRight") {

                evento.preventDefault();

                enfocarElemento(
                    indiceActual + 1
                );

            }


            /*
             * Flecha izquierda:
             * regresar al fragmento anterior.
             */

            if (evento.key === "ArrowLeft") {

                evento.preventDefault();

                enfocarElemento(
                    indiceActual - 1
                );

            }


            /*
             * Tecla Inicio:
             * ir al primer párrafo.
             */

            if (evento.key === "Home") {

                evento.preventDefault();

                enfocarElemento(0);

            }


            /*
             * Tecla Fin:
             * ir al último párrafo.
             */

            if (evento.key === "End") {

                evento.preventDefault();

                enfocarElemento(
                    elementos.length - 1
                );

            }


            /*
             * Enter o barra espaciadora:
             * mantiene seleccionado el párrafo.
             */

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                seleccionarElemento(
                    elemento,
                    true
                );

            }


            /*
             * Escape:
             * quitar el resaltado.
             */

            if (evento.key === "Escape") {

                quitarSeleccion();

                elemento.blur();

            }

        });

    });


    /*
     * Selecciona y resalta un elemento.
     */

    function seleccionarElemento(
        elemento,
        moverPantalla = true
    ) {

        quitarSeleccion();

        elemento.classList.add("parrafo-activo");

        elemento.setAttribute(
            "aria-current",
            "true"
        );


        if (document.activeElement !== elemento) {

            elemento.focus({
                preventScroll: true
            });

        }


        if (moverPantalla) {

            elemento.scrollIntoView({

                behavior: "smooth",

                block: "center",

                inline: "nearest"

            });

        }

    }


    /*
     * Quita el resaltado anterior.
     */

    function quitarSeleccion() {

        elementos.forEach((elemento) => {

            elemento.classList.remove(
                "parrafo-activo"
            );

            elemento.removeAttribute(
                "aria-current"
            );

        });

    }


    /*
     * Enfoca el párrafo según su posición.
     */

    function enfocarElemento(indice) {

        /*
         * Evita salir de los límites.
         */

        if (indice < 0) {
            indice = 0;
        }

        if (indice >= elementos.length) {
            indice = elementos.length - 1;
        }


        const elemento = elementos[indice];


        seleccionarElemento(
            elemento,
            true
        );

    }


    /*
     * Al hacer clic fuera de la transcripción,
     * no se elimina inmediatamente el resaltado.
     *
     * Al presionar Escape sí se elimina.
     */


    /*
     * Seleccionar automáticamente el primer párrafo
     * cuando se presiona una flecha sin haber
     * seleccionado previamente ningún párrafo.
     */

    document.addEventListener("keydown", (evento) => {

        const etiqueta = document.activeElement.tagName;

        const estaEscribiendo =
            etiqueta === "INPUT" ||
            etiqueta === "TEXTAREA" ||
            etiqueta === "SELECT";


        if (estaEscribiendo) {
            return;
        }


        const existeActivo = contenedor.querySelector(
            ".parrafo-activo"
        );


        if (
            !existeActivo &&
            (
                evento.key === "ArrowDown" ||
                evento.key === "ArrowUp"
            )
        ) {

            evento.preventDefault();

            const indiceInicial =
                evento.key === "ArrowUp"
                    ? elementos.length - 1
                    : 0;


            enfocarElemento(
                indiceInicial
            );

        }

    });

});