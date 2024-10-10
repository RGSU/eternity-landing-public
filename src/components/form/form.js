const calFormFilled = (form) => {
  form.filledFieldsCount = 0;
  form.allFieldsCount = 0;

  // eslint-disable-next-line max-len
  // const REQUIRED_FIELDS_SELECTOR = 'input:not([type^=hidden]):not([type^=submit]):not([disabled]):not(.custom-select__search-input):required, input[data-filled], select:not([disabled]):required, textarea:not([disabled]):required';

  const ALL_FIELDS_SELECTOR = 'input:not([type^=hidden]):not([type^=submit]):not([disabled]):not(.custom-select__search-input), input[data-filled], select:not([disabled]), textarea:not([disabled]), .lang-record, .relative-record';

  const isFieldFilled = (field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      if (field.checked) return true;
    } else if (field.classList.contains('lang-record') || field.classList.contains('relative-record') || field.value.length) return true;
    return false;
  };

  const checkCompletion = () => {
    const allFields = form.querySelectorAll(ALL_FIELDS_SELECTOR);
    form.allFieldsCount = allFields.length;
    form.filledFieldsCount = 0;

    allFields.forEach((field) => {
      if (isFieldFilled(field)) {
        form.filledFieldsCount += 1;
      }
    });

    form.dispatchEvent(new CustomEvent('changeFilledCount', {}));
  };

  form.addEventListener('change', () => {
    checkCompletion();
  });

  checkCompletion();
};

document.querySelectorAll('.form[data-calc-filled]').forEach((form) => {
  calFormFilled(form);
});

const initForm = (form) => {
  const SELECTION_FIELD_SELECTOR = 'input:not([type^=hidden]):not([type^=submit]):not([disabled]):not(.custom-select__search-input), select:not([disabled]), textarea:not([disabled])';

  const isFieldSelected = (field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      if (field.checked) return true;
    } else if (field.value.length) return true;
    return false;
  };

  const calcGroupSelectedCount = (group) => {
    let count = 0;
    group.querySelectorAll('[data-filter-fieldset]').forEach((fieldset) => {
      let isSelected = false;
      fieldset.querySelectorAll(SELECTION_FIELD_SELECTOR).forEach((field) => {
        if (isFieldSelected(field)) isSelected = true;
      });
      if (isSelected) count += 1;
    });
    const ref = group.getAttribute('data-filter-group');
    group.querySelectorAll(`[data-filter-group-count="${ref}"]`).forEach((indicator) => {
      indicator.textContent = count > 0 ? count : '';
    });
  };

  const calcSelectedCount = () => {
    let count = 0;
    form.querySelectorAll('[data-filter-fieldset]').forEach((fieldset) => {
      let isSelected = false;
      fieldset.querySelectorAll(SELECTION_FIELD_SELECTOR).forEach((field) => {
        if (isFieldSelected(field)) isSelected = true;
      });
      if (isSelected) count += 1;
    });
    if (form.selectedFiltersCount !== count) {
      form.selectedFiltersCount = count;
      form.dispatchEvent(new CustomEvent('changeSelectedFiltersCount', {
        detail: { selectedFiltersCount: count },
      }));
      document.querySelectorAll(`[data-filter-count="${form.id}"]`).forEach((indicator) => {
        indicator.textContent = count > 0 ? count : '';
      });
    }
    form.querySelectorAll('[data-filter-group]').forEach((groupEl) => {
      calcGroupSelectedCount(groupEl);
    });
  };

  calcSelectedCount();

  const clearForm = () => {
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = false;
      } else {
        field.value = '';
      }
    });
  };

  form.addEventListener('reset', () => {
    clearForm(form);
    setTimeout(() => {
      clearForm();
      calcSelectedCount();
    }, 300);
  });

  form.addEventListener('change', () => {
    calcSelectedCount();
  });
};

document.querySelectorAll('.form').forEach((form) => {
  initForm(form);
});
