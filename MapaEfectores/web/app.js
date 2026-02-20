// ---------- Helpers UI ----------
const statusEl = document.getElementById("status");
const ivsLegendEl = document.getElementById("ivsLegend");
const filterLegendEl = document.getElementById("filterLegend");
const filteredCenterEl = document.getElementById("filteredCenter");
const filteredCenterNameEl = document.getElementById("filteredCenterName");

// Stats
const statEfectoresEl = document.getElementById("statEfectores");
const statAtencionesEl = document.getElementById("statAtenciones");
const statPacientesEl = document.getElementById("statPacientes");
const statGeolocalizadosEl = document.getElementById("statGeolocalizados");

// Efectores Salud Mental
const smWrap  = document.getElementById("smWrap");
const smBtn   = document.getElementById("smBtn");
const smDrop  = document.getElementById("smDrop");
const smList  = document.getElementById("smList");
const smAll   = document.getElementById("smAll");
const smNone  = document.getElementById("smNone");
const smApply = document.getElementById("smApply");

// Efectores Públicos
const msWrap  = document.getElementById("msWrap");
const msBtn   = document.getElementById("msBtn");
const msDrop  = document.getElementById("msDrop");
const msList  = document.getElementById("msList");
const msAll   = document.getElementById("msAll");
const msNone  = document.getElementById("msNone");
const msApply = document.getElementById("msApply");

// Zonas
const zonasWrap  = document.getElementById("zonasWrap");
const zonasBtn   = document.getElementById("zonasBtn");
const zonasDrop  = document.getElementById("zonasDrop");
const zonasList  = document.getElementById("zonasList");
const zonasAll   = document.getElementById("zonasAll");
const zonasNone  = document.getElementById("zonasNone");
const zonasApply = document.getElementById("zonasApply");

// Seccionales
const seccionalesWrap  = document.getElementById("seccionalesWrap");
const seccionalesBtn   = document.getElementById("seccionalesBtn");
const seccionalesDrop  = document.getElementById("seccionalesDrop");
const seccionalesList  = document.getElementById("seccionalesList");
const seccionalesAll   = document.getElementById("seccionalesAll");
const seccionalesNone  = document.getElementById("seccionalesNone");
const seccionalesApply = document.getElementById("seccionalesApply");

// IVS
const ivsWrap  = document.getElementById("ivsWrap");
const ivsBtn   = document.getElementById("ivsBtn");
const ivsDrop  = document.getElementById("ivsDrop");
const ivsList  = document.getElementById("ivsList");
const ivsAll   = document.getElementById("ivsAll");
const ivsNone  = document.getElementById("ivsNone");
const ivsApply = document.getElementById("ivsApply");

const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const setStatus = (t, success = false) => {
  statusEl.textContent = t;
  statusEl.className = success ? 'status-text success' : 'status-text';
};

const fmt = (n) => {
  if (n === null || n === undefined) return '0';
  return n.toLocaleString("es-AR");
};

// ---------- Parse robusto ----------
function num(v) {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s || s.toUpperCase() === "NULL") return NaN;
    return Number(s.replace(",", "."));
  }
  return Number(v);
}

