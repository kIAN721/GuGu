/* ==========================================================
     3. Two-Stage Envelope Transition & Typewriter Animation
  ========================================================== */
  const envelopeStage = document.getElementById('envelope-stage');
  const envelope = document.getElementById('envelope');
  const flap = document.getElementById('envelope-flap');
  const wax = document.getElementById('wax-seal');
  const tapHint = document.getElementById('tap-hint');
  const letterBox = document.getElementById('letter-container');
  const typewriter = document.getElementById('typewriter');
  
  const message = 
    "တစ်ကယ်တော့လေ ဘာပြောရမှန်းမသိဘူး အများကြီးပြောမိရင်လည်း စိတ်ရှုပ်မှာစိုးရိမ်တယ်. " +
    "တစ်ရက်ကလေးမှမမေ့ခဲ့ပါဘူးနော် ကုကုလေးကိုအများကြီးလွမ်းပြီး သတိရနေတာ🥺. " +
    "ပြောရင်တော့ရယ်စရာကြီး ဒါမဲ့ဝမ်ဝမ်း ကုကိုစလိုက်ရင် ကုဝမ်ဝမ်းကိုထိုးတာလေးလည်းလွမ်းတယ်🥹🙏. " +
    "အလုပ်လုပ်တာလည်း 加油👊🏻နော် အရမ်းလည်း ကိုယ့်ကိုယ်ကိုတွန်းအားမပေးနဲ့နော်✨. " +
    "ကဲကဲ အများကြီးမပြောတော့ပါဘူး သဘောကျပြီးပြုံးသွားတာဆိုရင်ပဲအများကြီးကျေနပ်ပါပြီဗျာ ကုကု💞.";
  
  let opened = false;
  
  function triggerOpen(e) {
    if (e) e.stopPropagation();
    if (opened) return;
    opened = true;
  
    // Play sound & start background melody
    audio.playChimeChord();
    if (!audio.isPlaying) {
      audio.start();
    }
  
    // Visual open triggers
    if (wax) wax.classList.add('broken');
    if (flap) flap.classList.add('opened');
    if (tapHint) tapHint.style.opacity = '0';
  
    // Transition to stage 2
    setTimeout(() => {
      if (envelopeStage) envelopeStage.classList.add('fade-out');
      
      setTimeout(() => {
        if (envelopeStage) envelopeStage.style.display = 'none';
        if (letterBox) letterBox.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
  
        setTimeout(() => {
          if (letterBox) letterBox.classList.add('fade-in');
          typewrite();
          initScratch();
        }, 50);
      }, 600);
    }, 850);
  }
  
  if (envelope) envelope.addEventListener('click', triggerOpen);
  if (wax) wax.addEventListener('click', triggerOpen);
  
  function typewrite() {
    if (!typewriter) return;
    let i = 0;
    typewriter.textContent = "";
    const timer = setInterval(() => {
      if (i < message.length) {
        typewriter.textContent += message.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 28);
  }
  
  /* ==========================================================
     4. Scratch-off Canvas
  ========================================================== */
  function initScratch() {
    const sCanvas = document.getElementById('scratch-canvas');
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext('2d');
    const rect = sCanvas.getBoundingClientRect();
    sCanvas.width = rect.width || 300;
    sCanvas.height = rect.height || 120;
  
    sCtx.fillStyle = '#CBD5E1';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    sCtx.fillStyle = '#64748B';
    sCtx.font = 'bold 13px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('✨ Rub here to reveal ✨', sCanvas.width / 2, sCanvas.height / 2 + 5);
  
    let isScratching = false;
    function scratch(e) {
      if (!isScratching) return;
      const box = sCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - box.left;
      const y = clientY - box.top;
  
      sCtx.globalCompositeOperation = 'destination-out';
      sCtx.beginPath();
      sCtx.arc(x, y, 18, 0, Math.PI * 2);
      sCtx.fill();
    }
  
    sCanvas.addEventListener('mousedown', () => isScratching = true);
    sCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
    window.addEventListener('mouseup', () => isScratching = false);
    window.addEventListener('touched', () => isScratching = false);
    sCanvas.addEventListener('mousemove', scratch);
    sCanvas.addEventListener('touchmove', scratch);
  }

/* ==========================================================
   5. Runaway "No" Button & Success Modal
========================================================== */
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

let escapeAttempts = 0;
// These are the funny messages that will cycle through as she tries to click "No"
const quips = [
  "Nice try! 😉", 
  "Almost got it! 🏃💨", 
  "Try the other button! 🌹", 
  "No isn't an option today! 💖",
  "Think again! 🙈",
  "Nope, try the big red one! ✨"
];

function evade(e) {
  if (e) e.preventDefault();
  escapeAttempts++;
  
  // Calculate a random distance to jump away
  const rx = (Math.random() - 0.5) * 220;
  const ry = (Math.random() - 0.5) * 80;
  
  // Move the button using CSS transform
  noBtn.style.transform = `translate(${rx}px, ${ry}px)`;
  
  // If you want to show text right under or next to it, 
  // you can dynamically create a small floating quip or alert!
  showFloatingQuip(quips[escapeAttempts % quips.length], e);
}

// Optional: Creates a cute floating text bubble where she tried to click
function textBubble(text, clientX, clientY) {
  const bubble = document.createElement('div');
  bubble.textContent = text;
  bubble.style.position = 'fixed';
  bubble.style.left = `${clientX}px`;
  bubble.style.top = `${clientY - 20}px`;
  bubble.style.background = '#ffffff';
  bubble.style.color = '#E11D48';
  bubble.style.padding = '4px 10px';
  bubble.style.borderRadius = '12px';
  bubble.style.fontSize = '12px';
  bubble.style.fontWeight = 'bold';
  bubble.style.boxShadow = '0 4px 12px rgba(225,29,72,0.15)';
  bubble.style.zIndex = '1000';
  bubble.style.pointerEvents = 'none';
  bubble.style.transition = 'all 1.5s ease-out';
  
  document.body.appendChild(bubble);
  
  setTimeout(() => {
    bubble.style.transform = 'translateY(-30px)';
    bubble.style.opacity = '0';
  }, 50);

  setTimeout(() => {
    bubble.remove();
  }, 600);
}

function showFloatingQuip(text, e) {
  const clientX = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
  const clientY = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
  textBubble(text, clientX, clientY);
}

// Desktop hover trigger
noBtn.addEventListener('mouseover', evade);
// Mobile touch trigger
noBtn.addEventListener('touchstart', evade);
// Fallback click trigger just in case she manages to tap it
noBtn.addEventListener('click', evade);

yesBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

modalCloseBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});