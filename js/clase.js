document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#quiz-form");
    const resultado = document.querySelector("#quiz-resultado");

    if (!formulario || !resultado) {
        return;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const preguntas = Array.from(formulario.querySelectorAll("fieldset"));
        let respondidas = 0;
        let aciertos = 0;

        preguntas.forEach((pregunta) => {
            const seleccionada = pregunta.querySelector("input:checked");
            const respuestaCorrecta = pregunta.dataset.respuesta;

            pregunta.querySelectorAll("label").forEach((opcion) => {
                opcion.classList.remove("respuesta-correcta", "respuesta-incorrecta");
            });

            if (!seleccionada) {
                return;
            }

            respondidas += 1;
            const etiquetaSeleccionada = seleccionada.closest("label");

            if (seleccionada.value === respuestaCorrecta) {
                aciertos += 1;
                etiquetaSeleccionada.classList.add("respuesta-correcta");
            } else {
                etiquetaSeleccionada.classList.add("respuesta-incorrecta");

                const correcta = pregunta.querySelector(
                    `input[value="${respuestaCorrecta}"]`
                );

                correcta.closest("label").classList.add("respuesta-correcta");
            }
        });

        if (respondidas < preguntas.length) {
            resultado.textContent = "Responde las tres preguntas.";
            return;
        }

        if (aciertos === preguntas.length) {
            resultado.textContent = `¡Excelente! ${aciertos} de ${preguntas.length}.`;
        } else if (aciertos >= 2) {
            resultado.textContent = `Muy bien: ${aciertos} de ${preguntas.length}.`;
        } else {
            resultado.textContent = `${aciertos} de ${preguntas.length}. Revisa las ideas clave.`;
        }
    });
});