// ---------- Normalizador texto ----------
function normTxt(v) {
  return (v ?? "")
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function prettyTipo(tipo) {
  const t = normTxt(tipo);
  if (t === "SALUD MENTAL") return "Salud Mental y Adicciones";
  return tipo;
}

// ---------- Exclusiones por tipo ----------
function isTipoExcluido(tipoRaw) {
  const t = normTxt(tipoRaw);
  if (t.includes("CLINICA")) return true;
  if (t.includes("HOSPITAL PROVINCIAL CORDOBA")) return true;
  if (t === "MAYUSCULAS") return true;
  return false;
}

// ---------- Mapeo de iconos por tipo ----------
const TIPO_ICON_MAP = {
  // Polideportivo
  "POLIDEPORTIVO": "PolideportivosyParqueseducativos",
  
  // Parque educativo
  "PARQUE EDUCATIVO": "Parque educativo",
  
  // CAPS
  "CAPS": "CAPS",
  
  // CPC
  "CPC": "CPC",
  
  // Centro Vecinal y Comisión de Vecinos
  "CENTRO VECINAL": "CentroVecinal",
  "COMISION DE VECINOS": "ComisiondeVecinos",
  
  // Casa Convivencial
  "CASA CONVIVENCIAL": "CasaConvivenciales",
  
  // Escuelas y jardines
  "ESCUELA MUNICIPAL": "colegio",
  "JARDINES MUNICIPALES": "colegio",
  "SALA CUNA": "colegio",
  
  // Hospitales
  "HOSPITAL DE PRONTA ATENCION": "Hospitales",
  "HOSPITAL MUNICIPAL CORDOBA": "Hospitales",
  "PADRE LA MONACA": "Hospitales",
  
  // Centro Comunitario
  "CENTRO COMUNITARIO": "EspaciodeEscuchayAcompañamiento",
  
  // Centro de Salud
  "CENTRO DE SALUD": "CentroSalud",
  
  // Medicina Preventiva
  "MEDICINA PREVENTIVA": "MedicinaPreventiva",
  "DEM": "DEM",
  
  // Servicio Odontológico
  "SERVICIO ODONTOLOGICO MUNICIPAL": "odontologia",
  
  // Secretaria de Salud, Reparticion
  "SECRETARIA DE SALUD": "ReparticionSecretariaSalud",
  "REPARTICION": "ReparticionSecretariaSalud"
};

// ---------- Obtener icono según tipo ----------
function getIconForTipo(tipo) {
  const t = normTxt(tipo);
  
  for (const [key, iconName] of Object.entries(TIPO_ICON_MAP)) {
    if (t.includes(normTxt(key))) {
      return iconName;
    }
  }
  
  return "CentroSalud"; // Por defecto
}

// ---------- Colores IVS ----------
const IVS_COLORS = {
  "1": "#C44C4C",
  "2": "#E67E50",
  "3": "#F4D03F",
  "4": "#7FCD91",
  "5": "#52A370"
};

const IVS_LABELS = {
  "1": "Muy alta",
  "2": "Alta",
  "3": "Media",
  "4": "Baja",
  "5": "Muy baja"
};

const PACIENTES_COLOR = "#004B81";

// Colores para zonas (diferentes para cada una)
const ZONA_COLORS = [
  "#3498db", "#2ecc71", "#e74c3c", "#f39c12", 
  "#9b59b6", "#1abc9c", "#34495e", "#e67e22", 
  "#16a085", "#27ae60", "#2980b9", "#8e44ad"
];

// Colores para seccionales (diferentes para cada una)
const SECCIONAL_COLORS = [
  "#9b59b6", "#e91e63", "#ff5722", "#795548", 
  "#607d8b", "#00bcd4", "#cddc39", "#ffc107", 
  "#ff9800", "#673ab7", "#3f51b5", "#009688", 
  "#8bc34a", "#ffeb3b"
];

// ---------- Data storage ----------
let smRows = [];
let chRows = [];
let pacPorEfectorRows = [];
let zonasGeoJSON = null;
let ivsBarriosGeoJSON = null;
let seccionalesGeoJSON = null;
let pacientesGlobal = 0;

// ---------- Controles de filtros ----------
let smControls, msControls, zonasControls, seccionalesControls, ivsControls;

// -------------------------------
// Dropdown builders
// -------------------------------
function buildSaludMentalDropdown(rows) {
  const efectores = rows.map(r => ({
    id: r.efector_id || r.centro || "Sin nombre",
    nombre: r.centro || r.efector_id || "Sin nombre"
  })).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  smList.innerHTML = `
    ${efectores.map(e => `
      <label class="ms-item">
        <input type="checkbox" value="${e.id.replace(/"/g,'&quot;')}" checked>
        <span>${e.nombre}</span>
      </label>
    `).join("")}
  `;

  smBtn.textContent = `Todos (${efectores.length})`;
}

