const btn = document.getElementById("btn");
const out = document.getElementById("out");

// --- CONFIGURACIÓN DEL LOCAL ---
const LOCAL_COORDS = {
    lat: 32.6018, // Coordenadas de Av. Claridad 3600
    lng: -115.4145,
    direccion: "Avenida Claridad 3600, 21378 Mexicali, B.C.",
    rangoMax: 9.2
};

/**
 * Calcula la distancia en KM entre dos puntos (Fórmula de Haversine)
 */
function calcularDistanciaKM(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

let locationFetched = false;

// Intentar recuperar de sessionStorage
const cachedGeoText = sessionStorage.getItem("geoText");
const cachedGeoVisible = sessionStorage.getItem("geoVisible");

if (cachedGeoText) {
    locationFetched = true;
    out.textContent = cachedGeoText;
    
    if (cachedGeoVisible === "true") {
        out.style.display = "block";
        btn.textContent = "Ocultar mi zona";
    } else {
        out.style.display = "none";
        btn.textContent = "Verificar mi zona";
    }
} else {
    out.style.display = "none";
}

btn.addEventListener("click", () => {
    // Si ya obtuvimos la ubicación, solo ocultar o mostrar
    if (locationFetched) {
        if (out.style.display === "none") {
            out.style.display = "block";
            btn.textContent = "Ocultar mi zona";
            sessionStorage.setItem("geoVisible", "true");
        } else {
            out.style.display = "none";
            btn.textContent = "Verificar mi zona";
            sessionStorage.setItem("geoVisible", "false");
        }
        return;
    }

    out.style.display = "block";
    out.textContent = "Obteniendo ubicación...";
    btn.disabled = true;

    if (!("geolocation" in navigator)) {
        out.textContent = "El navegador no soporta geolocalización.";
        btn.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;

            // 1. Calcular distancia al local
            const distancia = calcularDistanciaKM(LOCAL_COORDS.lat, LOCAL_COORDS.lng, latitude, longitude);
            const estaEnRango = distancia <= LOCAL_COORDS.rangoMax;

            // 2. Definir mensaje de cobertura
            let mensajeCobertura = "";
            if (estaEnRango) {
                mensajeCobertura = `✅ ¡ESTÁ DENTRO DEL RANGO DE ENTREGA! (A ${distancia.toFixed(2)} km)`;
            } else {
                mensajeCobertura = `NO SE PUEDE ENVIAR A DOMICILIO (Excede los ${LOCAL_COORDS.rangoMax} km. Estás a ${distancia.toFixed(2)} km)`;
            }

            // 3. Obtener dirección detallada (Nominatim)
            out.textContent = `Calculando ruta y dirección...`;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            try {
                const response = await fetch(url, {
                    headers: { "Accept": "application/json" }
                });
                const data = await response.json();
                const { road, city, town, village, country } = data.address;
                const ciudadNombre = city || town || village || "No detectada";

                // 4. Salida Final
                out.textContent =
                    `Tu ubicación\n` +
                    `${mensajeCobertura}\n\n` +
                    `Te encuentras en: ${road || "No disponible"}, ${ciudadNombre}\n` +
                    `Precisión: ±${accuracy.toFixed(0)} metros\n\n` +
                    `Nos encontramos en: \n` +
                    `${LOCAL_COORDS.direccion}`;

            } catch (err) {
                out.textContent = `${mensajeCobertura}\n\n(Error al obtener dirección detallada)`;
                console.error("Error en Fetch:", err);
            }

            locationFetched = true;
            btn.textContent = "Ocultar mi zona";
            btn.disabled = false;
            sessionStorage.setItem("geoText", out.textContent);
            sessionStorage.setItem("geoVisible", "true");
        },
        (err) => {
            out.textContent = `Error GPS: ${err.message}`;
            btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
});