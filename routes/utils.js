const fs = require('fs');

function settings(name, params) {
    try {
        const data = fs.readFileSync(name, 'utf8'); // Читаем содержимое файла
        const jsonData = JSON.parse(data); // Парсим содержимое как JSON
        return jsonData[params] || []; // Возвращаем значение или пустой массив, если параметр не найден
    } catch (error) {
        console.error('Error reading or parsing the file:', error.message);
        return []; // В случае ошибки возвращаем пустой массив
    }
}

module.exports = { settings }