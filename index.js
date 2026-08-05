require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Fuse = require("fuse.js");
const fs = require("fs");
const { getTodayBans } = require("./banwaveMonitor");
const BAN_HISTORY_FILE = "./banHistory.json";
const responses = require("./data/responses");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');

const path = require('path');
const AUDIO_PATH = path.join(__dirname, "audio");

const goodbyeSounds = fs.readdirSync(
    path.join(AUDIO_PATH, "goodbyeSounds")
);

const TARGET_VC_ID = '1532406221565460573';
const BANWAVE_CHANNEL_ID = "1533568957875748944";
const BAN_ALERT_CHANNEL_ID = "1533601673698611360";

let lastStatus = null;
let lastBans = null;
let banwaveMessage = null;
let banHistory = loadBanHistory();

function loadBanHistory() {
    if (!fs.existsSync(BAN_HISTORY_FILE)) {
        fs.writeFileSync(BAN_HISTORY_FILE, "[]", "utf8");
        return [];
    }

    try {
        return JSON.parse(fs.readFileSync(BAN_HISTORY_FILE, "utf8"));
    } catch (err) {
        console.error("Failed to load ban history:", err);
        return [];
    }
}

function saveBanHistory() {
    fs.writeFileSync(
        BAN_HISTORY_FILE,
        JSON.stringify(banHistory, null, 2)
    );
}

const client = new Client({
    intents: [
       GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});



async function deleteOldBanwaveStatus() {
    const channel = client.channels.cache.get(BANWAVE_CHANNEL_ID);

    if (!channel) return;

    try {
        const messages = await channel.messages.fetch({ limit: 20 });

        const oldMessages = messages.filter(msg =>
            msg.author.id === client.user.id &&
            msg.embeds.length > 0 &&
            msg.embeds[0].footer?.text === "GTAVCheatz • Automatic BattlEye Monitor"
        );

        for (const msg of oldMessages.values()) {
            await msg.delete().catch(() => {});
        }

        console.log(`Deleted ${oldMessages.size} old banwave status messages`);

    } catch (err) {
        console.error("Failed deleting old banwave messages:", err);
    }
}






async function checkBanwave() {

    const bans = await getTodayBans();

const now = Date.now();

banHistory.push({
    time: now,
    bans: bans
});

// Poistetaan yli tunnin vanhat mittaukset
banHistory = banHistory.filter(
    x => now - x.time <= 60 * 60 * 1000
);

saveBanHistory();

const oldest = banHistory[0];

const increase = oldest ? bans - oldest.bans : 0;

let status;

if (increase >= 5) {
    status = "banwave";
}
else if (increase >= 2) {
    status = "elevated";
}
else {
    status = "normal";
}

    const oldStatus = lastStatus;
lastStatus = status;

if (
    status !== oldStatus &&
    (status === "elevated" || status === "banwave")
) {

    const alertChannel = client.channels.cache.get(BAN_ALERT_CHANNEL_ID);

    if (alertChannel) {

        const alertEmbed = new EmbedBuilder()
            .setColor(
                status === "banwave"
                    ? "#E74C3C"
                    : "#F39C12"
            )
            .setTitle(
                status === "banwave"
                    ? "🚨 Possible Ban Wave Detected"
                    : "🟠 Elevated BattlEye Activity"
            )
            .setDescription(
`BattlEye activity has increased.

📊 **Statistics**
• Today's Bans: **${bans}**
• Status: **${status.toUpperCase()}**

🕒 Detected: <t:${Math.floor(Date.now() / 1000)}:F>`
            )
            .setFooter({
                text: "GTAVCheatz • Moderator Alert"
            });

        alertChannel.send({
            embeds: [alertEmbed]
        });
    }
}

const channel = client.channels.cache.get(BANWAVE_CHANNEL_ID);

    if (!channel) return;

    // embedit jatkuvat tästä normaalisti...

    let embed;

    if (status === "normal") {

        embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("🟢 BattlEye Status: Normal")
            .setDescription(
`BattlEye ban activity is currently within the normal range.

## 📊 Statistics
• **Today's Bans:** ${bans}
• **Risk Level:** Low
• **Status:** Normal Activity

## ℹ️ Information
No unusual increase in BattlEye bans has been detected.

While the current activity appears normal, using any mod menu always carries a risk of suspension or permanent account bans.

The GTAVCheatz monitoring system will continue tracking BattlEye activity and automatically notify you of any significant changes.`
            )
            .addFields({
    name: "🕒 Last Checked",
    value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
    inline: true
})
            .setFooter({
                text: "GTAVCheatz • Automatic BattlEye Monitor"
            })
            .setTimestamp();

    }

    if (status === "elevated") {

        embed = new EmbedBuilder()
            .setColor("#F39C12")
            .setTitle("🟠 BattlEye Status: Elevated")
            .setDescription(
`BattlEye ban activity is higher than normal.

## 📊 Statistics
• **Today's Bans:** ${bans}
• **Risk Level:** Medium
• **Status:** Elevated Activity

## ⚠️ Recommendation
• Be cautious when joining GTA Online.
• Avoid unnecessary money recoveries or risky features.
• If possible, wait until ban activity returns to normal.

This is **not necessarily a ban wave**, but increased BattlEye activity has been detected.`
            )
            .addFields({
    name: "🕒 Last Checked",
    value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
    inline: true
})
            .setFooter({
                text: "GTAVCheatz • Automatic BattlEye Monitor"
            })
            .setTimestamp();

    }

    if (status === "banwave") {

        embed = new EmbedBuilder()
            .setColor("#E74C3C")
            .setTitle("🚨 Possible BattlEye Ban Wave Detected")
            .setDescription(
`A significant increase in BattlEye bans has been detected.

## 📊 Statistics
• **Today's Bans:** ${bans}
• **Risk Level:** Very High
• **Status:** Possible Ban Wave

## 🚨 Recommendation
We strongly recommend **avoiding GTA Online** until ban activity decreases.

Using any mod menu during periods of unusually high BattlEye activity may significantly increase the risk of account suspension or permanent bans.

Our monitoring system will continue tracking the situation and automatically post updates when the status changes.`
            )
            .addFields({
    name: "🕒 Last Checked",
    value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
    inline: true
})
            .setFooter({
                text: "GTAVCheatz • Automatic BattlEye Monitor"
            })
            .setTimestamp();

    }

    if (!banwaveMessage) {
    banwaveMessage = await channel.send({ embeds: [embed] });
} else {
    await banwaveMessage.edit({ embeds: [embed] });
}
}









client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    await deleteOldBanwaveStatus(); // poistaa vanhan statusviestin
    await checkBanwave();            // lähettää uuden

    setInterval(checkBanwave, 10 * 60 * 1000);
});

