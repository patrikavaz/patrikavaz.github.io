// ================================================================
//  TERMINAL — script.js
//  Structure: CONFIG → DATA → STATE → DOM → INIT → INPUT → OUTPUT
// ================================================================


// ----------------------------------------------------------------
// 1. CONFIG
// ----------------------------------------------------------------

const CONFIG = {
  typingSpeed : 10,    // ms per character
  promptText  : "user@System:~$",
};


// ----------------------------------------------------------------
// 2. DATA  (all content lives here, separated from logic)
// ----------------------------------------------------------------

const ASCII_BANNER = `
  __  __                        
 |  \\/  |_ __ __ ___   ____ ___
 | |\\/| | '__/ _\` \\ \\ / / _\` |_  / 
 | |  | | | | (_| |\\ V / (_| |/ /  
 |_|  |_|_|  \\__,_| \\_/ \\__,_/___|
`;

// Each command has: description (for help), type (for color), output or html
const COMMANDS = {

  help: {
    description : "Show available commands",
    type        : "info",
    output      : () =>
`Available commands:
  about      —  About me
  skills     —  Technical skills
  education  —  Educational background
  contact    —  Contact & social media
  whoami     —  Who am I?
  banner     —  Show ASCII banner
  date       —  Current date & time
  sudo       —  Try your luck
  clear      —  Clear the terminal
  help       —  Show this message`,
  },

  about: {
    description : "About me",
    type        : "success",
    output      : () =>
`[ about ]
  Full-Time Ethical Hacker & Bug Bounty Hunter
  Uncovering critical vulnerabilities to strengthen digital defenses.
  Proficient in Web / API / Mobile security.`,
  },

  skills: {
    description : "Technical skills",
    type        : "success",
    output      : () =>
`[ skills ]

  1. Vulnerability Assessment & Penetration Testing
     └─ Web apps, APIs, network infrastructure

  2. Tools & Technologies
     ├─ Burp Suite          ├─ SQLMap
     ├─ Nmap                ├─ Wireshark
     ├─ Postman             └─ Python / Bash scripts

  3. Vulnerability Knowledge
     ├─ OWASP Top 10        ├─ CWE
     ├─ Misconfigurations   ├─ Privilege Escalation
     └─ Post-exploitation techniques

  4. Reporting & Communication
     └─ Detailed reports with PoCs & remediation advice

  5. Continuous Learning
     └─ CTFs, security research, emerging threats`,
  },

  education: {
    description : "Educational background",
    type        : "warning",
    output      : () =>
`[ education ]
  Currently at university...
  [REDACTED] — for security reasons.`,
  },

  // contact uses html() instead of output() to render clickable links
  contact: {
    description : "Contact info",
    type        : "success",
    html        : () =>
`[ contact ]
  <a href="https://instagram.com/0x65null"  target="_blank">Instagram</a>  →  0x65null
  <a href="https://t.me/isRoot_u"           target="_blank">Telegram</a>   →  isRoot_u
  <a href="https://twitter.com/Mroff_ir"    target="_blank">Twitter</a>    →  Mroff_ir
  <a href="mailto:info@hearian.ir"                        >Email</a>       →  info@hearian.ir`,
  },

  projects: {
    description : "My projects",
    type        : "warning",
    output      : () =>
`[ projects ]
  Coming soon...
  Stay tuned.`,
  },

  whoami: {
    description : "Who am I?",
    type        : "success",
    output      : () =>
`mroff
  Role   : Ethical Hacker | Bug Bounty Hunter | CTF Player
  Status : root access... pending`,
  },

  banner: {
    description : "Show ASCII banner",
    type        : "banner",
    output      : () => ASCII_BANNER,
  },

  date: {
    description : "Current date & time",
    type        : "info",
    output      : () => {
      const now = new Date();
      return `[ system clock ]
  UTC   : ${now.toUTCString()}
  Unix  : ${Math.floor(Date.now() / 1000)}`;
    },
  },

  sudo: {
    description : "sudo",
    type        : "error",
    output      : () => `sudo: Permission denied.  Nice try. 😏`,
  },

  clear: {
    description : "Clear terminal",
    type        : "clear",
    output      : null,
  },

};


