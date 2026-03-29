async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const userText = input.value.trim();
  if (!userText) return;

  // tampilkan user
  chatBox.innerHTML += `<div class="message user">${userText}</div>`;
  input.value = "";

  // auto scroll setelah user
  chatBox.scrollTop = chatBox.scrollHeight;

  // loading
  chatBox.innerHTML += `<div class="message bot" id="loading">...</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  // cek knowledge lokal
  let found = null;
  for (let key in knowledge) {
    if (userText.toLowerCase().includes(key)) {
      found = knowledge[key];
      break;
    }
  }

  // kalau ketemu di knowledge
  if (found) {
    const loadingEl = document.getElementById("loading");
    if (loadingEl) loadingEl.remove();

    chatBox.innerHTML += `<div class="message bot">${found}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  // kalau ga ketemu → call AI
  try {
    const response = await fetch(
      "https://komanglegolas-chatbot-hr.hf.space/run",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [userText] })
      }
    );

    const result = await response.json();

    // handle error dari API
    if (!result || !result.data) {
      throw new Error("Invalid response");
    }

    const botText = result.data[0];

    // hapus loading
    const loadingEl = document.getElementById("loading");
    if (loadingEl) loadingEl.remove();

    // tampilkan bot
    chatBox.innerHTML += `<div class="message bot">${botText}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    // kalau error
    const loadingEl = document.getElementById("loading");
    if (loadingEl) loadingEl.remove();

    chatBox.innerHTML += `<div class="message bot">⚠️ Error, coba lagi</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
