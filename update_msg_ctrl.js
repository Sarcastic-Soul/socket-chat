import fs from 'fs';

let content = fs.readFileSync('backend/controllers/message.controller.js', 'utf8');

if (!content.includes('isCall } = req.body;')) {
    content = content.replace(
        'const { message, mediaUrl, mediaType, replyTo } = req.body;',
        'const { message, mediaUrl, mediaType, replyTo, isCall } = req.body;'
    );
}

if (!content.includes('isCall: isCall || false,')) {
    content = content.replace(
        'replyTo: replyTo || null,',
        'replyTo: replyTo || null,\n            isCall: isCall || false,'
    );
}

fs.writeFileSync('backend/controllers/message.controller.js', content);
