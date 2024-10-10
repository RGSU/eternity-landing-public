document.querySelectorAll('.input-file').forEach((component) => {
  const input = component.querySelector('input');
  const button = component.querySelector('.input-file__button');
  const filesContainer = component.querySelector('.input-file__files');

  const isMultiple = () => input.hasAttribute('multiple');

  const highlightDropzone = () => {
    component.classList.add('is-highlighted');
  };

  const unhighlightDropzone = () => {
    component.classList.remove('is-highlighted');
  };

  const returnFileSize = (number) => {
    if (number < 1024) {
      return `${number}B`;
    }

    if (number > 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)}KB`;
    }

    //  else if(number > 1048576)
    return `${(number / 1048576).toFixed(1)}MB`;
  };

  const clearOverMaxFileSize = (inputEl) => {
    const maxFileSize = +inputEl.getAttribute('data-max-file-size') || '-1';
    if (maxFileSize > 0) {
      const dt = new DataTransfer();
      let update = false;

      for (let i = 0; i < inputEl.files.length; i += 1) {
        const file = inputEl.files[i];
        if (file.size > maxFileSize) {
          update = true;
        } else {
          dt.items.add(file);
        }
      }

      if (update) {
        inputEl.files = dt.files;
      }
    }
  };

  const clearOverMaxFiles = (inputEl) => {
    const maxFiles = inputEl.getAttribute('data-max-files') || '-1';
    if ((maxFiles > 0) && (input.files.length > maxFiles)) {
      const dt = new DataTransfer();

      for (let i = 0; i < maxFiles - 1; i += 1) {
        dt.items.add(inputEl.files[i]);
      }

      inputEl.files = dt.files;
    }
  };

  const isValidFile = (file, accept) => {
    if (!accept) {
      return true;
    } // If there are no accepted mime types, it's OK
    const acceptList = accept.split(',');

    const mimeType = file.type;
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    // eslint-disable-next-line no-restricted-syntax
    for (let validType of acceptList) {
      validType = validType.trim();
      if (validType.charAt(0) === '.') {
        // eslint-disable-next-line max-len
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        // This is something like a image/* mime type
        if (baseMimeType === validType.replace(/\/.*$/, '')) {
          return true;
        }
      } else if (mimeType === validType) {
        return true;
      }
    }

    return false;
  };

  // const clearNotAcceptable = (inputEl) => {
  //   const accept = input.getAttribute('accept') || '';
  //   if (!accept.length) return true;

  //   let needUpdate = false;
  //   const { files } = inputEl;
  //   const dt = new DataTransfer();

  //   for (let i = 0; i < files.length; i += 1) {
  //     if (!isValidFile(files.item(i), accept)) {
  //       dt.items.add(files[i]);
  //     } else {
  //       needUpdate = true;
  //     }
  //   }

  //   if (needUpdate) {
  //     inputEl.files = dt.files;
  //   }
  // };

  const createFileItem = (file) => {
    if (!filesContainer) return;

    function getFileExtension(filename) {
      const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
      return extension;
    }

    const fileItem = document.createElement('div');
    fileItem.classList.add('input-file__file');
    filesContainer.append(fileItem);

    const ext = getFileExtension(file.name).toLowerCase();
    const acceptableImgExts = ['png', 'jpg', 'svg', 'gif', 'jpeg'];

    if (file.type.startsWith('image/') && acceptableImgExts.includes(ext)) {
      const fileImg = document.createElement('div');
      fileImg.classList.add('input-file__file-img');
      fileItem.append(fileImg);

      const img = document.createElement('img');
      fileImg.append(img);

      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
    } else {
      const fileIcon = document.createElement('div');
      fileIcon.classList.add('input-file__file-icon');
      fileIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m16.3 7.3-5.5-5.5c-.3-.4-.8-.5-1.3-.5H5.6c-.6 0-1.3.2-1.7.7s-.8 1.1-.8 1.8v12.5c0 .7.3 1.3.7 1.8.5.5 1.1.7 1.8.7h8.8c.7 0 1.3-.3 1.8-.7.5-.5.7-1.1.7-1.8V8.6c0-.5-.2-.9-.6-1.3zm-1.6.2h-3.5c-.2 0-.3-.1-.4-.2s-.2-.3-.2-.4V3.4l4.1 4.1zm.6 9.6c-.2.2-.6.4-.9.4H5.6c-.3 0-.7-.1-.9-.4-.2-.2-.4-.6-.4-.9V3.8c0-.3.1-.7.4-.9s.6-.4.9-.4h3.8v4.4c0 .5.2 1 .5 1.3s.8.5 1.3.5h4.4v7.5c0 .4-.1.7-.3.9z"/></svg>';
      fileItem.append(fileIcon);
    }

    const fileCaption = document.createElement('div');
    fileCaption.classList.add('input-file__file-caption');
    fileItem.append(fileCaption);

    const fileTitle = document.createElement('div');
    fileTitle.classList.add('input-file__file-title');
    fileTitle.textContent = file.name;
    fileCaption.append(fileTitle);

    const fileSize = document.createElement('div');
    fileSize.classList.add('input-file__file-size');
    fileSize.textContent = returnFileSize(file.size);
    fileCaption.append(fileSize);
  };

  if (button && input) {
    button.addEventListener('focus', () => {
      input.focus();
    });
  }

  input.addEventListener('focus', () => {
    component.classList.add('focus');
  });

  input.addEventListener('blur', () => {
    component.classList.remove('focus');
  });

  const clearFileItems = () => {
    if (filesContainer) {
      filesContainer.querySelectorAll('.input-file__file').forEach((item) => item.remove());
    }
  };

  input.addEventListener('change', () => {
    clearFileItems();

    clearOverMaxFileSize(input);
    clearOverMaxFiles(input);

    for (let i = 0; i < input.files.length; i += 1) {
      createFileItem(input.files[i]);
    }

    const quntityValueLabel = component.querySelector('.input-file__quantity-value');
    if (quntityValueLabel) {
      quntityValueLabel.textContent = input.files.length;
    }

    if (input.files.length > 0) {
      component.classList.add('input-file--completed');
      // input.setAttribute("data-filled","true")
    } else {
      component.classList.remove('input-file--completed');
      // input.removeAttribute("data-filled")
    }
  });

  const btnClear = component.querySelector('.input-file__btn-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      component.classList.remove('input-file--completed');
    });
  }

  const dataContainsFile = (data, file) => {
    for (let i = 0; i < data.files.length; i += 1) {
      if (data.files[i].name.toLowerCase() === file.name.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const dropzone = component.querySelector('.input-file__dropzone');

  const dropzoneEvents = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // if (settings.disableDropzone) return false;

    if (event.type === 'dragenter') {
      highlightDropzone();
    }

    if (event.type === 'dragover') {
      highlightDropzone();
    }

    if (event.type === 'dragleave') {
      unhighlightDropzone();
    }

    if (event.type === 'drop') {
      const { files } = event.dataTransfer;
      const accept = input.getAttribute('accept') || '';
      unhighlightDropzone();
      const data = new DataTransfer();
      if (isMultiple()) {
        for (let i = 0; i < files.length; i += 1) {
          if (!dataContainsFile(data, files[i]) && isValidFile(files[i], accept)) {
            data.items.add(files[i]);
          }
        }
      } else if (isValidFile(files[0], accept)) {
        data.items.add(files[0]);
      }

      input.files = data.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  if (dropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, dropzoneEvents, false);
    });
  }
});
