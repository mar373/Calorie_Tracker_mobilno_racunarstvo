const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/firebase');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Ime, e-mail i lozinka su obavezni.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Lozinka mora imati najmanje 6 karaktera.' });
    }

    const db = getDb();

    if (!db) {
        return res.status(503).json({ error: 'Baza podataka nije dostupna. Konfigurišite Firebase.' });
    }

    try {
        // Provjeri da li korisnik već postoji
        const usersRef = db.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

        if (snapshot.exists()) {
            return res.status(409).json({ error: 'Korisnik sa ovim e-mailom već postoji.' });
        }

        // Hash lozinke
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Sačuvaj korisnika
        const newUserRef = usersRef.push();
        const userId = newUserRef.key;

        await newUserRef.set({
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            createdAt: Date.now(),
        });

        // Postavi defaultni kalorijski cilj
        await db.ref(`userdata/${userId}/config/calorieGoal`).set(2400);

        const user = { id: userId, name: name.trim(), email: email.toLowerCase().trim() };
        const token = generateToken(user);

        console.log(`✅ Novi korisnik registrovan: ${email}`);

        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Greška na serveru. Pokušajte ponovo.' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail i lozinka su obavezni.' });
    }

    const db = getDb();

    if (!db) {
        return res.status(503).json({ error: 'Baza podataka nije dostupna. Konfigurišite Firebase.' });
    }

    try {
        // Pronađi korisnika po emailu
        const usersRef = db.ref('users');
        const snapshot = await usersRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

        if (!snapshot.exists()) {
            return res.status(401).json({ error: 'Neispravan e-mail ili lozinka.' });
        }

        // Uzmi prvog (i jednog) korisnika
        let userData = null;
        snapshot.forEach((child) => {
            userData = child.val();
        });

        // Provjeri lozinku
        const isMatch = await bcrypt.compare(password, userData.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Neispravan e-mail ili lozinka.' });
        }

        const user = { id: userData.id, name: userData.name, email: userData.email };
        const token = generateToken(user);

        console.log(`✅ Korisnik prijavljen: ${email}`);

        res.json({ token, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Greška na serveru. Pokušajte ponovo.' });
    }
});

module.exports = router;
