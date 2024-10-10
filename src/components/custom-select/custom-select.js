/* eslint-disable */

// const Select = (element, options) => {
const CustomSelect = function (element, options) {

  let settings = {};
  let select, component, button, buttonCaption, buttonCount, dropdown, list, searchWrapper, searchInput;
  let placeholder = "";
  let isMultiple = false;

  let defaults = {
    baseClass: 'custom-select',
    prefix: "",
    search: false,
    searchPlaceholder: "Поиcк",
    autoSearch: false,
    autoSearchMinOptions: 10,
    multyFilter: false,
    onInit: function () {},
    onBeforeOpen: function () {},
    onOpen: function () {},
    onBeforeClose: function () {},
    onClose: function () {},
    onBeforeChange: function () {},
    onChange: function () {},
    onSearch: function () {},
  };

  function supports(){
    return (
      'querySelector' in document &&
      'addEventListener' in window &&
      'closest' in window.Element.prototype
    );
  };

  function extend(defaults, options){
    for (let key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        defaults[key] = options[key];
      }
    }
    return defaults;
  };

  function isInitialized(){
    return component && component.classList.contains("is-initialized");
  };


  function createComponent() {

    // hide native select
    select.classList.add("visually-hidden");
    select.setAttribute("tabindex","-1");

    // create root tag
    component = document.createElement("div");
    component.classList.add(settings.baseClass);
    select.parentNode.insertBefore(component, select.nextSibling);

    // is multiple?
    isMultiple = select.hasAttribute("multiple");
    if (isMultiple) {
      component.classList.add(settings.baseClass + "--multiple")
    };

    const mod = select.getAttribute("data-mod") || "";
    const modArray = mod.split(" ");
    modArray.forEach(item => {
      component.classList.add(settings.baseClass + "--" + item);
    });

    // Create button
    button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add(settings.baseClass + "__button");
    component.appendChild(button);

    buttonCaption = document.createElement("span");
    buttonCaption.classList.add(settings.baseClass + "__button-caption");

    button.appendChild(buttonCaption);

    if (settings.multyFilter) {
      buttonCount = document.createElement("span");
      buttonCount.classList.add(settings.baseClass + "__button-count");
      button.appendChild(buttonCount);
    }

    const buttonArrow = document.createElement("span");
    buttonArrow.classList.add(settings.baseClass + "__button-arrow");
    buttonArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"><path d="M14.655 8.68a.834.834 0 0 0-1.18-1.18l-3.23 3.231L7.012 7.5a.834.834 0 0 0-1.18 1.18l3.697 3.695a1.01 1.01 0 0 0 1.428 0l3.697-3.696Z"/></svg>';
    button.appendChild(buttonArrow);

    button.setAttribute("aria-disabled", select.disabled);

    button.addEventListener("click", buttonEvents, false);
    button.addEventListener("keydown", buttonEvents, false);

    // Create Dropdown
    dropdown = document.createElement("div");
    dropdown.classList.add(settings.baseClass + "__dropdown")
    component.appendChild(dropdown);

    createList();

  };

  function clearList() {

    // remove search events
    if (searchInput){
      searchInput.removeEventListener("input", searchEvents, false);
      searchInput.removeEventListener("keydown", searchEvents, false);
    };

    // remove list items events
    if (list) {
      list.querySelectorAll("." + settings.baseClass + "__item").forEach(item => {
        item.removeEventListener("click", itemEvents, false);
        item.removeEventListener("mousemove", itemEvents, false);
        item.removeEventListener("keydown", itemEvents, false);
      })
    };

    // remove all elements from dropdown
    while (dropdown.lastElementChild) dropdown.removeChild(dropdown.lastElementChild);

    // reset global vars
    searchWrapper = null;
    searchInput = null;
    list = null;
    placeholder = "";

    component.classList.remove(settings.baseClass + "--placeholder");

  };

  function allowSearch(){
    const options = select.options;
    const hasPlaceholder = options.length && (options[0].value == "");
    let optionsCount = hasPlaceholder ? options.length - 1 : options.length;
    return (optionsCount > 0) && (settings.search || (settings.autoSearch && (optionsCount >= settings.autoSearchMinOptions)));
  };

  function createList() {
    if (!component) return;
    if (!select.options.length) return;

    // clear dropdown (search and list)
    clearList();


    // create search form
    if (allowSearch()) {
      const uniqId = (prefix = "") => prefix + Math.random().toString(36).substring(2, 9);

      searchWrapper = document.createElement("div");
      searchWrapper.classList.add(settings.baseClass + "__search");

      searchInput = document.createElement("input");
      searchInput.classList.add(settings.baseClass + "__search-input")
      searchInput.setAttribute("type","text");
      searchInput.setAttribute("placeholder", settings.searchPlaceholder);
      searchInput.setAttribute("aria-label", settings.searchPlaceholder);
      searchInput.setAttribute("autocomplete", "off");
      searchInput.setAttribute("autocapitalize", "off");
      searchInput.setAttribute("spellcheck", "false");
      searchInput.setAttribute("role", "textbox");
      searchInput.setAttribute("id", uniqId("search-"));
      searchInput.addEventListener("input", searchEvents, false);
      searchInput.addEventListener("keydown", searchEvents, false);
      searchWrapper.appendChild(searchInput);

      dropdown.appendChild(searchWrapper);
    };

    // create list
    list = document.createElement("ul");
    list.setAttribute("role","listbox")
    list.classList.add(settings.baseClass + "__items")
    dropdown.appendChild(list);

    const listContent = document.createDocumentFragment();
    const options = select.options;

    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i];

      if (option.value === "") {
        placeholder = option.innerHTML;
      } else {
        const item = document.createElement("li");
        item.classList.add(settings.baseClass + "__item");
        item.setAttribute("role","option");
        item.setAttribute("data-value", option.value);
        item.setAttribute("data-index", i);
        item.setAttribute("tabindex", "-1");
        item.setAttribute("aria-selected", option.selected);

        const img = option.getAttribute("data-img") || "";

        if (isMultiple) {
          const itemCheck = document.createElement("span")
          itemCheck.classList.add(settings.baseClass + "__item-check");
          item.appendChild(itemCheck);
          const itemCaption = document.createElement("span")
          itemCaption.classList.add(settings.baseClass + "__item-caption");
          item.appendChild(itemCaption);
          itemCaption.innerHTML = option.innerHTML;
        } else if (img){
          const itemImgWrapper = document.createElement("span")
          itemImgWrapper.classList.add(settings.baseClass + "__item-img");
          item.appendChild(itemImgWrapper);

          const itemImg = document.createElement("img")
          itemImg.setAttribute("loading", "lazy");
          itemImg.setAttribute("src", img);
          itemImg.setAttribute("alt", "");
          itemImgWrapper.appendChild(itemImg);

          const itemCaption = document.createElement("span")
          itemCaption.classList.add(settings.baseClass + "__item-caption");
          item.appendChild(itemCaption);
          itemCaption.innerHTML = option.innerHTML;

        } else {
          item.innerHTML = option.innerHTML;
        }

        if (option.selected) item.classList.add("is-selected");

        item.addEventListener("click", itemEvents, false);
        item.addEventListener("mousemove", itemEvents, false);
        item.addEventListener("keydown", itemEvents, false);

        listContent.appendChild(item);
      };

    };

    list.appendChild(listContent);

    updateButton();

  };

  function setButtonCaption(caption, img){
    let imgHTML = img.length ? `<span class="${settings.baseClass}__button-img"><img src="${img}" alt=""></span>` : '';
    const prefix = select.getAttribute("data-custom-select-prefix") || settings.prefix || "";
    if (prefix.length > 0) {
      buttonCaption.innerHTML = `${imgHTML}<span class="${settings.baseClass}__button-caption-prefix">${prefix}</span> <span class="${settings.baseClass}__button-caption-text">${caption}</span>`;
    } else {
      buttonCaption.innerHTML = `${imgHTML}${caption}`;
    };
    button.setAttribute("title", buttonCaption.textContent);
  };

  function updateFiltersCount(){
    let count = 0;
    for (var option of select.options) {
      if (option.selected && option.value !== "") {
        count += 1;
      }
    }
    if (settings.multyFilter && buttonCount) {
      buttonCount.textContent = count > 0 ? count : '';
    }
  }

  function updateButton(){
    let str = ""
    let img = ''
    if (settings.multyFilter) {
      str = placeholder;
      updateFiltersCount();
    } else if (isMultiple) {
      for (var option of select.options) {
        if (option.selected && option.value !== "") {
          if (!str) {
            str = option.innerHTML;
          } else {
            str = str + ", " + option.textContent;
          };
        }
      }
    } else {
      const option = select.options[select.selectedIndex];
      if (option && (option.value !== "")){
        str = select.options[select.selectedIndex].textContent;
        img = option.getAttribute('data-img') || '';
      }
    };

    component.classList.remove(settings.baseClass + "--placeholder");
    if (!str && placeholder) {
      str = placeholder;
      component.classList.add(settings.baseClass + "--placeholder");
    };

    setButtonCaption(str, img);
  };

  function updateListState(){
    if (list) {
      list.querySelectorAll("." + settings.baseClass + "__item").forEach(function(item){
        const index = +item.getAttribute("data-index") || 0;
        const option = select.options[index];
        if (option) {
          item.setAttribute("aria-selected", option.selected);
          if (option.selected) {
            item.classList.add("is-selected");
          } else {
            item.classList.remove("is-selected");
          };
        };
      });
    };
  };


  function toggleItem(item, updateSelect = true){
    settings.onBeforeChange;

    if (item) {
      const index = +item.getAttribute("data-index") || 0;
      const option = select.options[index];

      if (option) {
        if (option.selected) {
          option.selected = false;
        } else {
          if (isMultiple && !select.value.length) {
            select.value = "-1";
          }
          option.selected = true;
        }

        item.setAttribute("aria-selected", option.selected);
          if (option.selected) {
            item.classList.add("is-selected");
          } else {
            item.classList.remove("is-selected");
          };
      };

      if (updateSelect) {
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
      };

      updateButton();

    };
    settings.onChange;

  };

  function getSelected(){
    return [...select.options].filter(option => option.selected && (option.value !== "")).map(option => option.value);
  };

  function isHiddenItem(item){
    return window.getComputedStyle(item).display === 'none';
  };

  function isSelectedItem(item){
    return item && item.classList.contains("is-selected");
  };

  function getFirstItem(){
    let firstItem = list.firstElementChild;
    while (firstItem && isHiddenItem(firstItem)) {
      firstItem = firstItem.nextElementSibling;
    };
    return firstItem;
  };

  function getLastItem(){
    let lastItem = list.lastElementChild;
    while (lastItem && isHiddenItem(lastItem)) {
      lastItem = lastItem.previousElementSibling;
    };
    return lastItem;
  };

  function getPrevItem(item){
    let prevItem = item.previousElementSibling;
    while (prevItem && isHiddenItem(prevItem)) {
      prevItem = prevItem.previousElementSibling;
    };
    return prevItem;
  };

  function getNextItem(item){
    let nextItem = item.nextElementSibling;
    while (nextItem && isHiddenItem(nextItem)) {
      nextItem = nextItem.nextElementSibling;
    };
    return nextItem;
  };



  // EVENTS

  function documentEvents(event){
    if (event.type === "click") {
      const target = event.target;
      if ( isOpen() && (target !== component) && !component.contains(target) ) {
        event.stopPropagation();
        close()
      };
    };
  };

  function selectEvents(event){
    if (event.type === "change") {
      updateListState();
      updateButton()
    };
  };

  function buttonEvents(event){
    if (event.type === "click") {
      if (isOpen()) {
        close();
      } else {
        open();
      };
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    if (event.type === "keydown") {
      var preventDefault = true;
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "Enter":
        case " ":
          open();
          break;
        case "Tab":
          preventDefault = false;
          break;
      };
      if (preventDefault) {
        event.preventDefault();
      };
    };

  };

  function itemEvents(event){
    const item = event.target.closest("." + settings.baseClass + "__item");

    if (event.type === "click") {
      if (item) {
        toggleItem(item);
      };
      if (!isMultiple) {
        close();
        button.focus();
      };
    };

    if (event.type === "mousemove") {
      if (item) {
        item.focus();
      };
    };

    if (event.type === "keydown") {
      var preventDefault = true;
      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
          if (item) {
            const prevItem = getPrevItem(item);
            if (prevItem) {
              prevItem.focus();
            };
          };
          break;
        case "ArrowDown":
        case "ArrowRight":
          if (item) {
            const nextItem = getNextItem(item);
            if (nextItem) {
              nextItem.focus();
            }
          }
          break;
        case "Home":
          const firstItem = getFirstItem();
          if (firstItem) {
            firstItem.focus();
          }
          break;
        case "End":
          const lastItem = getLastItem();
          if (lastItem) {
            lastItem.focus();
          }
          break;
        case "PageUp":
        case "PageDown":
          break;
        case "Tab":
          if (isOpen()) {
            close();
            button.focus()
            preventDefault = true;
          };
          break;
        case "Enter":
        case " ":
          if (item) {
            toggleItem(item);
          };
          if (!isMultiple) {
            close();
            button.focus();
          };
          preventDefault = true;
          break;
        case "Escape":
          close();
          button.focus()
          break;
      };
      if (preventDefault) {
        event.preventDefault();
      };
    };
  };

  function searchEvents(event){
    if (event.type === "input") {
      event.preventDefault();
      doSearch(event.target.value);
    };

    if (event.type === "keydown") {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "Home":
        case "PageDown":
        case "Enter":
          const selectedItem = list.querySelector("." + settings.baseClass + "__item.is-selected");
          if (selectedItem && !isHiddenItem(selectedItem)) {
            selectedItem.focus()
          } else {
            const firstItem = getFirstItem();
            if (firstItem) {
              firstItem.focus();
            };
          };
          break;
        case "Tab":
          close();
          button.focus();
          break;
        case "Escape":
          close();
          button.focus()
          break;
      };

    };
  };

  function doSearch(query){
    const searchText = query.toLowerCase();
    const items = list.querySelectorAll("." + settings.baseClass + "__item");
    items.forEach(item => item.classList.remove("is-hidden"));
    if (searchText.length > 0) {
      items.forEach(function(item){
        const text = item.textContent.toLowerCase();
        if (text.indexOf(searchText) == -1){
          item.classList.add("is-hidden");
        }
      })
    };
  };

  function resetSearch(){
    if (searchInput){
      searchInput.value = "";
    }
    const items = list.querySelectorAll("." + settings.baseClass + "__item");
    items.forEach(item => item.classList.remove("is-hidden"));
  };

  function isOpen(){
    return component && component.classList.contains("is-open");
  };

  function open() {
    if (!list) return;
    settings.onBeforeOpen;

    component.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    setListboxPosition();

    const selectedItem = list.querySelector("." + settings.baseClass + "__item.is-selected");
    if (selectedItem && !isHiddenItem(selectedItem)) {
      selectedItem.focus()
    } else {
      const firstItem = getFirstItem();
      if (firstItem) {
        firstItem.focus();
      };
    };

    if (searchInput) {
      searchInput.focus();
    }

    settings.onOpen;
  }

  function setListboxPosition() {
    // Position the list box on top of the button if there isn't enough space on the bottom
    const rect = button.getBoundingClientRect();
    component.classList.remove(`${settings.baseClass}--top`);
    if (rect.y + rect.height + dropdown.offsetHeight > document.documentElement.clientHeight) {
      component.classList.add(`${settings.baseClass}--top`);
    };
  };

  function close() {
    settings.onBeforeClose;
    component.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    resetSearch();
    updateButton();
    settings.onClose;
  };

  function update() {
    if (!isInitialized) return;
    createList();
  }

  function destroy() {
    if (!isInitialized()) return;

    document.removeEventListener('click', documentEvents, true);
    select.removeEventListener('change', selectEvents, false);

    clearList();

    if (button) {
      button.removeEventListener('click', buttonEvents, false);
      button.removeEventListener('keydown', buttonEvents, false);
    }

    // show native select
    select.classList.remove('visually-hidden');
    select.setAttribute('tabindex');

    // remove custom select layout
    while (component.lastElementChild) component.removeChild(component.lastElementChild);
    component.parentNode.removeChild(component);

    component = null;
    button = null;
    buttonCaption = null;
    dropdown = null;
    settings = null;
  }

  function applyDataAttributes() {
    if (select.hasAttribute('data-custom-select-search')) {
      settings.search = true;
    }

    if (select.hasAttribute('data-custom-select-search-placeholder')) {
      settings.searchPlaceholder = select.getAttribute('data-custom-select-search-placeholder') || settings.searchPlaceholder;
    }

    if ((select.getAttribute('data-custom-select') === 'filter') && select.hasAttribute('multiple')) {
      settings.multyFilter = true;
    }
  }

  function init() {
    if (!supports()) throw new Error('select: This browser does not support the required JavaScript methods and browser APIs.');
    if (isInitialized()) return;

    destroy();

    if (typeof element === 'string') {
      select = document.querySelector(element);
    } else if (typeof element === 'object') {
      select = element;
    }

    if (!select) throw new Error('select: Does not found a select control!');

    settings = extend(defaults, options || {});

    applyDataAttributes();

    createComponent();

    document.addEventListener('click', documentEvents, true);
    select.addEventListener('change', selectEvents);

    if (component) component.classList.add('is-initialized');

    const form = select.closest('form');
    if (form) {
      form.addEventListener('reset', () => {
        setTimeout(update, 100);
      });
    }

    settings.onInit;
  }

  init();

  // Object for public APIs
  const publicAPI = {};

  publicAPI.init = init;
  publicAPI.destroy = destroy;
  publicAPI.update = update;
  publicAPI.open = open;
  publicAPI.close = close;

  return publicAPI;
};

export default CustomSelect;

const initCustomSelect = (selectEl) => {
  selectEl.customSelect = new CustomSelect(selectEl, {});
};

window.initCustomSelect = initCustomSelect;

document.querySelectorAll('select[data-custom-select]').forEach((el) => {
  initCustomSelect(el);
});
