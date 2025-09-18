const fs = require('fs');
const path = require('path');
const https = require('https');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config({ path: '../.env' });

const YOUTRACK_URL = process.env.YOUTRACK_URL;
const YOUTRACK_TOKEN = process.env.YOUTRACK_TOKEN;

if (!YOUTRACK_URL || !YOUTRACK_TOKEN) {
    console.error('❌ Erro: YOUTRACK_URL e YOUTRACK_TOKEN devem estar definidos no arquivo .env');
    process.exit(1);
}

const APP_ZIP_PATH = './youtrack-performance-dashboard.zip';

async function uploadApp() {
    try {
        // Verificar se o arquivo ZIP existe
        if (!fs.existsSync(APP_ZIP_PATH)) {
            console.error('❌ Arquivo youtrack-performance-dashboard.zip não encontrado. Execute "npm run build" primeiro.');
            process.exit(1);
        }

        console.log('📦 Fazendo upload do plugin para YouTrack...');
        console.log(`🌐 URL: ${YOUTRACK_URL}`);

        // Ler arquivo ZIP
        const appData = fs.readFileSync(APP_ZIP_PATH);

        // Preparar dados para multipart/form-data
        const boundary = '----formdata-polyfill-' + Math.random();
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        let body = delimiter;
        body += 'Content-Disposition: form-data; name="file"; filename="youtrack-performance-dashboard.zip"\r\n';
        body += 'Content-Type: application/zip\r\n\r\n';

        const bodyBuffer = Buffer.concat([
            Buffer.from(body, 'utf8'),
            appData,
            Buffer.from(closeDelimiter, 'utf8')
        ]);

        // Configurar requisição
        const url = new URL(`${YOUTRACK_URL}/api/admin/apps`);

        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${YOUTRACK_TOKEN}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': bodyBuffer.length
            }
        };

        // Fazer upload
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Plugin enviado com sucesso para o YouTrack!');
                    console.log('📋 Acesse o YouTrack Admin → Apps para gerenciar o plugin');

                    if (responseData) {
                        try {
                            const response = JSON.parse(responseData);
                            console.log('📄 Resposta:', response);
                        } catch (e) {
                            console.log('📄 Resposta:', responseData);
                        }
                    }
                } else {
                    console.error(`❌ Erro no upload: HTTP ${res.statusCode}`);
                    console.error('📄 Resposta:', responseData);
                    process.exit(1);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Erro na requisição:', error.message);
            process.exit(1);
        });

        // Enviar dados
        req.write(bodyBuffer);
        req.end();

    } catch (error) {
        console.error('❌ Erro durante o upload:', error.message);
        process.exit(1);
    }
}

uploadApp();