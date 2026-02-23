const output = document.getElementById("output");
const input = document.getElementById("input");

const commands = {
    help: `Available commands:
    - about: Display information about me.
    - skills: List my skills.
    - education: Display my educational background.
    - contact: Get my contact information.
    - clear: Clear the terminal.`,
    about: `about me:
    - Full-Time Ethical Hacker & Bug Bounty Hunter | Uncovering critical vulnerabilities to strengthen digital defenses Proficient in Web/API/Mobile security`,
    skills: `Core Skills:

    1. Vulnerability Assessment & Penetration Testing:
       - Proficient in testing web apps, APIs, and network infrastructure.

    2. Tools & Technologies:
       - Burp Suite
       - SQLMap
       - Nmap
       - Wireshark
       - Postman
       - Custom automation scripts (Python/Bash)

    3. Vulnerability Knowledge:
       - OWASP Top 10
       - CWE
       - Misconfigurations
       - Privilege escalation
       - Post-exploitation techniques

    4. Reporting & Communication:
       - Clear, detailed vulnerability reports with PoCs and remediation advice.

    5. Continuous Learning:
       - Active participation in CTFs, security research, and staying updated with emerging threats.`,
    education: `- At university I am studying at university . . No no I am unable to write this for security reasons`,
    contact: `Social Media:
    - Instagram ID: 0x65null
    - Telegram ID: isRoot_u
    - Twitter ID: Mroff_ir
    - Email: info@hearian.ir`,
    clear: `clear`,
};


function handleCommand(command) {
    if (command === "clear") {
        clearTerminal();
        return;
    }
    let response = commands[command] || `Command not found: ${command}`;
    
    typeResponse(response);
}


function typeResponse(text) {
    const responseLine = document.createElement("p");
    output.appendChild(responseLine);
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                responseLine.innerHTML += "<br>";
            } else {
                responseLine.textContent += text.charAt(i);
            }
            i++;
        } else {
            clearInterval(typingInterval);
            output.scrollTop = output.scrollHeight;
        }
    }, 40); 
}

function clearTerminal() {
    output.innerHTML = "";
    typeResponse('Terminal cleared. Type "help" to see available commands.');
}

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const command = input.value.trim();
        input.value = "";
        
        if (command) {
            const userCmdLine = document.createElement("p");
            userCmdLine.innerHTML = `<span class='prompt'>user@System:~$</span> ${command}`;
            output.appendChild(userCmdLine);
            handleCommand(command);
        } else {
             output.appendChild(document.createElement("p"));
        }
        
        input.focus(); 
    }
});


window.onload = function () {
    const introText = `[INFO] Initializing Shell...
[INFO] Loading user profile: ${document.title || 'Unknown'}
Welcome to My System, Arian! Type 'help' to see available commands.`;
    
    const responseLine = document.createElement("p");
    output.appendChild(responseLine);
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < introText.length) {
            if (introText.charAt(i) === '\n') {
                responseLine.innerHTML += "<br>";
            } else {
                responseLine.textContent += introText.charAt(i);
            }
            i++;
        } else {
            clearInterval(typingInterval);
            input.focus(); 
            output.scrollTop = output.scrollHeight;
        }
        output.scrollTop = output.scrollHeight;
    }, 40); 
};
