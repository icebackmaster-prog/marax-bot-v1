// plugins/ping.js — Animated ping with fancy borders for Marax Md
const name = "ping";
const category = "system";
const help = "Check bot response speed with a loading animation.";

const BORDERS = {
  top: "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
  mid: "┃                                    ┃",
  bot: "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
};

async function run({ m, sock, reply }) {
  // Best JID extraction for different frameworks
  const from = m.key?.remoteJid || m.chat;

  // Store start time (before any processing)
  const start = Date.now();

  // 1. Send initial loading message
  const loadMsg = await sock.sendMessage(from, {
    text: `${BORDERS.top}
┃      🚀 PINGING MARAX MD...      ┃
┃  ░░░░░░░░░░░░░░░░░░░░░░░░  0%   ┃
${BORDERS.bot}`,
  });

  // 2. Animated progress (edit message)
  const frames = [
    { bar: "█░░░░░░░░░░░░░░░░░░░░░", percent: "10%", delay: 200 },
    { bar: "████░░░░░░░░░░░░░░░░░░", percent: "30%", delay: 200 },
    { bar: "█████████░░░░░░░░░░░░░", percent: "50%", delay: 200 },
    { bar: "██████████████░░░░░░░░", percent: "70%", delay: 200 },
    { bar: "███████████████████░░░", percent: "90%", delay: 200 },
    { bar: "██████████████████████", percent: "100%", delay: 200 },
  ];

  for (const frame of frames) {
    await new Promise(res => setTimeout(res, frame.delay));
    await sock.sendMessage(from, {
      text: `${BORDERS.top}
┃      🚀 PINGING MARAX MD...      ┃
┃  ${frame.bar}  ${frame.percent}  ┃
${BORDERS.bot}`,
      edit: loadMsg.key,
    });
  }

  // 3. Calculate final latency
  const latency = Date.now() - start;

  // 4. Fancy final result
  let speedText;
  if (latency < 100) speedText = "⚡ BLAZING FAST ⚡";
  else if (latency < 300) speedText = "✅ FAST";
  else if (latency < 600) speedText = "⚠️ AVERAGE";
  else speedText = "🐌 SLOW";

  const finalMsg = `${BORDERS.top}
┃          📡 PING RESULT          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃   ⏱️ Response : ${latency} ms ${speedText.padEnd(6)} ┃
┃   🖥️ Node.js   : ${process.version}               ┃
┃   🧠 Platform  : ${process.platform.padEnd(15)} ┃
${BORDERS.bot}
💀 _Marax Md is alive and ready._`;

  await sock.sendMessage(from, {
    text: finalMsg,
    edit: loadMsg.key,
  });
}

module.exports = { name, category, help, run };
