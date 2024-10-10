const tables = document.querySelectorAll('.tariffs-table');

function getCellsCat(table) {
  return table.querySelectorAll('.tariffs-table__cell--cat');
}

function getCellsDef(table) {
  return table.querySelectorAll('.tariffs-table__cell:not(.tariffs-table__cell--cat)');
}

function getHead(table) {
  return table.querySelectorAll('.tariffs-table__th');
}

function makeMobileTables(oldTable) {
  const tablesWrapper = document.querySelector('.tariffs-table__wrapper');
  const ths = getHead(oldTable);
  const cellsCat = getCellsCat(oldTable);
  const cellsDef = getCellsDef(oldTable);

  let defIndex = 0;

  // Создаем таблицы для мобильного вида
  const mobileTables = [];
  const numberOfMobileTables = Math.ceil((ths.length - 1) / 2);

  for (let i = 0; i < numberOfMobileTables; i += 1) {
    const table = Object.assign(document.createElement('div'), { className: 'tariffs-table tariffs-table--mobile' });
    const head = Object.assign(document.createElement('div'), { className: 'tariffs-table__head' });
    const body = Object.assign(document.createElement('div'), { className: 'tariffs-table__body' });

    table.appendChild(head);
    table.appendChild(body);
    tablesWrapper.appendChild(table);
    mobileTables.push({ head, body });
  }

  // Заполняем заголовки таблиц
  for (let i = 1; i < ths.length; i += 1) {
    const tableIndex = Math.floor((i - 1) / 2);
    const clonedTh = ths[i].cloneNode(true);
    mobileTables[tableIndex].head.appendChild(clonedTh);
  }

  // Заполняем тело таблиц
  cellsCat.forEach((cat) => {
    for (let i = 0; i < numberOfMobileTables; i += 1) {
      const row = Object.assign(document.createElement('div'), { className: 'tariffs-table__row' });

      // Клонируем и добавляем категорию
      const clonedCat = cat.cloneNode(true);
      row.appendChild(clonedCat);

      // Добавляем ячейки определения в текущую строку
      for (let j = 0; j < 2; j += 1) {
        if (defIndex < cellsDef.length) {
          const clonedDef = cellsDef[defIndex].cloneNode(true);
          row.appendChild(clonedDef);
          defIndex += 1;
        }
      }

      mobileTables[i].body.appendChild(row);
    }
  });
}

tables.forEach((table) => {
  makeMobileTables(table);
});
