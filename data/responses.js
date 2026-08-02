module.exports = [
    {
        triggers: ["setup"],
        reply:
`**Setup Help Menu**

Please type one of the following options you need help with:

• installation
• inject / crash / game crashes
• err_gfx_state / gfx error
• battleye / battle eye
• battleye timeout / kicked from battleye`
    },

    {
        triggers: ["installation"],
        reply:
`**How to Install the ModMenu**

📺 **There is a detailed tutorial available on our YouTube channel!**

🔗 **Watch the tutorial here:**
https://www.youtube.com/@GtaVcheatz/

📋 **After watching the tutorial:**
• If you still have questions, feel free to ask me again.
• Or contact a **Moderator** for further assistance.

Good luck! 🚀`
    },

    {
    triggers: ["crash", "game crashes"],
    reply:
`# 💥 Game Crash Troubleshooting

When does your game crash?

If it crashes **while injecting**:

• Disable Frame Generation.
• Disable Ray Tracing.
• Lower graphics settings.

If it crashes **after loading into the game**:

• Verify your game files.
• Update your GPU drivers.
• Restart your PC.
• Make sure you're using the latest version of the menu.

If it crashes **every time**:

• Disable your antivirus temporarily.
• Restore any quarantined menu files.
• Reinstall the menu if necessary.

## Still having problems?

Reply with one of these:

• inject
• err_gfx_state
• drivers
• verify files
• support`
},

    {
        triggers: ["money"],
        reply:
`**Money Making Guide**

https://www.youtube.com/watch?v=AeHv2Cz0RNs

Go to 4:40 in the video.`
    },
    {
    triggers: ["cheat engine", "cheatengine"],
    reply:
`Run Cheat Engine as Administrator.

Use the latest version.

Restart your PC if needed.`
},
{
    triggers: ["battleye", "battle eye"],
    reply:
`Turn BattlEye off before using the menu.

If you're in timeout, wait up to 24 hours.`
},
{
    triggers: ["err_gfx_state", "gfx error"],
    reply:
`**ERR_GFX_STATE - Troubleshooting**

This error is related to graphics settings. Please follow these steps:

**Step 1:** Turn off Frame Generator and Raytracing in your Graphics Settings.
**Step 2:** If the problem still occurs, gradually lower all of your graphics settings (e.g., Texture Quality, Shadows, Reflections).
**Step 3:** Restart your game and try injecting again.

If the error persists, please contact a moderator with your system information (GPU, RAM, Driver Version).`
},
{
    triggers: ["battleye timeout", "kicked from battleye"],
    reply:
`**BattlEye Timeout - Information**

This usually means you've been temporarily flagged by BattlEye.

**What to do:**
• Wait up to 24 hours
• Do not attempt to bypass anti-cheat during this time

If the issue continues after 24 hours, contact a moderator.`
},
{
    triggers: ["help", "commands", "menu"],
    reply:
`**📖 Cheatz Helper Commands**

Type one of the following keywords in this channel:

🔧 **Installation**
• installation
• setup

🎮 **Game Issues**
• inject
• crash
• game crashes
• err_gfx_state
• gfx error
• fps
• stuck loading
• crash on startup

🛡️ **BattlEye**
• battleye
• battle eye
• battleye timeout
• kicked from battleye

💰 **Guides**
• money
• cheat engine

🖥️ **System**
• antivirus
• windows defender
• virus
• false positive
• drivers
• update
• verify files

❓ **Support**
• support
• faq
• status

If your issue isn't listed, please create a support ticket or contact a moderator.`
},
{
    triggers: ["fps", "low fps"],
    reply:
`**Low FPS - Troubleshooting**

• Lower your graphics settings.
• Update your GPU drivers.
• Close unnecessary background programs.
• Disable overlays (Discord, GeForce Experience, MSI Afterburner, etc.).
• Restart your PC if performance suddenly became worse.`
},
{
    triggers: ["antivirus", "windows defender"],
    reply:
`**Windows Defender / Antivirus**

Some antivirus programs may quarantine or delete files used by the mod menu.

Please check your antivirus quarantine and restore any removed files if you trust the source.

After restoring them, add the folder to your antivirus exclusions before extracting or launching the menu again.`
},
{
    triggers: ["virus", "false positive"],
    reply:
`**Virus Detection**

Many game modification tools trigger antivirus software because of the techniques they use.

Always download the menu from the official source only.

If your antivirus detects it, compare the file with the official release and contact staff if you're unsure.`
},
{
    triggers: ["update"],
    reply:
`**Game Update**

If GTA V has recently received an update, the mod menu may stop working until it is updated.

Please wait for an official announcement before trying again.`
},
{
    triggers: ["support"],
    reply:
`**Support**

If none of the automatic solutions fix your issue, please contact a moderator.

When asking for help, include:

• Your Windows version
• GPU
• Error message
• Screenshot (if possible)
• A description of what you've already tried

This helps us solve your issue much faster.`
},
{
    triggers: ["drivers", "gpu drivers", "driver"],
    reply:
`**GPU Drivers**

Outdated graphics drivers can cause crashes, poor performance, or injection issues.

**NVIDIA**
• Update through the NVIDIA App or GeForce Experience.

**AMD**
• Update through AMD Software: Adrenalin Edition.

After updating your drivers, restart your PC before trying again.`
},
{
    triggers: ["verify files", "verify", "integrity"],
    reply:
`**Verify Game Files**

Corrupted game files can cause crashes and other issues.

**Steam**
• Library → Grand Theft Auto V → Properties → Installed Files → Verify integrity of game files.

**Epic Games**
• Library → Click the three dots next to GTA V → Manage → Verify.

**Rockstar Games Launcher**
• Settings → My Installed Games → Grand Theft Auto V → Verify Integrity.

After the verification is complete, restart your PC and try again.`
},
{
    triggers: ["faq"],
    reply:
`# 📌 GTA MOD MENU – FAQ

## 🛡️ My antivirus says it's a virus?

This is often a false positive.
Mod menus modify the game's memory and can look suspicious to antivirus software.
That’s why they may get flagged even if they’re not actual malware.

## 🚫 Can I get banned?

Yes.
Possible outcomes:

* Temporary ban
* Permanent ban

## 📊 How high is the ban risk?

It depends on how you use it.
The more you use mods and the more obvious you are, the higher the risk.

## 💰 What is a “safe” amount of money to add?

There is no completely safe amount.
Common recommendation: about 20 million per day or less.
This does not guarantee safety.

## ⚠️ Can mod menus be used safely?

No.
A ban is always possible.

## ⏳ Will I get banned instantly?

Not necessarily.
Bans can happen instantly, days later, or even weeks later.

## 🔒 Can I bypass a ban?

Usually not.
A permanent ban means the account is lost.

## ❌ Can I use these mods On PS4/PS5/XBOX?
No.
We dont do mods for any Controller Device.`
},
{
    triggers: ["inject"],
    reply:
`# 💉 Inject Troubleshooting

If the menu won't inject, follow these steps in order:

## 1️⃣ check the version
• Make sure you're using the latest version of the menu.
• Check for updates on our official channels.



## 2️⃣ Disable BattlEye
• Make sure BattlEye is completely disabled before launching the game.

## 3️⃣ Graphics Settings
• Disable **Frame Generation**.
• Disable **Ray Tracing**.
• Lower your graphics settings if necessary.

## 4️⃣ Restart Everything
• Close GTA V completely.
• Close the launcher.
• Restart your PC if needed.

## 5️⃣ Check Your Files
• Verify your GTA V game files.
• Make sure your antivirus hasn't deleted any menu files.

## Still not working?

Reply with one of these:

• crash
• battleye
• verify files
• antivirus
• menu not opening`
},

];
