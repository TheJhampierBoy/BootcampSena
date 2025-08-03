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
        
        const avatarNum = (i % 6) + 1;
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.style.backgroundImage = `url(../img/avatar${avatarNum}.png)`;
        avatar.style.margin = "0 auto";
        avatar.dataset.avatar = avatarNum;
        
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
            const avatarNum = avatares[index].dataset.avatar;
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
            
            // Construir URL con parámetros
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(jugadores)) {
                params.append(key, value.nombre);
                params.append(`avatar${key.replace('jugador', '')}`, value.avatar);
            }
            params.append('idSala', data.idSala);
            
            // Redirigir a sala de espera
            window.location.href = `salaEspera.html?${params.toString()}`;
            
        } catch (error) {
            console.error("Error completo:", error);
            
            // Mensaje de error más detallado
            let errorMessage = `Error: ${error.message}`;
            
            if (error.message.includes("Failed to fetch")) {
                errorMessage += "\n\nPosibles soluciones:";
                errorMessage += "\n1. Verifica que el servidor local (XAMPP/WAMP) está corriendo";
                errorMessage += "\n2. Comprueba que la URL del endpoint es correcta";
                errorMessage += "\n3. Revisa la consola del navegador para más detalles";
            } else if (error.message.includes("<br")) {
                errorMessage += "\n\nEl servidor está devolviendo una página de error HTML";
                errorMessage += "\n1. Revisa tu archivo bd.php";
                errorMessage += "\n2. Verifica que no haya errores de PHP";
                errorMessage += "\n3. Comprueba los logs del servidor";
            }
            
            alert(errorMessage);
        } finally {
            btnRegistrar.disabled = false;
            btnRegistrar.textContent = "Registrar";
        }
    });
});