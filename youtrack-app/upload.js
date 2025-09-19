const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config({ path: '../.env' });

const YOUTRACK_URL = process.env.YOUTRACK_URL;
const YOUTRACK_TOKEN = process.env.YOUTRACK_TOKEN;

if (!YOUTRACK_URL || !YOUTRACK_TOKEN) {
    console.error('❌ Erro: YOUTRACK_URL e YOUTRACK_TOKEN devem estar definidos no arquivo .env');
    process.exit(1);
}

const APP_ZIP_PATH = './youtrack-performance-dashboard-v2.zip';

async function uploadApp() {
    try {
        // Verificar se o arquivo ZIP existe
        if (!fs.existsSync(APP_ZIP_PATH)) {
            console.error('❌ Arquivo youtrack-performance-dashboard-v2.zip não encontrado. Execute "npm run build" primeiro.');
            process.exit(1);
        }

        console.log('📦 Fazendo upload do plugin para YouTrack...');
        console.log(`🌐 URL: ${YOUTRACK_URL}`);

        // Ler arquivo ZIP como buffer
        const appData = fs.readFileSync(APP_ZIP_PATH);

        // Usar endpoint web correto com método PUT
        const url = new URL(`${YOUTRACK_URL}/admin/apps/upload`);

        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${YOUTRACK_TOKEN}`,
                'Content-Type': 'application/zip',
                'Content-Length': appData.length
            }
        };

        console.log('🔗 Enviando para:', `${url.protocol}//${url.hostname}${url.pathname}`);

        // Fazer upload
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                console.log(`📡 Status HTTP: ${res.statusCode}`);

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Plugin enviado com sucesso para o YouTrack!');
                    console.log('📋 Acesse o YouTrack Admin → Apps para gerenciar o plugin');

                    if (responseData) {
                        try {
                            const response = JSON.parse(responseData);
                            console.log('📄 Resposta:', JSON.stringify(response, null, 2));
                        } catch (e) {
                            console.log('📄 Resposta:', responseData);
                        }
                    }
                } else {
                    console.error(`❌ Erro no upload: HTTP ${res.statusCode}`);
                    console.error('📄 Resposta:', responseData);

                    // Tentar resposta como JSON
                    try {
                        const errorResponse = JSON.parse(responseData);
                        console.error('📋 Detalhes do erro:', JSON.stringify(errorResponse, null, 2));
                    } catch (e) {
                        // Resposta não é JSON válido
                    }

                    process.exit(1);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Erro na requisição:', error.message);
            process.exit(1);
        });

        // Enviar dados do arquivo
        req.write(appData);
        req.end();

    } catch (error) {
        console.error('❌ Erro durante o upload:', error.message);
        process.exit(1);
    }
}

uploadApp();