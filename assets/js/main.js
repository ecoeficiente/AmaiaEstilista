/**
 * Amaia Estilista - Lógica interactiva ligera (Vanilla JS)
 * Cálculo dinámico de horario de apertura, día actual y mejoras de accesibilidad
 */

document.addEventListener('DOMContentLoaded', () => {
  initScheduleStatus();
  initHeaderScroll();
});

/**
 * Horario oficial de atención y citas de Amaia Estilista:
 * 0: Domingo (Cerrado)
 * 1: Lunes (Cerrado)
 * 2: Martes (09:30 - 13:30, 15:00 - 18:00)
 * 3: Miércoles (09:30 - 13:30, 15:00 - 18:00)
 * 4: Jueves (09:30 - 13:30, 15:00 - 18:00)
 * 5: Viernes (09:30 - 19:00)
 * 6: Sábado (09:00 - 13:00)
 */
const SCHEDULE = {
  0: [], // Domingo: cerrado
  1: [], // Lunes: cerrado
  2: [
    { start: 9 * 60 + 30, end: 13 * 60 + 30, closeStr: '13:30' },
    { start: 15 * 60, end: 18 * 60, closeStr: '18:00' }
  ],
  3: [
    { start: 9 * 60 + 30, end: 13 * 60 + 30, closeStr: '13:30' },
    { start: 15 * 60, end: 18 * 60, closeStr: '18:00' }
  ],
  4: [
    { start: 9 * 60 + 30, end: 13 * 60 + 30, closeStr: '13:30' },
    { start: 15 * 60, end: 18 * 60, closeStr: '18:00' }
  ],
  5: [{ start: 9 * 60 + 30, end: 19 * 60, closeStr: '19:00' }],
  6: [{ start: 9 * 60, end: 13 * 60, closeStr: '13:00' }]
};

function initScheduleStatus() {
  const isBasque = document.documentElement.lang === 'eu';
  const now = new Date();

  // Obtener hora local de España (Europe/Madrid)
  const localTimeString = now.toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour12: false });
  const [hStr, mStr] = localTimeString.split(':');
  const currentMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
  
  // Día de la semana en horario peninsular
  const dayFormatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'narrow' });
  // Usamos getDay() con compensación o fecha calculada
  const madridDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const currentDay = madridDate.getDay();

  // Resaltar la fila correspondiente al día actual en la tabla de horarios
  const tableRows = document.querySelectorAll('.hours-table tr[data-day]');
  tableRows.forEach(row => {
    const rowDay = parseInt(row.getAttribute('data-day'), 10);
    if (rowDay === currentDay) {
      row.classList.add('is-today');
      const dayCell = row.querySelector('.day-col');
      if (dayCell && !dayCell.querySelector('.today-tag')) {
        const tag = document.createElement('span');
        tag.className = 'today-tag';
        tag.textContent = isBasque ? 'Gaur' : 'Hoy';
        dayCell.appendChild(tag);
      }
    }
  });

  // Determinar disponibilidad de citas en este momento
  const todayIntervals = SCHEDULE[currentDay] || [];
  let isOpen = false;
  let closingAt = '';
  let nextOpenToday = '';

  for (const interval of todayIntervals) {
    if (currentMinutes >= interval.start && currentMinutes < interval.end) {
      isOpen = true;
      closingAt = interval.closeStr;
      break;
    } else if (currentMinutes < interval.start && !nextOpenToday) {
      const openH = Math.floor(interval.start / 60).toString().padStart(2, '0');
      const openM = (interval.start % 60).toString().padStart(2, '0');
      nextOpenToday = `${openH}:${openM}`;
    }
  }

  // Actualizar el badge de estado en el hero con orientación a citas
  const statusContainer = document.getElementById('business-status');
  if (!statusContainer) return;

  if (isOpen) {
    statusContainer.className = 'status-badge open';
    statusContainer.innerHTML = `
      <span class="status-dot" aria-hidden="true"></span>
      <span>${isBasque ? `Hitzorduetarako eskuragarri · Gaur ${closingAt}ak arte` : `Disponible para citas · Hoy hasta las ${closingAt}`}</span>
    `;
  } else {
    statusContainer.className = 'status-badge closed';
    let statusText = '';
    if (nextOpenToday) {
      statusText = isBasque ? `Hitzorduak eskuragarri gaur ${nextOpenToday}etik aurrera` : `Citas disponibles hoy desde las ${nextOpenToday}`;
    } else {
      // Buscar siguiente día con atención
      let nextDay = (currentDay + 1) % 7;
      let daysAhead = 1;
      while ((!SCHEDULE[nextDay] || SCHEDULE[nextDay].length === 0) && daysAhead < 7) {
        nextDay = (nextDay + 1) % 7;
        daysAhead++;
      }
      
      const firstSlot = SCHEDULE[nextDay][0];
      const openH = Math.floor(firstSlot.start / 60).toString().padStart(2, '0');
      const openM = (firstSlot.start % 60).toString().padStart(2, '0');
      const timeStr = `${openH}:${openM}`;

      const dayNamesEs = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const dayNamesEu = ['igandean', 'astelehenean', 'asteartean', 'asteazkenean', 'ostegunean', 'ostiralean', 'larunbatean'];

      if (daysAhead === 1) {
        statusText = isBasque ? `Hurrengo arreta: bihar ${timeStr}etan · Erreserbatu WhatsAppez` : `Próxima atención: mañana a las ${timeStr} · Reserva por WhatsApp`;
      } else {
        statusText = isBasque ? `Hurrengo arreta: ${dayNamesEu[nextDay]} (${timeStr}) · Erreserbatu WhatsAppez` : `Próxima atención: ${dayNamesEs[nextDay]} a las ${timeStr} · Reserva por WhatsApp`;
      }
    }

    statusContainer.innerHTML = `
      <span class="status-dot" aria-hidden="true"></span>
      <span>${statusText}</span>
    `;
  }
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
