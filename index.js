const https = require('https');
const fs = require('fs');
const path = require('path');

// Configurar HTTPS com certificados
const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')), // Chave privada
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')) // Certificado público
};

// Função para carregar os frames da pasta frames/
function loadFrames() {
    const frameDir = path.join(__dirname, 'frames');
    const frameFiles = fs.readdirSync(frameDir)
        .filter(file => file.endsWith('.png.txt')) // Apenas os arquivos .png.txt
        .sort((a, b) => {
            // Ordenar os arquivos numericamente
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
            return numA - numB;
        });

    // Carregar o conteúdo de cada frame
    return frameFiles.map(file => fs.readFileSync(path.join(frameDir, file), 'utf8'));
}

// Criar o servidor HTTPS
https.createServer(options, (req, res) => {
    if (req.url === '/') { // Rota principal
        const frames = loadFrames();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        let frameIndex = 0;

        // Função para exibir os frames com intervalo
        const interval = setInterval(() => {
            res.write('\033[2J\033[H'); // Limpa o terminal
            res.write(frames[frameIndex]); // Envia o próximo frame

            frameIndex++;
            if (frameIndex >= frames.length) {
                clearInterval(interval); // Para a animação
                res.end(); // Fecha a conexão
            }
        }, 100); // Intervalo de 100ms entre os frames
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
}).listen(443, () => {
    console.log('Servidor rodando em https://localhost/');
});