function resetInactivityTimer(channelId) {

    // Poista vanhat ajastimet
    const old = inactivityTimers.get(channelId);

    if (old) {
        clearTimeout(old.reminder);
        clearTimeout(old.leave);
    }

    // 2 min -> muistutus
    const reminder = setTimeout(() => {

        const channel = client.channels.cache.get(channelId);

        if (channel) {
            channel.send(
                "👋 Are you still there? If you still need help, just send a message in chat."
            );
        }

    }, 120000);

    // 5 min -> poistu
    const leave = setTimeout(() => {

        const player = players.get(channelId);
        const connection = connections.get(channelId);

        if (!player || !connection) return;

        player.stop(true);

        const randomGoodbye =
            goodbyeSounds[Math.floor(Math.random() * goodbyeSounds.length)];

        player.play(
            createAudioResource(
                path.join(AUDIO_PATH, "goodbyeSounds", randomGoodbye)
            )
        );

        player.once(AudioPlayerStatus.Idle, () => {

            connection.destroy();

            connections.delete(channelId);
            players.delete(channelId);
            timeouts.delete(channelId);
            chatMode.delete(channelId);
            inactivityTimers.delete(channelId);

        });

    }, 300000);

    inactivityTimers.set(channelId, {
        reminder,
        leave
    });
}

const connections = new Map();
const players = new Map();
const timeouts = new Map();
const chatMode = new Map();
const inactivityTimers = new Map();


const unknownReplies = require("./data/unknownReplies");
const goodbyeKeywords = require("./data/goodbyeKeywords");
const introReplies = require("./data/introReplies");
const welcomeSounds = fs.readdirSync(
    path.join(AUDIO_PATH, "welcomeSounds")
);

   
const keywords = responses.flatMap(r => r.triggers);

const fuse = new Fuse(keywords, {
    includeScore: true,
    threshold: 0.35
});
    
const eliteKeywords = [
    "elite",
    "cheatz elite",
    "cheatzelite"
];

