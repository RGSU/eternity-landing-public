/* eslint-disable no-console */
import fs from 'fs'; // будем работать с файловой системой
import { mkdirp } from 'mkdirp';

// Генератор файлов компонента

// Использование: $ node add [имя компонента] [доп. расширения через пробел]

const level = 'index';

const componentName = process.argv[2]; // получим имя блока

const defaultExtensions = ['styl', 'pug']; // расширения по умолчанию
// добавим введенные при вызове расширения (если есть)

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
  const objectTemp = {};
  for (let i = 0; i < arr.length; i += 1) {
    const str = arr[i];
    objectTemp[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
  // const fs = require('fs');
  try {
    fs.statSync(path);
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
  return true;
}

const extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));

const filenameIndexStyl = `src/${level}.styl`;
const filenameIndexJs = `src/${level}.js`;

// Если есть имя блока
if (componentName) {
  const dirComponent = `./src/components/${componentName}/`;
  mkdirp(dirComponent).then(() => {
    console.log(`Создание папки ${dirComponent} (создана, если ещё не существует)`);

    // Обходим массив расширений и создаем файлы, если они еще не созданы
    extensions.forEach((extention) => {
      // полный путь к создаваемому файлу
      const filePath = `${dirComponent}${componentName}.${extention}`;
      // будущий контент файла
      let fileContent = '';
      // будущее сообщение в консоли при создании файла
      const fileCreateMsg = '';

      // Если это Stylus
      if (extention === 'styl') {
        fileContent = `.${componentName}\n  display block\n`;

        // Читаем файл импорта стилей
        const connectManagerStyl = fs.readFileSync(filenameIndexStyl, 'utf8');

        // Делаем из строк массив, фильтруем массив,
        //  оставляя только строки с незакомментированными импортами
        const fileSystemStyl = connectManagerStyl.split('\n').filter((item) => {
          if (/^(\s*)@import/.test(item)) return true;
          return false;
        });

        const fileImportStyl = `@import "./components/${componentName}/${componentName}.styl"`;

        // Создаем регулярку с импортом
        const reg = new RegExp(fileImportStyl, '');

        // Создадим флаг отсутствия блока среди импортов
        let impotrtExist = false;

        // Обойдём массив и проверим наличие импорта
        for (let i = 0, j = fileSystemStyl.length; i < j; i += 1) {
          if (reg.test(fileSystemStyl[i])) {
            impotrtExist = true;
            break;
          }
        }

        // Если флаг наличия импорта по-прежнему опущен, допишем импорт
        if (!impotrtExist) {
          // Открываем файл
          fs.open(filenameIndexStyl, 'a', (err, fileHandle) => {
            // Если ошибок открытия нет...
            if (!err) {
              // Запишем в конец файла
              fs.write(fileHandle, `${fileImportStyl}\n`, null, 'utf8', (err2) => {
                if (!err2) {
                  console.log(`В диспетчер подключений ${filenameIndexStyl} записано: ${fileImportStyl}`);
                } else {
                  console.log(`ОШИБКА записи в ${filenameIndexStyl}: ${err2}`);
                }
              });
            } else {
              console.log(`ОШИБКА открытия ${filenameIndexStyl}: ${err}`);
            }
          });
        } else {
          console.log(`Импорт НЕ прописан в ${filenameIndexStyl} (он там уже есть)`);
        }
      } else if (extention === 'pug') {
        // Если это PUG
        fileContent = `mixin ${componentName}()\n  -\n    const props = initComponent('${componentName}', attributes, []);\n\n  .${componentName}&attributes(attributes)\n    block\n`;
      } else if (extention === 'js') {
        // Если это JS
        fileContent = '';

        // Читаем файл импорта js-файлов
        const connectManagerJs = fs.readFileSync(filenameIndexJs, 'utf8');

        // Делаем из строк массив, фильтруем массив,
        // оставляя только строки с незакомментированными импортами
        const fileSystemJs = connectManagerJs.split('\n').filter(() => true);

        const jsFileImport = `import './components/${componentName}/${componentName}.js';`;

        // Создаем регулярку с импортом
        const reg = new RegExp(jsFileImport, '');

        // Создадим флаг отсутствия блока среди импортов
        let impotrtExist = false;

        // Обойдём массив и проверим наличие импорта
        for (let i = 0, j = fileSystemJs.length; i < j; i += 1) {
          if (reg.test(fileSystemJs[i])) {
            impotrtExist = true;
            break;
          }
        }

        // Если флаг наличия импорта по-прежнему опущен, допишем импорт
        if (!impotrtExist) {
          // Открываем файл
          fs.open(filenameIndexJs, 'a', (err, fileHandle) => {
            // Если ошибок открытия нет...
            if (!err) {
              // Запишем в конец файла
              fs.write(fileHandle, `${jsFileImport}\n`, null, 'utf8', (err2) => {
                if (!err2) {
                  console.log(`В файл (${filenameIndexJs}) записано: ${jsFileImport}`);
                } else {
                  console.log(`ОШИБКА записи в ${filenameIndexJs}: ${err2}`);
                }
              });
            } else {
              console.log(`ОШИБКА открытия ${filenameIndexJs}: ${err}`);
            }
          });
        } else {
          console.log(`Импорт НЕ прописан в ${filenameIndexJs} (он там уже есть)`);
        }
      } else if (extention === 'img') {
        // Если нужна подпапка для картинок
        const imgFolder = `${dirComponent}img/`;
        if (fileExist(imgFolder) === false) {
          mkdirp(imgFolder, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Папка создана: ${imgFolder}`);
            }
          });
        } else {
          console.log('Папка НЕ создана (уже существует)');
        }
      }

      // Создаем файл, если он еще не существует
      if (fileExist(filePath) === false && extention !== 'img') {
        fs.writeFile(filePath, fileContent, (err) => {
          if (err) {
            return console.log(`Файл НЕ создан: ${err}`);
          }
          console.log(`Файл создан: ${filePath}`);
          if (fileCreateMsg) {
            console.warn(fileCreateMsg);
          }
          return false;
        });
      } else if (extention !== 'img') {
        console.log(`Файл НЕ создан: ${filePath} (уже существует)`);
      }
    });
  });
} else {
  console.log('Отмена операции: не указан блок');
}
