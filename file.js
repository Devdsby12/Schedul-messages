const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");

// ======= USER SETTINGS
const contactNumber = "911234567890@c.us";
const messageTime = "2025-10-06 00:00:01";
const birthdayMessage = " Message here------------------------------------- ";


// Convert messageTime (IST) to UTC time for scheduling
function getISTDateTime(str) {
  const [datePart, timePart] = str.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const localDate = new Date(year, month - 1, day, hour, minute, second);
  const utcTime = localDate.getTime() - (5.5 * 60 * 60 * 1000);
  return new Date(utcTime);
}

const scheduleDate = getISTDateTime(messageTime);

// Create WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] }
});

// QR login
client.on("qr", qr => {
  console.log("📱 Scan this QR code with your WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("whatsApp connected");

  const displayTime = new Date(scheduleDate.getTime() + (5.5 * 60 * 60 * 1000));
  console.log(` Message scheduled for (IST): ${displayTime}`);

  schedule.scheduleJob(scheduleDate, async () => {
    try {
      await client.sendMessage(contactNumber, birthdayMessage);
      console.log("🎉 Birthday message sent successfully!");
    } catch (err) {
      console.error(" Failed to send message:", err);
    }
  });
});

client.initialize();