function buildOtrosEfectoresDropdown(rows) {
  const tipos = [...new Set(
    (rows || [])
      .map(r => prettyTipo((r.tipo ?? "").toString().trim()))
      .filter(Boolean)
      .filter(t => !isTipoExcluido(t))
      .filter(t => normTxt(t) !== normTxt("Salud Mental y Adicciones"))
      .filter(t => {
        const normalized = normTxt(t);

        if (
          normalized === "MAYUSCULAS" ||
          normalized.includes("MAYUSCULA") ||
          normalized === "EAC" ||
          normalized === "PCCH"
        ) return false;

        return true;
      })
  )].sort((a, b) => a.localeCompare(b, "es"));

  msList.innerHTML = `
    ${tipos.map(t => `
      <label class="ms-item">
        <input type="checkbox" value="${t.replace(/"/g,'&quot;')}">
        <span>${t}</span>
      </label>
    `).join("")}
  `;

  msBtn.textContent = "Ninguno";
}

function buildZonasDropdown(zonas) {
  const zonasNames = zonas.features
    .map(f => f.properties.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));

  zonasList.innerHTML = `
    ${zonasNames.map(z => `
      <label class="ms-item">
        <input type="checkbox" value="${z.replace(/"/g,'&quot;')}">
        <span>${z}</span>
      </label>
    `).join("")}
  `;

  zonasBtn.textContent = "Ninguna";
}

function buildSeccionalesDropdown(seccionales) {
  const seccionalesNames = seccionales.features
    .map(f => f.properties.NOMBRE || f.properties.nombre || f.properties.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));

  seccionalesList.innerHTML = `
    ${seccionalesNames.map(s => `
      <label class="ms-item">
        <input type="checkbox" value="${s.replace(/"/g,'&quot;')}">
        <span>${s}</span>
      </label>
    `).join("")}
  `;

  seccionalesBtn.textContent = "Ninguna";
}

function buildIVSDropdown() {
  const ivsOptions = ["1", "2", "3", "4", "5"];
  
  ivsList.innerHTML = `
    ${ivsOptions.map(ivs => `
      <label class="ms-item">
        <input type="checkbox" value="${ivs}">
        <span class="ivs-indicator" style="background-color: ${IVS_COLORS[ivs]}"></span>
        <span>IVS ${ivs} - ${IVS_LABELS[ivs]}</span>
      </label>
    `).join("")}
  `;

  ivsBtn.textContent = "Ninguno";
}

// ---------- Dropdown handlers ----------
function setupDropdown(wrapEl, btnEl, dropEl, listEl, allBtn, noneBtn, applyBtn, callback) {
  function openDrop(v) { dropEl.classList.toggle("open", v); }
  
  document.addEventListener("click", (e) => { 
    if (!wrapEl.contains(e.target)) openDrop(false); 
  });
  
  btnEl.addEventListener("click", () => openDrop(!dropEl.classList.contains("open")));

  function getChecked() {
    return [...listEl.querySelectorAll("input[type=checkbox]:checked")].map(chk => chk.value);
  }

  function setAllChecks(state) {
    listEl.querySelectorAll("input[type=checkbox]").forEach(chk => {
      chk.checked = state;
    });
  }

  allBtn.addEventListener("click", () => setAllChecks(true));
  noneBtn.addEventListener("click", () => setAllChecks(false));
  applyBtn.addEventListener("click", () => { 
    openDrop(false); 
    callback(); 
  });

  return { getChecked, setAllChecks };
}

// ---------- Mapa centrado en Córdoba ----------
const map = L.map("map", { preferCanvas: true }).setView([-31.4201, -64.1888], 12);

const baseOSM = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// ---------- Leaflet layers ----------
const saludMentalLayer = L.layerGroup().addTo(map);
const centrosLayer = L.layerGroup();
const pacientesLayer = L.layerGroup().addTo(map);
const zonasLayer = L.layerGroup();
const ivsBarriosLayer = L.layerGroup();
const seccionalesLayer = L.layerGroup();

// ---------- Iconos ----------
const iconSM = L.icon({
  iconUrl: "./assets/hospital.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  tooltipAnchor: [0, -38],
});

