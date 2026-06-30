/**
 * Handles the cosplay registration form submission.
 * Hides the form and reveals a success message.
 */

const emailJsConfig = {
  publicKey: '7l_HAZEX9KJId_NRw',
  serviceId: 'service_lhtetiu',
  templateId: 'template_8ogqjxg',
  recipientEmail: 'trajan.comic.cosplay@gmail.com',
};

function initEmailJS() {
  if (window.emailjs && !window.emailjsInitDone) {
    emailjs.init(emailJsConfig.publicKey);
    window.emailjsInitDone = true;
  }
}

function buildEmailHtml(formData) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111;background:#f8f7f2;padding:24px;border-radius:16px;">
      <div style="background:#2f2258;padding:18px 24px;border-radius:12px 12px 0 0;color:#fff;">
        <h1 style="margin:0;font-size:22px;letter-spacing:0.08em;">Registrazione Arcomix Games & Cosplay</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 18px;color:#444;font-size:16px;line-height:1.6;">Hai ricevuto una nuova registrazione dal modulo del sito.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;font-weight:700;color:#2f2258;width:180px;">Nome / Nome d'Arte:</td><td style="padding:10px 0;color:#333;">${formData.name}</td></tr>
          <tr><td style="padding:10px 0;font-weight:700;color:#2f2258;">Email:</td><td style="padding:10px 0;color:#333;">${formData.email}</td></tr>
          <tr><td style="padding:10px 0;font-weight:700;color:#2f2258;">Personaggio / Gioco:</td><td style="padding:10px 0;color:#333;">${formData.character || 'N/A'}</td></tr>
          <tr><td style="padding:10px 0;font-weight:700;color:#2f2258;">Categoria:</td><td style="padding:10px 0;color:#333;">${formData.category}</td></tr>
          <tr><td style="padding:10px 0;font-weight:700;color:#2f2258;">Note aggiuntive:</td><td style="padding:10px 0;color:#333;">${formData.message || 'Nessuna'}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#f1eefa;border-radius:12px;color:#5e4e8b;font-size:14px;">
          Questa email è stata generata da Arcomix Games & Cosplay — Festival 2026.
        </div>
      </div>
    </div>
  `;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('cosplayForm');
  const successMsg = document.getElementById('successMessage');

  if (!form || !successMsg) {
    return false;
  }

  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const character = form.querySelector('#character');
  const type = form.querySelector('#type');
  const message = form.querySelector('#message');

  if (!name || !email || !type) {
    return false;
  }

  const formData = {
    name: name.value.trim(),
    email: email.value.trim(),
    character: character ? character.value.trim() : '',
    category: type.value,
    message: message ? message.value.trim() : '',
  };

  const validation = validateForm(form);

  if (!validation.valid) {
    alert('Per favore compila correttamente i campi obbligatori: nome, email e categoria.');
    return false;
  }

  initEmailJS();

  const templateParams = {
    user_name: formData.name,
    user_email: formData.email,
    user_character: formData.character || 'N/A',
    user_category: formData.category,
    user_message: formData.message || 'Nessuna',
    recipient_email: emailJsConfig.recipientEmail,
    email_subject: 'Registrazione Arcomix Games & Cosplay',
    html_message: buildEmailHtml(formData),
  };

  emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams)
    .then(() => {
      form.style.display = 'none';
      successMsg.classList.remove('hidden');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      alert('C\'è stato un problema nell\'invio della mail. Controlla le impostazioni EmailJS e riprova.');
    });

  return true;
}

/**
 * Validates required form fields before submission.
 * Returns an object with `valid` boolean and `errors` array.
 */
function validateForm(formElement) {
  const errors = [];

  const name = formElement.querySelector('#name');
  const email = formElement.querySelector('#email');
  const category = formElement.querySelector('#type');

  if (!name || !name.value.trim()) {
    errors.push('name');
  }

  if (!email || !email.value.trim()) {
    errors.push('email');
  } else if (!isValidEmail(email.value.trim())) {
    errors.push('email_format');
  }

  if (!category || !category.value) {
    errors.push('category');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Basic email format validation.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleFormSubmit, validateForm, isValidEmail };
}
