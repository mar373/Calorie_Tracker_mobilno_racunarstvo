const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getDb } = require('../config/firebase');

// Sve rute zaštićene JWT middleware-om
router.use(authMiddleware);

// GET /logs — dohvati obroke prijavljenog korisnika
router.get('/', async (req, res) => {
    const userId = req.user.id;
    const db = getDb();

    try {
        const snapshot = await db.ref(`userdata/${userId}/logs`).once('value');
        const data = snapshot.val();

        if (!data) {
            return res.json([]);
        }

        const logs = Object.keys(data).map((key) => ({
            ...data[key],
            id: key,
        }));

        logs.sort((a, b) => b.timestamp - a.timestamp);
        res.json(logs);
    } catch (error) {
        console.error('GET /logs error:', error);
        res.status(500).json({ error: 'Greška pri dohvatanju obroka.' });
    }
});

// POST /logs — dodaj novi obrok
router.post('/', async (req, res) => {
    const userId = req.user.id;
    const db = getDb();
    const { name, calories, protein, carbs, fats, mealType, amount, timestamp } = req.body;

    if (!name || calories === undefined) {
        return res.status(400).json({ error: 'Naziv i kalorije su obavezni.' });
    }

    try {
        const logsRef = db.ref(`userdata/${userId}/logs`);
        const newLogRef = logsRef.push();

        const log = {
            id: newLogRef.key,
            name,
            calories: Number(calories),
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fats: Number(fats) || 0,
            mealType: mealType || 'Ostalo',
            amount: amount || '',
            timestamp: timestamp || Date.now(),
        };

        await newLogRef.set(log);

        console.log(`✅ Log dodan za korisnika ${userId}: ${name}`);
        res.status(201).json(log);
    } catch (error) {
        console.error('POST /logs error:', error);
        res.status(500).json({ error: 'Greška pri dodavanju obroka.' });
    }
});

// PUT /logs/:id — ažuriraj obrok
router.put('/:id', async (req, res) => {
    const userId = req.user.id;
    const logId = req.params.id;
    const db = getDb();

    try {
        const logRef = db.ref(`userdata/${userId}/logs/${logId}`);
        const snapshot = await logRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Obrok nije pronađen.' });
        }

        const updatedLog = { ...snapshot.val(), ...req.body, id: logId };
        await logRef.set(updatedLog);

        console.log(`✅ Log ažuriran za korisnika ${userId}: ${logId}`);
        res.json(updatedLog);
    } catch (error) {
        console.error('PUT /logs/:id error:', error);
        res.status(500).json({ error: 'Greška pri ažuriranju obroka.' });
    }
});

// DELETE /logs/:id — obriši obrok
router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const logId = req.params.id;
    const db = getDb();

    try {
        const logRef = db.ref(`userdata/${userId}/logs/${logId}`);
        const snapshot = await logRef.once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Obrok nije pronađen.' });
        }

        await logRef.remove();

        console.log(`✅ Log obrisan za korisnika ${userId}: ${logId}`);
        res.json({ success: true, message: 'Obrok obrisan.' });
    } catch (error) {
        console.error('DELETE /logs/:id error:', error);
        res.status(500).json({ error: 'Greška pri brisanju obroka.' });
    }
});

// GET /logs/goal — dohvati kalorijski cilj
router.get('/goal', async (req, res) => {
    const userId = req.user.id;
    const db = getDb();

    try {
        const snapshot = await db.ref(`userdata/${userId}/config/calorieGoal`).once('value');
        const goal = snapshot.val() || 2400;
        res.json({ calorieGoal: goal });
    } catch (error) {
        console.error('GET /logs/goal error:', error);
        res.status(500).json({ error: 'Greška pri dohvatanju cilja.' });
    }
});

// PUT /logs/goal — ažuriraj kalorijski cilj
router.put('/goal', async (req, res) => {
    const userId = req.user.id;
    const db = getDb();
    const { calorieGoal } = req.body;

    if (!calorieGoal || isNaN(Number(calorieGoal)) || Number(calorieGoal) <= 0) {
        return res.status(400).json({ error: 'Nevažeći kalorijski cilj.' });
    }

    try {
        await db.ref(`userdata/${userId}/config/calorieGoal`).set(Number(calorieGoal));
        res.json({ calorieGoal: Number(calorieGoal) });
    } catch (error) {
        console.error('PUT /logs/goal error:', error);
        res.status(500).json({ error: 'Greška pri ažuriranju cilja.' });
    }
});

module.exports = router;
