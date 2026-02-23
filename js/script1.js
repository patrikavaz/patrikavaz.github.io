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
    
    // --- نمایش پاسخ با افکت تایپ ---
    typeResponse(response);
}

/** 
 * تابع بهبود یافته برای تایپ کردن پاسخ‌ها
 */
function typeResponse(text) {
    const responseLine = document.createElement("p");
    output.appendChild(responseLine);
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            // مهم: نمایش صحیح خطوط جدید (\n)
            if (text.charAt(i) === '\n') {
                responseLine.innerHTML += "<br>";
            } else {
                responseLine.textContent += text.charAt(i);
            }
            i++;
        } else {
            clearInterval(typingInterval);
            // اسکرول به پایین
            output.scrollTop = output.scrollHeight;
        }
    }, 40); // سرعت 40 میلی‌ثانیه (کمی کندتر و خواناتر از 15ms)
}

function clearTerminal() {
    output.innerHTML = "";
    // پیام پاکسازی اولیه را با افکت تایپ نمایش می‌دهیم
    typeResponse('Terminal cleared. Type "help" to see available commands.');
}

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const command = input.value.trim();
        input.value = "";
        
        // 1. نمایش ورودی کاربر (با پرامپت)
        if (command) {
            const userCmdLine = document.createElement("p");
            userCmdLine.innerHTML = `<span class='prompt'>user@System:~$</span> ${command}`;
            output.appendChild(userCmdLine);
            handleCommand(command);
        } else {
             // اگر خالی بود، فقط یک خط جدید اضافه می‌کنیم
             output.appendChild(document.createElement("p"));
        }
        
        input.focus(); 
    }
});


// --- بخش جدید: اجرای اولیه با افکت تایپ هنگام بارگذاری صفحه ---
window.onload = function () {
    // توجه: عنوان صفحه در کد شما باید به درستی تنظیم شده باشد (مثل Mr.Avaz)
    const profileTitle = document.title.replace("Mr.Avaz", "Arian"); 
    const introText = `[INFO] Initializing Shell...
[INFO] Loading user profile: ${profileTitle}
Welcome to My System, Arian! Type 'help' to see available commands.`;
    
    const responseLine = document.createElement("p");
    output.appendChild(responseLine);
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < introText.length) {
            // مدیریت خط جدید برای نمایش صحیح
            if (introText.charAt(i) === '\n') {
                responseLine.innerHTML += "<br>";
            } else {
                responseLine.textContent += introText.charAt(i);
            }
            i++;
        } else {
            clearInterval(typingInterval);
            input.focus(); // فوکوس روی ورودی پس از اتمام تایپ اولیه
            output.scrollTop = output.scrollHeight;
        }
        output.scrollTop = output.scrollHeight;
    }, 40); // سرعت 40 میلی‌ثانیه برای پیام شروع
};