// ----------------------------------------------------------------
// 3. STATE
// ----------------------------------------------------------------

const history = [];       // command history (newest first)
let historyIndex = -1;    // current position in history while navigating


// ----------------------------------------------------------------
// 4. DOM REFS
// ----------------------------------------------------------------

const outputEl = document.getElementById("output");
const inputEl  = document.getElementById("input");


// ----------------------------------------------------------------
// 5. INIT
// ----------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  printBanner();
  inputEl.focus();

  // Clicking anywhere on the terminal refocuses the input
  document.querySelector(".terminal").addEventListener("click", () => inputEl.focus());
});

function printBanner() {
  const bannerEl = document.createElement("pre");
  bannerEl.className = "out-banner";
  bannerEl.textContent = ASCII_BANNER;
  outputEl.appendChild(bannerEl);

  const hintEl = document.createElement("p");
  hintEl.className = "out-info";
  hintEl.textContent = '  Type "help" to see available commands.';
  outputEl.appendChild(hintEl);
}


// ----------------------------------------------------------------
// 6. INPUT HANDLING
// ----------------------------------------------------------------

inputEl.addEventListener("keydown", function (e) {

  // Submit command
  if (e.key === "Enter") {
    const cmd = inputEl.value.trim();
    inputEl.value = "";
    historyIndex   = -1;

    if (!cmd) return;
    history.unshift(cmd);   // add to front (newest first)
    echoCommand(cmd);
    handleCommand(cmd);
    return;
  }

  // Navigate history: ArrowUp → older, ArrowDown → newer
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      inputEl.value = history[historyIndex];
    }
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputEl.value = history[historyIndex];
    } else {
      historyIndex  = -1;
      inputEl.value = "";
    }
    return;
  }

  // Tab autocomplete — find the first command that starts with what's typed
  if (e.key === "Tab") {
    e.preventDefault();
    const partial = inputEl.value.trim().toLowerCase();
    if (!partial) return;

    const match = Object.keys(COMMANDS).find(cmd => cmd.startsWith(partial));
    if (match) inputEl.value = match;
    return;
  }

});


// ----------------------------------------------------------------
// 7. COMMAND LOGIC
// ----------------------------------------------------------------

function handleCommand(raw) {
  const key = raw.toLowerCase();
  const def = COMMANDS[key];

  if (!def) {
    printLine(
      `Command not found: "${raw}"  —  type "help" for available commands.`,
      "error"
    );
    return;
  }

  if (def.type === "clear") {
    clearTerminal();
    return;
  }

  // HTML mode (e.g. contact with clickable links)
  if (def.html) {
    printHTML(def.html(), def.type);
    return;
  }

  // Plain text mode with typing animation
  const text = typeof def.output === "function" ? def.output() : "";
  if (text) typeResponse(text, def.type);
}


// ----------------------------------------------------------------
// 8. OUTPUT RENDERERS
// ----------------------------------------------------------------

/** Echo the typed command above its response */
function echoCommand(cmd) {
  const el      = document.createElement("p");
  el.className  = "out-echo";
  el.textContent = `${CONFIG.promptText} ${cmd}`;
  outputEl.appendChild(el);
}

/** Typing animation for plain-text responses */
function typeResponse(text, type = "success") {
  const el     = document.createElement("pre");
  el.className = `out-${type}`;
  outputEl.appendChild(el);
  scrollBottom();

  let i = 0;
  const tick = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
      scrollBottom();
    } else {
      clearInterval(tick);
    }
  }, CONFIG.typingSpeed);
}

/** Instant HTML output (used for contact links) */
function printHTML(html, type = "success") {
  const el     = document.createElement("pre");
  el.className = `out-${type}`;
  el.innerHTML  = html;
  outputEl.appendChild(el);
  scrollBottom();
}

/** Instant single-line print (used for errors) */
function printLine(text, type = "info") {
  const el      = document.createElement("p");
  el.className  = `out-${type}`;
  el.textContent = text;
  outputEl.appendChild(el);
  scrollBottom();
}

function clearTerminal() {
  outputEl.innerHTML = "";
  printLine('Terminal cleared.  Type "help" to see available commands.', "info");
}

function scrollBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
