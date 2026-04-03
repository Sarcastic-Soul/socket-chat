import fs from 'fs';

let content = fs.readFileSync('frontend/src/context/CallContext.jsx', 'utf8');

// 1. Add endCallCleanupRef
if (!content.includes('const endCallCleanupRef = useRef();')) {
    content = content.replace(
        'const callStartTimeRef = useRef(null);',
        'const callStartTimeRef = useRef(null);\n    const endCallCleanupRef = useRef();'
    );
}

// 2. Update socket.on("callEnded")
if (content.includes('socket.on("callEnded", () => {\\n            endCallCleanup();\\n        });')) {
    content = content.replace(
        'socket.on("callEnded", () => {\n            endCallCleanup();\n        });',
        'socket.on("callEnded", () => {\n            if (endCallCleanupRef.current) endCallCleanupRef.current();\n        });'
    );
} else if (content.includes('socket.on("callEnded", () => {\\n            endCallCleanup();\\n        });')) {
    // Just in case formatting differs
    content = content.replace(
        /socket\.on\("callEnded", \(\) => \{\s*endCallCleanup\(\);\s*\}\);/g,
        'socket.on("callEnded", () => {\n            if (endCallCleanupRef.current) endCallCleanupRef.current();\n        });'
    );
} else {
    content = content.replace(
        'socket.on("callEnded", () => {\n            endCallCleanup();\n        });',
        'socket.on("callEnded", () => {\n            if (endCallCleanupRef.current) endCallCleanupRef.current();\n        });'
    );
}

// 3. Add useEffect to update the ref
if (!content.includes('endCallCleanupRef.current = endCallCleanup;')) {
    const endCallDef = 'const endCallCleanup = () => {';
    content = content.replace(
        endCallDef,
        'useEffect(() => {\n        endCallCleanupRef.current = endCallCleanup;\n    });\n\n    ' + endCallDef
    );
}

fs.writeFileSync('frontend/src/context/CallContext.jsx', content);
