document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const numJugadores = parseInt(urlParams.get('numJugadores')) || 2;
    const jugadoresContainer = document.getElementById("jugadores-container");
    const btnRegistrar = document.getElementById("btn-registrar");
    
   
    for (let i = 1; i <= numJugadores; i++) {
        const div = document.createElement("div");
        div.className = "nombres";
        div.style.marginBottom = "10px";
        
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.style.backgroundImage = `url(../img/avatar${(i % 6) + 1}.png)`;
        avatar.style.margin = "0 auto";
        
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
    const jugadores = {};
    
    inputs.forEach((input, index) => {
        jugadores[`jugador${index+1}`] = input.value.trim();
    });
    
    
    if (Object.values(jugadores).some(nombre => nombre === "")) {
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
            params.append(key, value);
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