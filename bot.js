import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';

// Bot Token'iniz
const TOKEN = 'YOUR_BOT_TOKE';

// Yetkili rol ID'si (Tik veya Çarpı için yetkili olacak rol)
const ALLOWED_ROLE_ID = 'ALLOWED_ROLE_ID';
const TARGET_CHANNEL_ID = 'TARGET_CHANNEL_ID'; // Hedef kanal ID'si

// Discord.js Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Bot Hazır Olduğunda
client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Bot ${readyClient.user.tag} olarak giriş yaptı!`);
});

// Mesaj Gönderildiğinde
client.on(Events.MessageCreate, async (message) => {
    // Botun kendi mesajlarını kontrol etme
    if (message.author.bot) return;
    if (message.channel.id !== TARGET_CHANNEL_ID) return;

    try {
        await message.react('✅'); // Tik emojisi
        await message.react('❌'); // Çarpı emojisi
    } catch (error) {
        console.error('Emoji eklenirken hata oluştu:', error);
    }
});

// Emojiye Tepki Verildiğinde
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    try {
        const member = await reaction.message.guild.members.fetch(user.id);

        // Kullanıcının belirttiğimiz role sahip olup olmadığını kontrol et
        if (!member.roles.cache.has(ALLOWED_ROLE_ID)) {
            console.log('⛔ Yetkisiz kullanıcı tepki verdi:', user.tag);
            return;
        }

        if (reaction.emoji.name === '✅') {
            // Tik'e basıldığında
            await reaction.message.member.setNickname(reaction.message.content);
            await reaction.message.reply(`✅ **İsim başarıyla değiştirildi:** ${reaction.message.content}`);
        } else if (reaction.emoji.name === '❌') {
            // Çarpı'ya basıldığında
            await reaction.message.reply('❌ **İsim reddedildi!**');
        }
    } catch (error) {
        console.error('Tepki işlenirken hata oluştu:', error);
    }
});

// Botu Başlat
client.login(TOKEN);
