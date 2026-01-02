const express = require('express');
const noblox = require('noblox.js');
const app = express();

app.use(express.json());

// ดึงค่าจาก Environment Variable ของ Render (เพื่อความปลอดภัย)
const COOKIE = process.env.ROBLOSECURITY;
const GROUP_ID = Number(process.env.GROUP_ID);
const API_KEY = process.env.API_KEY; // รหัสลับกันคนอื่นแอบใช้

// เริ่มต้น Login
async function startApp() {
    try {
        const currentUser = await noblox.setCookie(COOKIE);
        console.log(`Logged in as ${currentUser.UserName}`);
    } catch (err) {
        console.error("Login Failed:", err);
    }
}
startApp();

// จุดรับคำสั่งเปลี่ยนยศ
app.post('/rankup', async (req, res) => {
    const { secret, userId, rankId } = req.body;

    // ตรวจสอบรหัสลับ
    if (secret !== API_KEY) {
        return res.status(403).json({ status: 'error', message: 'Incorrect API Key' });
    }

    try {
        // สั่งเปลี่ยนยศ
        await noblox.setRank(GROUP_ID, userId, Number(rankId));
        res.json({ status: 'success', message: `Rank changed for ${userId}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});