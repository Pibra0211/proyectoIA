/* =========================================================
   DGE Studios - Lógica de la página
   1) Menú móvil (hamburguesa)
   2) Validación del formulario de contacto (sin envío real)
   ========================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initForm();
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   1) MENÚ MÓVIL
   --------------------------------------------------------- */
function initMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('menuPrincipal');
  if (!toggle || !menu) return;

  // Abre o cierra el menú y actualiza los atributos de accesibilidad
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Cierra el menú al elegir un enlace
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Cierra el menú con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // Si la pantalla crece a tablet/desktop, se restablece el estado
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) setMenu(false);
  });
}

/* ---------------------------------------------------------
   2) FORMULARIO DE CONTACTO
   --------------------------------------------------------- */
function initForm() {
  const form = document.getElementById('formContacto');
  const successMsg = document.getElementById('mensajeExito');
  if (!form) return;

  // Reglas de validación: cada función devuelve un mensaje de error o '' si es válido
  const rules = {
    nombre(value) {
      const v = value.trim();
      if (!v) return 'Escribe tu nombre completo.';
      if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/.test(v)) return 'El nombre solo puede contener letras.';
      return '';
    },
    correo(value) {
      const v = value.trim();
      if (!v) return 'Escribe tu correo electrónico.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
      return '';
    },
    telefono(value) {
      const v = value.trim();
      if (!v) return 'Escribe tu número de teléfono.';
      if (!/^\+?[\d\s()-]+$/.test(v)) return 'El teléfono solo puede tener números, espacios, + y guiones.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'El teléfono debe tener entre 7 y 15 dígitos.';
      return '';
    },
    negocio(value) {
      return value ? '' : 'Selecciona tu tipo de negocio.';
    },
    mensaje(value) {
      const v = value.trim();
      if (!v) return 'Cuéntanos brevemente qué necesitas.';
      if (v.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      if (v.length > 500) return 'El mensaje no puede superar los 500 caracteres.';
      return '';
    }
  };

  // Valida un campo y muestra u oculta su mensaje de error
  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    const error = rule(field.value);
    const errorBox = document.getElementById('error-' + field.name);

    errorBox.textContent = error;
    field.classList.toggle('is-invalid', Boolean(error));
    field.classList.toggle('is-valid', !error);
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }

  const fields = Array.from(form.querySelectorAll('input, select, textarea'));

  // Validación en vivo: al salir del campo y, si ya tenía error, mientras se corrige
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    const evt = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evt, () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  // Envío: se valida todo y NO se envía información real
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.hidden = true;

    let firstInvalid = null;
    fields.forEach((field) => {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    // Si hay errores, se lleva el foco al primer campo inválido
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Todo correcto: se muestra la confirmación y se limpia el formulario
    successMsg.hidden = false;
    form.reset();
    fields.forEach((field) => {
      field.classList.remove('is-valid', 'is-invalid');
      field.removeAttribute('aria-invalid');
    });
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
