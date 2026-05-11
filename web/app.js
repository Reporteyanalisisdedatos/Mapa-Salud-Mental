// ---------- Helpers UI ----------
const statusEl = document.getElementById("status");
const ivsLegendEl = document.getElementById("ivsLegend");
const filterLegendEl = document.getElementById("filterLegend");
const filteredCenterEl = document.getElementById("filteredCenter");
const filteredCenterNameEl = document.getElementById("filteredCenterName");

// Stats
const statEfectoresEl      = document.getElementById("statEfectores");
const statAtencionesEl     = document.getElementById("statAtenciones");
const statPacientesEl      = document.getElementById("statPacientes");
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
const suicidioBtn     = document.getElementById("suicidioBtn");

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
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();
}

function prettyTipo(tipo) {
  return normTxt(tipo) === "SALUD MENTAL" ? "Salud Mental y Adicciones" : tipo;
}

function isTipoExcluido(tipoRaw) {
  const t = normTxt(tipoRaw);
  return t.includes("CLINICA") || t.includes("HOSPITAL PROVINCIAL CORDOBA") || t === "MAYUSCULAS";
}

// ---------- Mapeo de iconos por tipo ----------
const TIPO_ICON_MAP = {
  "POLIDEPORTIVO": "PolideportivosyParqueseducativos",
  "PARQUE EDUCATIVO": "Parque educativo",
  "CAPS": "CAPS",
  "CPC": "CPC",
  "CENTRO VECINAL": "CentroVecinal",
  "COMISION DE VECINOS": "ComisiondeVecinos",
  "CASA CONVIVENCIAL": "CasaConvivenciales",
  "ESCUELA MUNICIPAL": "colegio",
  "JARDINES MUNICIPALES": "colegio",
  "SALA CUNA": "colegio",
  "HOSPITAL DE PRONTA ATENCION": "Hospitales",
  "HOSPITAL MUNICIPAL CORDOBA": "Hospitales",
  "PADRE LA MONACA": "Hospitales",
  "CENTRO COMUNITARIO": "EspaciodeEscuchayAcompañamiento",
  "CENTRO DE SALUD": "CentroSalud",
  "MEDICINA PREVENTIVA": "MedicinaPreventiva",
  "DEM": "DEM",
  "SERVICIO ODONTOLOGICO MUNICIPAL": "odontologia",
  "SECRETARIA DE SALUD": "ReparticionSecretariaSalud",
  "REPARTICION": "ReparticionSecretariaSalud"
};

// Claves pre-normalizadas una vez al inicio
const _TIPO_NORM = Object.fromEntries(
  Object.entries(TIPO_ICON_MAP).map(([k, v]) => [normTxt(k), v])
);

