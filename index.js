const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

function loadFrames() {
    const frameDir = path.join(__dirname, 'frames');
    const frameFiles = fs.readdirSync(frameDir)
        .filter(file => file.endsWith('.png.txt'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
            return numA - numB;
        });
    return frameFiles.map(file => fs.readFileSync(path.join(frameDir, file), 'utf8'));
}

https.createServer(options, (req, res) => {
    if (req.url === '/') {
        const frames = loadFrames();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        let frameIndex = 0;
        const interval = setInterval(() => {
            res.write('\033[2J\033[H');
            res.write(frames[frameIndex]);

            frameIndex++;
            if (frameIndex >= frames.length) {
                clearInterval(interval);
                res.end();
            }
        }, 100);
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
}).listen(443, () => {
    console.log('Servidor rodando em https://localhost/');
});
