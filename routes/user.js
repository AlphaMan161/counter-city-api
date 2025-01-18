/*
    Исходный код, полностью бесплатный.
    По всем вопросам: https://t.me/cs_041
*/

const express = require('express');
const router = express.Router();
const path = require('path');

const { User } = require('../database/index');
const { settings } = require('../routes/utils');
const { onPlayerBuyCloth, giveBabil, changeNickname } = require('../routes/shop');
const { updateInventory, updateWeapon } = require('../routes/inventory');
        
router.get('/ajax.php', async (req, res) => {
    try {
        const { ccid, page, act, action } = req.query;

        if (page === 'assets') {
            const filePath = path.join(__dirname, 'Files', 'CharacterData.unity3d');
            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Ошибка при отправке файла:', err);
                    return res.status(err.status || 500).send('Ошибка при отправке файла');
                }
            });
        }

        if (!page) {
            return res.status(400).json({ error: 'Неверные параметры запроса' });
        }

        const user = await User.findOne({ where: { ccid: ccid } });

        switch (page) {
            case 'auth':
                if (act === 'g') {
                    return res.status(200).json({ result: true, user_id: 1, key: 0 });
                }
                break;

            // Статистика
            case 'stats':
                if (act === 'ybest') {
                    return res.status(200).json({ result: true, yb: {} });
                }
                break;

            // Магазин
            case 'shop':
                if (act === 'act') {
                    return res.status(200).json({ result: true });
                }
                if (act === 'assemb') {
                    return res.status(200).json({
                        result: true,
                        assemblage: [
                            {
                                id: 25,
                                items: [
                                    { sc: { tPv: 49, sc_id: 1 }, it: "3", w_id: 1, sname: "beret03", nlvl: 1, sc_id: 1, wt: 1 },
                                    { sc: { tPv: 49, sc_id: 1 }, it: "3", w_id: 2, sname: "aviaglass", nlvl: 1, sc_id: 1, wt: 2 }
                                ]
                            }
                        ]
                    });
                }
                if (act === 'items') {
                    return res.status(200).json({
                        result: true,
                        weap: { items: settings('shop.json', 'weapon') },
                        wear: { items: settings('shop.json', 'cloth') },
                        taunt: { items: settings('shop.json', 'taunt') },
                        enh: { items: settings('shop.json', 'busters') }
                    });
                }
                break;

            // Игрок
            case 'pl':
                if (act === 'i') {
                    if (!user) {
                        const default_weap = settings('data/default.json', 'data_weap');
                        const default_view = settings('data/default.json', 'data_view');

                        const newUser = await User.create({
                            vcur: 100,
                            lvl: 1,
                            ccid: ccid,
                            inventory: JSON.stringify([]),
                            babil: JSON.stringify([]),
                            weap: JSON.stringify(default_weap),
                            view: JSON.stringify(default_view),
                            status: true
                        });

                        return res.status(200).json({
                            result: true,
                            page: 'register',
                            info: {
                                u_id: newUser.id,
                                un: newUser.username,
                                pE: 0,
                                isP: 0,
                                fname: "",
                                lvl: newUser.lvl,
                                exp: { cur: 0, min: 0, max: 200 },
                                vcur: newUser.vcur
                            },
                            cl: {},
                            view: JSON.parse(newUser.view),
                            weap: JSON.parse(newUser.weap),
                            sA: [],
                            taun: [],
                          //  dR: [{ uid: "13968485", d: { d: 1, vcur: 5 }, i: "1", et: "11" }],
                            conf: []
                        });
                    }

                    return res.status(200).json({
                        result: true,
                        page: 'load',
                        info: {
                            u_id: user.id,
                            un: user.username,
                            pE: 0,
                            isP: 0,
                            fname: "",
                            lvl: user.lvl,
                            exp: { cur: 0, min: 0, max: 200 },
                            vcur: user.vcur
                        },
                        cl: {},
                        view: JSON.parse(user.view),
                        weap: JSON.parse(user.weap),
                        sA: [],
                        taun: [],
                      //  dR: [{ uid: "13968485", d: { d: 1, vcur: 5 }, i: "1", et: "11" }],
                        conf: []
                    });
                }
                if (act === 'inv') {
                    return res.status(200).json({
                        result: true,
                        data: {
                            items: user.inventory,
                            dw: settings('data/default.json', 'weapon')
                        }
                    });
                                      
                }
                if (act === 'ach') {
                    return res.status(200).json({
                        result: true,
                        b: [
                            { i: 10000000005, v: 5000, r: 100, id: 1, ul: 1 },
                            { i: 10100000001, v: 1, r: 100, id: 2, ul: 1 }
                        ],
                        u: [{ i: 10000000005, v: 5000, r: 100, id: 1, ul: 1 }]
                    });
                }
                if (act === 'abil') {
                    return res.status(200).json({ result: true, b: settings("shop.json", "abils"), u: JSON.parse(user.babil)  });
                }
                if (act === 'map') {
                    return res.status(200).json({ result: true, s: [
                        {
                            "h": "127.0.0.1",
                            "p": "8080,9090",
                            "n": "ServerName",
                            "pL": 1,
                            "lM": 2,
                            "lMa": 1,
                            "m": 1,
                            "iD": 1
                        },
                        {
                            "h": "192.168.0.1",
                            "p": "3000,4000",
                            "n": "AnotherServer",
                            "pL": 1,
                            "lM": 2,
                            "lMa": 1,
                            "m": 0,
                            "iD": 0
                        }
                    ]});
                }
                if (act === 'sview') {
                    return updateInventory( req, res );
                }

                if (act === 'sweap') {
                    return updateWeapon( req, res );
                }
                break;
            
            case 'account':
                if (action === 'cpname') {
                    return changeNickname( req, res );
                }
                if (action === 'cname') {
                    return changeNickname( req, res );
                }
                break;

            // Покупки
            case 'buy':
                if (act === 'bwear') {
                    return onPlayerBuyCloth( req, res, 3);
                }
                if (act === 'bweap') {
                    return onPlayerBuyCloth( req, res, 1);
                }
                if (act === 'babil') {
                    return giveBabil( req, res, 1);
                }
                break;
        }

        return res.status(200).json({ result: false });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;


/*
    Исходный код, полностью бесплатный.
    По всем вопросам: https://t.me/cs_041
*/