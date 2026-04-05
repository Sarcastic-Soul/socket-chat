import fs from 'fs';

let content = fs.readFileSync('README.md', 'utf8');

const featuresAdd = `
- **Magic Reply (AI):** AI-powered smart replies using Google Gemini API with customizable tones ✨
- Edit Sent Messages to fix typos with a real-time \`(edited)\` indicator ✏️
- "Delete for Everyone" to remove messages from active conversations 🗑️
- **Message Forwarding:** Easily forward messages to other contacts or groups ➡️
- **System Messages:** Automatic group chat notifications (e.g., "Alice joined the group") 🚪
- **Voice Calls & Call Logs:** Audio-only WebRTC calls with in-chat logs for missed and completed calls 📞`;

content = content.replace(
    `- **Magic Reply (AI):** AI-powered smart replies using Google Gemini API with customizable tones ✨\n- Edit Sent Messages to fix typos with a real-time \`(edited)\` indicator ✏️\n- "Delete for Everyone" to remove messages from active conversations 🗑️`,
    featuresAdd.trim()
);

fs.writeFileSync('README.md', content);
console.log("README patched");