client.on('messageCreate', async (message) => {
    
    if (message.author.bot) return;


    // Vastaa vain Support VC:n chatissa
    if (message.channel.id !== TARGET_VC_ID) return;

    const content = message.content.toLowerCase();
    resetInactivityTimer(TARGET_VC_ID);

    if (eliteKeywords.some(word => content.includes(word))) {

    const player = players.get(TARGET_VC_ID);

    if (player) {

        const ids = timeouts.get(TARGET_VC_ID);

        if (ids) {
            ids.forEach(clearTimeout);
            timeouts.delete(TARGET_VC_ID);
        }

        player.stop(true);

        player.play(
            createAudioResource(
                path.join(AUDIO_PATH, "elite.mp3")
            )
        );
    }

    return;
}


   if (goodbyeKeywords.some(keyword => content.includes(keyword))) {

    const player = players.get(TARGET_VC_ID);
    const connection = connections.get(TARGET_VC_ID);

    // Peru mahdolliset ajastetut äänet
    const ids = timeouts.get(TARGET_VC_ID);
    if (ids) {
        ids.forEach(clearTimeout);
        timeouts.delete(TARGET_VC_ID);
    }

    if (player) {
        player.stop(true);

        const randomGoodbye =
            goodbyeSounds[Math.floor(Math.random() * goodbyeSounds.length)];

        player.play(
            createAudioResource(
                path.join(AUDIO_PATH, "goodbyeSounds", randomGoodbye)
            )
        );

        // Poistu VC:stä kun goodbye.mp3 on loppunut
        player.once(AudioPlayerStatus.Idle, () => {
            if (connection) {
                connection.destroy();
                connections.delete(TARGET_VC_ID);
                players.delete(TARGET_VC_ID);
                chatMode.delete(TARGET_VC_ID);
            }
        });
    }

    return;
}

    for (const response of responses) {

     if (!response.triggers.includes(content)) continue;

        const player = players.get(TARGET_VC_ID);

        // Peru tulevat äänet
        const ids = timeouts.get(TARGET_VC_ID);
        if (ids) {
            ids.forEach(clearTimeout);
            timeouts.delete(TARGET_VC_ID);
        }

        if (player && !chatMode.get(TARGET_VC_ID)) {

            chatMode.set(TARGET_VC_ID, true);

            player.stop(true);

            player.play(
                createAudioResource(path.join(AUDIO_PATH, "continue.mp3"))
            );

            const intro = introReplies[Math.floor(Math.random() * introReplies.length)];

setTimeout(async () => {

    await message.reply(intro);

    setTimeout(() => {
        message.reply(response.reply);
    }, 800);

}, 5000);

        } else {
            message.reply(response.reply);
        }

        return;
    }

    const result = fuse.search(content);

if (result.length > 0) {

    return message.reply(
        `🤔 Did you mean **${result[0].item}**?`
    );

}

const randomReply =
    unknownReplies[Math.floor(Math.random() * unknownReplies.length)];

message.reply(randomReply);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    const joined = newState.channelId;
    const left = oldState.channelId;

    const channel = newState.guild.channels.cache.get(TARGET_VC_ID);

    if (!channel) return;

    // ===== USER JOINS TARGET VC =====
    if (joined === TARGET_VC_ID) {

        console.log('Someone joined target VC');

        // jos botti ei ole jo kanavassa, liity
        if (!connections.has(TARGET_VC_ID)) {
            
            chatMode.set(TARGET_VC_ID, false);

           const connection = joinVoiceChannel({
    channelId: TARGET_VC_ID,
    guildId: newState.guild.id,
    adapterCreator: newState.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false
});
            connections.set(TARGET_VC_ID, connection);
            resetInactivityTimer(TARGET_VC_ID);
            // (valinnainen) ääni kun ensimmäinen liittyy
           const player = createAudioPlayer();
connection.subscribe(player);

players.set(TARGET_VC_ID, player);

// 1. sound1 heti
const randomWelcome =
    welcomeSounds[Math.floor(Math.random() * welcomeSounds.length)];

player.play(
    createAudioResource(
        path.join(AUDIO_PATH, "welcomeSounds", randomWelcome)
    )
);

const timeout1 = setTimeout(() => {
    player.play(createAudioResource(path.join(AUDIO_PATH, "sound2.mp3")));
}, 15000);

const timeout2 = setTimeout(() => {
    player.play(createAudioResource(path.join(AUDIO_PATH, "sound3.mp3")));
}, 37000);

timeouts.set(TARGET_VC_ID, [timeout1, timeout2]);
        }
    }

    // ===== CHECK IF CHANNEL IS EMPTY =====
  setTimeout(async () => {
    const voiceChannel = newState.guild.channels.cache.get(TARGET_VC_ID);

    if (!voiceChannel) return;

    // Lasketaan vain ihmiset, ei botteja
    const humans = voiceChannel.members.filter(member => !member.user.bot);

    console.log(`Humans in channel: ${humans.size}`);

    if (humans.size === 0) {
    console.log("Channel empty, leaving.");

    try {
        const messages = await channel.messages.fetch({ limit: 100 });
        await channel.bulkDelete(messages, true);
        console.log("VC chat cleaned.");
    } catch (err) {
        console.error(err);
    }

    const connection = connections.get(TARGET_VC_ID);

    if (connection) {
        connection.destroy();
        connections.delete(TARGET_VC_ID);
        players.delete(TARGET_VC_ID);
        timeouts.delete(TARGET_VC_ID);
        chatMode.delete(TARGET_VC_ID);
    }
}
}, 2000);

});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "say") {

        // Vain omistaja
        if (interaction.user.id !== "1130477369115824169") {
            return interaction.reply({
                content: "❌ You do not have permission to use this command.",
                ephemeral: true
            });
        }

        const message = interaction.options.getString("message");

        await interaction.reply({
            content: "✅ Message sent.",
            ephemeral: true
        });

        await interaction.channel.send(message);
    }
});




client.login(process.env.TOKEN);