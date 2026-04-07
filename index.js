const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const mapping = {
    // Lowercase & Numbers (Shift 0)
    ' ': '000000', 'a': '000001', 'b': '000010', 'c': '000011', 'd': '000100',
    'e': '000101', 'f': '000110', 'g': '000111', 'h': '001000', 'i': '001001',
    'j': '001010', 'k': '001011', 'l': '001100', 'm': '001101', 'n': '001110',
    'o': '001111', 'p': '010000', 'q': '010001', 'r': '010010', 's': '010011',
    't': '010100', 'u': '010101', 'v': '010110', 'w': '010111', 'x': '011000',
    'y': '011001', 'z': '011010', '1': '011011', '2': '011100', '3': '011101',
    '4': '011110', '5': '011111', '6': '100000', '7': '100001', '8': '100010',
    '9': '100011', '0': '100100', '-': '100101', '=': '100110', '.': '100111',

    // Uppercase & Symbols (Shift 1)
    'A': '000001', 'B': '000010', 'C': '000011', 'D': '000100', 'E': '000101',
    'F': '000110', 'G': '000111', 'H': '001000', 'I': '001001', 'J': '001010',
    'K': '001011', 'L': '001100', 'M': '001101', 'N': '001110', 'O': '001111',
    'P': '010000', 'Q': '010001', 'R': '010010', 'S': '010011', 'T': '010100',
    'U': '010101', 'V': '010110', 'W': '010111', 'X': '011000', 'Y': '011001',
    'Z': '011010', '!': '011011', '@': '011100', '#': '011101', '$': '011110',
    '%': '011111', '?': '100000', '&': '100001', '*': '100010', '(': '100011',
    ')': '100100', '_': '100101', '+': '100110'
};

function encode(text) {
    return text.split('').map(char => {
        let base = mapping[char] || '000000';
        let shift = (char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase()) || "!@#$%?&*()_+".includes(char) ? '1' : '0';
        let next = '1'; // 8th bit always ON to move cursor
        
        // Final format: [1-6: Binary] [7: Shift] [8: Next]
        return `${base}${shift}${next}`;
    });
}

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: monospace; padding: 20px;">
                <h2>Build Logic Text Encoder</h2>
                <form method="POST" action="/encode">
                    <input type="text" name="message" style="width: 300px;" placeholder="Enter text..." autofocus>
                    <button type="submit">Generate Binary</button>
                </form>
            </body>
        </html>
    `);
});

app.post('/encode', (req, res) => {
    const text = req.body.message || "";
    const result = encode(text);
    
    let htmlOutput = `<h3>Results for: "${text}"</h3><ul style="list-style:none; padding:0;">`;
    result.forEach((bin, index) => {
        htmlOutput += `<li>'${text[index]}': <strong>${bin}</strong></li>`;
    });
    htmlOutput += `</ul><br><a href="/">Back</a>`;
    
    res.send(`<html><body style="font-family: monospace; padding: 20px;">${htmlOutput}</body></html>`);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
