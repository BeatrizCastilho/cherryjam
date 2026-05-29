btnLogin.addEventListener('click', async () => {

  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();

  authError.innerText = "";

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!data.success) {
    authError.innerText = data.error;
    return;
  }

  currentUser = data.user;

  logarUsuarioUI();
});

btnSignup.addEventListener('click', async () => {

  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value.trim();

  authError.innerText = "";

  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!data.success) {
    authError.innerText = data.error;
    return;
  }

  currentUser = data.user;

  alert("✨ Conta criada com sucesso!");

  logarUsuarioUI();
});

// ==========================================
// 🕹️ ROTEADOR DE PÁGINAS
// ==========================================
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');
const logoArea = document.getElementById('nav-logo');

function switchView(targetViewId) {
  views.forEach(view => view.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));
  const targetView = document.getElementById(targetViewId);
  if (targetView) targetView.classList.add('active');
  const activeLink = document.querySelector(`[data-target="${targetViewId}"]`);
  if (activeLink) activeLink.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchView(link.getAttribute('data-target'));
  });
});
if (logoArea) logoArea.addEventListener('click', () => switchView('view-home'));

const heroEnter = document.getElementById('hero-enter');
const heroAesthetic = document.getElementById('hero-aesthetic');
if (heroEnter) heroEnter.addEventListener('click', () => switchView('view-radio'));
if (heroAesthetic) heroAesthetic.addEventListener('click', () => switchView('view-looks'));

// ==========================================
// 📻 RÁDIO RETRÔ + FITAS PERSONALIZADAS
// ==========================================
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const musicTitle = document.getElementById("music-title");
const playerStatus = document.getElementById("player-status");
const stationBtns = document.querySelectorAll(".station-btn");

function updatePlayerUI(status) {
  playerStatus.innerText = status === "tocando" ? "⚡ Tocando agora..." : "⏸️ Pausado";
  playerStatus.style.color = status === "tocando" ? "#ff3ca6" : "#aaa";
}
if (playBtn) playBtn.addEventListener("click", () => { audio.play(); updatePlayerUI("tocando"); });
if (pauseBtn) pauseBtn.addEventListener("click", () => { audio.pause(); updatePlayerUI("pausado"); });

function ativarStation(btn) {
  stationBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  audio.src = btn.getAttribute('data-src');
  musicTitle.innerText = btn.getAttribute('data-title');
  audio.play().catch(() => console.log("interação"));
  updatePlayerUI("tocando");
  localStorage.setItem('cherry_last_station', JSON.stringify({ src: audio.src, title: musicTitle.innerText }));
}
stationBtns.forEach(btn => btn.addEventListener('click', () => ativarStation(btn)));

const savedStation = localStorage.getItem('cherry_last_station');
if (savedStation) {
  const { src, title } = JSON.parse(savedStation);
  audio.src = src;
  musicTitle.innerText = title;
  const btnMatch = [...stationBtns].find(b => b.getAttribute('data-src') === src);
  if (btnMatch) ativarStation(btnMatch);
}

let customTapes = JSON.parse(localStorage.getItem('cherry_custom_tapes')) || [];
function carregarFitasPersonalizadas() {
  const container = document.getElementById('custom-tapes-list');
  if (!container) return;
  container.innerHTML = '';
  customTapes.forEach((tape, idx) => {
    const btn = document.createElement('button');
    btn.className = 'custom-tape-btn';
    btn.innerText = `📼 ${tape.name}`;
    btn.addEventListener('click', () => {
      audio.src = tape.data;
      musicTitle.innerText = tape.name;
      audio.play();
      updatePlayerUI("tocando");
      localStorage.setItem('cherry_last_station', JSON.stringify({ src: tape.data, title: tape.name }));
    });
    container.appendChild(btn);
  });
}
document.getElementById('add-tape-btn')?.addEventListener('click', () => {
  const name = document.getElementById('new-tape-name').value.trim();
  const file = document.getElementById('new-tape-file').files[0];
  if (!name || !file) return alert('🍒 Dê um nome e selecione um arquivo MP3');
  const reader = new FileReader();
  reader.onload = e => {
    customTapes.push({ name, data: e.target.result });
    localStorage.setItem('cherry_custom_tapes', JSON.stringify(customTapes));
    carregarFitasPersonalizadas();
    document.getElementById('new-tape-name').value = '';
    document.getElementById('new-tape-file').value = '';
    alert(`✨ Fita "${name}" adicionada!`);
  };
  reader.readAsDataURL(file);
});

