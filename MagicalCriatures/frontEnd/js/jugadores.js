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
                
                const avatar = document.createElement("div");
                avatar.className = "avatar";
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
            
            // Registrar jugadores
            btnRegistrar.addEventListener("click", async function() {
                const inputs = document.querySelectorAll("input[name^='jugador']");
                const nombres = Array.from(inputs).map(input => input.value.trim());
                
                // Validar que todos los nombres estén completos
                if (nombres.some(nombre => nombre === "")) {
                    alert("Por favor ingresa nombres para todos los jugadores");
                    return;
                }
                
                // Deshabilitar botón mientras se procesa
                btnRegistrar.disabled = true;
                btnRegistrar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
                
                try {
                    // Enviar datos al servidor
                    const response = await fetch('../php/bd.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nombres: nombres })
                    });
                    
                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(error || "Error en la respuesta del servidor");
                    }
                    
                    const data = await response.json();
                    
                    if (data.status === "success") {
                        // Redirigir a sala de espera con los nombres y ID de sala
                        const queryParams = new URLSearchParams();
                        nombres.forEach((nombre, index) => {
                            queryParams.append(`jugador${index+1}`, nombre);
                        });
                        queryParams.append('idSala', data.idSala);
                        
                        window.location.href = `salaEspera.html?${queryParams.toString()}`;
                    } else {
                        throw new Error(data.message || "Error al registrar jugadores");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert(`Error: ${error.message}`);
                } finally {
                    btnRegistrar.disabled = false;
                    btnRegistrar.textContent = "Registrar";
                }
            });
        });