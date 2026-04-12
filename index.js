const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mapping = {
    ' ': '000000', 'a': '000001', 'b': '000010', 'c': '000011', 'd': '000100',
    'e': '000101', 'f': '000110', 'g': '000111', 'h': '001000', 'i': '001001',
    'j': '001010', 'k': '001011', 'l': '001100', 'm': '001101', 'n': '001110',
    'o': '001111', 'p': '010000', 'q': '010001', 'r': '010010', 's': '010011',
    't': '010100', 'u': '010101', 'v': '010110', 'w': '010111', 'x': '011000',
    'y': '011001', 'z': '011010', '1': '011011', '2': '011100', '3': '011101',
    '4': '011110', '5': '011111', '6': '100000', '7': '100001', '8': '100010',
    '9': '100011', '0': '100100', '-': '100101', '=': '100110', '.': '100111'
};

function get8Bit(char) {
    let base = mapping[char.toLowerCase()] || '000000';
    let isUpper = char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase();
    let isSymbol = "!@#$%?&*()_+".includes(char);
    let shift = (isUpper || isSymbol) ? '1' : '0';
    let next = '1'; 
    return base + shift + next;
}

let lastValue = "00000000";

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: monospace; padding: 20px; background: #fff; color: #000;">
                <h2>Typewriter 2.0 (Turbo Pulse)</h2>
                <div style="margin-bottom: 10px;">
                    <input type="text" id="msg" style="width: 300px; padding: 5px;" placeholder="Message..." autofocus>
                    <button onclick="send()">Transmit</button>
                </div>
                <div>
                    <label>Delay (ms): </label>
                    <input type="number" id="speed" value="100" style="width: 60px; padding: 5px;">
                    <small>100ms = 0.1s</small>
                </div>
                <p id="status" style="color: #666;"></p>

                <script>
                    async function send() {
                        const text = document.getElementById('msg').value;
                        const status = document.getElementById('status');
                        const delay = parseInt(document.getElementById('speed').value) || 100;
                        
                        status.innerText = "Transmitting at " + (delay/1000) + "s speed...";
                        
                        for (let char of text) {
                            // 1. Send Character
                            await fetch('/httpstrans', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ char: char })
                            });
                            await new Promise(r => setTimeout(r, delay));

                            // 2. Pulse Reset
                            await fetch('/httpstrans', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ value: "00000000" })
                            });
                            await new Promise(r => setTimeout(r, delay));
                        }

                        status.innerText = "Finished pulsing: " + text;
                        document.getElementById('msg').value = "";
                    }
                </script>
            </body>
        </html>
    `);
});

app.post('/httpstrans', (req, res) => {
    if (req.body.char) {
        lastValue = get8Bit(req.body.char);
    } else if (req.body.value) {
        lastValue = req.body.value;
    }
    res.json({ value: lastValue });
});

app.get('/httpstrans', (req, res) => {
    res.json({ value: lastValue });
});

app.listen(port, () => console.log('Server running on port ' + port));
