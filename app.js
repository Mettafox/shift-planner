/* ============================================================
   TurnoCerto Clone – Core Logic
   - No default shifts
   - Android-style clock picker (hours outer ring, minutes inner ring)
   - Pause start + duration per shift
   - "All day" when shift doesn't count as work
   - Day popup shows shift details + pencil to change
   - Collapsible "Other settings" section
   - Holidays auto-reload on language change
   ============================================================ */
(function () {
  "use strict";

  const KEY = "turnocerto.v7";

  const COLOR_PALETTE = [
    "#F2B33D","#E9785B","#4C55B8","#7FB59A","#49A6C9","#B866A8","#D45D79","#5E9E4F",
    "#C49A2C","#8A8F9E","#FF6B6B","#4ECDC4","#F38181","#AA96DA","#95E1D3"
  ];

  const TRANSLATIONS = {
    pt: {
      nav_calendar:"Calendário", nav_summary:"Resumo", nav_year:"Ano", nav_shifts:"Turnos", nav_settings:"Definições", nav_more:"Mais",
      go_today:"Ir para hoje", prev_month:"Mês anterior", next_month:"Mês seguinte", prev_year:"Ano anterior", next_year:"Ano seguinte",
      edit_mode:"Modo de edição", tap_to_edit:"Toca num dia para o editar",
      empty_title:"A tua escala está vazia",
      empty_text:"Cria os teus turnos na aba «Turnos». Depois liga o modo de edição e toca nos dias.",
      weekdays:["S","T","Q","Q","S","S","D"],
      months:["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
      your_shifts:"Os teus turnos", your_shifts_desc:"Define os horários uma vez. Depois é só pintar o calendário.",
      new_shift:"Novo turno", new_shift_title:"Novo turno", edit_shift:"Editar turno",
      no_shifts:"Ainda não tens turnos. Cria um novo para começar.",
      no_shifts_paint:"Cria um turno na aba «Turnos» para começares a pintar.",
      name:"Nome", code:"Código", color:"Cor",
      start_time:"Início", end_time:"Fim",
      pause_start:"Início da pausa", pause_duration:"Duração da pausa (min)", pause:"Pausa",
      counts_as_work:"Conta como trabalho",
      all_day:"Todo o dia",
      save:"Guardar", cancel:"Cancelar", delete_shift:"Apagar turno",
      shift_updated:"Turno atualizado", shift_created:"Turno criado", shift_deleted:"Turno apagado",
      confirm_delete_shift:"Apagar este turno? Os dias marcados com ele também serão apagados.",
      change:"Alterar", delete:"Apagar", close:"Fechar",
      settings:"Definições", payment:"Pagamento", hourly_rate:"Valor por hora (€)", hourly_rate_hint:"Deixa a 0 se não quiseres ver a estimativa.",
      night_bonus:"Acréscimo noturno (%)", holiday_bonus:"Acréscimo em feriado (%)",
      night_starts:"Noite começa às", night_ends:"Noite acaba às",
      weekly_hours:"Horas por semana", overtime_bonus:"Acréscimo horas a mais (%)",
      two_jobs:"Dois empregos", has_second_job:"Tenho um segundo emprego",
      job1_name:"Nome do 1.º", job2_name:"Nome do 2.º", job1_placeholder:"Ex.: Hospital", job2_placeholder:"Ex.: Clínica",
      job2_rate:"Valor por hora no 2.º emprego (€)",
      holidays:"Feriados", country:"País",
      country_pt:"Portugal", country_es:"Espanha", country_fr:"França", country_de:"Alemanha",
      country_gb:"Reino Unido", country_br:"Brasil", country_us:"Estados Unidos",
      country_ca:"Canadá", country_it:"Itália", country_nl:"Países Baixos",
      country_ie:"Irlanda", country_be:"Bélgica", country_at:"Áustria", country_ch:"Suíça",
      country_se:"Suécia", country_no:"Noruega", country_dk:"Dinamarca", country_fi:"Finlândia",
      country_pl:"Polónia", country_mx:"México", country_au:"Austrália",
      country_nz:"Nova Zelândia", country_jp:"Japão", country_za:"África do Sul",
      load_holidays:"Carregar feriados",
      holidays_loaded:"{n} feriados carregados para {year}.",
      holidays_error:"Não foi possível carregar os feriados. Verifica a ligação à internet.",
      appearance:"Aspeto", theme:"Tema", theme_light:"Claro", theme_dark:"Escuro",
      time_format:"Formato de hora", time_format_24:"24 horas (por defeito)", time_format_12:"12 horas (AM / PM)",
      language:"Idioma", your_data:"Os teus dados", other_settings:"Outras definições",
      data_note:"Tudo fica guardado só neste telemóvel. Guarda uma cópia de vez em quando.",
      backup:"Guardar cópia", restore:"Repor cópia", wipe:"Apagar tudo",
      hours_worked:"Horas trabalhadas", payment_estimate:"Estimativa de pagamento", by_job:"Detalhe por emprego",
      job1_fallback:"Emprego 1", job2_fallback:"Emprego 2", my_year:"O meu",
      hours_per_month:"Horas por mês", annual_total:"Total anual", hours_worked_short:"trabalhadas",
      more_options:"Mais opções", export_to_calendar:"Exportar para o calendário", export_pdf:"Exportar para PDF",
      export_ics_desc:"Descarrega um ficheiro .ics para importar no calendário do telemóvel.",
      export_pdf_desc:"Gera uma folha A4 com a escala do mês para imprimir ou guardar.",
      export_pdf_blocked:"O teu browser bloqueou a janela de impressão. Permite pop-ups para este site.",
      confirm_wipe:"Tens a certeza que queres apagar todos os dados?", data_cleared:"Dados apagados",
      backup_restored:"Cópia restaurada", invalid_file:"Ficheiro inválido", file_error:"Erro ao ler ficheiro",
      save_error:"Não foi possível guardar.",
      am:"AM", pm:"PM"
    },
    en: {
      nav_calendar:"Calendar", nav_summary:"Summary", nav_year:"Year", nav_shifts:"Shifts", nav_settings:"Settings", nav_more:"More",
      go_today:"Go to today", prev_month:"Previous month", next_month:"Next month", prev_year:"Previous year", next_year:"Next year",
      edit_mode:"Edit mode", tap_to_edit:"Tap a day to edit it",
      empty_title:"Your schedule is empty",
      empty_text:"Create your shifts in the \"Shifts\" tab. Then turn on edit mode and tap on the days.",
      weekdays:["M","T","W","T","F","S","S"],
      months:["January","February","March","April","May","June","July","August","September","October","November","December"],
      your_shifts:"Your shifts", your_shifts_desc:"Set the times once. Then just paint the calendar.",
      new_shift:"New shift", new_shift_title:"New shift", edit_shift:"Edit shift",
      no_shifts:"You don't have any shifts yet. Create one to get started.",
      no_shifts_paint:"Create a shift in the \"Shifts\" tab to start painting.",
      name:"Name", code:"Code", color:"Colour",
      start_time:"Start", end_time:"End",
      pause_start:"Pause start", pause_duration:"Pause duration (min)", pause:"Pause",
      counts_as_work:"Counts as work",
      all_day:"All day",
      save:"Save", cancel:"Cancel", delete_shift:"Delete shift",
      shift_updated:"Shift updated", shift_created:"Shift created", shift_deleted:"Shift deleted",
      confirm_delete_shift:"Delete this shift? Days marked with it will also be removed.",
      change:"Change", delete:"Delete", close:"Close",
      settings:"Settings", payment:"Payment", hourly_rate:"Hourly rate (€)", hourly_rate_hint:"Leave at 0 to hide the estimate.",
      night_bonus:"Night bonus (%)", holiday_bonus:"Holiday bonus (%)",
      night_starts:"Night starts at", night_ends:"Night ends at",
      weekly_hours:"Hours per week", overtime_bonus:"Overtime bonus (%)",
      two_jobs:"Two jobs", has_second_job:"I have a second job",
      job1_name:"1st job name", job2_name:"2nd job name", job1_placeholder:"E.g.: Hospital", job2_placeholder:"E.g.: Clinic",
      job2_rate:"Hourly rate at 2nd job (€)",
      holidays:"Holidays", country:"Country",
      country_pt:"Portugal", country_es:"Spain", country_fr:"France", country_de:"Germany",
      country_gb:"United Kingdom", country_br:"Brazil", country_us:"United States",
      country_ca:"Canada", country_it:"Italy", country_nl:"Netherlands",
      country_ie:"Ireland", country_be:"Belgium", country_at:"Austria", country_ch:"Switzerland",
      country_se:"Sweden", country_no:"Norway", country_dk:"Denmark", country_fi:"Finland",
      country_pl:"Poland", country_mx:"Mexico", country_au:"Australia",
      country_nz:"New Zealand", country_jp:"Japan", country_za:"South Africa",
      load_holidays:"Load holidays",
      holidays_loaded:"{n} holidays loaded for {year}.",
      holidays_error:"Could not load holidays. Check your internet connection.",
      appearance:"Appearance", theme:"Theme", theme_light:"Light", theme_dark:"Dark",
      time_format:"Time format", time_format_24:"24-hour (default)", time_format_12:"12-hour (AM / PM)",
      language:"Language", your_data:"Your data", other_settings:"Other settings",
      data_note:"Everything is stored only on this phone. Back up once in a while.",
      backup:"Back up", restore:"Restore", wipe:"Erase all",
      hours_worked:"Hours worked", payment_estimate:"Estimated pay", by_job:"Breakdown by job",
      job1_fallback:"Job 1", job2_fallback:"Job 2", my_year:"My",
      hours_per_month:"Hours per month", annual_total:"Yearly total", hours_worked_short:"worked",
      more_options:"More options", export_to_calendar:"Export to calendar", export_pdf:"Export to PDF",
      export_ics_desc:"Download an .ics file to import into your phone's calendar.",
      export_pdf_desc:"Generate an A4 sheet with the month schedule to print or save.",
      export_pdf_blocked:"Your browser blocked the print window. Allow pop-ups for this site.",
      confirm_wipe:"Are you sure you want to erase all data?", data_cleared:"Data cleared",
      backup_restored:"Backup restored", invalid_file:"Invalid file", file_error:"Error reading file",
      save_error:"Couldn't save.",
      am:"AM", pm:"PM"
    }
  };

  // --- Helpers ---
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const toastEl = $("#toast");

  function t(key) {
    const lang = (state && state.settings && state.settings.lang) || "pt";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.pt;
    return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.pt[key] !== undefined ? TRANSLATIONS.pt[key] : key);
  }

  function isSameDay(a, b) {
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  // pause is in MINUTES
  function calcHours(start, end, pauseMinutes) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let s = sh * 60 + sm, e = eh * 60 + em;
    if (e <= s) e += 24 * 60;
    return Math.max(0, (e - s - (pauseMinutes || 0)) / 60);
  }

  function addMinutes(hhmm, mins) {
    if (!hhmm) return "";
    const [h, m] = hhmm.split(":").map(Number);
    const total = h * 60 + m + (mins || 0);
    const newH = ((Math.floor(total / 60) % 24) + 24) % 24;
    const newM = ((total % 60) + 60) % 60;
    return `${String(newH).padStart(2,"0")}:${String(newM).padStart(2,"0")}`;
  }

  function formatTime(hhmm) {
    if (!hhmm || typeof hhmm !== "string") return hhmm || "";
    if ((state.settings.timeFormat || "24") === "24") return hhmm;
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr);
    if (isNaN(h)) return hhmm;
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${(mStr || "00").padStart(2,"0")} ${period}`;
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    setTimeout(() => toastEl.classList.remove("on"), 2400);
  }

  // --- State ---
  let state = loadState();
  let currentTab = "cal";
  let currentMonth = new Date();
  let currentYear = new Date().getFullYear();
  let paintMode = false;
  let brush = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      if (!parsed.settings) parsed.settings = {};
      if (!parsed.settings.theme || parsed.settings.theme === "auto") parsed.settings.theme = "light";
      if (!parsed.settings.lang) parsed.settings.lang = "pt";
      if (!parsed.settings.timeFormat) parsed.settings.timeFormat = "24";
      if (!parsed.settings.country) parsed.settings.country = "PT";
      if (!parsed.holidays) parsed.holidays = {};
      if (!Array.isArray(parsed.types)) parsed.types = [];
      // Ensure each type has pauseStart and pause fields
      for (const ty of parsed.types) {
        if (typeof ty.pause !== "number") ty.pause = 0;
        if (typeof ty.pauseStart !== "string") ty.pauseStart = "";
      }
      // Clean orphan days
      if (parsed.days) {
        const ids = new Set(parsed.types.map(x => x.id));
        for (const k of Object.keys(parsed.days)) {
          const d = parsed.days[k];
          if (d.typeId && !ids.has(d.typeId)) delete parsed.days[k];
        }
      }
      return parsed;
    } catch { return defaults(); }
  }

  function saveState() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { showToast(t("save_error")); }
  }

  function defaults() {
    return {
      v: 7,
      types: [],
      days: {},
      holidays: {},
      settings: {
        rate:0, nightPct:25, holPct:100, nightStart:"22:00", nightEnd:"07:00",
        weekly:40, extraPct:50, job2on:false, job1name:"", job2name:"", job2rate:0,
        alarm:0, theme:"light", lang:"pt", timeFormat:"24",
        country:"PT"
      }
    };
  }

  // --- Theme & language ---
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.settings.theme === "dark" ? "dark" : "light");
  }

  function applyLanguage() {
    const lang = state.settings.lang === "en" ? "en" : "pt";
    document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
    saveState();
    renderStaticTexts();
    renderAll();
    updatePaintUI();
    syncSettingsInputs();
  }

  function renderStaticTexts() {
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$("[data-i18n-aria-label]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel)); });
    renderWeekdays();
  }

  function renderWeekdays() {
    const days = t("weekdays");
    $("#weekdays").innerHTML = days.map(d => `<span>${d}</span>`).join("");
  }

  function updatePaintUI() {
    $("#paintSwitch").setAttribute("aria-pressed", paintMode);
    $("#paintBar").classList.toggle("hidden", !paintMode);
    $("#paintHint").style.display = paintMode ? "" : "none";
  }

  // --- Calendar ---
  function renderCalendar() {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const months = t("months");
    $("#monthTitle").textContent = (months[m]||"").charAt(0).toUpperCase() + (months[m]||"").slice(1);

    const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let html = "";
    for (let i = 0; i < firstDay; i++) html += '<div class="day out"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const dayData = state.days[key];
      const isToday = isSameDay(new Date(y, m, d), new Date());
      const isSunday = new Date(y, m, d).getDay() === 0;
      const holidayName = state.holidays[key];

      let blockHtml = '<span class="blk" style="background:var(--surface2)"></span>';
      if (dayData && dayData.typeId) {
        const ty = state.types.find(x => x.id === dayData.typeId);
        if (ty) blockHtml = `<span class="blk" style="background:${ty.color};color:#fff">${ty.code}</span>`;
      }

      const holidayDot = holidayName ? '<span class="holiday-dot" title="'+holidayName+'"></span>' : '';

      html += `<button class="day${isToday?" today":""}${isSunday?" sun":""}" data-k="${key}">
        <span class="num"><span>${d}</span>${holidayDot}</span>${blockHtml}</button>`;
    }

    $("#grid").innerHTML = html;
    $$("#grid .day[data-k]").forEach(btn =>
      btn.addEventListener("click", () => handleDayClick(btn.dataset.k)));

    const hasData = Object.keys(state.days).length > 0;
    $("#emptyCal").classList.toggle("hidden", hasData);
  }

  function handleDayClick(key) {
    if (paintMode && brush) {
      if (brush === "__x") delete state.days[key];
      else state.days[key] = { typeId: brush, job: 1 };
      saveState();
      renderCalendar();
    } else {
      openDaySheet(key);
    }
  }

  // --- Day sheet ---
  function openDaySheet(key) {
    const dayData = state.days[key];
    const holidayName = state.holidays[key];
    const holidayHtml = holidayName
      ? `<div class="holiday-note">🎉 <b>${holidayName}</b></div>`
      : "";

    // If day has an assigned shift, show its details
    if (dayData && dayData.typeId) {
      const ty = state.types.find(x => x.id === dayData.typeId);
      if (ty) {
        let timeHtml;
        if (ty.work) {
          timeHtml = `<div class="shift-time">${formatTime(ty.start)} – ${formatTime(ty.end)}</div>`;
          if (ty.pause > 0 && ty.pauseStart) {
            const pauseEnd = addMinutes(ty.pauseStart, ty.pause);
            timeHtml += `<div class="shift-pause">${t("pause")}: ${formatTime(ty.pauseStart)} – ${formatTime(pauseEnd)}</div>`;
          }
        } else {
          timeHtml = `<div class="shift-time">${t("all_day")}</div>`;
        }

        $("#sheetBody").innerHTML = `
          ${holidayHtml}
          <div class="shift-details">
            <div class="shift-name-row">
              <span class="badge" style="background:${ty.color};color:#fff">${ty.code}</span>
              <h2 class="h2" style="margin:0">${ty.name}</h2>
            </div>
            ${timeHtml}
          </div>
          <div class="row">
            <button class="btn primary" id="changeShiftBtn" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 3l5 5-11 11H5v-5z"></path><path d="M14 5l5 5"></path>
              </svg>
              ${t("change")}
            </button>
            <button class="btn" id="closeSheet" style="flex:1">${t("close")}</button>
          </div>
        `;
        $("#sheet").classList.add("on");
        $("#scrim").classList.add("on");
        $("#changeShiftBtn").addEventListener("click", () => openDayShiftPicker(key));
        $("#closeSheet").addEventListener("click", closeSheet);
        return;
      }
    }

    // Otherwise: show picker directly
    openDayShiftPicker(key, holidayHtml);
  }

  function openDayShiftPicker(key, holidayHtml = "") {
    let chipsHtml = "";
    if (state.types.length === 0) {
      chipsHtml = `<p class="small muted" style="padding:8px 4px">${t("no_shifts_paint")}</p>`;
    } else {
      chipsHtml = state.types.map(ty => `
        <button class="chip" data-type="${ty.id}">
          <span class="dot" style="background:${ty.color}"></span>${ty.name}
        </button>`).join("");
      chipsHtml += `<button class="chip" data-type="__x">
        <span class="dot" style="background:transparent;border:2px dashed var(--muted)"></span>${t("delete")}
      </button>`;
    }

    $("#sheetBody").innerHTML = `
      ${holidayHtml}
      <div class="paint">${chipsHtml}</div>
      <button class="btn block" id="closeSheet" style="margin-top:8px">${t("close")}</button>
    `;
    $("#sheet").classList.add("on");
    $("#scrim").classList.add("on");

    $$("#sheetBody .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const ty = chip.dataset.type;
        if (ty === "__x") delete state.days[key];
        else state.days[key] = { typeId: ty, job: 1 };
        saveState();
        renderCalendar();
        closeSheet();
      });
    });
    $("#closeSheet").addEventListener("click", closeSheet);
  }

  function closeSheet() {
    $("#sheet").classList.remove("on");
    $("#scrim").classList.remove("on");
  }

  // --- Navigation ---
  function switchTab(tab) {
    currentTab = tab;
    $$("section[id^='v-']").forEach(s => s.classList.add("hidden"));
    $("#v-" + tab).classList.remove("hidden");
    $$(".nav button").forEach(b => b.removeAttribute("aria-current"));
    const navBtn = $(`.nav button[data-tab="${tab}"]`);
    if (navBtn) navBtn.setAttribute("aria-current", "page");
    if (tab === "res") renderSummary();
    if (tab === "ano") renderYear();
    if (tab === "tur") renderTypeList();
  }

  // --- Summary ---
  function renderSummary() {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const months = t("months");
    $("#resTitle").textContent = (months[m]||"").charAt(0).toUpperCase() + (months[m]||"").slice(1);

    let totalHours = 0, totalPay = 0;
    const jobHours = {1:0,2:0};
    for (const [key, data] of Object.entries(state.days)) {
      const [dy, dm] = key.split("-").map(Number);
      if (dy !== y || dm !== m+1) continue;
      const ty = state.types.find(x => x.id === data.typeId);
      if (!ty || !ty.work) continue;
      const h = calcHours(ty.start, ty.end, ty.pause);
      totalHours += h;
      jobHours[data.job||1] += h;
      const rate = data.job === 2 ? state.settings.job2rate : state.settings.rate;
      totalPay += h * (rate||0);
    }

    $("#resBody").innerHTML = `
      <div class="stats">
        <div class="stat"><b>${totalHours.toFixed(1)}h</b><span>${t("hours_worked")}</span></div>
        <div class="stat"><b>${totalPay.toFixed(2)}€</b><span>${t("payment_estimate")}</span></div>
      </div>
      <div class="card">
        <h2 class="h2">${t("by_job")}</h2>
        <ul class="lines">
          <li><span>${state.settings.job1name || t("job1_fallback")}</span><span>${jobHours[1].toFixed(1)}h</span></li>
          ${state.settings.job2on ? `<li><span>${state.settings.job2name || t("job2_fallback")}</span><span>${jobHours[2].toFixed(1)}h</span></li>` : ""}
        </ul>
      </div>`;
  }

  // --- Year ---
  function renderYear() {
    const months = t("months");
    $("#anoTitle").textContent = `${t("my_year")} ${currentYear}`;
    const monthHours = Array(12).fill(0);
    for (const [key, data] of Object.entries(state.days)) {
      const [dy, dm] = key.split("-").map(Number);
      if (dy !== currentYear) continue;
      const ty = state.types.find(x => x.id === data.typeId);
      if (!ty || !ty.work) continue;
      monthHours[dm-1] += calcHours(ty.start, ty.end, ty.pause);
    }
    const maxH = Math.max(...monthHours, 1);
    const bars = monthHours.map(h => {
      const height = (h/maxH)*100;
      return `<i style="height:${height}%" class="${h===0?"zero":""}"></i>`;
    }).join("");
    const labels = months.map(m => `<span>${m.slice(0,3)}</span>`).join("");
    const total = monthHours.reduce((a,b)=>a+b,0);

    $("#anoBody").innerHTML = `
      <div class="card"><h2 class="h2">${t("hours_per_month")}</h2><div class="bars">${bars}</div><div class="barl">${labels}</div></div>
      <div class="card"><h2 class="h2">${t("annual_total")}</h2><p><b>${total.toFixed(1)}h</b> ${t("hours_worked_short")}</p></div>`;
  }

  // --- Shifts list ---
  function renderTypeList() {
    if (state.types.length === 0) {
      $("#typeList").innerHTML = `<p class="muted small" style="text-align:center;padding:20px 0">${t("no_shifts")}</p>`;
      renderPaintBar();
      return;
    }
    $("#typeList").innerHTML = state.types.map(ty => {
      const timeDisplay = ty.work
        ? `${formatTime(ty.start)} – ${formatTime(ty.end)}`
        : t("all_day");
      return `
      <div class="it-wrap">
        <button class="it-edit" data-type-id="${ty.id}">
          <span class="badge" style="background:${ty.color};color:#fff">${ty.code}</span>
          <div style="flex:1;min-width:0">
            <b>${ty.name}</b>
            <div class="small muted">${timeDisplay}</div>
          </div>
        </button>
        <button class="it-del" data-del-id="${ty.id}" aria-label="${t("delete")}">×</button>
      </div>`;
    }).join("");

    $$("#typeList .it-edit").forEach(btn =>
      btn.addEventListener("click", () => openTypeSheet(btn.dataset.typeId)));
    $$("#typeList .it-del").forEach(btn =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.delId;
        if (!confirm(t("confirm_delete_shift"))) return;
        state.types = state.types.filter(x => x.id !== id);
        for (const k of Object.keys(state.days)) if (state.days[k].typeId === id) delete state.days[k];
        saveState(); renderTypeList(); renderCalendar(); showToast(t("shift_deleted"));
      }));

    renderPaintBar();
  }

  // --- Shift editor ---
  function openTypeSheet(typeId) {
    let type, isNew = false;
    if (typeId) type = state.types.find(x => x.id === typeId);
    if (!type) {
      isNew = true;
      type = {
        id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2,5),
        name:"", code:"", color: COLOR_PALETTE[state.types.length % COLOR_PALETTE.length],
        start:"08:00", end:"16:00", pause:0, pauseStart:"12:00", work:true
      };
    }
    let selectedColor = type.color;

    $("#sheetBody").innerHTML = `
      <h2 class="h2">${t(isNew?"new_shift_title":"edit_shift")}</h2>
      <label class="field"><span>${t("name")}</span>
        <input class="inp" id="typeName" value="${(type.name||"").replace(/"/g,"&quot;")}">
      </label>
      <label class="field"><span>${t("code")}</span>
        <input class="inp" id="typeCode" value="${type.code||""}" maxlength="3">
      </label>
      <label class="check"><input type="checkbox" id="typeWork" ${type.work?"checked":""}><span>${t("counts_as_work")}</span></label>
      <div id="timeFields" style="${type.work?"":"display:none"}">
        <div class="two">
          <label class="field"><span>${t("start_time")}</span>
            <input class="inp time-input" type="text" readonly id="typeStart">
          </label>
          <label class="field"><span>${t("end_time")}</span>
            <input class="inp time-input" type="text" readonly id="typeEnd">
          </label>
        </div>
        <div class="two">
          <label class="field"><span>${t("pause_start")}</span>
            <input class="inp time-input" type="text" readonly id="typePauseStart">
          </label>
          <label class="field"><span>${t("pause_duration")}</span>
            <input class="inp" type="number" id="typePause" min="0" step="5" value="${type.pause||0}">
          </label>
        </div>
      </div>
      <label class="field"><span>${t("color")}</span>
        <div class="colors" id="colorPicker">
          ${COLOR_PALETTE.map(c => `<button type="button" data-color="${c}" style="background:${c}" aria-pressed="${c===selectedColor}" aria-label="${c}"></button>`).join("")}
        </div>
      </label>
      <button class="btn primary block" id="saveType">${t("save")}</button>
      <button class="btn block" id="cancelType" style="margin-top:10px">${t("cancel")}</button>
      ${!isNew ? `<button class="btn danger block" id="delType" style="margin-top:10px">${t("delete_shift")}</button>` : ""}
    `;
    $("#sheet").classList.add("on");
    $("#scrim").classList.add("on");

    // Initialize time inputs
    makeTimeInput($("#typeStart"), type.start);
    makeTimeInput($("#typeEnd"), type.end);
    makeTimeInput($("#typePauseStart"), type.pauseStart || type.start);

    // Toggle time fields on work checkbox
    $("#typeWork").addEventListener("change", () => {
      $("#timeFields").style.display = $("#typeWork").checked ? "" : "none";
    });

    // Color picker
    $$("#colorPicker button").forEach(btn => btn.addEventListener("click", () => {
      selectedColor = btn.dataset.color;
      $$("#colorPicker button").forEach(x => x.setAttribute("aria-pressed","false"));
      btn.setAttribute("aria-pressed","true");
    }));

    // Cancel
    $("#cancelType").addEventListener("click", closeSheet);

    // Save
    $("#saveType").addEventListener("click", () => {
      const isWork = $("#typeWork").checked;
      const updates = {
        name: $("#typeName").value.trim() || (isNew?t("new_shift_title"):type.name),
        code: $("#typeCode").value.trim().slice(0,3) || (isNew?"?":type.code),
        color: selectedColor,
        work: isWork
      };
      if (isWork) {
        updates.start = $("#typeStart").dataset.value || "00:00";
        updates.end = $("#typeEnd").dataset.value || "00:00";
        updates.pauseStart = $("#typePauseStart").dataset.value || updates.start;
        updates.pause = Math.max(0, parseInt($("#typePause").value, 10) || 0);
      } else {
        updates.start = "00:00";
        updates.end = "00:00";
        updates.pauseStart = "";
        updates.pause = 0;
      }
      const existing = state.types.find(x => x.id === type.id);
      if (existing) Object.assign(existing, updates);
      else { Object.assign(type, updates); state.types.push(type); }
      saveState(); renderTypeList(); renderCalendar(); closeSheet();
      showToast(t(isNew?"shift_created":"shift_updated"));
    });

    // Delete
    const delBtn = $("#delType");
    if (delBtn) delBtn.addEventListener("click", () => {
      if (!confirm(t("confirm_delete_shift"))) return;
      state.types = state.types.filter(x => x.id !== type.id);
      for (const k of Object.keys(state.days)) if (state.days[k].typeId === type.id) delete state.days[k];
      saveState(); renderTypeList(); renderCalendar(); closeSheet(); showToast(t("shift_deleted"));
    });
  }

  // --- Time input helper ---
  function makeTimeInput(inputEl, initialValue) {
    inputEl.dataset.value = initialValue || "00:00";
    inputEl.value = formatTime(inputEl.dataset.value);
    inputEl.readOnly = true;
    inputEl.addEventListener("click", () => {
      openClockPicker(inputEl.dataset.value, (newTime) => {
        inputEl.dataset.value = newTime;
        inputEl.value = formatTime(newTime);
      });
    });
  }

  // --- ICS export ---
  function exportICS() {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TurnoCerto//Clone//PT\n";
    for (const [dateKey, data] of Object.entries(state.days)) {
      const ty = state.types.find(x => x.id === data.typeId);
      if (!ty || !ty.work) continue;
      const dt = dateKey.replace(/-/g,"");
      ics += `BEGIN:VEVENT\nUID:${Math.random().toString(36).slice(2)}\nDTSTART:${dt}T${ty.start.replace(":","")}00\nDTEND:${dt}T${ty.end.replace(":","")}00\nSUMMARY:${ty.name}\nEND:VEVENT\n`;
    }
    ics += "END:VCALENDAR";
    const blob = new Blob([ics], {type:"text/calendar"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "turnos.ics"; a.click();
    URL.revokeObjectURL(a.href);
  }

  // --- PDF export ---
  function exportPDF() {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const months = t("months");
    const title = `${(months[m]||"").charAt(0).toUpperCase() + (months[m]||"").slice(1)} ${y}`;
    const firstDay = (new Date(y,m,1).getDay()+6)%7;
    const daysInMonth = new Date(y,m+1,0).getDate();

    let cells = "";
    for (let i=0;i<firstDay;i++) cells += "<td></td>";
    for (let d=1;d<=daysInMonth;d++) {
      const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const dayData = state.days[key];
      const hol = state.holidays[key];
      let inner = `<div class="dnum">${d}${hol?' <span style="color:#C2413A">●</span>':''}</div>`;
      if (dayData && dayData.typeId) {
        const ty = state.types.find(x=>x.id===dayData.typeId);
        if (ty) inner += `<div class="dblk" style="background:${ty.color}">${ty.code}</div>`;
      }
      cells += `<td>${inner}</td>`;
      if ((firstDay+d)%7===0 && d<daysInMonth) cells += "</tr><tr>";
    }
    const total = firstDay + daysInMonth;
    const trailing = (7-(total%7))%7;
    for (let i=0;i<trailing;i++) cells += "<td></td>";

    const wdHtml = t("weekdays").map(d=>`<th>${d}</th>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>@page{size:A4;margin:12mm}body{font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#1B2033;margin:0;padding:12mm}
h1{font-size:22px;margin:0 0 12px}table{border-collapse:collapse;width:100%;table-layout:fixed}
th{font-size:11px;color:#646C82;padding:6px 4px;text-align:left;border-bottom:1px solid #E0E3EB}
td{border:1px solid #E0E3EB;padding:4px;vertical-align:top;width:14.28%;height:64px}
.dnum{font-size:11px;font-weight:600;margin-bottom:3px}
.dblk{border-radius:4px;padding:4px 2px;font-size:10px;font-weight:700;text-align:center;color:#fff}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:0}}</style></head>
<body><h1>${title}</h1><table><thead><tr>${wdHtml}</tr></thead><tbody><tr>${cells}</tr></tbody></table></body></html>`;

    const w = window.open("","_blank");
    if (!w) { showToast(t("export_pdf_blocked")); return; }
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(()=>{try{w.focus();w.print();}catch(e){}},350);
  }

  // --- More options sheet ---
  function openMoreSheet() {
    $("#sheetBody").innerHTML = `
      <h2 class="h2">${t("more_options")}</h2>
      <button class="action-row" id="exportIcsBtn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 13v5M9 15l3 3 3-3"/></svg>
        <div style="flex:1;min-width:0"><div>${t("export_to_calendar")}</div><div class="small muted" style="font-weight:400;margin-top:2px">${t("export_ics_desc")}</div></div>
      </button>
      <button class="action-row" id="exportPdfBtn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9 15h6M9 18h4"/></svg>
        <div style="flex:1;min-width:0"><div>${t("export_pdf")}</div><div class="small muted" style="font-weight:400;margin-top:2px">${t("export_pdf_desc")}</div></div>
      </button>
      <button class="btn block" id="closeMore" style="margin-top:8px">${t("close")}</button>`;
    $("#sheet").classList.add("on");
    $("#scrim").classList.add("on");
    $("#exportIcsBtn").addEventListener("click",()=>{closeSheet();exportICS();});
    $("#exportPdfBtn").addEventListener("click",()=>{closeSheet();exportPDF();});
    $("#closeMore").addEventListener("click",closeSheet);
  }

  // --- Paint bar ---
  function renderPaintBar() {
    if (state.types.length === 0) {
      $("#paintBar").innerHTML =
        `<span class="small muted" style="padding:8px 4px;flex:none">${t("no_shifts_paint")}</span>`;
      return;
    }
    const parts = state.types.map(ty =>
      `<button class="chip" data-brush="${ty.id}" aria-pressed="${brush===ty.id}"><span class="dot" style="background:${ty.color}"></span>${ty.name}</button>`);
    parts.push(`<button class="chip" data-brush="__x" aria-pressed="${brush==='__x'}"><span class="dot" style="background:transparent;border:2px dashed var(--muted)"></span>${t("delete")}</button>`);
    $("#paintBar").innerHTML = parts.join("");
    $$("#paintBar .chip").forEach(chip => chip.addEventListener("click", () => {
      brush = chip.dataset.brush;
      $$("#paintBar .chip").forEach(c => c.setAttribute("aria-pressed","false"));
      chip.setAttribute("aria-pressed","true");
    }));
  }

  function enablePaintScroll() {
    const bar = $("#paintBar");
    bar.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); bar.scrollLeft += e.deltaY; }
    }, {passive:false});
    let isDown=false, startX=0, startScroll=0, moved=false;
    bar.addEventListener("mousedown", (e)=>{ isDown=true; moved=false; startX=e.pageX-bar.offsetLeft; startScroll=bar.scrollLeft; });
    window.addEventListener("mouseup", ()=>{ isDown=false; bar.classList.remove("dragging"); });
    bar.addEventListener("mousemove", (e)=>{
      if(!isDown) return;
      const dx = (e.pageX-bar.offsetLeft) - startX;
      if (Math.abs(dx)>4) { moved=true; bar.classList.add("dragging"); e.preventDefault(); bar.scrollLeft = startScroll - dx; }
    });
    bar.addEventListener("click", (e)=>{ if(moved){e.stopPropagation();e.preventDefault();moved=false;} }, true);
  }

  // --- Settings inputs ---
  function syncSettingsInputs() {
    $$("[data-set]").forEach(input => {
      const key = input.dataset.set;
      const val = state.settings[key];
      if (val === undefined) return;
      if (input.type === "checkbox") input.checked = !!val;
      else if (input.classList.contains("time-input")) {
        input.dataset.value = val;
        input.value = formatTime(val);
      }
      else input.value = val;
    });
  }

  // --- Backup / restore ---
  function backup() {
    const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "turnocerto-backup.json"; a.click(); URL.revokeObjectURL(a.href);
  }
  function restore(file) {
    const r = new FileReader();
    r.onload = e => {
      try {
        const d = JSON.parse(e.target.result);
        if (d.v && Array.isArray(d.types)) {
          state = d;
          if (!state.settings.lang) state.settings.lang = "pt";
          if (!state.settings.theme || state.settings.theme === "auto") state.settings.theme = "light";
          if (!state.settings.timeFormat) state.settings.timeFormat = "24";
          if (!state.settings.country) state.settings.country = "PT";
          if (!state.holidays) state.holidays = {};
          for (const ty of state.types) {
            if (typeof ty.pause !== "number") ty.pause = 0;
            if (typeof ty.pauseStart !== "string") ty.pauseStart = "";
          }
          saveState(); applyTheme(); syncSettingsInputs(); applyLanguage();
          showToast(t("backup_restored"));
        } else showToast(t("invalid_file"));
      } catch { showToast(t("file_error")); }
    };
    r.readAsText(file);
  }

  function renderAll() {
    renderCalendar(); renderTypeList(); renderSummary(); renderYear();
  }

  // --- Holidays ---
  async function loadHolidaysForYear(year) {
    const country = state.settings.country || "PT";
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${encodeURIComponent(country)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Unsupported country "${country}" or no data for ${year}`);
        throw new Error(`HTTP ${res.status}`);
      }
      const list = await res.json();
      if (!Array.isArray(list)) throw new Error("Unexpected response shape");

      const lang = state.settings.lang === "en" ? "en" : "pt";
      const map = {};
      for (const h of list) {
        if (h.global !== true) continue;
        const date = (h.date || "").slice(0, 10);
        if (!date) continue;
        const displayName = (lang === "en") ? (h.name || h.localName) : (h.localName || h.name);
        map[date] = displayName || "Holiday";
      }
      state.holidays = map;
      saveState();
      return Object.keys(map).length;
    } catch (e) {
      console.warn("Failed to load holidays", e);
      throw e;
    }
  }

  // ============================================================
  // CLOCK PICKER (Android-style: hours outer ring, minutes inner ring)
  // ============================================================
  let clockState = null;
  let clockDragging = false;
  let clockListenersAdded = false;

  function openClockPicker(initialHHMM, callback) {
    const mode24 = state.settings.timeFormat !== "12";
    let [h, m] = (initialHHMM || "00:00").split(":").map(Number);
    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;

    clockState = { hour: h, minute: m, mode24, callback };

    const overlay = ensureClockOverlay();
    overlay.innerHTML = `
      <div class="clock-top">
        <button class="btn" id="clockCancel">${t("cancel")}</button>
      </div>
      <div class="clock-time" id="clockTime"></div>
      ${!mode24 ? `<div class="clock-period" id="clockPeriod">
        <button data-ampm="AM">${t("am")}</button>
        <button data-ampm="PM">${t("pm")}</button>
      </div>` : `<div style="height:8px"></div>`}
      <div id="clockSvgContainer"></div>
      <div class="clock-actions">
        <button class="btn primary block" id="clockConfirm">${t("save")}</button>
      </div>
    `;
    overlay.classList.add("on");

    renderClockDisplay();
    renderClockSvg();

    $("#clockCancel").onclick = closeClockPicker;
    $("#clockConfirm").onclick = () => {
      const result = `${String(clockState.hour).padStart(2,"0")}:${String(clockState.minute).padStart(2,"0")}`;
      const cb = clockState.callback;
      closeClockPicker();
      if (cb) cb(result);
    };

    if (!mode24) {
      $$("#clockPeriod button").forEach(btn => {
        btn.onclick = () => {
          const cur = clockState.hour;
          const isPM = cur >= 12;
          const h12 = cur % 12;
          if (btn.dataset.ampm === "AM" && isPM) clockState.hour = h12;
          else if (btn.dataset.ampm === "PM" && !isPM) clockState.hour = h12 + 12;
          renderClockDisplay();
          renderClockSvg();
        };
      });
    }

    ensureClockListeners();
  }

  function closeClockPicker() {
    const overlay = document.getElementById("clockOverlay");
    if (overlay) overlay.classList.remove("on");
    clockState = null;
    clockDragging = false;
  }

  function ensureClockOverlay() {
    let overlay = document.getElementById("clockOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "clockOverlay";
      overlay.className = "clock-overlay";
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function renderClockDisplay() {
    if (!clockState) return;
    const timeEl = document.getElementById("clockTime");
    if (!timeEl) return;
    const { hour, minute, mode24 } = clockState;
    if (mode24) {
      timeEl.textContent = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
    } else {
      const ampm = hour < 12 ? t("am") : t("pm");
      const h12 = hour % 12 || 12;
      timeEl.textContent = `${h12}:${String(minute).padStart(2,"0")} ${ampm}`;
    }
    if (!mode24) {
      $$("#clockPeriod button").forEach(btn => {
        const isPM = hour >= 12;
        btn.classList.toggle("active",
          (btn.dataset.ampm === "PM" && isPM) || (btn.dataset.ampm === "AM" && !isPM));
      });
    }
  }

  function renderClockSvg() {
    if (!clockState) return;
    const { hour, minute, mode24 } = clockState;
    const container = document.getElementById("clockSvgContainer");
    if (!container) return;

    const cx = 150, cy = 150;
    const rHour = mode24 ? 120 : 115;
    const rMin = 68;

    let svg = `<svg viewBox="0 0 300 300" class="clock-face">`;

    // Hour numbers (outer ring)
    const hourCount = mode24 ? 24 : 12;
    for (let i = 0; i < hourCount; i++) {
      let value, selected;
      if (mode24) {
        value = i;
        selected = hour === i;
      } else {
        value = i === 0 ? 12 : i;
        selected = (hour % 12) === (value % 12);
      }
      const angle = (i / hourCount) * 360 - 90;
      const rad = angle * Math.PI / 180;
      const x = cx + Math.cos(rad) * rHour;
      const y = cy + Math.sin(rad) * rHour;
      const fs = mode24 ? 12 : 18;
      svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
                font-size="${fs}" font-weight="${selected ? '800' : '500'}"
                fill="${selected ? 'var(--accent)' : 'var(--ink)'}"
                pointer-events="none">${mode24 ? String(value).padStart(2,'0') : value}</text>`;
    }

    // Minute numbers (inner ring)
    for (let i = 0; i < 12; i++) {
      const value = i * 5;
      const angle = (i / 12) * 360 - 90;
      const rad = angle * Math.PI / 180;
      const x = cx + Math.cos(rad) * rMin;
      const y = cy + Math.sin(rad) * rMin;
      const selected = Math.abs(minute - value) < 2.5;
      svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
                font-size="12" font-weight="${selected ? '800' : '500'}"
                fill="${selected ? 'var(--accent)' : 'var(--muted)'}"
                pointer-events="none">${String(value).padStart(2,'0')}</text>`;
    }

    // Hour hand
    const displayHour = mode24 ? hour : (hour % 12);
    const hourAngle = (displayHour / (mode24 ? 24 : 12)) * 360 - 90;
    const hrad = hourAngle * Math.PI / 180;
    const hx = cx + Math.cos(hrad) * (rHour - 18);
    const hy = cy + Math.sin(hrad) * (rHour - 18);
    svg += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}"
              stroke="var(--accent)" stroke-width="4" stroke-linecap="round" pointer-events="none"/>`;

    // Minute hand
    const minAngle = (minute / 60) * 360 - 90;
    const mrad = minAngle * Math.PI / 180;
    const mx = cx + Math.cos(mrad) * (rMin - 12);
    const my = cy + Math.sin(mrad) * (rMin - 12);
    svg += `<line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"
              stroke="var(--accent)" stroke-width="3" stroke-linecap="round" opacity="0.7" pointer-events="none"/>`;

    // Center dot
    svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="var(--accent)" pointer-events="none"/>`;

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function ensureClockListeners() {
    if (clockListenersAdded) return;
    clockListenersAdded = true;

    document.addEventListener("pointerdown", (e) => {
      const container = document.getElementById("clockSvgContainer");
      if (!container) return;
      if (!container.contains(e.target)) return;
      clockDragging = true;
      updateClockFromPointer(e);
    });
    document.addEventListener("pointermove", (e) => {
      if (clockDragging) updateClockFromPointer(e);
    });
    document.addEventListener("pointerup", () => { clockDragging = false; });
    document.addEventListener("pointercancel", () => { clockDragging = false; });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const overlay = document.getElementById("clockOverlay");
        if (overlay && overlay.classList.contains("on")) {
          e.stopPropagation();
          closeClockPicker();
        }
      }
    });
  }

  function updateClockFromPointer(e) {
    if (!clockState) return;
    const svgEl = document.querySelector("#clockSvgContainer svg");
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 300;
    const y = (e.clientY - rect.top) / rect.height * 300;

    const cx = 150, cy = 150;
    const dx = x - cx, dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 25 || dist > 145) return;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (dist > 92) {
      // Hour zone
      if (clockState.mode24) {
        const idx = Math.round(angle / 15) % 24;
        if (clockState.hour !== idx) {
          clockState.hour = idx;
          renderClockDisplay();
          renderClockSvg();
        }
      } else {
        const idx = Math.round(angle / 30) % 12;
        const h12 = idx === 0 ? 12 : idx;
        const isPM = clockState.hour >= 12;
        const newHour = isPM
          ? (h12 === 12 ? 12 : h12 + 12)
          : (h12 === 12 ? 0 : h12);
        if (clockState.hour !== newHour) {
          clockState.hour = newHour;
          renderClockDisplay();
          renderClockSvg();
        }
      }
    } else {
      // Minute zone
      const idx = Math.round(angle / 30) % 12;
      const newMin = idx * 5;
      if (clockState.minute !== newMin) {
        clockState.minute = newMin;
        renderClockDisplay();
        renderClockSvg();
      }
    }
  }

  // --- INIT ---
  async function init() {
    applyTheme();

    // Nav
    $$(".nav button").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.tab === "more") { openMoreSheet(); return; }
      switchTab(b.dataset.tab);
    }));

    // Month/year nav
    $$("[data-mv]").forEach(b => b.addEventListener("click", () => {
      currentMonth.setMonth(currentMonth.getMonth() + Number(b.dataset.mv));
      if (currentTab === "cal") renderCalendar();
      if (currentTab === "res") renderSummary();
    }));
    $$("[data-yv]").forEach(b => b.addEventListener("click", () => {
      currentYear += Number(b.dataset.yv); renderYear();
    }));

    // Paint mode
    $("#paintSwitch").addEventListener("click", () => { paintMode = !paintMode; updatePaintUI(); });
    $("#todayBtn").addEventListener("click", () => { currentMonth = new Date(); renderCalendar(); });

    // Scrim closes any open sheet
    $("#scrim").addEventListener("click", closeSheet);

    // Esc closes sheet
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("#sheet").classList.contains("on")) {
        closeSheet();
      }
    });

    // Backup / restore / wipe
    $("#backupBtn").addEventListener("click", backup);
    $("#restoreBtn").addEventListener("click", () => $("#restoreFile").click());
    $("#restoreFile").addEventListener("change", e => { if (e.target.files[0]) restore(e.target.files[0]); });
    $("#wipeBtn").addEventListener("click", () => {
      if (!confirm(t("confirm_wipe"))) return;
      const lang=state.settings.lang, theme=state.settings.theme, tf=state.settings.timeFormat;
      state = defaults(); state.settings.lang=lang; state.settings.theme=theme; state.settings.timeFormat=tf;
      saveState(); applyTheme(); syncSettingsInputs(); applyLanguage(); showToast(t("data_cleared"));
    });

    // New shift
    $("#addType").addEventListener("click", () => openTypeSheet(null));

    // Load holidays
    $("#loadHolidaysBtn").addEventListener("click", async () => {
      const year = currentMonth.getFullYear();
      try {
        const n = await loadHolidaysForYear(year);
        renderCalendar();
        $("#holidaysStatus").textContent = t("holidays_loaded").replace("{n}", n).replace("{year}", year);
      } catch {
        showToast(t("holidays_error"));
      }
    });

    // Time inputs in settings — open clock picker
    $$(".time-input[data-set]").forEach(input => {
      const key = input.dataset.set;
      input.dataset.value = state.settings[key] || "00:00";
      input.value = formatTime(input.dataset.value);
      input.readOnly = true;
      input.addEventListener("click", () => {
        openClockPicker(input.dataset.value, (newTime) => {
          input.dataset.value = newTime;
          input.value = formatTime(newTime);
          state.settings[key] = newTime;
          saveState();
        });
      });
    });

    // Other settings change handlers (skip time inputs — handled above)
    $$("[data-set]").forEach(input => {
      if (input.classList.contains("time-input")) return;
      input.addEventListener("change", async () => {
        const key = input.dataset.set;
        if (input.type === "checkbox") state.settings[key] = input.checked;
        else state.settings[key] = input.value;
        saveState();
        if (key === "theme") applyTheme();
        if (key === "timeFormat") {
          // Re-render everything that shows times
          renderTypeList();
          syncSettingsInputs();
        }
        if (key === "job2on") renderSummary();
        if (key === "lang") {
          applyLanguage();
          // Auto-reload holidays in new language
          const holidayKeys = Object.keys(state.holidays);
          if (holidayKeys.length > 0) {
            const holidayYear = parseInt(holidayKeys[0].slice(0,4), 10);
            try {
              await loadHolidaysForYear(holidayYear);
              renderCalendar();
              $("#holidaysStatus").textContent = t("holidays_loaded")
                .replace("{n}", Object.keys(state.holidays).length)
                .replace("{year}", holidayYear);
            } catch { /* silent */ }
          }
        }
      });
    });

    enablePaintScroll();
    syncSettingsInputs();
    applyLanguage();
    switchTab("cal");

    // Auto-load holidays on first run
    if (Object.keys(state.holidays).length === 0) {
      try {
        const n = await loadHolidaysForYear(new Date().getFullYear());
        renderCalendar();
        $("#holidaysStatus").textContent = t("holidays_loaded").replace("{n}", n).replace("{year}", new Date().getFullYear());
      } catch (e) { /* silent */ }
    } else {
      const years = new Set(Object.keys(state.holidays).map(d => d.slice(0,4)));
      const latest = [...years].sort().pop() || new Date().getFullYear();
      $("#holidaysStatus").textContent = t("holidays_loaded")
        .replace("{n}", Object.keys(state.holidays).length)
        .replace("{year}", latest);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();