// ==========================================
// 🍒 GERADOR DE PLAYLIST + COMPARTILHAR
// ==========================================
const moodInput = document.getElementById("mood-input");
const generateBtn = document.getElementById("generate-btn");
const resultDiv = document.getElementById("playlist-result");
const shareBtn = document.getElementById("share-playlist-btn");

function gerarPlaylist(mood) {
  let html = '';
  if (mood.includes("triste") || mood.includes("sad") || mood.includes("mal")) {
    html = `<h3>💔 Playlist Sad Glam</h3><p>🎵 drivers license - Olivia Rodrigo</p><p>🎵 cardigan - Taylor Swift</p><p>🎵 liability - Lorde</p><br><p><strong>Estética:</strong> Delineado borrado, glitter prata e moletom oversized.</p>`;
  } else if (mood.includes("raiva") || mood.includes("odio") || mood.includes("brava")) {
    html = `<h3>🔥 Cherry Rage Mode</h3><p>🎵 misery business - Paramore</p><p>🎵 good 4 u - Olivia Rodrigo</p><p>🎵 brutal - Olivia Rodrigo</p><br><p><strong>Estética:</strong> Coturno preto, gloss vermelho e estrelas metálicas.</p>`;
  } else if (mood.includes("feliz") || mood.includes("animada") || mood.includes("festa")) {
    html = `<h3>✨ Popstar Energy</h3><p>🎵 teenage dream - Katy Perry</p><p>🎵 california gurls - Katy Perry</p><p>🎵 last friday night - Katy Perry</p><br><p><strong>Estética:</strong> Rosa neon, mini saia Y2K e muito brilho labial.</p>`;
  } else if (mood.includes("ansioso") || mood.includes("ansiosa") || mood.includes("nervosa")) {
    html = `<h3>🌀 Overthinking Mind</h3><p>🎵 breathin - Ariana Grande</p><p>🎵 piloto automático - Supercombo</p><p>🎵 uncomfortably numb - American Football</p><br><p><strong>Estética:</strong> Unhas pretas e fones no volume máximo.</p>`;
  } else {
    html = `<h3>🍒 Indie Cherry Vibes</h3><p>🎵 sweater weather - The Neighbourhood</p><p>🎵 apocalypse - Cigarettes After Sex</p><p>🎵 softcore - The Neighbourhood</p><br><p><strong>Estética:</strong> CDs riscados e fones retrô.</p>`;
  }
  resultDiv.innerHTML = html;
  shareBtn.style.display = 'block';
  if (Notification.permission === 'granted') {
    new Notification('🍒 Playlist pronta!', { body: `Sua playlist para "${mood}" está no backstage.` });
  }
}
generateBtn.addEventListener('click', () => {
  const mood = moodInput.value.toLowerCase().trim();
  if (!mood) {
    resultDiv.innerHTML = `<p style="color:#ff78c8;text-align:center;">🍒 Digite um humor primeiro...</p>`;
    shareBtn.style.display = 'none';
    return;
  }
  gerarPlaylist(mood);
});
shareBtn.addEventListener('click', () => {
  html2canvas(resultDiv).then(canvas => {
    const link = document.createElement('a');
    link.download = 'cherry_playlist.png';
    link.href = canvas.toDataURL();
    link.click();
    alert('📸 Imagem da playlist salva! Compartilhe com as amigas.');
  });
});

// ==========================================
// 💄 LOOKS + TEMA DINÂMICO (sem modo noturno)
// ==========================================
const lookCards = document.querySelectorAll('.look-card');
const toast = document.getElementById('aesthetic-alert');
const fillGlitter = document.getElementById('fill-glitter');
const fillRockstar = document.getElementById('fill-rockstar');
const labelGlitter = document.getElementById('label-glitter');
const labelRockstar = document.getElementById('label-rockstar');
const defaultBackground = "radial-gradient(circle at top, #3a1330, #120812 40%, #09040d)";

function playPopSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.2;
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
  oscillator.stop(audioCtx.currentTime + 0.3);
}
function aplicarTemaDinamico(aestheticName, glitterVal, rockstarVal) {
  fillGlitter.style.width = `${glitterVal}%`;
  fillRockstar.style.width = `${rockstarVal}%`;
  labelGlitter.innerText = `glitter level: ${glitterVal}%`;
  labelRockstar.innerText = `rockstar energy: ${rockstarVal}%`;
  let tempColor = "";
  if (aestheticName === "Sad Glam") tempColor = "#2a102f";
  else if (aestheticName === "Rockstar") tempColor = "#3d0814";
  else if (aestheticName === "Indie Rebel") tempColor = "#132515";
  document.body.style.background = tempColor;
  const radioPlayer = document.querySelector('.radio-player');
  const btns = document.querySelectorAll('.primary-btn, .secondary-btn');
  if (radioPlayer) radioPlayer.style.boxShadow = `0 0 25px ${glitterVal > 80 ? '#ff3ca6' : '#c1123f'}`;
  btns.forEach(btn => btn.style.transform = 'scale(0.98)');
  setTimeout(() => {
    document.body.style.background = defaultBackground;
    if (radioPlayer) radioPlayer.style.boxShadow = '';
    btns.forEach(btn => btn.style.transform = '');
  }, 2000);
  toast.innerText = `Estética "${aestheticName}" aplicada! 🍒`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
  playPopSound();
}
lookCards.forEach(card => {
  const btn = card.querySelector('.look-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const aestheticName = card.getAttribute('data-aesthetic');
    const glitterVal = card.getAttribute('data-glitter');
    const rockstarVal = card.getAttribute('data-rockstar');
    aplicarTemaDinamico(aestheticName, glitterVal, rockstarVal);
  });
});

// ==========================================
// 📖 DIÁRIO + ESTATÍSTICAS + EXPORT/IMPORT + BROADCAST
// ==========================================
const saveDiaryBtn = document.getElementById('save-diary-btn');
const diaryTitleInput = document.getElementById('diary-title');
const diaryContentInput = document.getElementById('diary-content');
const diaryList = document.getElementById('diary-list');

saveDiaryBtn.addEventListener('click', async () => {

  if (!currentUser) return;

  const title =
    diaryTitleInput.value.trim();

  const content =
    diaryContentInput.value.trim();

  if (!title || !content) {
    alert("🍒 Preencha tudo antes de salvar.");
    return;
  }

  const response = await fetch(
    "/api/diario",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        uid: currentUser.uid,
        title,
        content
      })
    }
  );

  const data =
    await response.json();

  if (!data.success) {
    alert("Erro ao salvar.");
    return;
  }

  diaryTitleInput.value = "";
  diaryContentInput.value = "";

  await ouvirDiarioBanco(
    currentUser.uid
  );

  atualizarEstatisticasDiario();
});

async function ouvirDiarioBanco(uid) {

  const response =
    await fetch(`/api/diario/${uid}`);

  const posts =
    await response.json();

  const originalCards = `
    <div class="diary-card">
      <h4>“Pretty isn’t enough”</h4>
      <p>Uma análise sobre como músicas pop escondem sentimentos atrás do glitter.</p>
    </div>

    <div class="diary-card">
      <h4>“Lipstick & heartbreaks”</h4>
      <p>A estética rebelde dos anos 2000 e a cultura emo glam.</p>
    </div>
  `;

  let dynamicCards = "";

  posts.forEach(post => {

    dynamicCards += `
      <div class="diary-card dynamic-card">

        <button
          class="delete-diary-btn"
          onclick="deletarRegistroLocal('${post.id}')">
          🗑️
        </button>

        <h4>“${post.title}”</h4>

        <p>${post.content}</p>

      </div>
    `;

  });

  diaryList.innerHTML =
    originalCards + dynamicCards;
}
window.deletarRegistroLocal = async function(postId) {

  if (!confirm("🍒 Deseja apagar este pensamento?"))
    return;

  await fetch(`/api/diario/${postId}`, {
    method: "DELETE"
  });

  await ouvirDiarioBanco(
    currentUser.uid
  );

  atualizarEstatisticasDiario();
};

async function atualizarEstatisticasDiario() {

  if (!currentUser) return;

  const response =
    await fetch(`/api/diario/${currentUser.uid}`);

  const userPosts =
    await response.json();

  const total =
    userPosts.length;

  const totalChars =
    userPosts.reduce(
      (acc, p) =>
        acc + (p.title + p.content).length,
      0
    );

  const avgLen =
    total
      ? (totalChars / total).toFixed(0)
      : 0;

  const words =
    userPosts.flatMap(
      p =>
        (p.title + " " + p.content)
          .toLowerCase()
          .split(/\s+/)
    );

  const freq = {};

  words.forEach(w => {
    if (w.length > 3)
      freq[w] = (freq[w] || 0) + 1;
  });

  let mostCommon = "glitter";
  let maxFreq = 0;

  for (let w in freq) {

    if (freq[w] > maxFreq) {

      maxFreq = freq[w];
      mostCommon = w;

    }

  }

  const statsDiv =
    document.getElementById(
      'diary-stats'
    );

  statsDiv.innerHTML = `
    <div class="stat-card">
      📝 ${total} segredos guardados
    </div>

    <div class="stat-card">
      ✍️ Média de ${avgLen} caracteres
    </div>

    <div class="stat-card">
      💬 Palavra mais usada:
      "${mostCommon}"
    </div>
  `;
}

