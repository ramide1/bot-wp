import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { callGpt } from './gpt';
import 'dotenv/config';

const options = {
    googleApi: ((process.env.GOOGLEAPI !== undefined) && (process.env.GOOGLEAPI === 'true')) ? true : false,
    url: (process.env.URL !== undefined) ? process.env.URL : 'https://api.openai.com/v1/chat/completions',
    model: (process.env.MODEL !== undefined) ? process.env.MODEL : 'gpt-4o-mini',
    apiKey: (process.env.APIKEY !== undefined) ? process.env.APIKEY : '',
    historyFile: (process.env.HISTORYFILE !== undefined) ? process.env.HISTORYFILE : 'history.yml',
    instructions: (process.env.INSTRUCTIONS !== undefined) ? process.env.INSTRUCTIONS : 'Answer user questions.'
}

const client = new Client({
    authStrategy: new LocalAuth()
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async (message) => {
    if (message.fromMe) return;
    try {
        const gptResponse = await callGpt(options, message.body, message.from);
        client.sendMessage(message.from, gptResponse.message);
    } catch (e) {
        console.error(e);
        client.sendMessage(message.from, 'Response failed');
    }
});

client.initialize();