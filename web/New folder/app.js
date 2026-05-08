// ---------- Helpers UI ----------
const statusEl = document.getElementById("status");
const ivsLegendEl = document.getElementById("ivsLegend");
const filterLegendEl = document.getElementById("filterLegend");

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
  return false;
}

// ---------- Mapeo de iconos por tipo ----------
const TIPO_ICON_MAP = {
  // Polideportivo, Parque educativo
  "POLIDEPORTIVO": "PolideportivosyParqueseducativos",
  "PARQUE EDUCATIVO": "PolideportivosyParqueseducativos",
  
  // CAPS
  "CAPS": "CAPS",
  
  // CPC
  "CPC": "CPC",
  
  // Centro Vecinal y Comisión de Vecinos
  "CENTRO VECINAL": "CentroVecinal",
  "COMISION DE VECINOS": "CentroVecinal",
  
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
  
  // Medicina Preventiva y DEM
  "MEDICINA PREVENTIVA": "DEM",
  "DEM": "DEM",
  
  // Servicio Odontológico
  "SERVICIO ODONTOLOGICO MUNICIPAL": "odontologia"
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

// ---------- Data storage ----------
let smRows = [];
let chRows = [];
let pacPorEfectorRows = [];
let zonasGeoJSON = null;
let ivsBarriosGeoJSON = null;
let seccionalesGeoJSON = null;

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
        // Filtrar MAYUSCULAS, EAC, Pcch
        return normalized !== "MAYUSCULAS" && 
               normalized !== "EAC" && 
               normalized !== "PCCH";
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
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  tooltipAnchor: [0, -50],
});

// Iconos para establecimientos públicos
const iconosEstablecimientos = {
  "PolideportivosyParqueseducativos": L.icon({
    iconUrl: "./assets/PolideportivosyParqueseducativos.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "CAPS": L.icon({
    iconUrl: "./assets/CAPS.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "CPC": L.icon({
    iconUrl: "./assets/CPC.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "CentroVecinal": L.icon({
    iconUrl: "./assets/CentroVecinal.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "CasaConvivenciales": L.icon({
    iconUrl: "./assets/CasaConvivenciales.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "colegio": L.icon({
    iconUrl: "./assets/colegio.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "Hospitales": L.icon({
    iconUrl: "./assets/Hospitales.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "EspaciodeEscuchayAcompañamiento": L.icon({
    iconUrl: "./assets/EspaciodeEscuchayAcompañamiento.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "CentroSalud": L.icon({
    iconUrl: "./assets/CentroSalud.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "DEM": L.icon({
    iconUrl: "./assets/DEM.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
  "odontologia": L.icon({
    iconUrl: "./assets/odontologia.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    tooltipAnchor: [0, -42],
  }),
};

// Iconos legacy (por si acaso)
const iconHospitalMunicipal = iconosEstablecimientos["Hospitales"];
const iconCentroSalud = iconosEstablecimientos["CentroSalud"];

// ---------- Render Zonas ----------
function renderZonas(selectedZonas) {
  zonasLayer.clearLayers();
  
  const selSet = new Set(selectedZonas.map(normTxt));
  
  zonasGeoJSON.features.forEach((feat) => {
    const name = feat.properties.name;
    if (!name || !selSet.has(normTxt(name))) return;
    
    const layer = L.geoJSON(feat, {
      style: {
        color: "#3498db",
        weight: 2,
        fillOpacity: 0.1,
        fillColor: "#3498db"
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
  
  seccionalesGeoJSON.features.forEach((feat) => {
    const name = feat.properties.NOMBRE || feat.properties.nombre || feat.properties.name;
    if (!name || !selSet.has(normTxt(name))) return;
    
    const layer = L.geoJSON(feat, {
      style: {
        color: "#9b59b6",
        weight: 2,
        fillOpacity: 0.1,
        fillColor: "#9b59b6"
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
function updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales) {
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
          "PolideportivosyParqueseducativos": "Polideportivo / Parque educativo",
          "CAPS": "CAPS",
          "CPC": "CPC",
          "CentroVecinal": "Centro Vecinal",
          "CasaConvivenciales": "Casa Convivencial",
          "colegio": "Escuela / Jardín / Sala Cuna",
          "Hospitales": "Hospital",
          "EspaciodeEscuchayAcompañamiento": "Centro Comunitario",
          "CentroSalud": "Centro de Salud",
          "DEM": "Medicina Preventiva / DEM",
          "odontologia": "Servicio Odontológico"
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
  
  // Zonas filtradas
  if (selectedZonas.length > 0) {
    selectedZonas.forEach(zona => {
      items.push(`
        <div class="legend-item">
          <div class="legend-icon" style="background-color: #3498db; width: 16px; height: 16px; border-radius: 3px; border: 2px solid #3498db;"></div>
          <div class="legend-label">${zona}</div>
        </div>
      `);
    });
  }
  
  // Seccionales filtradas
  if (selectedSeccionales.length > 0) {
    selectedSeccionales.forEach(seccional => {
      items.push(`
        <div class="legend-item">
          <div class="legend-icon" style="background-color: #9b59b6; width: 16px; height: 16px; border-radius: 3px; border: 2px solid #9b59b6;"></div>
          <div class="legend-label">${seccional}</div>
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
  updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales);

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

  updateStats({
    smCount: smStats.count,
    smAt: smStats.totalAt,
    smPac: smStats.totalPac,
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
