
        .filter(file => file.endsWith('.png.txt'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
            return numA - numB;
        });

    return frameFiles.map(file => fs.readFileSync(path.join(frameDir, file), 'utf8'));
}

// Porta fornecida pelo ambiente ou 3000 localmente
const PORT = process.env.PORT || 3000;

// Criar o servidor HTTP
http.createServer((req, res) => {
    if (req.url === '/') {
        const frames = loadFrames();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        let frameIndex = 0;

        // Enviar os frames em loop infinito
        const interval = setInterval(() => {
            res.write('\033[2J\033[H'); // Limpa o terminal
            res.write(frames[frameIndex]); // Envia o próximo frame
            frameIndex = (frameIndex + 1) % frames.length; // Reinicia o índice ao atingir o último frame
        }, 100); // Intervalo entre frames (100ms)

        // Encerrar animação quando o cliente fechar a conexão
        req.on('close', () => {
            clearInterval(interval); // Para o intervalo
            res.end(); // Encerra a conexão
        });
    } else {
        res.writeHead(404);
        res.end('404
    }
