const { User } = require('../database/index');
const { settings } = require('../routes/utils');

async function changeNickname( req, res ) {
    try {
        const { ve } = req.query;
        const u_id = 1;
        const user = await User.findOne({ where: { id: u_id } });

        if (!user) {
            return res.status(200).json({ result: false, message: 'Player not found' });
        }

        if(user.username.length < 3 ) {
            const hasNickname = await User.findOne({ where: { username: ve } });

            if(hasNickname) {
                return res.status(200).json({ result: false, code: 300 });
            }
    
            await User.update(
                {
                    username: String(ve)
                },
                { where: { id: user.id } }
            );
    
            return res.status(200).json({ result: true });
        }

        if (user.vcur < 500) {
            return res.status(200).json({ result: false, code: 200 });
        }

        const hasNickname = await User.findOne({ where: { username: ve } });

        if(hasNickname) {
            return res.status(200).json({ result: false, code: 300 });
        }

        await User.update(
            {
                vcur: user.vcur - 500,
                username: String(ve)
            },
            { where: { id: user.id } }
        );

        return res.status(200).json({ result: true });

    } catch (error) {
        return console.log(error.message);
    }
}



async function onPlayerBuyCloth( req, res, itype ) {
    try {
        const { id } = req.query;
        const u_id = 1;
        const user = await User.findOne({ where: { id: u_id } });

        if (!user) {
            return res.status(200).json({ result: false });
        }
        
        // Получаем список предметов из магазина
        const items = itype == 3 && settings("shop.json", "cloth") || settings("shop.json", "weapon");
        
        for (const item of items) {
            const shop_id = item.w_id;
        
            if (shop_id == id) {
                const shop_cost = item.sc['tPv'];
        
                // Проверяем, хватает ли валюты
                if (user.vcur < shop_cost) {
                    return res.status(200).json({ result: false, code: 200 });
                }

                item.itype = itype;

                // Проверяем, что инвентарь корректный
                let currentInventory;
                try {
                    currentInventory = JSON.parse(user.inventory || '[]');
                } catch (e) {
                    return res.status(500).json({ result: false, message: 'Invalid inventory data' });
                }
        
                // проверка на массив 
                if (!Array.isArray(currentInventory)) {
                    currentInventory = [];
                }
        
                // Проверяем, нет ли уже такого предмета в инвентаре
                if (currentInventory.some(i => i.w_id === shop_id)) {
                    return res.status(200).json({ result: false, code: 201, message: 'Item already in inventory' });
                }
        
                // Добавляем новый предмет в инвентарь
                currentInventory.push(item);
        
                // Обновляем валюту и инвентарь
                await User.update(
                    { 
                        vcur: user.vcur - shop_cost,
                        inventory: JSON.stringify(currentInventory)
                    },
                    { where: { id: u_id } }
                );
        
                return res.status(200).json({ result: true, message: 'Item purchased successfully' });
            }
        }        
        
        return res.status(200).json({ result: false });
    } catch (error) {
        return console.log(error.message);
    }
}

// трен. зал
async function giveBabil(req, res) {
    try {
        const { id } = req.query;

        const u_id = 1;

        const user = await User.findOne({ where: { id: u_id } });
        if (!user) {
            return res.status(404).json({ result: false, message: 'User not found' });
        }

        // Парсим текущие способности и загружаем способности магазина
        let babil = JSON.parse(user.babil || '[]');
        const shopAbils = settings("shop.json", "abils");

        console.log( id )

        // Ищем способность в магазине
        const shopItem = shopAbils.find(item => item.i == id);
        if (!shopItem) {
            return res.status(404).json({ result: false, message: 'Ability not found in shop' });
        }

        // Проверяем, есть ли способность у игрока
        const playerUpgrade = babil.find(upgrade => upgrade.i == id);

        // Если способность уже есть
        if (playerUpgrade) {
            if (playerUpgrade.l >= 5) {
                return res.status(400).json({ result: false, message: 'Max level reached' });
            }

            const nextLevel = playerUpgrade.l + 1;
            const nextLevelItem = shopAbils.find(item => item.i == id && item.l == nextLevel);

            if (!nextLevelItem) {
                return res.status(404).json({ result: false, message: 'Next level not found' });
            }

            if (user.vcur < nextLevelItem.sc.tPv) {
                return res.status(400).json({ result: false, message: 'Not enough currency' });
            }

            // Обновляем уровень и валюту
            playerUpgrade.l = nextLevel;
            playerUpgrade.i = Number(id);

            await updateUserAbilities(user, babil, nextLevelItem.sc.tPv);

            return res.status(200).json({ result: true, message: 'Ability upgraded successfully' });
        }

        // если способности ещё нет
        if (user.vcur < shopItem.sc.tPv) {
            return res.status(400).json({ result: false, message: 'Not enough currency' });
        }

        babil.push({ i: Number(id), l: 1 });
        await updateUserAbilities(user, babil, shopItem.sc.tPv);

        return res.status(200).json({ result: true, message: 'Ability purchased successfully' });
    } catch (error) {
        console.error('Error in giveBabil:', error.message);
        return res.status(500).json({ result: false, message: 'Server error' });
    }
}

async function updateUserAbilities(user, babil, cost) {
    await User.update(
        {
            vcur: user.vcur - cost,
            babil: JSON.stringify(babil)
        },
        { where: { id: user.id } }
    );
}


module.exports = { onPlayerBuyCloth, giveBabil, changeNickname };