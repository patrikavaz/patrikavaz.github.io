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

// --- تابع بهبود یافته برای تایپ کردن پاسخ‌ها ---
function typeResponse(text) {
  const responseLine = document.createElement("p");
  output.appendChild(responseLine);
  let i = 0;
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      // **اصلاح موضعی برای مدیریت خط جدید**
      if (text.charAt(i) === '\n') {
          responseLine.innerHTML += "<br>"; // استفاده از innerHTML فقط برای <br>
      } else {
          responseLine.textContent += text.charAt(i); // برای سایر کاراکترها
      }
      i++;
    } else {
      clearInterval(typingInterval);
      output.scrollTop = output.scrollHeight; // اسکرول به پایین
    }
  }, 15); // حفظ سرعت 15ms شما
}

function handleCommand(command) {
  if (command === "clear") {
    clearTerminal();
    return;
  }
  let response = commands[command] || `Command not found: ${command}`;
  
  // اگر دستوری اجرا شد، پاسخ را با افکت تایپ نمایش می‌دهیم
  typeResponse(response);
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    input.value = "";
    
    // --- بخش جدید: نمایش خط فرمان کاربر قبل از پاسخ ---
    if (command) {
        const userCmdLine = document.createElement("p");
        userCmdLine.innerHTML = `<span class='prompt'>user@System:~$</span> ${command}`;
        output.appendChild(userCmdLine);
        handleCommand(command);
    } else {
         // اگر دستور خالی بود، فقط یک خط جدید اضافه می‌کنیم
         output.appendChild(document.createElement("p"));
    }
    // -------------------------------------------------
    
    input.focus(); 
  }
});

function clearTerminal() {
  output.innerHTML = ""; // پاکسازی کامل
  // پیام پاکسازی جدید را با افکت تایپ نمایش می‌دهیم
  typeResponse('Terminal cleared. Type "help" to see available commands.');
}

// --- بخش جدید: اجرای اولیه با افکت تایپ هنگام بارگذاری صفحه ---
window.onload = function () {
    // با فرض اینکه title صفحه شما حاوی نام کاربر است
    const userName = document.title.includes("Arian") ? "Arian" : "user";
    const introText = `[INFO] Initializing Shell...
[INFO] Loading user profile: ${userName}
Welcome to My System, ${userName}! Type 'help' to see available commands.`;
    
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
    }, 40); // سرعت کمی آهسته‌تر برای پیام شروع (40ms)
};
