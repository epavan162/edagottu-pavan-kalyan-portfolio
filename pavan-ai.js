/* =========================================
   PAVAN AI — PREMIUM PORTFOLIO CHATBOT
   ========================================= */

(function () {
  'use strict';

  // State
  let isOpen = false;
  let isLoading = false;
  let messages = []; // { role: 'user'|'ai'|'error', text: string, id: string }
  let lastFailedQuestion = '';

  const SUGGESTED_QUESTIONS = [
    "What technologies do you work with?",
    "Tell me about your experience",
    "What projects have you built?",
    "What is your GenAI & RAG expertise?",
    "What can you build for our team?",
    "Give me a quick overview of your background"
  ];

  // DOM Elements
  let launcherBtn, chatWindow, teaserBubble, messagesContainer, welcomeScreen, inputField, sendBtn, clearBtn, closeBtn;

  function init() {
    createDOM();
    bindEvents();
  }

  function createDOM() {
    // 1. Floating Launcher Button
    launcherBtn = document.createElement('button');
    launcherBtn.id = 'pavanAiLauncher';
    launcherBtn.className = 'pavan-ai-launcher';
    launcherBtn.setAttribute('aria-label', 'Open Pavan AI Chatbot');
    launcherBtn.setAttribute('title', 'Ask Pavan AI');
    launcherBtn.innerHTML = `
      <span class="pavan-ai-launcher-glow"></span>
      <span class="pavan-ai-launcher-badge">
        <i class="fas fa-robot"></i>
      </span>
      <span class="pavan-ai-launcher-text">Pavan AI</span>
      <span class="pavan-ai-online-dot"></span>
    `;
    document.body.appendChild(launcherBtn);

    // 1b. Floating Teaser Bubble above launcher
    teaserBubble = document.createElement('div');
    teaserBubble.id = 'pavanAiTeaser';
    teaserBubble.className = 'pavan-ai-teaser hidden';
    teaserBubble.innerHTML = `
      <button id="pavanAiTeaserClose" class="pavan-ai-teaser-close" aria-label="Close message">&times;</button>
      <div class="pavan-ai-teaser-body">
        <div class="pavan-ai-teaser-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="pavan-ai-teaser-content">
          <div class="pavan-ai-teaser-title">Hi! 👋</div>
          <div class="pavan-ai-teaser-text">
            Skip browsing my portfolio, resume &amp; social profiles — <strong>ask me anything directly!</strong>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(teaserBubble);

    // 2. Chat Window Modal
    chatWindow = document.createElement('div');
    chatWindow.id = 'pavanAiWindow';
    chatWindow.className = 'pavan-ai-window hidden';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-label', 'Pavan AI Chatbot');

    chatWindow.innerHTML = `
      <div class="pavan-ai-header">
        <div class="pavan-ai-brand">
          <div class="pavan-ai-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="pavan-ai-title-wrap">
            <div class="pavan-ai-name">Pavan AI</div>
            <div class="pavan-ai-status">
              <span class="pavan-ai-status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div class="pavan-ai-actions">
          <button id="pavanAiClear" class="pavan-ai-icon-btn" title="Clear Conversation" aria-label="Clear Conversation">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button id="pavanAiClose" class="pavan-ai-icon-btn" title="Close Chat" aria-label="Close Chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="pavan-ai-body">
        <!-- Welcome Screen -->
        <div id="pavanAiWelcome" class="pavan-ai-welcome">
          <div class="pavan-ai-welcome-badge">
            <i class="fas fa-sparkles"></i> AI Digital Twin
          </div>
          <h3 class="pavan-ai-welcome-title">Ask me anything about my work.</h3>
          <p class="pavan-ai-welcome-desc">
            Skip browsing through my portfolio, resume, LinkedIn, or social profiles — ask me anything you want to know about my experience, skills, and projects!
          </p>
          <div class="pavan-ai-chips-label">Suggested Questions</div>
          <div class="pavan-ai-chips" id="pavanAiChips">
            ${SUGGESTED_QUESTIONS.map(q => `<button class="pavan-ai-chip" data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}
          </div>
        </div>

        <!-- Scrollable Messages Container -->
        <div id="pavanAiMessages" class="pavan-ai-messages hidden"></div>
      </div>

      <!-- Input Bar -->
      <div class="pavan-ai-footer">
        <form id="pavanAiForm" class="pavan-ai-form">
          <input
            type="text"
            id="pavanAiInput"
            class="pavan-ai-input"
            placeholder="Ask anything about me..."
            autocomplete="off"
            maxlength="1000"
            aria-label="Ask anything about Pavan"
          />
          <button type="submit" id="pavanAiSend" class="pavan-ai-send-btn" aria-label="Send Question" disabled>
            <i class="fas fa-arrow-up"></i>
          </button>
        </form>
        <div class="pavan-ai-footer-note">Built by Pavan Kalyan • Powered by Gemini AI</div>
      </div>
    `;

    document.body.appendChild(chatWindow);

    // Bind DOM refs
    messagesContainer = document.getElementById('pavanAiMessages');
    welcomeScreen = document.getElementById('pavanAiWelcome');
    inputField = document.getElementById('pavanAiInput');
    sendBtn = document.getElementById('pavanAiSend');
    clearBtn = document.getElementById('pavanAiClear');
    closeBtn = document.getElementById('pavanAiClose');
  }

  function bindEvents() {
    launcherBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    clearBtn.addEventListener('click', clearChat);

    // Teaser bubble interaction
    const teaserCloseBtn = document.getElementById('pavanAiTeaserClose');
    if (teaserCloseBtn) {
      teaserCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTeaser(true);
      });
    }
    teaserBubble.addEventListener('click', () => {
      hideTeaser(true);
      openChat();
    });

    // Auto-show teaser bubble instantly on page load (100ms)
    setTimeout(() => {
      if (!isOpen && teaserBubble) {
        teaserBubble.classList.remove('hidden');
      }
    }, 100);

    const form = document.getElementById('pavanAiForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });

    inputField.addEventListener('input', () => {
      sendBtn.disabled = !inputField.value.trim() || isLoading;
    });

    // Chips click delegate
    const chipsContainer = document.getElementById('pavanAiChips');
    chipsContainer.addEventListener('click', (e) => {
      const target = e.target.closest('.pavan-ai-chip');
      if (target) {
        const question = target.getAttribute('data-question');
        if (question) {
          sendQuestion(question);
        }
      }
    });

    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });
  }

  function hideTeaser(remember = false) {
    if (teaserBubble) {
      teaserBubble.classList.add('hidden');
    }
    if (remember) {
      sessionStorage.setItem('pavanAiTeaserDismissed', 'true');
    }
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    hideTeaser(false);
    chatWindow.classList.remove('hidden');
    launcherBtn.classList.add('active');
    setTimeout(() => inputField.focus(), 150);
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.add('hidden');
    launcherBtn.classList.remove('active');
  }

  function clearChat() {
    messages = [];
    lastFailedQuestion = '';
    messagesContainer.innerHTML = '';
    messagesContainer.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
  }

  function handleSend() {
    const text = inputField.value.trim();
    if (!text || isLoading) return;
    inputField.value = '';
    sendBtn.disabled = true;
    sendQuestion(text);
  }

  async function sendQuestion(questionText) {
    if (isLoading) return;

    // Transition to chat view
    welcomeScreen.classList.add('hidden');
    messagesContainer.classList.remove('hidden');

    // Remove any trailing error card if present
    const existingError = messagesContainer.querySelector('.pavan-ai-msg-error');
    if (existingError) existingError.remove();

    // Append User Message
    const userMsg = { id: Date.now().toString(), role: 'user', text: questionText };
    messages.push(userMsg);
    appendMessageUI(userMsg);
    scrollToBottom();

    // Show Typing Indicator
    isLoading = true;
    showTypingIndicator();

    try {
      // Pass previous history for context-aware follow-up questions
      const previousHistory = messages.slice(0, -1).map(m => ({ role: m.role, text: m.text }));
      const payloadData = { message: questionText, history: previousHistory };

      // Call Netlify Function (/api/chat) with fallback to direct netlify function URL
      let response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        });
      } catch (networkErr) {
        // Fallback endpoint if rewrite fails locally
        response = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        });
      }

      // Remove typing indicator immediately when response arrives
      removeTypingIndicator();

      // Cooldown timer to prevent rapid clicking from triggering 429 rate limits
      setTimeout(() => {
        isLoading = false;
        sendBtn.disabled = !inputField.value.trim();
      }, 1200);

      if (!response.ok) {
        lastFailedQuestion = questionText;
        showFriendlyError("Looks like I hit a small technical bump. Please try again in a moment. 🚀");
        return;
      }

      const data = await response.json();

      if (data.status === 'quota_exceeded') {
        lastFailedQuestion = questionText;
        showFriendlyError(data.answer || "Hmm, I'm having a little trouble answering that right now. 😅 Please try again in a moment — or feel free to explore the portfolio while I get back up.");
        return;
      }

      if (data.status === 'error' || !data.answer) {
        lastFailedQuestion = questionText;
        showFriendlyError(data.answer || "Something went wrong on my side. Please try again shortly.");
        return;
      }

      // Success AI Answer
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: data.answer };
      messages.push(aiMsg);
      appendMessageUI(aiMsg);
      scrollToBottom();

    } catch (err) {
      console.error('Pavan AI Request Error:', err);
      removeTypingIndicator();
      setTimeout(() => {
        isLoading = false;
        sendBtn.disabled = !inputField.value.trim();
      }, 1200);
      lastFailedQuestion = questionText;
      showFriendlyError("I couldn't reach the AI right now. Please check your connection and try again.");
    }
  }

  function appendMessageUI(msg) {
    const msgEl = document.createElement('div');
    msgEl.className = `pavan-ai-msg pavan-ai-msg-${msg.role}`;
    msgEl.setAttribute('data-id', msg.id);

    if (msg.role === 'user') {
      msgEl.innerHTML = `
        <div class="pavan-ai-msg-bubble">
          ${escapeHtml(msg.text)}
        </div>
      `;
    } else if (msg.role === 'ai') {
      msgEl.innerHTML = `
        <div class="pavan-ai-msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="pavan-ai-msg-bubble">
          ${formatMarkdown(msg.text)}
        </div>
      `;
    }

    messagesContainer.appendChild(msgEl);
  }

  function showTypingIndicator() {
    let indicator = document.getElementById('pavanAiTyping');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pavanAiTyping';
      indicator.className = 'pavan-ai-msg pavan-ai-msg-ai pavan-ai-typing';
      indicator.innerHTML = `
        <div class="pavan-ai-msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="pavan-ai-msg-bubble">
          <span class="pavan-ai-dot"></span>
          <span class="pavan-ai-dot"></span>
          <span class="pavan-ai-dot"></span>
        </div>
      `;
      messagesContainer.appendChild(indicator);
      scrollToBottom();
    }
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('pavanAiTyping');
    if (indicator) indicator.remove();
  }

  function showFriendlyError(errorMessage) {
    removeTypingIndicator();
    const errorEl = document.createElement('div');
    errorEl.className = 'pavan-ai-msg pavan-ai-msg-ai pavan-ai-msg-error';
    errorEl.innerHTML = `
      <div class="pavan-ai-msg-avatar error"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="pavan-ai-msg-bubble error-bubble">
        <p>${escapeHtml(errorMessage)}</p>
        <button class="pavan-ai-retry-btn" id="pavanAiRetryBtn">
          <i class="fas fa-redo"></i> Try again
        </button>
      </div>
    `;

    messagesContainer.appendChild(errorEl);
    scrollToBottom();

    const retryBtn = errorEl.querySelector('#pavanAiRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        errorEl.remove();
        if (lastFailedQuestion) {
          // Remove the last user message from memory array before retrying
          if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            const lastUserMsgEl = messagesContainer.querySelector(`[data-id="${messages[messages.length - 1].id}"]`);
            if (lastUserMsgEl) lastUserMsgEl.remove();
            messages.pop();
          }
          sendQuestion(lastFailedQuestion);
        }
      });
    }
  }

  function scrollToBottom(smooth = true) {
    const bodyContainer = chatWindow ? chatWindow.querySelector('.pavan-ai-body') : null;
    requestAnimationFrame(() => {
      if (bodyContainer) {
        bodyContainer.scrollTo({
          top: bodyContainer.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
      if (messagesContainer) {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    });

    setTimeout(() => {
      if (bodyContainer) {
        bodyContainer.scrollTop = bodyContainer.scrollHeight;
      }
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 80);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);

    // 1. Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. Inline Code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="pavan-ai-inline-code">$1</code>');

    // 3. Markdown Links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="pavan-ai-link">$1 <i class="fas fa-external-link-alt"></i></a>');

    // Process lines for Headings, Lists, Dividers, and Paragraphs
    const lines = formatted.split('\n');
    let inList = false;
    let resultHtml = '';

    for (let line of lines) {
      const trimmed = line.trim();

      // Horizontal Rule / Divider (--- or ***)
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        if (inList) { inList = false; resultHtml += '</ul>'; }
        resultHtml += '<hr class="pavan-ai-divider" />';
        continue;
      }

      // Headings (### , ## , # )
      if (trimmed.startsWith('### ')) {
        if (inList) { inList = false; resultHtml += '</ul>'; }
        resultHtml += `<h4 class="pavan-ai-h4">${formatInlineItalics(trimmed.slice(4))}</h4>`;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        if (inList) { inList = false; resultHtml += '</ul>'; }
        resultHtml += `<h3 class="pavan-ai-h3">${formatInlineItalics(trimmed.slice(3))}</h3>`;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        if (inList) { inList = false; resultHtml += '</ul>'; }
        resultHtml += `<h2 class="pavan-ai-h2">${formatInlineItalics(trimmed.slice(2))}</h2>`;
        continue;
      }

      // Bullet List Items (* item or - item)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          inList = true;
          resultHtml += '<ul class="pavan-ai-list">';
        }
        resultHtml += `<li>${formatInlineItalics(trimmed.slice(2))}</li>`;
      } else {
        if (inList) {
          inList = false;
          resultHtml += '</ul>';
        }
        if (trimmed) {
          resultHtml += `<p class="pavan-ai-para">${formatInlineItalics(line)}</p>`;
        }
      }
    }
    if (inList) resultHtml += '</ul>';

    return resultHtml || `<p class="pavan-ai-para">${formatted}</p>`;
  }

  function formatInlineItalics(str) {
    if (!str) return '';
    // Safely format *italic* or _italic_ without clashing with bullet list stars
    return str
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
