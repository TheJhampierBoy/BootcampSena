document.addEventListener("DOMContentLoaded", function() {
    const jugadoresSection = document.getElementById("jugadores-container");
    const txtRonda = document.querySelector(".txt-ronda");
    const poderes = document.querySelectorAll(".poder");
    
    // Obtener jugadores de sessionStorage
    const jugadores = JSON.parse(sessionStorage.getItem("jugadores")) || [];
    const idSala = sessionStorage.getItem("idSala");
    
    if (!jugadores.length || !idSala) {
        alert("Error: No se encontraron datos de la partida");
        window.location.href = "sala.html";
        return;
    }
    
    // Estado del juego
    let rondaActual = 1;
    let jugadorActual = 0;
    let cartasJugadores = {};
    let puntosJugadores = {};
    
    // Inicializar juego
    function inicializarJuego() {
        jugadoresSection.innerHTML = "";
        
        // Inicializar cartas y puntos
        jugadores.forEach((nombre, index) => {
            cartasJugadores[index] = 8; // Todos empiezan con 8 cartas
            puntosJugadores[index] = 0;
            
            // Crear elemento de jugador
            const jugadorDiv = document.createElement("div");
            jugadorDiv.className = "jugador";
            const avatarNum = (index % 6) + 1;
            
            jugadorDiv.innerHTML = `
                <img src="../img/avatar${avatarNum}.png" alt="${nombre}">
                <p>${nombre}</p>
                <div>
                    <div class="cartas"></div>
                    <p class="num-cartas">${cartasJugadores[index]} Cartas</p>
                </div>
            `;
            
            jugadoresSection.appendChild(jugadorDiv);
        });
        
        // Actualizar ronda
        txtRonda.textContent = `Ronda ${rondaActual}`;
    }
    
    // Manejar selección de poder
    poderes.forEach(poder => {
        poder.addEventListener("click", async function() {
            const atributo = this.querySelector("p").textContent.toLowerCase();
            
            try {
                // Aquí iría la lógica para comparar atributos con el servidor
                // Por ahora simulamos un ganador aleatorio
                const ganador = Math.floor(Math.random() * jugadores.length);
                
                // Actualizar cartas del ganador
                cartasJugadores[ganador] += 1;
                puntosJugadores[ganador] += 1;
                
                // Actualizar cartas del jugador actual
                cartasJugadores[jugadorActual] -= 1;
                
                // Actualizar vista
                document.querySelectorAll(".num-cartas")[jugadorActual].textContent = 
                    `${cartasJugadores[jugadorActual]} Cartas`;
                document.querySelectorAll(".num-cartas")[ganador].textContent = 
                    `${cartasJugadores[ganador]} Cartas`;
                
                // Pasar al siguiente jugador
                jugadorActual = (jugadorActual + 1) % jugadores.length;
                
                // Si todos han jugado, pasar a siguiente ronda
                if (jugadorActual === 0) {
                    rondaActual++;
                    txtRonda.textContent = `Ronda ${rondaActual}`;
                }
                
                // Verificar si el juego ha terminado
                const jugadoresConCartas = Object.values(cartasJugadores).filter(c => c > 0).length;
                if (jugadoresConCartas <= 1) {
                    await finalizarJuego();
                }
            } catch (error) {
                console.error("Error en la partida:", error);
                alert("Ocurrió un error durante la partida");
            }
        });
    });
    
    // Finalizar juego
    async function finalizarJuego() {
        // Determinar ganador
        let ganador = 0;
        let maxPuntos = 0;
        
        for (let i = 0; i < jugadores.length; i++) {
            if (puntosJugadores[i] > maxPuntos) {
                maxPuntos = puntosJugadores[i];
                ganador = i;
            }
        }
        
        alert(`¡El juego ha terminado! Ganador: ${jugadores[ganador]} con ${maxPuntos} puntos`);
        
        // Enviar resultados finales al servidor
        try {
            const response = await fetch('../php/finalizar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idSala: idSala,
                    ganador: jugadores[ganador],
                    puntos: maxPuntos
                })
            });
            
            if (!response.ok) {
                throw new Error("Error al guardar resultados");
            }
        } catch (error) {
            console.error("Error al finalizar:", error);
        }
        
        
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 3000);
    }
    
    // Inicializar el juego
    inicializarJuego();
});