// Iconos para establecimientos públicos
const iconosEstablecimientos = {
  "PolideportivosyParqueseducativos": L.icon({
    iconUrl: "./assets/PolideportivosyParqueseducativos.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "Parque educativo": L.icon({
    iconUrl: "./assets/Parque educativo.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "CAPS": L.icon({
    iconUrl: "./assets/CAPS.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "CPC": L.icon({
    iconUrl: "./assets/CPC.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "CentroVecinal": L.icon({
    iconUrl: "./assets/CentroVecinal.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "CasaConvivenciales": L.icon({
    iconUrl: "./assets/CasaConvivenciales.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "colegio": L.icon({
    iconUrl: "./assets/colegio.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "Hospitales": L.icon({
    iconUrl: "./assets/Hospitales.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "EspaciodeEscuchayAcompañamiento": L.icon({
    iconUrl: "./assets/EspaciodeEscuchayAcompañamiento.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "CentroSalud": L.icon({
    iconUrl: "./assets/CentroSalud.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "MedicinaPreventiva": L.icon({
    iconUrl: "./assets/MedicinaPreventiva.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "DEM": L.icon({
    iconUrl: "./assets/DEM.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "odontologia": L.icon({
    iconUrl: "./assets/odontologia.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "ReparticionSecretariaSalud": L.icon({
    iconUrl: "./assets/ReparticionSecretariaSalud.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  }),
  "ComisiondeVecinos": L.icon({
    iconUrl: "./assets/ComisiondeVecinos.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  })
};

// Iconos legacy (por si acaso)
const iconHospitalMunicipal = iconosEstablecimientos["Hospitales"];
const iconCentroSalud = iconosEstablecimientos["CentroSalud"];

// ---------- Render Zonas ----------
function renderZonas(selectedZonas) {
  zonasLayer.clearLayers();
  
  const selSet = new Set(selectedZonas.map(normTxt));
  let colorIndex = 0;
  
  zonasGeoJSON.features.forEach((feat) => {
    const name = feat.properties.name;
    if (!name || !selSet.has(normTxt(name))) return;
    
    const color = ZONA_COLORS[colorIndex % ZONA_COLORS.length];
    colorIndex++;
    
    const layer = L.geoJSON(feat, {
      style: {
        color: color,
        weight: 2,
        fillOpacity: 0.1,
        fillColor: color
      }
    });
    
    layer.bindTooltip(`<b>Zona: ${name}</b>`, { sticky: true, opacity: 0.9 });
    layer.addTo(zonasLayer);
  });
}

// ---------- Render Seccionales ----------
function renderSeccionales(selectedSeccionales) {
  seccionalesLayer.clearLayers();
  
  const selSet = new Set(selectedSeccionales.map(normTxt));
  let colorIndex = 0;
  
  seccionalesGeoJSON.features.forEach((feat) => {
    const name = feat.properties.NOMBRE || feat.properties.nombre || feat.properties.name;
    if (!name || !selSet.has(normTxt(name))) return;
    
    const color = SECCIONAL_COLORS[colorIndex % SECCIONAL_COLORS.length];
    colorIndex++;
    
    const layer = L.geoJSON(feat, {
      style: {
        color: color,
        weight: 2,
        fillOpacity: 0.1,
        fillColor: color
      }
    });
    
    layer.bindTooltip(`<b>Seccional: ${name}</b>`, { sticky: true, opacity: 0.9 });
    layer.addTo(seccionalesLayer);
  });
}

// ---------- Render IVS Barrios ----------
function renderIVSBarrios(selectedIVS) {
  ivsBarriosLayer.clearLayers();
  
  const ivsSet = new Set(selectedIVS);
  
  ivsBarriosGeoJSON.features.forEach((feat) => {
    const ivs = (feat.properties.IVS_PRIORI ?? "").toString().trim();
    if (!ivs || !ivsSet.has(ivs)) return;
    
    const color = IVS_COLORS[ivs] || "#cccccc";
    
    const layer = L.geoJSON(feat, {
      style: {
        color: color,
        weight: 1,
        fillOpacity: 0.4,
        fillColor: color
      }
    });
    
    const barrio = feat.properties.BARRIO || "Sin nombre";
    layer.bindTooltip(`<b>${barrio}</b><br/>IVS: ${ivs} - ${IVS_LABELS[ivs]}`, { sticky: true, opacity: 0.9 });
    layer.addTo(ivsBarriosLayer);
  });
}

// ---------- Render Salud Mental ----------
function renderSaludMental(rows, selectedEfectores) {
  saludMentalLayer.clearLayers();
  
  let totalAt = 0, totalPac = 0, count = 0;
  const selSet = new Set(selectedEfectores.map(normTxt));

  rows.forEach((r) => {
    const lat = num(r.lat), lng = num(r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const efectorId = normTxt(r.efector_id || r.centro || "");
    if (!selSet.has(efectorId)) return;

    const name = (r.centro ?? "Sin nombre").trim();
    const at = num(r.atenciones) || 0;
    const pac = num(r.pacientes) || 0;

    totalAt += at;
    totalPac += pac;

    const m = L.marker([lat, lng], { icon: iconSM });
    m.bindTooltip(`<b>${name}</b><br/>Atenciones: ${fmt(at)}<br/>Pacientes: ${fmt(pac)}`, { sticky: true, opacity: 0.95 });
    m.addTo(saludMentalLayer);
    count++;
  });

  return { totalAt, totalPac, count };
}

// ---------- Render Pacientes ----------
function renderPacientes(pacPorEfectorData, selectedIVS, selectedEfectores, selectedZonas) {
  pacientesLayer.clearLayers();
  let puestos = 0;

  const ivsSet = new Set(selectedIVS);
  const efectorSet = new Set(selectedEfectores.map(normTxt));
  const zonasSet = new Set(selectedZonas.map(normTxt));

  if (efectorSet.size === 0) {
    return { puestos: 0 };
  }

  pacPorEfectorData.forEach((r) => {
    // Filtrar por efector
    const efectorSM = normTxt(r.efector_sm || "");
    if (!efectorSet.has(efectorSM)) return;

    const lat = num(r.lat), lng = num(r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    // Filtrar por IVS si hay seleccionados
    const ivs = (r.ivs ?? "").toString().trim();
    if (ivsSet.size > 0 && ivs && !ivsSet.has(ivs)) return;

    // Filtrar por ZONA si hay seleccionadas
    if (zonasSet.size > 0) {
      const zona = normTxt(r.zona || "");
      if (zona && !zonasSet.has(zona)) return;
      if (!zona) return;
    }

    const marker = L.circleMarker([lat, lng], { 
      radius: 4, 
      weight: 1, 
      fillOpacity: 0.7,
      color: "#ffffff",
      fillColor: PACIENTES_COLOR
    });
    
    const tooltipText = ivs 
      ? `<b>Paciente</b><br/>IVS: ${ivs} - ${IVS_LABELS[ivs]}<br/>Zona: ${r.zona || 'Sin zona'}<br/>Atenciones: ${num(r.atenciones) || 0}` 
      : `<b>Paciente</b><br/>Sin IVS<br/>Zona: ${r.zona || 'Sin zona'}<br/>Atenciones: ${num(r.atenciones) || 0}`;
    marker.bindTooltip(tooltipText, { direction: "top", opacity: 0.9 });
    
    marker.addTo(pacientesLayer);
    puestos++;
  });

  return { puestos };
}

// ---------- Render Centros/Efectores Públicos ----------
function renderCentrosHorariosMulti(rows, tiposSeleccionados) {
  centrosLayer.clearLayers();

  let count = 0;
  const tiposSet = new Set(tiposSeleccionados.map(t => normTxt(t)));

  rows.forEach((r) => {
    const lat = num(r.lat), lng = num(r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (isTipoExcluido(r.tipo)) return;

    const tipo = prettyTipo(r.tipo ?? "-");
    
    if (normTxt(tipo) === normTxt("Salud Mental y Adicciones")) return;
    
    if (!tiposSet.has(normTxt(tipo))) return;

    const name = (r.centro ?? "").trim() || (r.id ?? "Efector");
    const iconName = getIconForTipo(tipo);
    const icon = iconosEstablecimientos[iconName] || iconCentroSalud;

    const m = L.marker([lat, lng], { icon });
    m.bindTooltip(`<b>${name}</b><br/>Tipo: ${tipo}`, { sticky: true, opacity: 0.95 });
    m.addTo(centrosLayer);
    count++;
  });

  return { count };
}

// ---------- Actualizar leyenda de filtros ----------
function updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS) {
  const items = [];
  
  // Siempre mostrar referencia de Paciente si hay pacientes en el mapa
  const hayPacientes = selectedSM.length > 0;
  
  if (hayPacientes) {
    items.push(`
      <div class="legend-item">
        <div class="legend-icon" style="background-color: ${PACIENTES_COLOR}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>
        <div class="legend-label">Paciente</div>
      </div>
    `);
  }
  
  // Efectores de Salud Mental
  if (selectedSM.length > 0) {
    items.push(`
      <div class="legend-item">
        <img src="./assets/hospital.png" class="legend-icon-img" alt="SM">
        <div class="legend-label">Efectores de Salud Mental</div>
      </div>
    `);
  }
  
  // Establecimientos Públicos - solo mostrar los que están filtrados
  if (selectedTipos.length > 0) {
    const tiposUnicos = new Map(); // Usamos Map para mantener orden y evitar duplicados
    
    selectedTipos.forEach(tipo => {
      const iconName = getIconForTipo(tipo);
      if (!tiposUnicos.has(iconName)) {
        // Mapear nombre de icono a nombre legible
        const labelMap = {
          "PolideportivosyParqueseducativos": "Polideportivo",
          "Parque educativo": "Parque educativo",
          "CAPS": "CAPS",
          "CPC": "CPC",
          "CentroVecinal": "Centro Vecinal",
          "CasaConvivenciales": "Casa Convivencial",
          "colegio": "Escuela / Jardín / Sala Cuna",
          "Hospitales": "Hospital",
          "EspaciodeEscuchayAcompañamiento": "Centro Comunitario",
          "CentroSalud": "Centro de Salud",
          "MedicinaPreventiva": "Medicina Preventiva",
          "DEM": "DEM",
          "odontologia": "Servicio Odontológico",
          "ReparticionSecretariaSalud": "Secretaría de Salud / Repartición"
        };
        
        const label = labelMap[iconName] || tipo;
        tiposUnicos.set(iconName, label);
      }
    });
    
    // Agregar items de tipos únicos
    tiposUnicos.forEach((label, iconName) => {
      items.push(`
        <div class="legend-item">
          <img src="./assets/${iconName}.png" class="legend-icon-img" alt="${label}">
          <div class="legend-label">${label}</div>
        </div>
      `);
    });
  }
  
  // Zonas filtradas - cada una con su color
  if (selectedZonas.length > 0) {
    selectedZonas.forEach((zona, index) => {
      const color = ZONA_COLORS[index % ZONA_COLORS.length];
      items.push(`
        <div class="legend-item">
          <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
          <div class="legend-label">${zona}</div>
        </div>
      `);
    });
  }
  
  // Seccionales filtradas - cada una con su color
  if (selectedSeccionales.length > 0) {
    selectedSeccionales.forEach((seccional, index) => {
      const color = SECCIONAL_COLORS[index % SECCIONAL_COLORS.length];
      items.push(`
        <div class="legend-item">
          <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
          <div class="legend-label">${seccional}</div>
        </div>
      `);
    });
  }
  
  // IVS filtrados - mostrar con sus colores y nombres
  if (selectedIVS.length > 0) {
    selectedIVS.forEach(ivs => {
      const color = IVS_COLORS[ivs] || "#cccccc";
      const label = IVS_LABELS[ivs] || `IVS ${ivs}`;
      items.push(`
        <div class="legend-item">
          <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
          <div class="legend-label">IVS ${ivs} - ${label}</div>
        </div>
      `);
    });
  }
  
  // Siempre mostrar la leyenda si hay items
  if (items.length > 0) {
    filterLegendEl.innerHTML = `
      <div class="filter-legend-title">📍 Referencias</div>
      ${items.join('')}
    `;
    filterLegendEl.style.display = 'block';
  } else {
    filterLegendEl.style.display = 'none';
  }
}

// ---------- Update Stats Cards ----------
function updateStats({ smCount, smAt, smPac, centrosCount, pacGeo }) {
  statEfectoresEl.textContent = smCount || '0';
  statAtencionesEl.textContent = fmt(smAt);
  statPacientesEl.textContent = fmt(smPac);
  statGeolocalizadosEl.textContent = fmt(pacGeo);
}

// ---------- Loads ----------
async function loadSaludMental() {
  setStatus("Cargando Salud Mental...");
  const json = await fetch(`./data/atenciones_salud_mental.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  smRows = json.data || [];
}

async function loadCentrosHorarios() {
  setStatus("Cargando Centros/Hospitales...");
  const json = await fetch(`./data/centros_horarios.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  chRows = json.data || [];
}

async function loadPacientesPorEfector() {
  setStatus("Cargando pacientes...");
  const json = await fetch(`./data/pacientes_sm_por_efector.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  pacPorEfectorRows = json.data || [];
}

async function loadZonas() {
  setStatus("Cargando zonas...");
  zonasGeoJSON = await fetch(`./layers/zonas.geojson?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
}

async function loadSeccionales() {
  setStatus("Cargando seccionales...");
  seccionalesGeoJSON = await fetch(`./layers/SECCIONALES.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
}

async function loadIVSBarrios() {
  setStatus("Cargando IVS por barrios...");
  ivsBarriosGeoJSON = await fetch(`./layers/ivs_barrios_4326.geojson?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
}

async function loadPacientesGlobal() {
  setStatus("Cargando total pacientes...");
  const json = await fetch(`./data/pacientes_global.json?v=${Date.now()}`, { cache: "no-store" })
    .then(r => r.json());

  pacientesGlobal = json.data?.[0]?.pacientes_unicos || 0;
}


// ---------- Aplicar filtro ----------
function applyFilter() {
  const selectedSM = smControls.getChecked();
  const selectedTipos = msControls.getChecked();
  const selectedZonas = zonasControls.getChecked();
  const selectedSeccionales = seccionalesControls.getChecked();
  const selectedIVS = ivsControls.getChecked();

  // Leyenda IVS
  const ivsBarriosActiva = map.hasLayer(ivsBarriosLayer);
  if (selectedIVS.length > 0 || ivsBarriosActiva) {
    ivsLegendEl.style.display = 'block';
  } else {
    ivsLegendEl.style.display = 'none';
  }

  // Actualizar leyenda de filtros
  updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS);

  // Actualizar título de centro filtrado
  if (selectedSM.length === 1) {
    filteredCenterEl.classList.add('show');
    filteredCenterNameEl.textContent = selectedSM[0];
  } else {
    filteredCenterEl.classList.remove('show');
  }

  // Render Zonas
  if (selectedZonas.length > 0) {
    if (!map.hasLayer(zonasLayer)) zonasLayer.addTo(map);
    renderZonas(selectedZonas);
  } else {
    zonasLayer.clearLayers();
    if (map.hasLayer(zonasLayer)) map.removeLayer(zonasLayer);
  }

  // Render Seccionales
  if (selectedSeccionales.length > 0) {
    if (!map.hasLayer(seccionalesLayer)) seccionalesLayer.addTo(map);
    renderSeccionales(selectedSeccionales);
  } else {
    seccionalesLayer.clearLayers();
    if (map.hasLayer(seccionalesLayer)) map.removeLayer(seccionalesLayer);
  }

  // Render IVS por Barrios
  if (selectedIVS.length > 0) {
    if (!map.hasLayer(ivsBarriosLayer)) ivsBarriosLayer.addTo(map);
    renderIVSBarrios(selectedIVS);
  } else {
    ivsBarriosLayer.clearLayers();
    if (map.hasLayer(ivsBarriosLayer)) map.removeLayer(ivsBarriosLayer);
  }

  // Render Salud Mental
  let smStats = { totalAt: 0, totalPac: 0, count: 0 };
  if (selectedSM.length > 0) {
    smStats = renderSaludMental(smRows, selectedSM);
  } else {
    saludMentalLayer.clearLayers();
  }

  // Render Efectores Públicos
  let centrosStats = { count: 0 };
  if (selectedTipos.length > 0) {
    if (!map.hasLayer(centrosLayer)) centrosLayer.addTo(map);
    centrosStats = renderCentrosHorariosMulti(chRows, selectedTipos);
  } else {
    centrosLayer.clearLayers();
    if (map.hasLayer(centrosLayer)) map.removeLayer(centrosLayer);
  }

  // Render Pacientes con filtro de ZONA
  const pac = renderPacientes(pacPorEfectorRows, selectedIVS, selectedSM, selectedZonas);

  // Actualizar textos de botones
  if (selectedSM.length === 0) {
    smBtn.textContent = "Ninguno";
  } else if (selectedSM.length === smRows.length) {
    smBtn.textContent = `Todos (${selectedSM.length})`;
  } else {
    smBtn.textContent = `${selectedSM.length} seleccionados`;
  }

  if (selectedTipos.length === 0) {
    msBtn.textContent = "Ninguno";
  } else {
    const totalTipos = msList.querySelectorAll("input[type=checkbox]").length;
    if (selectedTipos.length === totalTipos) {
      msBtn.textContent = "Todos";
    } else if (selectedTipos.length === 1) {
      msBtn.textContent = selectedTipos[0];
    } else {
      msBtn.textContent = `${selectedTipos.length} seleccionados`;
    }
  }

  if (selectedZonas.length === 0) {
    zonasBtn.textContent = "Ninguna";
  } else if (selectedZonas.length === zonasList.querySelectorAll("input[type=checkbox]").length) {
    zonasBtn.textContent = "Todas";
  } else {
    zonasBtn.textContent = `${selectedZonas.length} seleccionadas`;
  }

  if (selectedSeccionales.length === 0) {
    seccionalesBtn.textContent = "Ninguna";
  } else if (selectedSeccionales.length === seccionalesList.querySelectorAll("input[type=checkbox]").length) {
    seccionalesBtn.textContent = "Todas";
  } else {
    seccionalesBtn.textContent = `${selectedSeccionales.length} seleccionadas`;
  }

  if (selectedIVS.length === 5) {
    ivsBtn.textContent = "Todos";
  } else if (selectedIVS.length === 0) {
    ivsBtn.textContent = "Ninguno";
  } else {
    ivsBtn.textContent = `IVS: ${selectedIVS.join(", ")}`;
  }

  // Pacientes: si hay 1 efector seleccionado, mostrar pacientes de ese efector
// Si no, mostrar el total global único
const pacientesParaMostrar =
  (selectedSM.length === 1) ? (smStats.totalPac || 0) : (pacientesGlobal || 0);

updateStats({
  smCount: smStats.count,
  smAt: smStats.totalAt,
  smPac: pacientesParaMostrar,
  centrosCount: centrosStats.count,
  pacGeo: pac.puestos
});


  setStatus("✓ Datos cargados correctamente", true);
}

// ---------- Limpiar todos los filtros ----------
clearFiltersBtn.addEventListener("click", () => {
  smControls.setAllChecks(true);
  msControls.setAllChecks(false);
  zonasControls.setAllChecks(false);
  seccionalesControls.setAllChecks(false);
  ivsControls.setAllChecks(false);
  applyFilter();
});

// ---------- Init ----------
(async function main() {
  try {
    await loadSaludMental();
    await loadCentrosHorarios();
    await loadPacientesPorEfector();
    await loadZonas();
    await loadSeccionales();
    await loadIVSBarrios();
    await loadPacientesGlobal();

    buildSaludMentalDropdown(smRows);
    buildOtrosEfectoresDropdown(chRows);
    buildZonasDropdown(zonasGeoJSON);
    buildSeccionalesDropdown(seccionalesGeoJSON);
    buildIVSDropdown();

    // Setup dropdowns
    smControls = setupDropdown(smWrap, smBtn, smDrop, smList, smAll, smNone, smApply, applyFilter);
    msControls = setupDropdown(msWrap, msBtn, msDrop, msList, msAll, msNone, msApply, applyFilter);
    zonasControls = setupDropdown(zonasWrap, zonasBtn, zonasDrop, zonasList, zonasAll, zonasNone, zonasApply, applyFilter);
    seccionalesControls = setupDropdown(seccionalesWrap, seccionalesBtn, seccionalesDrop, seccionalesList, seccionalesAll, seccionalesNone, seccionalesApply, applyFilter);
    ivsControls = setupDropdown(ivsWrap, ivsBtn, ivsDrop, ivsList, ivsAll, ivsNone, ivsApply, applyFilter);

    ivsLegendEl.style.display = 'none';
    filterLegendEl.style.display = 'none';

    applyFilter();
  } catch (e) {
    console.error(e);
    setStatus("❌ Error cargando archivos");
  }
})();
