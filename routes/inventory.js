const { User } = require('../database/index');
const { settings } = require('../routes/utils');

async function updateInventory(req, res) {
    try {
        const id = 1; // ID пользователя, заменить на токены!!!
        const { hat, mask, gloves, shirt, pants, boots, backpack, other, head } = req.query;

        // Находим пользователя
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(200).json({ result: false, message: 'User not found' });
        }

        // Парсим инвентарь
        let inventory;
        try {
            inventory = JSON.parse(user.inventory || '[]');
        } catch (e) {
            return res.status(500).json({ result: false, message: 'Invalid inventory data' });
        }

        // Проверяем, что инвентарь корректен
        if (!Array.isArray(inventory)) {
            return res.status(500).json({ result: false, message: 'Inventory is not an array' });
        }

        const itemsToCheck = { hat, mask, gloves, shirt, pants, boots, backpack, other, head };

        // Преобразуем каждое значение в числе, если это строка
        const numericItemsToCheck = Object.fromEntries(
            Object.entries(itemsToCheck).map(([key, value]) => [key, Number(value)])
        );
        
        // Проверяем, что все переданные предметы есть в инвентаре
        for (const [key, value] of Object.entries(numericItemsToCheck)) {
            if (value && value != 0 && !inventory.some(item => item.w_id == value)) {
                return res.status(200).json({ 
                    result: false, 
                    message: `Item "${value}" for "${key}" not found in inventory` 
                });
            }
        }
        
        // Парсим поле view и обновляем его
        const view = JSON.parse(user.view || '{}');
        Object.assign(view, numericItemsToCheck); // Обновляем view
        
        // Сохраняем изменения
        await User.update({ view: JSON.stringify(view) }, { where: { id: id } });
        
        return res.status(200).json({ result: true, message: 'View updated successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ result: false, message: 'Internal server error' });
    }
}

async function updateWeapon(req, res) {
    try {
        const id = 1; // ID пользователя, заменить на токены!!!
        const { i1, i2, i3, i4, i5, i6, i7 } = req.query;

        // Находим пользователя
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(200).json({ result: false, message: 'User not found' });
        }

        // Парсим поле weap
        let weap;
        try {
            weap = JSON.parse(user.weap || '{}');
        } catch (e) {
            return res.status(500).json({ result: false, message: 'Invalid weapon data' });
        }

        // Проверяем, что поле weap является объектом
        if (typeof weap !== 'object' || weap === null) {
            return res.status(500).json({ result: false, message: 'Weapon data is not a valid object' });
        }

        // Обновляем значения оружия
        const weaponUpdates = { i1, i2, i3, i4, i5, i6, i7 };
        const numericWeaponUpdates = Object.fromEntries(
            Object.entries(weaponUpdates).map(([key, value]) => [key, Number(value)])
        );

        Object.assign(weap, {
            id1: numericWeaponUpdates.i1,
            id2: numericWeaponUpdates.i2,
            id3: numericWeaponUpdates.i3,
            id4: numericWeaponUpdates.i4,
            id5: numericWeaponUpdates.i5,
            id6: numericWeaponUpdates.i6,
            id7: numericWeaponUpdates.i7,
        });

        // Сохраняем изменения
        await User.update({ weap: JSON.stringify(weap) }, { where: { id: id } });

        return res.status(200).json({ result: true, message: 'Weapon data updated successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ result: false, message: 'Internal server error' });
    }
}


module.exports = { updateInventory, updateWeapon };