function getIconForTipo(tipo) {
  const t = normTxt(tipo);
  for (const [key, iconName] of Object.entries(_TIPO_NORM)) {
    if (t.includes(key)) return iconName;
  }
  return "CentroSalud";
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

const PACIENTES_COLOR = "#61CE70";

const ZONA_COLORS = [
  "#3498db", "#2ecc71", "#e74c3c", "#f39c12",
  "#9b59b6", "#1abc9c", "#34495e", "#e67e22",
  "#16a085", "#27ae60", "#2980b9", "#8e44ad"
];

const SECCIONAL_COLORS = [
  "#9b59b6", "#e91e63", "#ff5722", "#795548",
  "#607d8b", "#00bcd4", "#cddc39", "#ffc107",
  "#ff9800", "#673ab7", "#3f51b5", "#009688",
  "#8bc34a", "#ffeb3b"
];

// Etiquetas legibles para la leyenda
const ICON_LABEL_MAP = {
  "PolideportivosyParqueseducativos": "Polideportivo",
  "Parque educativo": "Parque educativo",
  "CAPS": "CAPS",
  "CPC": "CPC",
  "CentroVecinal": "Centro Vecinal",
  "ComisiondeVecinos": "Comisión de Vecinos",
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

// Constantes normalizadas frecuentes
const _SM_NORM      = normTxt("Salud Mental y Adicciones");
const _DSM_NORM     = normTxt("DIRECCION DE SALUD MENTAL");
const _TRAMAS_NORM  = normTxt("CENTRO MUNICIPAL DE SALUD MENTAL - TRAMAS");
const _TRAMAS_LABEL = "Centro Municipal de Salud Mental - Tramas";
const _EXCLUDED_CODES = new Set(["MAYUSCULAS", "EAC", "PCCH"]);

// ---------- Data storage ----------
let smRows = [];
let chRows = [];
let smServiciosRows = [];
let pacPorEfectorRows = [];
let zonasGeoJSON = null;
let zonasPoligonosIndex = [];
let ivsBarriosGeoJSON = null;
let ivsPoligonosGeoJSON = null;
let ivsPoligonosIndex = [];
let seccionalesGeoJSON = null;
let seccionalesIndex = [];
let pacientesGlobal = 0;
let suicidioRows = [];
let suicidioModoActivo = false;

// ---------- Controles de filtros ----------
let smControls, msControls, zonasControls, seccionalesControls, ivsControls;

// -------------------------------
// Dropdown builders
// -------------------------------
function buildSaludMentalDropdown(rows) {
  const efectores = rows
    .map(r => ({ id: r.centro || r.efector_id || "Sin nombre", nombre: r.centro || r.efector_id || "Sin nombre" }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  smList.innerHTML = efectores.map(e => `
    <label class="ms-item">
      <input type="checkbox" value="${e.id.replace(/"/g,'&quot;')}" checked>
      <span>${e.nombre}</span>
    </label>
  `).join("");

  smBtn.textContent = `Todos (${efectores.length})`;
}

function buildOtrosEfectoresDropdown(rows) {
  const tipos = [...new Set(
    (rows || [])
      .map(r => prettyTipo((r.tipo ?? "").toString().trim()))
      .filter(t => {
        if (!t) return false;
        const n = normTxt(t);
        return !isTipoExcluido(t) && n !== _SM_NORM && !_EXCLUDED_CODES.has(n) && !n.includes("MAYUSCULA");
      })
  )].sort((a, b) => a.localeCompare(b, "es"));

  msList.innerHTML = tipos.map(t => `
    <label class="ms-item">
      <input type="checkbox" value="${t.replace(/"/g,'&quot;')}">
      <span>${t}</span>
    </label>
  `).join("");

  msBtn.textContent = "Ninguno";
}

function buildZonasDropdown(zonas) {
  const names = zonas.features.map(f => f.properties.name).filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));

  zonasList.innerHTML = names.map(z => `
    <label class="ms-item">
      <input type="checkbox" value="${z.replace(/"/g,'&quot;')}">
      <span>${z}</span>
    </label>
  `).join("");

  zonasBtn.textContent = "Ninguna";
}

function buildSeccionalesDropdown(seccionales) {
  const names = seccionales.features
    .map(f => f.properties.NOMBRE || f.properties.nombre || f.properties.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es"));

  seccionalesList.innerHTML = names.map(s => `
    <label class="ms-item">
      <input type="checkbox" value="${s.replace(/"/g,'&quot;')}">
      <span>${s}</span>
    </label>
  `).join("");

  seccionalesBtn.textContent = "Ninguna";
}

function buildIVSDropdown() {
  ivsList.innerHTML = ["1", "2", "3", "4", "5"].map(ivs => `
    <label class="ms-item">
      <input type="checkbox" value="${ivs}">
      <span class="ivs-indicator" style="background-color: ${IVS_COLORS[ivs]}"></span>
      <span>IVS ${ivs} - ${IVS_LABELS[ivs]}</span>
    </label>
  `).join("");

  ivsBtn.textContent = "Ninguno";
}

// ---------- Dropdown handlers (un único listener global) ----------
const _dropRegistry = [];

document.addEventListener("click", (e) => {
  _dropRegistry.forEach(([wrap, drop]) => {
    if (!wrap.contains(e.target)) drop.classList.remove("open");
  });
});

function setupDropdown(wrapEl, btnEl, dropEl, listEl, allBtn, noneBtn, applyBtn, callback) {
  _dropRegistry.push([wrapEl, dropEl]);

  function openDrop(v) { dropEl.classList.toggle("open", v); }

  btnEl.addEventListener("click", () => openDrop(!dropEl.classList.contains("open")));

  function getChecked() {
    return [...listEl.querySelectorAll("input[type=checkbox]:checked")].map(chk => chk.value);
  }

  function setAllChecks(state) {
    listEl.querySelectorAll("input[type=checkbox]").forEach(chk => { chk.checked = state; });
  }

  allBtn.addEventListener("click", () => setAllChecks(true));
  noneBtn.addEventListener("click", () => setAllChecks(false));
  applyBtn.addEventListener("click", () => { openDrop(false); callback(); });

  return { getChecked, setAllChecks };
}

// ---------- Mapa centrado en Córdoba ----------
const map = L.map("map", { preferCanvas: true }).setView([-31.4135, -64.1807], 12);

L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
  maxZoom: 19,
  attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://carto.com/'>CARTO</a>"
}).addTo(map);

// ---------- Leaflet layers ----------
const saludMentalLayer = L.layerGroup().addTo(map);
const centrosLayer     = L.layerGroup();
const pacientesLayer   = L.layerGroup().addTo(map);
const zonasLayer       = L.layerGroup();
const ivsBarriosLayer  = L.layerGroup();
const seccionalesLayer = L.layerGroup();
const suicidioLayer    = L.layerGroup();

// Helper: mostrar/ocultar layer + renderizar — reemplaza el patrón repetido 20 veces
function setLayer(layer, show, renderFn) {
  if (show) {
    if (!map.hasLayer(layer)) layer.addTo(map);
    if (renderFn) renderFn();
  } else {
    layer.clearLayers();
    if (map.hasLayer(layer)) map.removeLayer(layer);
  }
}

// ---------- Iconos ----------
function makeEstIcon(name) {
  return L.icon({
    iconUrl: `./assets/${name}.png`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    tooltipAnchor: [0, -32],
  });
}

const iconSM = L.icon({
  iconUrl: "./assets/efector_sm.png",
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  tooltipAnchor: [0, -52],
});

const iconosEstablecimientos = {};

const iconCentroSalud = L.icon({
  iconUrl: "./assets/alfiler.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  tooltipAnchor: [0, -38],
});

const iconSuicidio = L.icon({
  iconUrl: "./assets/intento_suicidio.png",
  iconSize: [25, 25],
  iconAnchor: [18, 36],
  tooltipAnchor: [0, -36],
});

// ---------- Point-in-polygon ----------
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function getIVSFromCoords(lat, lng) {
  for (const poly of ivsPoligonosIndex) {
    if (lng < poly.minLng || lng > poly.maxLng || lat < poly.minLat || lat > poly.maxLat) continue;
    if (pointInRing(lng, lat, poly.ring)) return { ivs: poly.ivs, barrio: poly.barrio };
  }
  return { ivs: null, barrio: null };
}

function getZonaFromCoords(lat, lng) {
  for (const poly of zonasPoligonosIndex) {
    if (lng < poly.minLng || lng > poly.maxLng || lat < poly.minLat || lat > poly.maxLat) continue;
    if (pointInRing(lng, lat, poly.ring)) return poly.name;
  }
  return null;
}

function getSeccionaFromCoords(lat, lng) {
  for (const poly of seccionalesIndex) {
    if (lng < poly.minLng || lng > poly.maxLng || lat < poly.minLat || lat > poly.maxLat) continue;
    if (pointInRing(lng, lat, poly.ring)) return poly.name;
  }
  return null;
}

// ---------- Parsear año desde campo FIS ----------
function parsearAnioFIS(fis) {
  if (!fis) return null;
  const s = fis.toString().trim();
  const m1 = s.match(/(\d{4})$/);
  if (m1) return m1[1];
  const m2 = s.match(/^(\d{4})-/);
  if (m2) return m2[1];
  return null;
}

// ---------- Pre-computar lookups espaciales (se ejecuta una vez al cargar) ----------
// Elimina N×M tests de polígono (N filas × M aplicaciones de filtro)
function precomputePacientes() {
  pacPorEfectorRows.forEach(r => {
    const lat = num(r.lat), lng = num(r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      r._valid = false;
      return;
    }
    r._valid = true;
    r._lat = lat;
    r._lng = lng;

    let esm = normTxt(r.efector_sm || "");
    let eid = normTxt(r.efector_id || "");
    if (esm === _DSM_NORM || eid === _DSM_NORM) esm = eid = _TRAMAS_NORM;
    r._efectorSM = esm;
    r._efectorId = eid;

    const lugarRaw = (r.efector_sm || "").trim();
    r._lugar = normTxt(lugarRaw) === _DSM_NORM ? _TRAMAS_LABEL : lugarRaw;

    const geo = getIVSFromCoords(lat, lng);
    r._ivs = geo.ivs || "";

    r._zona     = getZonaFromCoords(lat, lng);
    r._zonaNorm = r._zona ? normTxt(r._zona) : null;
  });
}

function precomputeSuicidio() {
  suicidioRows.forEach(r => {
    const lat = num(r.Latitud ?? r.latitud ?? r.lat);
    const lng = num(r.Longitud ?? r.longitud ?? r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      r._valid = false;
      return;
    }
    r._valid = true;
    r._lat = lat;
    r._lng = lng;
    r._zona = getZonaFromCoords(lat, lng);
    r._secc = getSeccionaFromCoords(lat, lng);
    const { ivs } = getIVSFromCoords(lat, lng);
    r._ivs = ivs || null;
  });

  // Cachear mapa Documento→{anio,sexo} del JSON completo (antes se reconstruía en cada filtro)
  window._completoMap = {};
  (window.suicidioRowsCompleto || []).forEach(r => {
    const doc = (r.Documento ?? r.documento ?? "").toString().trim();
    if (doc) window._completoMap[doc] = {
      anio: (r.ANOFIS ?? r.anofis ?? "").toString().trim() || parsearAnioFIS((r.FIS ?? "").toString()),
      sexo: (r.Sexo ?? "").toString().trim().toUpperCase()
    };
  });
}

// ---------- Render Zonas ----------
function renderZonas(selectedZonas) {
  zonasLayer.clearLayers();

  // Normalizar una sola vez por zona seleccionada
  const colorMap = {};
  selectedZonas.forEach((z, i) => { colorMap[normTxt(z)] = ZONA_COLORS[i % ZONA_COLORS.length]; });
  const selSet = new Set(Object.keys(colorMap));

  zonasGeoJSON.features.forEach((feat) => {
    const name = feat.properties.name;
    if (!name) return;
    const normName = normTxt(name);
    if (!selSet.has(normName)) return;
    const color = colorMap[normName] || ZONA_COLORS[0];
    const layer = L.geoJSON(feat, { style: { color, weight: 2, fillOpacity: 0.15, fillColor: color } });
    layer.bindTooltip(`<b>Zona: ${name}</b>`, { sticky: true, opacity: 0.9 });
    layer.addTo(zonasLayer);
  });
}

// ---------- Render Seccionales ----------
function renderSeccionales(selectedSeccionales) {
  seccionalesLayer.clearLayers();

  const colorMap = {};
  selectedSeccionales.forEach((s, i) => { colorMap[normTxt(s)] = SECCIONAL_COLORS[i % SECCIONAL_COLORS.length]; });
  const selSet = new Set(Object.keys(colorMap));

  seccionalesGeoJSON.features.forEach((feat) => {
    const name = feat.properties.NOMBRE || feat.properties.nombre || feat.properties.name;
    if (!name) return;
    const normName = normTxt(name);
    if (!selSet.has(normName)) return;
    const color = colorMap[normName] || SECCIONAL_COLORS[0];
    const layer = L.geoJSON(feat, { style: { color, weight: 2, fillOpacity: 0.15, fillColor: color } });
    layer.bindTooltip(`<b>Seccional: ${name}</b>`, { sticky: true, opacity: 0.9 });
    layer.addTo(seccionalesLayer);
  });
}

// ---------- Render IVS Barrios ----------
function renderIVSBarrios(selectedIVS) {
  ivsBarriosLayer.clearLayers();
  const ivsSet = new Set(selectedIVS);

  ivsBarriosGeoJSON.features.forEach((feat) => {
    const ivs = (feat.properties.ivs_2024_1 ?? "").toString().trim();
    if (!ivs || !ivsSet.has(ivs)) return;
    const color = IVS_COLORS[ivs] || "#cccccc";
    const layer = L.geoJSON(feat, { style: { color, weight: 1, fillOpacity: 0.4, fillColor: color } });
    const barrio = feat.properties.ivs_2024_v || "Sin nombre";
    layer.bindTooltip(`<b>${barrio}</b><br/>IVS: ${ivs} — ${IVS_LABELS[ivs]}`, { sticky: true, opacity: 0.9 });
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
    if (!selSet.has(normTxt(r.centro || r.efector_id || ""))) return;

    const name = (r.centro ?? "Sin nombre").trim();
    const at = num(r.atenciones) || 0;
    const pac = num(r.pacientes) || 0;
    totalAt += at;
    totalPac += pac;

    const m = L.marker([lat, lng], { icon: iconSM });
    m.bindTooltip(
      `<div class="pac-tt-header">🏥 Efector de Salud Mental</div>` +
      `<div class="pac-tt-body">` +
        `<span class="pac-tt-label">Centro</span><span class="pac-tt-value">${name}</span>` +
        `<div class="pac-tt-divider"></div>` +
        `<div class="pac-tt-stat">` +
          `<div class="pac-tt-stat-item"><div class="pac-tt-stat-label">Atenciones</div><div class="pac-tt-stat-value">${fmt(at)}</div></div>` +
          `<div class="pac-tt-stat-item"><div class="pac-tt-stat-label">Pacientes</div><div class="pac-tt-stat-value">${fmt(pac)}</div></div>` +
        `</div>` +
      `</div>`,
      { sticky: true, opacity: 1, className: "pac-tooltip sm-tooltip" }
    );
    m.on('click', () => openSMDetail(name, at, pac, lat, lng));
    m.addTo(saludMentalLayer);
    count++;
  });

  return { totalAt, totalPac, count };
}

// ---------- Render Pacientes (usa valores pre-computados) ----------
function renderPacientes(pacPorEfectorData, selectedIVS, selectedEfectores, selectedZonas) {
  pacientesLayer.clearLayers();
  let puestos = 0;

  const ivsSet     = new Set(selectedIVS);
  const efectorSet = new Set(selectedEfectores.map(normTxt));
  const zonasSet   = new Set(selectedZonas.map(normTxt));

  if (efectorSet.size === 0) return { puestos: 0 };

  pacPorEfectorData.forEach((r) => {
    if (!r._valid) return;
    if (!efectorSet.has(r._efectorSM) && !efectorSet.has(r._efectorId)) return;
    if (ivsSet.size > 0 && (!r._ivs || !ivsSet.has(r._ivs))) return;
    if (zonasSet.size > 0 && !zonasSet.has(r._zonaNorm)) return;

    const pacColor = (ivsSet.size > 0 && r._ivs && IVS_COLORS[r._ivs]) ? IVS_COLORS[r._ivs] : PACIENTES_COLOR;
    const marker = L.circleMarker([r._lat, r._lng], {
      radius: 7, weight: 2, fillOpacity: 0.85,
      color: "#ffffff", fillColor: pacColor
    });

    marker.bindTooltip(
      `<div class="pac-tt-header">👤 Paciente</div>` +
      `<div class="pac-tt-body">` +
        `<span class="pac-tt-label">Efector</span><span class="pac-tt-value">${r._lugar || 'Sin dato'}</span>` +
        `<span class="pac-tt-label">Atenciones</span><span class="pac-tt-value">${num(r.atenciones) || 0}</span>` +
        `<span class="pac-tt-label">Zona</span><span class="pac-tt-value">${r._zona || 'Sin zona'}</span>` +
        `<span class="pac-tt-label">IVS</span><span class="pac-tt-value">${r._ivs ? `${r._ivs} — ${IVS_LABELS[r._ivs]}` : 'Sin dato'}</span>` +
      `</div>`,
      { direction: "top", opacity: 1, className: "pac-tooltip" }
    );
    marker.addTo(pacientesLayer);
    puestos++;
  });

  return { puestos };
}

// ---------- Render Centros/Efectores Públicos ----------
function renderCentrosHorariosMulti(rows, tiposSeleccionados) {
  centrosLayer.clearLayers();
  let count = 0;
  const tiposSet = new Set(tiposSeleccionados.map(normTxt));

  rows.forEach((r) => {
    const lat = num(r.lat), lng = num(r.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (isTipoExcluido(r.tipo)) return;

    const tipo     = prettyTipo(r.tipo ?? "-");
    const tipoNorm = normTxt(tipo);
    if (tipoNorm === _SM_NORM || !tiposSet.has(tipoNorm)) return;

    const name = (r.centro ?? "").trim() || (r.id ?? "Efector");
    const icon = iconosEstablecimientos[getIconForTipo(tipo)] || iconCentroSalud;

    const m = L.marker([lat, lng], { icon });
    m.bindTooltip(
      `<div class="pac-tt-header">🏛️ Establecimiento Público</div>` +
      `<div class="pac-tt-body">` +
        `<span class="pac-tt-label">Nombre</span><span class="pac-tt-value">${name}</span>` +
        `<span class="pac-tt-label">Tipo</span><span class="pac-tt-value">${tipo}</span>` +
      `</div>`,
      { sticky: true, opacity: 1, className: "pac-tooltip est-tooltip" }
    );
    m.addTo(centrosLayer);
    count++;
  });

  return { count };
}

// ---------- Actualizar leyenda de filtros ----------
function updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS) {
  const items = [];

  if (selectedSM.length > 0) {
    items.push(`
      <div class="legend-item">
        <div class="legend-icon" style="background-color: ${PACIENTES_COLOR}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>
        <div class="legend-label">Paciente</div>
      </div>
      <div class="legend-item">
        <img src="./assets/efector_sm.png" class="legend-icon-img" alt="SM">
        <div class="legend-label">Efectores de Salud Mental</div>
      </div>
    `);
  }

  if (selectedTipos.length > 0) {
    const tiposUnicos = new Map();
    selectedTipos.forEach(tipo => {
      const iconName = getIconForTipo(tipo);
      if (!tiposUnicos.has(iconName)) tiposUnicos.set(iconName, ICON_LABEL_MAP[iconName] || tipo);
    });
    tiposUnicos.forEach((label, iconName) => {
      items.push(`
        <div class="legend-item">
          <img src="./assets/${iconName}.png" class="legend-icon-img" alt="${label}">
          <div class="legend-label">${label}</div>
        </div>
      `);
    });
  }

  selectedZonas.forEach((zona, i) => {
    const color = ZONA_COLORS[i % ZONA_COLORS.length];
    items.push(`
      <div class="legend-item">
        <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
        <div class="legend-label">${zona}</div>
      </div>
    `);
  });

  selectedSeccionales.forEach((seccional, i) => {
    const color = SECCIONAL_COLORS[i % SECCIONAL_COLORS.length];
    items.push(`
      <div class="legend-item">
        <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
        <div class="legend-label">${seccional}</div>
      </div>
    `);
  });

  selectedIVS.forEach(ivs => {
    const color = IVS_COLORS[ivs] || "#cccccc";
    items.push(`
      <div class="legend-item">
        <div class="legend-icon" style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid ${color};"></div>
        <div class="legend-label">IVS ${ivs} - ${IVS_LABELS[ivs] || `IVS ${ivs}`}</div>
      </div>
    `);
  });

  if (items.length > 0) {
    filterLegendEl.innerHTML = `<div class="filter-legend-title">📍 Referencias</div>${items.join('')}`;
    filterLegendEl.style.display = 'block';
  } else {
    filterLegendEl.style.display = 'none';
  }
}

// ---------- Update Stats Cards ----------
function updateStats({ smCount, smAt, smPac, centrosCount, pacGeo }) {
  statEfectoresEl.textContent      = smCount || '0';
  statAtencionesEl.textContent     = fmt(smAt);
  statPacientesEl.textContent      = fmt(smPac);
  statGeolocalizadosEl.textContent = fmt(pacGeo);
}

// ---------- Carga de datos ----------
async function loadSaludMental() {
  const json = await fetch(`./data/atenciones_salud_mental.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  const rawRows = json.data || [];

  const tramas = rawRows.find(r => normTxt(r.centro || r.efector_id || "") === _TRAMAS_NORM);
  const dsm    = rawRows.find(r => normTxt(r.centro || r.efector_id || "") === _DSM_NORM);

  if (tramas && dsm) {
    tramas.atenciones = (num(tramas.atenciones) || 0) + (num(dsm.atenciones) || 0);
    tramas.pacientes  = (num(tramas.pacientes)  || 0) + (num(dsm.pacientes)  || 0);
    smRows = rawRows.filter(r => normTxt(r.centro || r.efector_id || "") !== _DSM_NORM);
  } else {
    smRows = rawRows;
    console.warn("Fusión Tramas/DSM: no se encontraron ambos efectores.", { tramas: !!tramas, dsm: !!dsm });
  }
}

async function loadCentrosHorarios() {
  const json = await fetch(`./data/centros_horarios.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  chRows = json.data || [];
}

async function loadServiciosCentros() {
  const json = await fetch(`./data/servicios_centros.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  smServiciosRows = json.data || [];
}

async function loadPacientesPorEfector() {
  const json = await fetch(`./data/pacientes_sm_por_efector.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  pacPorEfectorRows = json.data || [];
}

async function loadZonas() {
  zonasGeoJSON = await fetch(`./layers/zonas.geojson?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  zonasPoligonosIndex = [];
  zonasGeoJSON.features.forEach(f => {
    const name = f.properties.name;
    if (!name || !f.geometry) return;
    const geom = f.geometry;
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    polys.forEach(polyCoords => {
      const ring = polyCoords[0];
      const lngs = ring.map(c => c[0]);
      const lats = ring.map(c => c[1]);
      zonasPoligonosIndex.push({
        name,
        minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
        minLat: Math.min(...lats), maxLat: Math.max(...lats),
        ring
      });
    });
  });
  console.log(`Índice Zonas: ${zonasPoligonosIndex.length} polígonos`);
}

async function loadSeccionales() {
  seccionalesGeoJSON = await fetch(`./layers/SECCIONALES.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  seccionalesIndex = [];
  seccionalesGeoJSON.features.forEach(f => {
    const name = f.properties.NOMBRE || f.properties.nombre || f.properties.name;
    if (!name || !f.geometry) return;
    const geom = f.geometry;
    const rings = geom.type === 'Polygon'
      ? [geom.coordinates[0]]
      : geom.coordinates.map(p => p[0]);
    rings.forEach(ring => {
      const lngs = ring.map(c => c[0]);
      const lats = ring.map(c => c[1]);
      seccionalesIndex.push({
        name,
        minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
        minLat: Math.min(...lats), maxLat: Math.max(...lats),
        ring
      });
    });
  });
  console.log(`Índice Seccionales: ${seccionalesIndex.length} polígonos`);
}

async function loadIVSBarrios() {
  ivsBarriosGeoJSON = await fetch(`./layers/ivs_barrios_4326.geojson?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
}

async function loadIVSPoligonos() {
  ivsPoligonosGeoJSON = await fetch(`./layers/polygons_4326.geojson?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  ivsPoligonosIndex = ivsPoligonosGeoJSON.features
    .filter(f => f.properties.ivs_2024_1 && f.properties.ivs_2024_1.trim() !== '')
    .map(f => {
      const ring = f.geometry.type === 'Polygon'
        ? f.geometry.coordinates[0]
        : f.geometry.coordinates[0][0];
      const lngs = ring.map(c => c[0]);
      const lats = ring.map(c => c[1]);
      return {
        ivs: f.properties.ivs_2024_1.trim(),
        barrio: f.properties.ivs_2024_v || '',
        minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
        minLat: Math.min(...lats), maxLat: Math.max(...lats),
        ring
      };
    });
  console.log(`Índice IVS: ${ivsPoligonosIndex.length} polígonos`);
}

async function loadPacientesGlobal() {
  const json = await fetch(`./data/pacientes_global.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json());
  pacientesGlobal = json.data?.[0]?.pacientes_unicos || 0;
}

async function loadSuicidio() {
  const [res1, res2] = await Promise.allSettled([
    fetch(`./data/intentos_suicidios.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json()),
    fetch(`./data/intento-suicidio_completa.json?v=${Date.now()}`, { cache: "no-store" }).then(r => r.json())
  ]);
  suicidioRows = res1.status === 'fulfilled' ? (res1.value.data || []) : [];
  window.suicidioRowsCompleto = res2.status === 'fulfilled' ? (res2.value.data || []) : suicidioRows;
  if (res1.status === 'rejected') console.warn("No se pudo cargar intentos_suicidios.json:", res1.reason);
  console.log(`Suicidio: ${suicidioRows.length} geolocalizados, ${window.suicidioRowsCompleto.length} completo`);
}

// ---------- Render Intentos de Suicidio (usa valores pre-computados) ----------
function renderSuicidio() {
  suicidioLayer.clearLayers();

  const selectedZonas       = zonasControls.getChecked();
  const selectedSeccionales = seccionalesControls.getChecked();
  const selectedIVS         = ivsControls.getChecked();

  const totalZonasCbs = zonasList ? zonasList.querySelectorAll("input[type=checkbox]").length : 0;
  const todasZonasSel = totalZonasCbs > 0 && selectedZonas.length >= totalZonasCbs;

  let count = 0;

  suicidioRows.forEach((r) => {
    if (!r._valid) return;

    if (selectedZonas.length > 0 && !todasZonasSel && (!r._zona || !selectedZonas.includes(r._zona))) return;
    if (selectedSeccionales.length > 0 && (!r._secc || !selectedSeccionales.includes(r._secc))) return;
    if (selectedIVS.length > 0 && (!r._ivs || !selectedIVS.includes(r._ivs))) return;

    const sexo = (r.Sexo ?? r.sexo ?? "").toString().trim().toUpperCase();
    const fis  = (r.FIS  ?? r.fis  ?? "").toString().trim();
    const edad = (r.Edad ?? r.edad ?? "").toString().trim();
    const sexoLabel = sexo === 'F' ? 'Femenino' : sexo === 'M' ? 'Masculino' : sexo || 'Sin dato';

    const marker = L.marker([r._lat, r._lng], { icon: iconSuicidio });
    marker.bindTooltip(
      `<div class="pac-tt-header">⚠️ Intento de Suicidio</div>` +
      `<div class="pac-tt-body">` +
        `<span class="pac-tt-label">Sexo</span><span class="pac-tt-value">${sexoLabel}</span>` +
        (edad ? `<span class="pac-tt-label">Edad</span><span class="pac-tt-value">${edad}</span>` : '') +
        (fis  ? `<span class="pac-tt-label">Fecha</span><span class="pac-tt-value">${fis}</span>`  : '') +
      `</div>`,
      { direction: "top", opacity: 1, className: "pac-tooltip suic-tooltip" }
    );
    marker.addTo(suicidioLayer);
    count++;
  });

  const el = document.getElementById('statSuicFiltro');
  if (el) el.textContent = fmt(count);
  return count;
}

// ---------- Stats tarjetas por año ----------
function updateSuicidioStats() {
  const totalEl        = document.getElementById('statSuicTotal');
  const geoEl          = document.getElementById('statSuicGeo');
  const aniosContainer = document.getElementById('suicidioAniosContainer');

  const totalRows = (window.suicidioRowsCompleto && window.suicidioRowsCompleto.length > 0)
    ? window.suicidioRowsCompleto : suicidioRows;

  const geo = suicidioRows.filter(r => r._valid).length;

  if (totalEl) totalEl.textContent = fmt(totalRows.length);
  if (geoEl)   geoEl.textContent   = fmt(geo);

  const porAnio = {};
  totalRows.forEach(r => {
    const anioDirecto = (r.ANOFIS ?? r.anofis ?? "").toString().trim();
    const fis  = (r.FIS ?? r.fis ?? "").toString().trim();
    const anio = (anioDirecto && anioDirecto !== "0") ? anioDirecto : parsearAnioFIS(fis);
    if (!anio) return;
    if (!porAnio[anio]) porAnio[anio] = { total: 0, M: 0, F: 0 };
    porAnio[anio].total++;
    const sexo = (r.Sexo ?? r.sexo ?? "").toString().trim().toUpperCase();
    if (sexo === 'M') porAnio[anio].M++;
    else if (sexo === 'F') porAnio[anio].F++;
  });

  const aniosOrdenados = Object.keys(porAnio).sort().reverse();

  if (aniosContainer) {
    aniosContainer.innerHTML = `
      <div class="anio-info-note">
        ℹ️ Los totales corresponden al <strong>total de registros</strong>, independientemente de si están geolocalizados.
      </div>
    ` + aniosOrdenados.map(anio => `
      <div class="anio-card">
        <div class="anio-card-title">📅 ${anio}</div>
        <div class="anio-card-row">
          <div class="anio-stat"><div class="anio-stat-label">Total</div><div class="anio-stat-value">${fmt(porAnio[anio].total)}</div></div>
          <div class="anio-stat"><div class="anio-stat-label">Femenino</div><div class="anio-stat-value">${fmt(porAnio[anio].F)}</div></div>
          <div class="anio-stat"><div class="anio-stat-label">Masculino</div><div class="anio-stat-value">${fmt(porAnio[anio].M)}</div></div>
        </div>
      </div>
    `).join('');
  }
}

// ---------- Leyenda suicidio (usa completoMap pre-cacheado) ----------
function updateSuicidioFilterLegend() {
  const selectedZonas       = zonasControls.getChecked();
  const selectedSeccionales = seccionalesControls.getChecked();
  const selectedIVS         = ivsControls.getChecked();
  const hayFiltro = selectedZonas.length > 0 || selectedSeccionales.length > 0 || selectedIVS.length > 0;

  let resumenAnios = '';
  if (hayFiltro) {
    const porAnio = {};
    const totalZonasDisponibles = zonasList ? zonasList.querySelectorAll("input[type=checkbox]").length : 0;
    const todasZonasSeleccionadas = totalZonasDisponibles > 0 && selectedZonas.length >= totalZonasDisponibles;
    const completoMap = window._completoMap || {};

    suicidioRows.forEach(r => {
      if (!r._valid) return;
      if (selectedZonas.length > 0 && !todasZonasSeleccionadas && (!r._zona || !selectedZonas.includes(r._zona))) return;
      if (selectedSeccionales.length > 0 && (!r._secc || !selectedSeccionales.includes(r._secc))) return;
      if (selectedIVS.length > 0 && (!r._ivs || !selectedIVS.includes(r._ivs))) return;

      const doc  = (r.Documento ?? r.documento ?? "").toString().trim();
      const info = completoMap[doc] || {};
      const anio = info.anio || parsearAnioFIS((r.FIS ?? "").toString()) || null;
      const sexo = info.sexo || (r.Sexo ?? "").toString().trim().toUpperCase();
      if (!anio) return;

      if (!porAnio[anio]) porAnio[anio] = { total: 0, F: 0, M: 0 };
      porAnio[anio].total++;
      if (sexo === 'F') porAnio[anio].F++;
      else if (sexo === 'M') porAnio[anio].M++;
    });

    const aniosOrdenados = Object.keys(porAnio).sort().reverse();
    if (aniosOrdenados.length > 0) {
      resumenAnios = `
        <div style="margin-top:12px; border-top:2px solid #f0f0f6; padding-top:12px;">
          <div style="font-size:13px; font-weight:700; color:#1a1a2e; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span style="background:#e8eaf6; border-radius:6px; padding:3px 8px; font-size:12px;">📊 En área seleccionada</span>
          </div>
          ${aniosOrdenados.map(anio => `
            <div style="margin-bottom:8px; background:#fafafa; border-radius:10px; padding:8px 10px; border:1px solid #ebebf0;">
              <div style="font-size:12px; font-weight:700; color:#4a5568; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
                <span>📅</span> <span>${anio}</span>
              </div>
              <div style="display:flex; gap:6px;">
                <div style="flex:1; background:#e8f4fd; border-radius:7px; padding:5px 6px; text-align:center;">
                  <div style="font-size:10px; color:#2c6fa8; font-weight:600; text-transform:uppercase; letter-spacing:0.4px;">Total</div>
                  <div style="font-size:18px; font-weight:800; color:#1a4971;">${porAnio[anio].total}</div>
                </div>
                <div style="flex:1; background:#fde8f0; border-radius:7px; padding:5px 6px; text-align:center;">
                  <div style="font-size:10px; color:#a0305a; font-weight:600; text-transform:uppercase; letter-spacing:0.4px;">Fem.</div>
                  <div style="font-size:18px; font-weight:800; color:#7b1e42;">${porAnio[anio].F}</div>
                </div>
                <div style="flex:1; background:#e8f0fd; border-radius:7px; padding:5px 6px; text-align:center;">
                  <div style="font-size:10px; color:#2c4fa8; font-weight:600; text-transform:uppercase; letter-spacing:0.4px;">Masc.</div>
                  <div style="font-size:18px; font-weight:800; color:#1a2e71;">${porAnio[anio].M}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  filterLegendEl.innerHTML = `
    <div class="filter-legend-title">📍 Referencias</div>
    <div class="legend-item">
      <img src="./assets/intento_suicidio.png" class="legend-icon-img" alt="Suicidio">
      <div class="legend-label">Intento de Suicidio</div>
    </div>
    ${resumenAnios}
  `;
  filterLegendEl.style.display = 'block';
}

// ---------- Panel detalle Efector SM ----------
function openSMDetail(name, at, pac, lat, lng) {
  const panel   = document.getElementById('smDetailPanel');
  const overlay = document.getElementById('smDetailOverlay');
  const titleEl = document.getElementById('smDetailTitle');
  const bodyEl  = document.getElementById('smDetailBody');

  titleEl.textContent = name;

  // Datos del centro desde centros_horarios
  const horario = chRows.find(r => normTxt(r.centro) === normTxt(name) || normTxt(r.id) === normTxt(name));
  const direccion   = horario ? horario.direccion : null;
  const institucion = horario ? horario.institucion : null;

  // Zona desde coordenadas
  const zona = getZonaFromCoords(lat, lng) || 'Sin dato';

  // Servicios del centro
  const servicios = smServiciosRows.filter(r => normTxt(r.Centro) === normTxt(name));

  let html = '';

  // Stats
  html += `
    <div class="sm-detail-stats">
      <div class="sm-detail-stat-card">
        <div class="sm-detail-stat-label">Atenciones</div>
        <div class="sm-detail-stat-value">${fmt(at)}</div>
      </div>
      <div class="sm-detail-stat-card">
        <div class="sm-detail-stat-label">Pacientes</div>
        <div class="sm-detail-stat-value">${fmt(pac)}</div>
      </div>
    </div>`;

  // Info
  html += `<div class="sm-detail-section">
    <div class="sm-detail-section-title">Información</div>`;
  if (direccion) html += `
    <div class="sm-detail-info-row">
      <span class="sm-detail-info-label">Dirección</span>
      <span class="sm-detail-info-value">${direccion}</span>
    </div>`;
  html += `
    <div class="sm-detail-info-row">
      <span class="sm-detail-info-label">Zona</span>
      <span class="sm-detail-info-value">${zona}</span>
    </div>`;
  html += `</div>`;

  // Servicios
  html += `<div class="sm-detail-section">
    <div class="sm-detail-section-title">Servicios (${servicios.length})</div>`;
  if (servicios.length === 0) {
    html += `<div class="sm-detail-empty">Sin datos de servicios</div>`;
  } else {
    servicios.sort((a, b) => b.atenciones_servicio - a.atenciones_servicio).forEach(s => {
      html += `<div class="sm-servicio-item"><div class="sm-servicio-name">${s.Servicio}</div></div>`;
    });
  }
  html += `</div>`;

  bodyEl.innerHTML = html;
  panel.classList.add('open');
  overlay.classList.add('open');
}

function closeSMDetail() {
  document.getElementById('smDetailPanel').classList.remove('open');
  document.getElementById('smDetailOverlay').classList.remove('open');
}

// ---------- Acordeón estadísticas por año ----------
function toggleAnioAccordion() {
  const btn  = document.getElementById('anioAccordionBtn');
  const body = document.getElementById('suicidioAniosContainer');
  if (!btn || !body) return;
  btn.classList.toggle('collapsed');
  body.classList.toggle('collapsed');
}

// ---------- Toggle modo suicidio ----------
function toggleSuicidioMode() {
  suicidioModoActivo = !suicidioModoActivo;

  const smSection      = document.getElementById('smSection');
  const statsNormal    = document.getElementById('statsNormal');
  const statsSuicidio  = document.getElementById('statsSuicidio');
  const filteredCenter = document.getElementById('filteredCenter');

  if (suicidioModoActivo) {
    suicidioBtn.classList.add("active");
    suicidioBtn.textContent = "✖ Ocultar Intentos de Suicidio";

    if (smSection)     smSection.style.display     = 'none';
    if (statsNormal)   statsNormal.style.display   = 'none';
    if (filteredCenter) filteredCenter.style.display = 'none';
    if (statsSuicidio) statsSuicidio.style.display = 'block';

    if (map.hasLayer(pacientesLayer))   map.removeLayer(pacientesLayer);
    if (map.hasLayer(saludMentalLayer)) map.removeLayer(saludMentalLayer);
    if (!map.hasLayer(suicidioLayer))   suicidioLayer.addTo(map);

    updateSuicidioStats();
    renderSuicidio();
    ivsLegendEl.style.display = ivsControls.getChecked().length > 0 ? 'block' : 'none';
    updateSuicidioFilterLegend();

  } else {
    suicidioBtn.classList.remove("active");
    suicidioBtn.textContent = "🔴 Intentos de Suicidio";

    if (statsSuicidio) statsSuicidio.style.display = 'none';
    if (smSection)     smSection.style.display      = 'block';
    if (statsNormal)   statsNormal.style.display    = 'block';

    suicidioLayer.clearLayers();
    if (map.hasLayer(suicidioLayer)) map.removeLayer(suicidioLayer);

    [zonasLayer, seccionalesLayer, ivsBarriosLayer, centrosLayer].forEach(layer => {
      layer.clearLayers();
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    if (!map.hasLayer(pacientesLayer))   pacientesLayer.addTo(map);
    if (!map.hasLayer(saludMentalLayer)) saludMentalLayer.addTo(map);

    ivsLegendEl.style.display = 'none';
    applyFilter();
  }
}

suicidioBtn.addEventListener("click", toggleSuicidioMode);

// ---------- Textos de botones (unificado) ----------
function updateAllButtonTexts(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS) {
  if (selectedSM.length === 0)               smBtn.textContent = "Ninguno";
  else if (selectedSM.length === smRows.length) smBtn.textContent = `Todos (${selectedSM.length})`;
  else                                        smBtn.textContent = `${selectedSM.length} seleccionados`;

  const totalTipos = msList.querySelectorAll("input[type=checkbox]").length;
  if (selectedTipos.length === 0)            msBtn.textContent = "Ninguno";
  else if (selectedTipos.length === totalTipos) msBtn.textContent = "Todos";
  else if (selectedTipos.length === 1)       msBtn.textContent = selectedTipos[0];
  else                                        msBtn.textContent = `${selectedTipos.length} seleccionados`;

  const totalZonas = zonasList.querySelectorAll("input[type=checkbox]").length;
  if (selectedZonas.length === 0)            zonasBtn.textContent = "Ninguna";
  else if (selectedZonas.length === totalZonas) zonasBtn.textContent = "Todas";
  else                                        zonasBtn.textContent = `${selectedZonas.length} seleccionadas`;

  const totalSecc = seccionalesList.querySelectorAll("input[type=checkbox]").length;
  if (selectedSeccionales.length === 0)      seccionalesBtn.textContent = "Ninguna";
  else if (selectedSeccionales.length === totalSecc) seccionalesBtn.textContent = "Todas";
  else                                        seccionalesBtn.textContent = `${selectedSeccionales.length} seleccionadas`;

  if (selectedIVS.length === 5)              ivsBtn.textContent = "Todos";
  else if (selectedIVS.length === 0)         ivsBtn.textContent = "Ninguno";
  else                                        ivsBtn.textContent = `IVS: ${selectedIVS.join(", ")}`;
}

// ---------- Aplicar filtro ----------
function applyFilter() {
  const selectedSM          = smControls.getChecked();
  const selectedTipos       = msControls.getChecked();
  const selectedZonas       = zonasControls.getChecked();
  const selectedSeccionales = seccionalesControls.getChecked();
  const selectedIVS         = ivsControls.getChecked();

  updateAllButtonTexts(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS);

  if (suicidioModoActivo) {
    setLayer(zonasLayer,       selectedZonas.length > 0,       () => renderZonas(selectedZonas));
    setLayer(seccionalesLayer, selectedSeccionales.length > 0, () => renderSeccionales(selectedSeccionales));
    setLayer(centrosLayer,     selectedTipos.length > 0,       () => renderCentrosHorariosMulti(chRows, selectedTipos));
    setLayer(ivsBarriosLayer,  selectedIVS.length > 0,         () => renderIVSBarrios(selectedIVS));
    ivsLegendEl.style.display = selectedIVS.length > 0 ? 'block' : 'none';
    renderSuicidio();
    updateSuicidioFilterLegend();
    return;
  }

  // Modo normal
  ivsLegendEl.style.display = selectedIVS.length > 0 ? 'block' : 'none';
  updateFilterLegend(selectedSM, selectedTipos, selectedZonas, selectedSeccionales, selectedIVS);

  if (selectedSM.length === 1) {
    filteredCenterEl.classList.add('show');
    filteredCenterNameEl.textContent = selectedSM[0];
  } else {
    filteredCenterEl.classList.remove('show');
  }

  setLayer(zonasLayer,       selectedZonas.length > 0,       () => renderZonas(selectedZonas));
  setLayer(seccionalesLayer, selectedSeccionales.length > 0, () => renderSeccionales(selectedSeccionales));
  setLayer(ivsBarriosLayer,  selectedIVS.length > 0,         () => renderIVSBarrios(selectedIVS));
  setLayer(centrosLayer,     selectedTipos.length > 0,       () => renderCentrosHorariosMulti(chRows, selectedTipos));

  let smStats = { totalAt: 0, totalPac: 0, count: 0 };
  if (selectedSM.length > 0) {
    smStats = renderSaludMental(smRows, selectedSM);
  } else {
    saludMentalLayer.clearLayers();
  }

  const pac = renderPacientes(pacPorEfectorRows, selectedIVS, selectedSM, selectedZonas);

  const pacientesParaMostrar = (selectedSM.length === 1) ? (smStats.totalPac || 0) : (pacientesGlobal || 0);
  updateStats({
    smCount: smStats.count,
    smAt: smStats.totalAt,
    smPac: pacientesParaMostrar,
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
    setStatus("Cargando datos...");
    await Promise.all([
      loadSaludMental(),
      loadCentrosHorarios(),
      loadServiciosCentros(),
      loadPacientesPorEfector(),
      loadZonas(),
      loadSeccionales(),
      loadIVSBarrios(),
      loadIVSPoligonos(),
      loadPacientesGlobal(),
      loadSuicidio()
    ]);

    // Pre-computar lookups espaciales una vez (después de que los índices estén listos)
    precomputePacientes();
    precomputeSuicidio();

    buildSaludMentalDropdown(smRows);
    buildOtrosEfectoresDropdown(chRows);
    buildZonasDropdown(zonasGeoJSON);
    buildSeccionalesDropdown(seccionalesGeoJSON);
    buildIVSDropdown();

    smControls          = setupDropdown(smWrap, smBtn, smDrop, smList, smAll, smNone, smApply, applyFilter);
    msControls          = setupDropdown(msWrap, msBtn, msDrop, msList, msAll, msNone, msApply, applyFilter);
    zonasControls       = setupDropdown(zonasWrap, zonasBtn, zonasDrop, zonasList, zonasAll, zonasNone, zonasApply, applyFilter);
    seccionalesControls = setupDropdown(seccionalesWrap, seccionalesBtn, seccionalesDrop, seccionalesList, seccionalesAll, seccionalesNone, seccionalesApply, applyFilter);
    ivsControls         = setupDropdown(ivsWrap, ivsBtn, ivsDrop, ivsList, ivsAll, ivsNone, ivsApply, applyFilter);

    ivsLegendEl.style.display    = 'none';
    filterLegendEl.style.display = 'none';

    applyFilter();
  } catch (e) {
    console.error(e);
    setStatus("❌ Error cargando archivos");
  }
})();
