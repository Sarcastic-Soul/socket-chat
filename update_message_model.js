import fs from 'fs';

let content = fs.readFileSync('backend/models/message.model.js', 'utf8');

if (!content.includes('isCall:')) {
    content = content.replace(
        'isDeleted: {\n            type: Boolean,\n            default: false,\n        },',
        'isDeleted: {\n            type: Boolean,\n            default: false,\n        },\n        isCall: {\n            type: Boolean,\n            default: false,\n        },'
    );
    fs.writeFileSync('backend/models/message.model.js', content);
}
