const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const userInput = document.getElementById('userInput');
const apiKeyInput = document.getElementById('apiKey');
const status = document.getElementById('status');

let messages = [];

async function sendMessage() {
  const apiKey = apiKeyInput.value.trim();
  const userMsg = userInput.value.trim();
  if (!apiKey || !userMsg) return;

  appendMessage('user', userMsg);
  messages.push({ role: 'user', content: userMsg });
  userInput.value = '';
  status.textContent = '加载中...';

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen3.6-plus',
        messages: messages
      })
    });

    const data = await response.json();
    const botMsg = data.choices[0].message.content;
    appendMessage('bot', botMsg);
    messages.push({ role: 'assistant', content: botMsg });
    status.textContent = '';
  } catch (err) {
    console.error(err);
    status.textContent = '出错了，请检查 API Key 或网络';
  }
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.classList.add('message', role);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
clearBtn.addEventListener('click', () => {
  messages = [];
  chatBox.innerHTML = '';
});