document.getElementById('export-data-btn')?.addEventListener('click', () => {
  const exportData = {
    users: getLocalUsers(),
    diaryPosts: JSON.parse(localStorage.getItem('cherry_diary_posts')) || [],
    customTapes: customTapes,
    lastStation: localStorage.getItem('cherry_last_station')
  };
  const blob = new Blob([JSON.stringify(exportData)], {type: 'application/json'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `cherry_backup_${currentUser.uid}.json`;
  link.click();
});
document.getElementById('import-data-btn')?.addEventListener('click', () => {
  document.getElementById('import-file-input').click();
});
document.getElementById('import-file-input')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.users) saveLocalUsers(data.users);
      if (data.diaryPosts) localStorage.setItem('cherry_diary_posts', JSON.stringify(data.diaryPosts));
      if (data.customTapes) { customTapes = data.customTapes; localStorage.setItem('cherry_custom_tapes', JSON.stringify(customTapes)); carregarFitasPersonalizadas(); }
      if (data.lastStation) localStorage.setItem('cherry_last_station', data.lastStation);
      alert('✅ Backup restaurado! Recarregue a página para aplicar completamente.');
      location.reload();
    } catch(e) { alert('❌ Arquivo inválido'); }
  };
  reader.readAsText(file);
});

// ==========================================
// 🔄 SINCRONIZAÇÃO ENTRE ABAS (BroadcastChannel)
// ==========================================
let broadcastChannel;
function iniciarBroadcastChannel() {
  if (broadcastChannel) broadcastChannel.close();
  broadcastChannel = new BroadcastChannel('cherry_sync');
  broadcastChannel.onmessage = (event) => {
    if (event.data.type === 'diario' && event.data.uid === currentUser?.uid) {
      ouvirDiarioBanco(currentUser.uid);
      atualizarEstatisticasDiario();
    }
  };
}
function enviarMensagemBroadcast(msg) {
  if (broadcastChannel) broadcastChannel.postMessage(msg);
}

// ==========================================
// 🐣 EASTER EGGS (sadglam / rockstar)
// ==========================================
let keyBuffer = "";
document.addEventListener('keydown', (e) => {
  keyBuffer += e.key.toLowerCase();
  keyBuffer = keyBuffer.slice(-8);
  if (keyBuffer.includes("sadglam")) {
    alert("✨🌸 Modo Sad Glam ativado! Glitter no ar.");
    for(let i=0;i<30;i++) criarConfete();
  } else if (keyBuffer.includes("rockstar")) {
    alert("🎸⚡ ROCKSTAR ENERGY! Toque um riff mental.");
    for(let i=0;i<40;i++) criarConfete();
  }
});
function criarConfete() {
  const conf = document.createElement('div');
  conf.innerText = ['🍒','✨','🎸','💄','🎧'][Math.floor(Math.random()*5)];
  conf.style.position = 'fixed';
  conf.style.left = Math.random() * window.innerWidth + 'px';
  conf.style.top = '-20px';
  conf.style.fontSize = '24px';
  conf.style.pointerEvents = 'none';
  conf.style.zIndex = 99999;
  document.body.appendChild(conf);
  let pos = 0;
  const fall = setInterval(() => {
    pos += 5;
    conf.style.top = pos + 'px';
    if (pos > window.innerHeight) { clearInterval(fall); conf.remove(); }
  }, 30);
  setTimeout(() => conf.remove(), 3000);
}

// ==========================================
// ✨ MODO ONLY GLITTER (toggle)
// ==========================================
const glitterToggle = document.getElementById('glitter-mode-toggle');
glitterToggle.addEventListener('click', () => {
  document.body.classList.toggle('glitter-mode');
  localStorage.setItem('cherry_glitter_mode', document.body.classList.contains('glitter-mode'));
});
if (localStorage.getItem('cherry_glitter_mode') === 'true') document.body.classList.add('glitter-mode');



// ==========================================
// 🚀 INICIALIZAÇÃO
// ==========================================
window.addEventListener("load", () => {
  verificarSessaoAtiva();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(() => console.log("✅ SW")).catch(err => console.log("❌ SW", err));
  }
  // ==========================================
// 🍒 SPLASH SCREEN
// ==========================================

window.addEventListener("load", () => {

  setTimeout(() => {

    const splash = document.getElementById("splash-screen");

    if(splash){
      splash.classList.add("hide");

      setTimeout(() => {
        splash.remove();
      }, 800);
    }

  }, 2000);

});
});
