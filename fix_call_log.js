import fs from 'fs';

let content = fs.readFileSync('frontend/src/context/CallContext.jsx', 'utf8');

if (!content.includes('import useConversation')) {
    content = content.replace(
        'import { useAuthContext } from "./AuthContext";',
        'import { useAuthContext } from "./AuthContext";\nimport useConversation from "../zustand/useConversation";'
    );
}

if (!content.includes('const { addMessage } = useConversation();')) {
    content = content.replace(
        'const { authUser } = useAuthContext();',
        'const { authUser } = useAuthContext();\n    const { addMessage } = useConversation();'
    );
}

const oldFetch = `            fetch(\`\${import.meta.env.VITE_API_URL}/api/messages/send/\${call.userToCall}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: logText, isCall: true }),
                credentials: "include"
            }).catch(console.error);`;

const newFetch = `            fetch(\`\${import.meta.env.VITE_API_URL}/api/messages/send/\${call.userToCall}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: logText, isCall: true }),
                credentials: "include"
            })
            .then(res => res.json())
            .then(data => {
                if (data.newMessage) {
                    addMessage(data.newMessage);
                }
            })
            .catch(console.error);`;

content = content.replace(oldFetch, newFetch);

fs.writeFileSync('frontend/src/context/CallContext.jsx', content);
