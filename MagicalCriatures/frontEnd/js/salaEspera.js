document.addEventListener("DOMContentLoaded", function() {
    const jugadoresContainer = document.getElementById("jugadores-container");
    const btnIniciar = document.getElementById("btn-iniciar");
    
    
    const urlParams = new URLSearchParams(window.location.search);
    const jugadores = [];
    let idSala = null;
    
   
    urlParams.forEach((value, key) => {
        if (key.startsWith("jugador")) {
            const num = parseInt(key.replace("jugador", ""));
            jugadores[num - 1] = value;
        } else if (key === "idSala") {
            idSala = value;
        }
    });
    
    const jugadoresFiltrados = jugadores.filter(j => j !== undefined && j !== "");
    
    
    jugadoresFiltrados.forEach((nombre, index) => {
        const avatarNum = (index % 6) + 1; // 6 avatares disponibles
        const jugadorDiv = document.createElement("div");
        jugadorDiv.className = "jugador";
        
        jugadorDiv.innerHTML = `
            <img src="../img/avatar${avatarNum}.png" alt="${nombre}" />
            <p>${nombre}</p>
        `;
        
        jugadoresContainer.appendChild(jugadorDiv);
    });
    
    
    btnIniciar.addEventListener("click", function() {
        if (!idSala || jugadoresFiltrados.length === 0) {
            alert("Error: No se encontraron datos suficientes para iniciar");
            return;
        }
        
      
        sessionStorage.setItem("jugadores", JSON.stringify(jugadoresFiltrados));
        sessionStorage.setItem("idSala", idSala);
        window.location.href = "partida.html";
    });
});