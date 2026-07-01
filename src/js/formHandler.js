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

function buildEmailText(formData) {
  return [
    'Nuova registrazione dal modulo del sito.',
    '',
    'Nome / Nome d\'Arte: ' + formData.name,
    'Email: ' + formData.email,
    'Personaggio / Gioco: ' + (formData.character || 'N/A'),
    'Categoria: ' + formData.category,
    'Note aggiuntive: ' + (formData.message || 'Nessuna'),
    '',
    '---',
    'Arcomix Games & Cosplay — Festival 2026',
  ].join('\n');
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
    from_name: formData.name,
    from_email: formData.email,
    reply_to: formData.email,
    to_email: emailJsConfig.recipientEmail,
    subject: 'Registrazione Arcomix Games & Cosplay',
    message: buildEmailText(formData),
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
