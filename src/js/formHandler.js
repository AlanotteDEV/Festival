/**
 * Handles the cosplay registration form submission.
 * Hides the form and reveals a success message.
 */

function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('cosplayForm');
  const successMsg = document.getElementById('successMessage');

  if (!form || !successMsg) {
    return false;
  }

  form.style.display = 'none';
  successMsg.classList.remove('hidden');
  successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
  const category = formElement.querySelector('#category');

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
