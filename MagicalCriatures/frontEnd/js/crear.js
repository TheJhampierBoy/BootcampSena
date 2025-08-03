document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const numJugadores = parseInt(urlParams.get('numJugadores')) || 2;
    const jugadoresContainer = document.getElementById("jugadores-container");
    const btnRegistrar = document.getElementById("btn-registrar");
    
    // Generar campos para cada jugador
    for (let i = 1; i <= numJugadores; i++) {
        const div = document.createElement("div");
        div.className = "nombres";
        div.style.marginBottom = "10px";
        
        const avatarNum = (i % 6) + 1; // Guardar este número para cada jugador
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.style.backgroundImage = `url(../img/avatar${avatarNum}.png)`;
        avatar.style.margin = "0 auto";
        avatar.dataset.avatar = avatarNum; // Almacenar el número de avatar
        
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Jugador ${i}`;
        input.className = "formulario";
        input.required = true;
        input.name = `jugador${i}`;
        input.maxLength = 20;
        
        div.appendChild(avatar);
        div.appendChild(input);
        jugadoresContainer.appendChild(div);
    }
    
    btnRegistrar.addEventListener("click", async function() {
        const inputs = document.querySelectorAll("input[name^='jugador']");
        const avatares = document.querySelectorAll(".avatar");
        const jugadores = {};
        
        inputs.forEach((input, index) => {
            const avatarNum = avatares[index].dataset.avatar; // Obtener el número de avatar guardado
            jugadores[`jugador${index+1}`] = {
                nombre: input.value.trim(),
                avatar: avatarNum
            };
        });
        
        // Validar nombres
        if (Object.values(jugadores).some(j => j.nombre === "")) {
            alert("Por favor ingresa nombres para todos los jugadores");
            return;
        }
        
        btnRegistrar.disabled = true;
        btnRegistrar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
        
        try {
            const url = 'http://localhost/BootcampSena-main/MagicalCriatures/frontEnd/php/bd.php';
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jugadores)
            });
            
            const data = await response.json();
            
            if (!response.ok || data.status !== "success") {
                throw new Error(data.message || `Error del servidor: ${response.status}`);
            }
            
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(jugadores)) {
                params.append(key, value.nombre);
                params.append(`avatar${key.replace('jugador', '')}`, value.avatar);
            }
            params.append('idSala', data.idSala);
            
            window.location.href = `salaEspera.html?${params.toString()}`;
            
        } catch (error) {
            console.error("Error completo:", error);
            alert(`Error: ${error.message}\n\nRevisa la consola para más detalles`);
        } finally {
            btnRegistrar.disabled = false;
            btnRegistrar.textContent = "Registrar";
        }
    });
});