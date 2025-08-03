document.addEventListener("DOMContentLoaded", function() {
    const jugadoresContainer = document.getElementById("jugadores-container");
    const btnIniciar = document.getElementById("btn-iniciar");
    const urlParams = new URLSearchParams(window.location.search);
    const idSala = urlParams.get('idSala');
    
    // Recoger jugadores y sus avatares de la URL
    const jugadores = [];
    for (let i = 1; i <= 5; i++) {
        const nombre = urlParams.get(`jugador${i}`);
        const avatar = urlParams.get(`avatar${i}`);
        if (nombre) {
            jugadores.push({
                numero: i,
                nombre: nombre,
                avatar: avatar || ((i % 6) + 1)
            });
        }
    }
    
    async function cargarJugadoresDesdeBD() {
        try {
            const response = await fetch(`../php/obtenerJugadores.php?idSala=${idSala}`);
            
            // Verificar primero el tipo de contenido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(`El servidor respondió con: ${errorText.substring(0, 100)}...`);
            }
            
            // Si es JSON, proceder con el parsing
            const data = await response.json();
            
            if (!response.ok || data.status !== "success") {
                throw new Error(data.message || `Error del servidor: ${response.status}`);
            }
            
            mostrarJugadores(data.jugadores);
        } catch (error) {
            console.error("Error al cargar jugadores:", error);
            // Mostrar jugadores de la URL como fallback
            mostrarJugadores(jugadores);
            
            // Mostrar mensaje de error solo si no hay jugadores en la URL
            if (jugadores.length === 0) {
                alert(`Error: ${error.message}\n\nUsando datos locales como respaldo.`);
            }
        }
    }
    
    function mostrarJugadores(jugadores) {
        jugadoresContainer.innerHTML = "";
        
        jugadores.forEach(jugador => {
            const jugadorDiv = document.createElement("div");
            jugadorDiv.className = "jugador";
            
            jugadorDiv.innerHTML = `
                <img src="../img/avatar${jugador.avatar}.png" alt="${jugador.nombre}" 
                     onerror="this.src='../img/avatar-default.png'">
                <p>${jugador.nombre}</p>
            `;
            
            jugadoresContainer.appendChild(jugadorDiv);
        });
    }
    
    btnIniciar.addEventListener("click", function() {
        if (!idSala) {
            alert("Error: No se encontró ID de sala");
            return;
        }
        
        // Pasar todos los parámetros a partida.html
        const params = new URLSearchParams();
        jugadores.forEach(jugador => {
            params.append(`jugador${jugador.numero}`, jugador.nombre);
            params.append(`avatar${jugador.numero}`, jugador.avatar);
        });
        params.append('idSala', idSala);
        
        window.location.href = `partida.html?${params.toString()}`;
    });
    
    // Cargar jugadores (primero intenta BD, luego fallback a URL)
    if (jugadores.length > 0) {
        mostrarJugadores(jugadores); // Mostrar inmediatamente los de la URL
    }
    cargarJugadoresDesdeBD(); // Intentar actualizar desde BD
});