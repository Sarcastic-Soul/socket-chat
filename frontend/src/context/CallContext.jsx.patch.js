import fs from 'fs';

let content = fs.readFileSync('frontend/src/context/CallContext.jsx', 'utf8');

// 1. Add callStartTimeRef
if (!content.includes('callStartTimeRef = useRef(null)')) {
    content = content.replace(
        'const pendingCandidates = useRef([]);',
        'const pendingCandidates = useRef([]);\n    const callStartTimeRef = useRef(null);'
    );
}

// 2. Set startTime on callAccepted
if (!content.includes('callStartTimeRef.current = Date.now();')) {
    content = content.replace(
        'setCallAccepted(true);',
        'setCallAccepted(true);\n            callStartTimeRef.current = Date.now();'
    );
}

// 3. Inject the logic into endCallCleanup
if (!content.includes('// Send Call Log')) {
    const endCallLogic = `
    const endCallCleanup = () => {
        // Send Call Log if caller
        if (isCalling && call.userToCall) {
            const duration = callStartTimeRef.current ? Date.now() - callStartTimeRef.current : 0;
            let logText = "Missed call";
            
            if (duration > 0) {
                const totalSeconds = Math.floor(duration / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                const formattedTime = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                logText = \`Call ended • \${formattedTime}\`;
            }

            fetch(\`\${import.meta.env.VITE_API_URL}/api/messages/send/\${call.userToCall}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: logText, isCall: true }),
                credentials: "include"
            }).catch(console.error);
        }
        
        callStartTimeRef.current = null;
        setCallEnded(false);
`;
    content = content.replace(
        'const endCallCleanup = () => {\n        setCallEnded(false);',
        endCallLogic
    );
}

fs.writeFileSync('frontend/src/context/CallContext.jsx', content);
