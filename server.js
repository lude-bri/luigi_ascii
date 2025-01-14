
const http = require('http');
const fs = require('fs');
const path = require('path');

// Função para carregar os frames da pasta frames/
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

// Porta fornecida pela Vercel ou 3000 localmente
const PORT = process.env.PORT || 3000;

// Criar o servidor HTTP
http.createServer((req, res) => {
    if (req.url === '/') {
        const frames = loadFrames();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        let frameIndex = 0;
        const interval = setInterval(() => {
            res.write('\033[2J\033[H');
            res.write(frames[frameIndex]);
            frameIndex = (frameIndex + 1) % frames.length;
        }, 100);

        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end('404 Not Found');
    }
}).listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

