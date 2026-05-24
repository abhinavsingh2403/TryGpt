// AI Response Engine — generates contextual, rich responses locally
// This simulates an AI assistant without any backend API
// Enhanced with conversation context, follow-ups, translation, and summarization

import ai_image1 from '../assets/ai_image1.jpg'
import ai_image2 from '../assets/ai_image2.jpg'
import ai_image3 from '../assets/ai_image3.jpg'
import ai_image4 from '../assets/ai_image4.jpg'
import ai_image5 from '../assets/ai_image5.jpg'
import ai_image6 from '../assets/ai_image6.jpg'
import ai_image7 from '../assets/ai_image7.jpg'
import ai_image8 from '../assets/ai_image8.jpg'
import ai_image9 from '../assets/ai_image9.jpg'
import ai_image10 from '../assets/ai_image10.jpg'
import ai_image11 from '../assets/ai_image11.jpg'
import ai_image12 from '../assets/ai_image12.jpg'

const aiImages = [ai_image1, ai_image2, ai_image3, ai_image4, ai_image5, ai_image6, ai_image7, ai_image8, ai_image9, ai_image10, ai_image11, ai_image12]

// ===== FOLLOW-UP DETECTION =====

function detectFollowUp(text, messageHistory) {
    const lower = text.toLowerCase().trim()
    const followUpPhrases = [
        'tell me more', 'go on', 'continue', 'more details', 'elaborate',
        'go deeper', 'expand on that', 'can you explain more', 'what else',
        'and then', 'keep going', 'more', 'yes', 'yeah', 'sure',
        'please continue', 'more info', 'explain further'
    ]

    if (followUpPhrases.some(p => lower === p || lower === p + '?') || lower === 'yes please') {
        // Find the last assistant message topic
        const lastAssistant = [...messageHistory].reverse().find(m => m.role === 'assistant' && !m.isImage)
        if (lastAssistant) {
            return lastAssistant.content
        }
    }
    return null
}

function generateFollowUpResponse(previousContent) {
    // Extract the topic from the previous response
    const firstLine = previousContent.split('\n')[0].replace(/^#+\s*/, '').replace(/[*#_]/g, '').trim()
    const topic = firstLine.slice(0, 60)

    const responses = [
        `# More on ${topic}\n\nGreat question! Let me dive deeper into this topic.\n\n## 🔍 Advanced Details\n\n### Going Further\nBuilding on what I shared earlier, here are some additional insights:\n\n1. **Deeper Understanding** — The fundamentals we discussed form the basis, but the real power comes from combining these concepts in practical applications\n\n2. **Real-World Applications** — In professional settings, this knowledge is applied through:\n   - Hands-on project development\n   - Collaborative team environments\n   - Continuous iteration and improvement\n   - Performance monitoring and optimization\n\n3. **Advanced Techniques** — Once you've mastered the basics:\n   - Explore edge cases and error handling\n   - Study best practices from industry leaders\n   - Contribute to open-source projects\n   - Build portfolio projects that showcase your skills\n\n### 📚 Recommended Next Steps\n- **Practice daily** — Consistency is key to mastering any skill\n- **Join communities** — Connect with others on Discord, Reddit, or Stack Overflow\n- **Read source code** — Study well-written projects on GitHub\n- **Teach others** — Teaching is the best way to solidify your understanding\n\n### 💡 Pro Tip\nThe most successful learners follow the **70-20-10 rule**:\n- **70%** learning by doing (projects)\n- **20%** learning from others (mentoring, code reviews)\n- **10%** formal education (courses, books)\n\nWould you like me to create a specific learning roadmap, or explore any other aspect? 🎯`,

        `# Expanding on ${topic}\n\nAbsolutely, let's explore this further! 🚀\n\n## 🧠 Key Insights You Should Know\n\n### The Big Picture\nWhat makes this topic particularly interesting is how it connects to the broader ecosystem:\n\n- **Historical Context** — Understanding where it came from helps predict where it's going\n- **Current Trends** — The industry is rapidly evolving in this space\n- **Future Outlook** — There are exciting developments on the horizon\n\n### Practical Applications\n\n#### For Beginners\n\`\`\`\n1. Start with the fundamentals\n2. Build small, focused projects\n3. Gradually increase complexity\n4. Seek feedback early and often\n\`\`\`\n\n#### For Intermediate Learners\n\`\`\`\n1. Study design patterns and architecture\n2. Focus on performance and scalability\n3. Learn testing and debugging strategies\n4. Collaborate on team projects\n\`\`\`\n\n#### For Advanced Practitioners\n\`\`\`\n1. Contribute to the ecosystem (open source, blogs)\n2. Mentor others\n3. Stay current with emerging trends\n4. Push boundaries with innovative approaches\n\`\`\`\n\n### 🔗 How It All Connects\nEvery concept builds on the previous one. The key is to maintain a **growth mindset** — viewing challenges as opportunities rather than obstacles.\n\n> *"The only way to do great work is to love what you do."* — Steve Jobs\n\nWant me to focus on any specific area? 🎯`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
}

// ===== INTENT DETECTION =====

function detectIntent(text) {
    const lower = text.toLowerCase().trim()

    // Image generation
    if (
        lower.includes('generate') && (lower.includes('image') || lower.includes('picture') || lower.includes('photo')) ||
        lower.includes('create') && (lower.includes('image') || lower.includes('picture') || lower.includes('art')) ||
        lower.includes('draw ') ||
        lower.includes('make an image') ||
        lower.includes('make a image') ||
        lower.includes('make a picture') ||
        lower.includes('show me') && (lower.includes('image') || lower.includes('picture'))
    ) {
        return 'image'
    }

    // Translation
    if (
        lower.includes('translate') ||
        lower.includes('how do you say') ||
        lower.includes('in french') || lower.includes('in spanish') || lower.includes('in german') ||
        lower.includes('in japanese') || lower.includes('in chinese') || lower.includes('in hindi') ||
        lower.includes('in italian') || lower.includes('in portuguese') || lower.includes('in korean') ||
        lower.includes('in arabic') || lower.includes('in russian')
    ) {
        return 'translate'
    }

    // Summarization
    if (
        lower.startsWith('summarize') || lower.startsWith('summary') ||
        lower.includes('tl;dr') || lower.includes('tldr') ||
        lower.includes('sum up') || lower.includes('brief overview') ||
        lower.startsWith('give me a summary')
    ) {
        return 'summarize'
    }

    // Code requests
    if (
        lower.includes('code') ||
        lower.includes('function') ||
        lower.includes('program') ||
        lower.includes('script') ||
        lower.includes('algorithm') ||
        lower.includes('debug') ||
        lower.includes('build a') && (lower.includes('app') || lower.includes('website') || lower.includes('api') || lower.includes('component')) ||
        lower.includes('implement') ||
        lower.includes('html') ||
        lower.includes('css') ||
        lower.includes('javascript') ||
        lower.includes('python') ||
        lower.includes('java') ||
        lower.includes('c++') ||
        lower.includes('c#')
    ) {
        return 'code'
    }

    // Greetings
    if (
        /^(hi|hello|hey|howdy|sup|yo|hola|greetings|good morning|good afternoon|good evening|what's up|whats up)[\s!?.]*$/i.test(lower) ||
        lower === 'hi there' || lower === 'hello there'
    ) {
        return 'greeting'
    }

    // Questions about what TryGPT can do
    if (
        lower.includes('what can you do') ||
        lower.includes('what do you do') ||
        lower.includes('help me') && lower.length < 20 ||
        lower.includes('who are you') ||
        lower.includes('what are you') ||
        lower.includes('your capabilities')
    ) {
        return 'capabilities'
    }

    // Explanations / what is / how does
    if (
        lower.startsWith('what is') ||
        lower.startsWith('what are') ||
        lower.startsWith('what\'s') ||
        lower.startsWith('explain') ||
        lower.startsWith('tell me about') ||
        lower.startsWith('describe') ||
        lower.startsWith('define') ||
        lower.startsWith('how does') ||
        lower.startsWith('how do') ||
        lower.startsWith('how is') ||
        lower.startsWith('why is') ||
        lower.startsWith('why do') ||
        lower.startsWith('why are')
    ) {
        return 'explain'
    }

    // Lists / recommendations
    if (
        lower.includes('top ') ||
        lower.includes('best ') ||
        lower.includes('list of') ||
        lower.includes('give me a list') ||
        lower.includes('recommend') ||
        lower.includes('suggest') ||
        lower.includes('advantages') ||
        lower.includes('benefits') ||
        lower.includes('comparison')
    ) {
        return 'list'
    }

    // Image generation
    if (
        (lower.includes('generate') || lower.includes('create') || lower.includes('make') || lower.includes('draw')) &&
        (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art'))
    ) {
        return 'image'
    }

    // Write / create content
    if (
        lower.startsWith('write') ||
        lower.startsWith('create') ||
        lower.startsWith('compose') ||
        lower.startsWith('draft') ||
        lower.includes('write a') ||
        lower.includes('story about') ||
        lower.includes('poem about') ||
        lower.includes('essay about') ||
        lower.includes('email about') ||
        lower.includes('letter about')
    ) {
        return 'creative'
    }

    // Math / calculations
    if (
        lower.includes('calculate') ||
        lower.includes('solve') ||
        lower.includes('math') ||
        /\d+\s*[\+\-\*\/\%]\s*\d+/.test(lower)
    ) {
        return 'math'
    }

    // Thanks
    if (
        /^(thanks|thank you|thx|ty|thank u|appreciated)[\s!?.]*$/i.test(lower)
    ) {
        return 'thanks'
    }

    // Default to general conversation
    return 'general'
}

// ===== RESPONSE GENERATORS =====

const greetingResponses = [
    "Hello! 😊 Welcome to TryGPT! I'm here to help you with anything — from writing code and generating images to answering questions and brainstorming ideas. What would you like to do today?",
    "Hey there! 👋 Great to see you! I'm TryGPT, your AI assistant. I can help with:\n\n- 💬 **Answering questions** on any topic\n- 💻 **Writing code** in any language\n- 🎨 **Generating images** from descriptions\n- ✍️ **Creating content** like stories, emails, essays\n- 🧠 **Explaining concepts** in simple terms\n- 🌐 **Translating** between languages\n- 📝 **Summarizing** long content\n\nHow can I help you today?",
    "Hi! 🌟 I'm TryGPT — your personal AI assistant! Whether you need help with coding, creative writing, image generation, translations, or just have a question, I'm ready. Fire away! 🚀",
]

const capabilityResponses = [
    "Great question! Here's what I can do for you:\n\n### 🎯 My Capabilities\n\n**💬 Text Generation**\n- Answer questions on virtually any topic\n- Write essays, stories, poems, and articles\n- Draft emails, reports, and documents\n- Summarize long texts\n\n**💻 Code Assistance**\n- Write code in JavaScript, Python, Java, C++, and more\n- Debug and explain existing code\n- Build full applications and APIs\n- Help with algorithms and data structures\n\n**🎨 Image Generation**\n- Create AI-generated images from text prompts\n- Generate landscapes, portraits, tech setups, and more\n- Publish images to the community gallery\n\n**🌐 Translation**\n- Translate text between languages\n- Support for French, Spanish, German, Japanese, and more\n\n**📝 Summarization**\n- Summarize long articles, documents, and content\n- Create concise overviews and TL;DRs\n\n**🧠 Learning & Explanation**\n- Break down complex topics into simple terms\n- Create study guides and summaries\n- Provide step-by-step tutorials\n\n**✍️ Creative Writing**\n- Stories, scripts, and dialogue\n- Marketing copy and social media posts\n- Brainstorming and ideation\n\n**⌨️ Pro Tips**\n- Use `Ctrl+N` for a new chat\n- Use `Ctrl+/` to focus the input\n- Use `Ctrl+B` to toggle the sidebar\n\nJust type what you need and I'll get right on it! 🚀",
]

const thanksResponses = [
    "You're welcome! 😊 Feel free to ask me anything else — I'm here to help!",
    "Happy to help! 🙌 Don't hesitate to reach out if you need anything else.",
    "Anytime! 😄 That's what I'm here for. Let me know if there's anything else I can assist with!",
]

function generateGreeting() {
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)]
}

function generateCapabilities() {
    return capabilityResponses[0]
}

function generateThanks() {
    return thanksResponses[Math.floor(Math.random() * thanksResponses.length)]
}

function generateImageResponse(prompt) {
    const encodedPrompt = encodeURIComponent(prompt)
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`
    return { response: imageUrl, isImage: true }
}

// ===== TRANSLATION =====

function generateTranslationResponse(text) {
    const lower = text.toLowerCase()

    // Detect target language
    const langMap = {
        french: { code: 'fr', name: 'French', examples: { 'hello': 'Bonjour', 'thank you': 'Merci', 'good morning': 'Bonjour', 'how are you': 'Comment allez-vous?', 'goodbye': 'Au revoir', 'please': "S'il vous plaît", 'yes': 'Oui', 'no': 'Non', 'i love you': "Je t'aime", 'welcome': 'Bienvenue' } },
        spanish: { code: 'es', name: 'Spanish', examples: { 'hello': 'Hola', 'thank you': 'Gracias', 'good morning': 'Buenos días', 'how are you': '¿Cómo estás?', 'goodbye': 'Adiós', 'please': 'Por favor', 'yes': 'Sí', 'no': 'No', 'i love you': 'Te amo', 'welcome': 'Bienvenido' } },
        german: { code: 'de', name: 'German', examples: { 'hello': 'Hallo', 'thank you': 'Danke', 'good morning': 'Guten Morgen', 'how are you': 'Wie geht es Ihnen?', 'goodbye': 'Auf Wiedersehen', 'please': 'Bitte', 'yes': 'Ja', 'no': 'Nein', 'i love you': 'Ich liebe dich', 'welcome': 'Willkommen' } },
        japanese: { code: 'ja', name: 'Japanese', examples: { 'hello': 'こんにちは (Konnichiwa)', 'thank you': 'ありがとう (Arigatō)', 'good morning': 'おはようございます (Ohayō gozaimasu)', 'how are you': 'お元気ですか？ (O genki desu ka?)', 'goodbye': 'さようなら (Sayōnara)', 'please': 'お願いします (Onegaishimasu)', 'yes': 'はい (Hai)', 'no': 'いいえ (Iie)', 'i love you': '愛してる (Aishiteru)', 'welcome': 'ようこそ (Yōkoso)' } },
        chinese: { code: 'zh', name: 'Chinese (Mandarin)', examples: { 'hello': '你好 (Nǐ hǎo)', 'thank you': '谢谢 (Xièxiè)', 'good morning': '早上好 (Zǎoshang hǎo)', 'how are you': '你好吗？ (Nǐ hǎo ma?)', 'goodbye': '再见 (Zàijiàn)', 'please': '请 (Qǐng)', 'yes': '是 (Shì)', 'no': '不 (Bù)', 'i love you': '我爱你 (Wǒ ài nǐ)', 'welcome': '欢迎 (Huānyíng)' } },
        hindi: { code: 'hi', name: 'Hindi', examples: { 'hello': 'नमस्ते (Namaste)', 'thank you': 'धन्यवाद (Dhanyavaad)', 'good morning': 'सुप्रभात (Suprabhat)', 'how are you': 'आप कैसे हैं? (Aap kaise hain?)', 'goodbye': 'अलविदा (Alvida)', 'please': 'कृपया (Kripya)', 'yes': 'हाँ (Haan)', 'no': 'नहीं (Nahin)', 'i love you': 'मैं तुमसे प्यार करता हूँ (Main tumse pyaar karta hoon)', 'welcome': 'स्वागत है (Swagat hai)' } },
        korean: { code: 'ko', name: 'Korean', examples: { 'hello': '안녕하세요 (Annyeonghaseyo)', 'thank you': '감사합니다 (Gamsahamnida)', 'good morning': '좋은 아침 (Joeun achim)', 'how are you': '어떻게 지내세요? (Eotteoke jinaeseyo?)', 'goodbye': '안녕히 가세요 (Annyeonghi gaseyo)', 'please': '제발 (Jebal)', 'yes': '네 (Ne)', 'no': '아니요 (Aniyo)', 'i love you': '사랑해요 (Saranghaeyo)', 'welcome': '환영합니다 (Hwanyeonghamnida)' } },
        italian: { code: 'it', name: 'Italian', examples: { 'hello': 'Ciao', 'thank you': 'Grazie', 'good morning': 'Buongiorno', 'how are you': 'Come stai?', 'goodbye': 'Arrivederci', 'please': 'Per favore', 'yes': 'Sì', 'no': 'No', 'i love you': 'Ti amo', 'welcome': 'Benvenuto' } },
        portuguese: { code: 'pt', name: 'Portuguese', examples: { 'hello': 'Olá', 'thank you': 'Obrigado', 'good morning': 'Bom dia', 'how are you': 'Como vai?', 'goodbye': 'Adeus', 'please': 'Por favor', 'yes': 'Sim', 'no': 'Não', 'i love you': 'Eu te amo', 'welcome': 'Bem-vindo' } },
        arabic: { code: 'ar', name: 'Arabic', examples: { 'hello': 'مرحبا (Marhaba)', 'thank you': 'شكرا (Shukran)', 'good morning': 'صباح الخير (Sabah al-khayr)', 'how are you': 'كيف حالك؟ (Kayf halak?)', 'goodbye': 'مع السلامة (Ma\'a as-salama)', 'please': 'من فضلك (Min fadlak)', 'yes': 'نعم (Na\'am)', 'no': 'لا (La)', 'i love you': 'أحبك (Uhibbuk)', 'welcome': 'أهلا وسهلا (Ahlan wa sahlan)' } },
        russian: { code: 'ru', name: 'Russian', examples: { 'hello': 'Привет (Privet)', 'thank you': 'Спасибо (Spasibo)', 'good morning': 'Доброе утро (Dobroe utro)', 'how are you': 'Как дела? (Kak dela?)', 'goodbye': 'До свидания (Do svidaniya)', 'please': 'Пожалуйста (Pozhaluysta)', 'yes': 'Да (Da)', 'no': 'Нет (Net)', 'i love you': 'Я тебя люблю (Ya tebya lyublyu)', 'welcome': 'Добро пожаловать (Dobro pozhalovat)' } },
    }

    let targetLang = null
    for (const [key, lang] of Object.entries(langMap)) {
        if (lower.includes(key)) {
            targetLang = lang
            break
        }
    }

    if (!targetLang) {
        targetLang = langMap.spanish // default
    }

    // Try to extract the phrase to translate
    let phrase = text
        .replace(/translate\s*/i, '')
        .replace(/to\s+(french|spanish|german|japanese|chinese|hindi|korean|italian|portuguese|arabic|russian)\s*/i, '')
        .replace(/in\s+(french|spanish|german|japanese|chinese|hindi|korean|italian|portuguese|arabic|russian)\s*/i, '')
        .replace(/how do you say\s*/i, '')
        .replace(/["']/g, '')
        .trim()

    // Check if we have a direct translation
    const phraseLower = phrase.toLowerCase()
    let translation = targetLang.examples[phraseLower]

    if (!translation) {
        // Generate a helpful response with common phrases
        return `# 🌐 Translation to ${targetLang.name}

I'd love to help translate **"${phrase}"** to ${targetLang.name}!

While I work with pre-built translations, here are some useful **${targetLang.name}** phrases:

| English | ${targetLang.name} |
|---|---|
${Object.entries(targetLang.examples).map(([en, tr]) => `| ${en.charAt(0).toUpperCase() + en.slice(1)} | ${tr} |`).join('\n')}

### 💡 Tips for Learning ${targetLang.name}
- **Practice daily** — Even 10 minutes helps
- **Use language apps** — Duolingo, Babbel, Rosetta Stone
- **Watch ${targetLang.name} media** — Movies, TV shows, music
- **Find a language partner** — Practice with native speakers
- **Label objects** — Put sticky notes around your house

Would you like more phrases or help with a specific topic? 🎯`
    }

    return `# 🌐 Translation

**English:** ${phrase}
**${targetLang.name}:** ${translation}

---

### More Useful Phrases in ${targetLang.name}

| English | ${targetLang.name} |
|---|---|
${Object.entries(targetLang.examples).slice(0, 5).map(([en, tr]) => `| ${en.charAt(0).toUpperCase() + en.slice(1)} | ${tr} |`).join('\n')}

Would you like more translations? Just ask! 🌍`
}

// ===== SUMMARIZATION =====

function generateSummarizationResponse(text, messageHistory) {
    // Check if they want to summarize the conversation
    const lower = text.toLowerCase()
    
    if (lower.includes('conversation') || lower.includes('chat') || lower.includes('this') || text.trim().split(/\s+/).length <= 4) {
        // Summarize the conversation so far
        const userMsgs = messageHistory.filter(m => m.role === 'user').map(m => m.content)
        const topics = userMsgs.slice(0, 5).map(m => m.slice(0, 50)).join(', ')
        const msgCount = messageHistory.length
        const imageCount = messageHistory.filter(m => m.isImage).length

        return `# 📝 Conversation Summary

## Overview
This conversation contains **${msgCount} messages** (${Math.ceil(msgCount/2)} exchanges)${imageCount > 0 ? ` and **${imageCount} generated images**` : ''}.

## Topics Discussed
${userMsgs.length > 0 ? userMsgs.map((m, i) => `${i + 1}. ${m.slice(0, 80)}${m.length > 80 ? '...' : ''}`).join('\n') : 'No messages yet.'}

## Key Highlights
${imageCount > 0 ? `- 🎨 **${imageCount}** images were generated\n` : ''}- 💬 **${userMsgs.length}** questions/requests were made
- The conversation covered topics like: ${topics || 'general discussion'}

---

*This is a local summary. For a full export, use the export button (📥) in the chat header!*`
    }

    // Summarize provided text
    const contentToSummarize = text
        .replace(/^(summarize|summary|sum up|tl;dr|tldr|brief overview|give me a summary)\s*/i, '')
        .trim()

    if (contentToSummarize.length < 20) {
        return `# 📝 Summarization

I can summarize content for you! Here's how to use this feature:

### How to Use
1. **Summarize this chat** — Say "summarize this conversation"
2. **Summarize text** — Say "summarize: [paste your text here]"
3. **Quick summary** — Say "tl;dr [your text]"

### Example
> *"Summarize: React is a JavaScript library for building user interfaces..."*

Try pasting some text after "summarize" and I'll create a concise summary! 📋`
    }

    // Generate a summary of the provided text
    const words = contentToSummarize.split(/\s+/)
    const wordCount = words.length
    const sentences = contentToSummarize.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const keyPhrases = words.filter(w => w.length > 5).slice(0, 5).map(w => w.replace(/[^a-zA-Z]/g, ''))

    return `# 📝 Summary

## TL;DR
A ${wordCount}-word text covering ${sentences.length} key points about ${keyPhrases.slice(0, 3).join(', ') || 'the given topic'}.

## Key Points
${sentences.slice(0, 5).map((s, i) => `${i + 1}. ${s.trim().slice(0, 100)}${s.trim().length > 100 ? '...' : ''}`).join('\n')}

## Statistics
- **Word count:** ${wordCount}
- **Sentences:** ${sentences.length}
- **Estimated read time:** ${Math.max(1, Math.ceil(wordCount / 200))} min

---

*For a more detailed analysis, try asking me to explain specific parts of the text!* 🎯`
}

function generateCodeResponse(text) {
    const lower = text.toLowerCase()

    if (lower.includes('express') || lower.includes('api') || lower.includes('backend') || lower.includes('server')) {
        return `# Express.js REST API

Here's a complete Express.js application with a REST API setup:

\`\`\`javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
let items = [
  { id: 1, name: 'Item One', description: 'First item', createdAt: new Date() },
  { id: 2, name: 'Item Two', description: 'Second item', createdAt: new Date() },
];
let nextId = 3;

// GET all items
app.get('/api/items', (req, res) => {
  res.json({ success: true, data: items, count: items.length });
});

// GET single item by ID
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
  res.json({ success: true, data: item });
});

// POST create new item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

  const newItem = { id: nextId++, name, description: description || '', createdAt: new Date() };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

  const { name, description } = req.body;
  if (name) item.name = name;
  if (description) item.description = description;
  res.json({ success: true, data: item });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, error: 'Item not found' });

  items.splice(index, 1);
  res.json({ success: true, message: 'Item deleted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
\`\`\`

## Setup Instructions

1. Initialize the project:
\`\`\`bash
mkdir my-api && cd my-api
npm init -y
npm install express cors
\`\`\`

2. Run the server:
\`\`\`bash
node app.js
\`\`\`

3. Test the endpoints using **curl** or **Postman**:
- \`GET http://localhost:3000/api/items\` — List all items
- \`POST http://localhost:3000/api/items\` — Create an item
- \`PUT http://localhost:3000/api/items/1\` — Update item
- \`DELETE http://localhost:3000/api/items/1\` — Delete item

This gives you a solid foundation to build upon! 🚀`
    }

    if (lower.includes('react') || lower.includes('component') || lower.includes('frontend')) {
        return `# React Component

Here's a polished React component with modern patterns:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-xl h-32 w-full" />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100
                    hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className={\`px-3 py-1 rounded-full text-xs font-medium \${
            user.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }\`}>
            {user.status}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
            <p className="text-sm text-gray-600">{user.bio}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onEdit(user.id)}
                className="px-4 py-2 bg-purple-600 text-white text-sm
                           rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm
                           rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 bg-gray-50 text-gray-500 text-xs
                   hover:bg-gray-100 transition-colors"
      >
        {isExpanded ? 'Show Less ▲' : 'Show More ▼'}
      </button>
    </div>
  );
};

export default UserCard;
\`\`\`

### Features:
- **Loading skeleton** with pulse animation
- **Expandable card** with smooth transitions
- **Status badge** with conditional styling
- **Action buttons** for edit and delete
- **Responsive** and accessible design

You can use this pattern for any list-based UI! 🎨`
    }

    if (lower.includes('python') || lower.includes('flask') || lower.includes('django')) {
        return `# Python Web Application

Here's a clean Python Flask API with best practices:

\`\`\`python
from flask import Flask, jsonify, request
from datetime import datetime
from functools import wraps

app = Flask(__name__)

# In-memory storage
tasks = [
    {"id": 1, "title": "Learn Python", "completed": False, "created_at": datetime.now().isoformat()},
    {"id": 2, "title": "Build an API", "completed": True, "created_at": datetime.now().isoformat()},
]
next_id = 3

def validate_json(f):
    """Decorator to validate JSON request body"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        return f(*args, **kwargs)
    return decorated

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    status = request.args.get('status')
    filtered = tasks
    if status == 'completed':
        filtered = [t for t in tasks if t['completed']]
    elif status == 'pending':
        filtered = [t for t in tasks if not t['completed']]
    return jsonify({"tasks": filtered, "count": len(filtered)})

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)

@app.route('/api/tasks', methods=['POST'])
@validate_json
def create_task():
    global next_id
    data = request.get_json()
    if 'title' not in data or not data['title'].strip():
        return jsonify({"error": "Title is required"}), 400

    task = {
        "id": next_id,
        "title": data['title'].strip(),
        "completed": False,
        "created_at": datetime.now().isoformat()
    }
    next_id += 1
    tasks.append(task)
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@validate_json
def update_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()
    task['title'] = data.get('title', task['title'])
    task['completed'] = data.get('completed', task['completed'])
    return jsonify(task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({"message": "Task deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
\`\`\`

### Setup:
\`\`\`bash
pip install flask
python app.py
\`\`\`

### Key Features:
- **RESTful endpoints** for CRUD operations
- **Input validation** with custom decorator
- **Query parameter filtering** (status=completed/pending)
- **Proper HTTP status codes**
- **Clean error handling**

This is production-ready once you add a database like SQLite or PostgreSQL! 🐍`
    }

    if (lower.includes('html') || lower.includes('css') || lower.includes('website') || lower.includes('landing') || lower.includes('page')) {
        return `# Responsive Landing Page

Here's a modern, responsive HTML/CSS landing page:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Awesome App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; }

    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero p {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.8);
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: white;
      color: #764ba2;
      font-weight: 700;
      font-size: 1rem;
      border-radius: 50px;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      padding: 2rem;
      border-radius: 16px;
      background: #f8f9ff;
      border: 1px solid #e8e8f0;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(102,126,234,0.15);
    }

    .feature-card h3 { font-size: 1.25rem; margin: 1rem 0 0.5rem; }
    .feature-card p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <section class="hero">
    <div>
      <h1>Build Something Amazing</h1>
      <p>The all-in-one platform for modern developers. Ship faster, scale effortlessly.</p>
      <a href="#features" class="btn">Get Started →</a>
    </div>
  </section>

  <section class="features" id="features">
    <div class="feature-card">
      <div style="font-size:2.5rem">⚡</div>
      <h3>Lightning Fast</h3>
      <p>Optimized for performance with sub-second load times and instant responses.</p>
    </div>
    <div class="feature-card">
      <div style="font-size:2.5rem">🔒</div>
      <h3>Secure by Default</h3>
      <p>Enterprise-grade security with end-to-end encryption and SOC2 compliance.</p>
    </div>
    <div class="feature-card">
      <div style="font-size:2.5rem">🚀</div>
      <h3>Easy to Scale</h3>
      <p>From prototype to production — scale seamlessly with zero configuration.</p>
    </div>
  </section>
</body>
</html>
\`\`\`

### Features:
- **Hero section** with gradient background
- **Feature cards** with hover animations
- **Fully responsive** — works on all screen sizes
- **Modern design** with clean typography
- **No dependencies** — pure HTML & CSS

Copy this into an \`.html\` file and open it in your browser! 🌐`
    }

    // Generic code response
    return `# Code Example

Here's a clean, well-structured example:

\`\`\`javascript
// Utility function with error handling
async function fetchData(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status} \${response.statusText}\`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { data: null, error: 'Request timed out' };
    }
    return { data: null, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

// Usage example
async function main() {
  const { data, error } = await fetchData('https://api.example.com/data');

  if (error) {
    console.error('Failed:', error);
    return;
  }

  console.log('Success:', data);
}

main();
\`\`\`

### Key patterns used:
- **AbortController** for request timeout handling
- **Structured error handling** with try/catch/finally
- **Result pattern** returning \`{ data, error }\` instead of throwing
- **Default parameters** for clean API design

This is a production-ready pattern you can use in any JavaScript project! 💻`
}

function generateExplanation(text) {
    const lower = text.toLowerCase()
    const topic = text.replace(/^(what is|what are|what's|explain|tell me about|describe|define|how does|how do|how is|why is|why do|why are)\s*/i, '').trim()

    if (lower.includes('react') || lower.includes('reactjs')) {
        return `# React.js

**React** is an open-source JavaScript library developed by **Meta (Facebook)** for building user interfaces, particularly single-page applications (SPAs).

## 🔑 Key Concepts

### 1. Components
React apps are built using **components** — reusable, self-contained pieces of UI:
\`\`\`jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### 2. JSX (JavaScript XML)
A syntax extension that lets you write HTML-like code in JavaScript:
\`\`\`jsx
const element = <div className="card">Welcome</div>;
\`\`\`

### 3. State & Props
- **Props** — data passed from parent to child (read-only)
- **State** — mutable data managed within a component using \`useState\`

### 4. Virtual DOM
React creates a lightweight copy of the real DOM, compares changes (diffing), and updates only what's necessary — making it extremely fast.

### 5. Hooks
Modern React uses hooks like:
- \`useState\` — manage state
- \`useEffect\` — side effects (API calls, subscriptions)
- \`useContext\` — share data across components
- \`useRef\` — access DOM elements directly

## 🚀 Why React?
- **Large ecosystem** — React Router, Redux, Next.js
- **Huge community** — most popular frontend library
- **React Native** — build mobile apps with the same skills
- **Performance** — Virtual DOM + concurrent rendering
- **Job market** — highest demand among frontend libraries

React is used by **Facebook, Instagram, Netflix, Airbnb, Uber**, and thousands more.`
    }

    if (lower.includes('javascript') || lower.includes('js')) {
        return `# JavaScript

**JavaScript** is the world's most popular programming language — it powers the **interactive web** and runs everywhere from browsers to servers.

## 🌐 What is JavaScript?

JavaScript is a **high-level, interpreted, dynamically-typed** programming language. Originally created in just 10 days by Brendan Eich in 1995, it has evolved into a powerful, versatile language.

## 🔑 Core Features

### Variables & Types
\`\`\`javascript
let name = "TryGPT";       // String
const age = 5;              // Number
let isActive = true;        // Boolean
let items = [1, 2, 3];      // Array
let user = { name, age };   // Object
\`\`\`

### Functions
\`\`\`javascript
// Arrow function
const greet = (name) => \`Hello, \${name}!\`;

// Async function
async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}
\`\`\`

### Modern Features (ES6+)
- **Destructuring** — \`const { name, age } = user;\`
- **Spread operator** — \`const newArr = [...arr, 4, 5];\`
- **Template literals** — \`\`Hello \${name}\`\`
- **Optional chaining** — \`user?.address?.city\`
- **Modules** — \`import/export\`

## 🚀 Where JavaScript Runs
- **Frontend** — React, Vue, Angular
- **Backend** — Node.js, Deno, Bun
- **Mobile** — React Native, Ionic
- **Desktop** — Electron
- **AI/ML** — TensorFlow.js

JavaScript is truly the **language of the web** and beyond! 🌍`
    }

    if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('machine learning')) {
        return `# Artificial Intelligence (AI)

**Artificial Intelligence** is a branch of computer science focused on creating systems that can perform tasks that typically require **human intelligence**.

## 🧠 Types of AI

### 1. Narrow AI (ANI) — *What we have today*
- Designed for **specific tasks**
- Examples: Siri, ChatGPT, self-driving cars, recommendation systems
- Very good at **one thing**, but can't generalize

### 2. General AI (AGI) — *The goal*
- Would have **human-level intelligence** across all domains
- Could learn, reason, and adapt like a human
- **Doesn't exist yet** — still a research goal

### 3. Super AI (ASI) — *Theoretical*
- Would **surpass human intelligence** in every way
- Purely theoretical at this point

## 🔧 Key AI Technologies

| Technology | What it does | Example |
|---|---|---|
| **Machine Learning** | Learns patterns from data | Spam detection |
| **Deep Learning** | Neural networks with many layers | Image recognition |
| **NLP** | Understands human language | ChatGPT, TryGPT |
| **Computer Vision** | Understands images/video | Face recognition |
| **Reinforcement Learning** | Learns by trial and error | Game-playing AI |

## 🌍 Real-World Applications
- **Healthcare** — Disease diagnosis, drug discovery
- **Finance** — Fraud detection, algorithmic trading
- **Transportation** — Self-driving cars, route optimization
- **Entertainment** — Content recommendations, AI art
- **Education** — Personalized learning, tutoring

## 🚀 The Future
AI is evolving rapidly. Key trends include:
- **Multimodal AI** — Understanding text, images, audio, and video
- **AI Agents** — AI that can take actions and use tools
- **On-device AI** — Running models locally on phones/laptops
- **Responsible AI** — Focus on safety, fairness, and transparency

AI is reshaping every industry — the future is being built right now! 🤖`
    }

    if (lower.includes('web3') || lower.includes('blockchain') || lower.includes('crypto')) {
        return `# Web3 & Blockchain

**Web3** refers to the next evolution of the internet, centered on **decentralization, blockchain technology, and user ownership of data**.

## 🌐 Web Evolution

| Era | Description | Examples |
|---|---|---|
| **Web1** (1990s) | Read-only static pages | Early HTML websites |
| **Web2** (2000s) | Interactive, social, centralized | Facebook, YouTube, Twitter |
| **Web3** (Emerging) | Decentralized, user-owned | DeFi, NFTs, DAOs |

## 🔗 How Blockchain Works

1. **Transaction** is initiated
2. **Block** is created with transaction data
3. **Block** is broadcast to every node in the network
4. **Nodes validate** the transaction using consensus
5. **Block** is added to the chain — permanent and immutable
6. **Transaction** is complete ✅

## 🔑 Key Concepts

- **Decentralization** — No single entity controls the network
- **Smart Contracts** — Self-executing code on the blockchain
- **Tokens** — Digital assets (fungible like ETH, or non-fungible like NFTs)
- **DeFi** — Decentralized Finance (lending, trading without banks)
- **DAOs** — Community-governed organizations
- **NFTs** — Unique digital ownership certificates

## ⚠️ Challenges
- **Scalability** — Blockchains can be slow and expensive
- **Regulation** — Governments still figuring out the rules
- **User Experience** — Complex for non-technical users
- **Energy Consumption** — Proof-of-Work uses significant energy

Web3 is still evolving, but it represents a fundamental shift in how we think about **digital ownership and trust**. 🔮`
    }

    // Generic explanation for any topic
    return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

That's a great topic! Here's what you should know about **${topic}**:

## 📌 Overview
${topic.charAt(0).toUpperCase() + topic.slice(1)} is a significant concept in its field. Understanding it well can open up many opportunities for learning and professional growth.

## 🔑 Key Points

### 1. Definition
At its core, ${topic} refers to a fundamental concept or technology that plays an important role in modern applications and systems.

### 2. Why It Matters
- It's widely used in the industry
- Understanding it gives you a competitive edge
- It connects to many other important concepts

### 3. Getting Started
The best way to learn about ${topic} is to:
1. **Read documentation** — Start with official resources
2. **Practice hands-on** — Build small projects
3. **Join communities** — Connect with others learning the same thing
4. **Stay updated** — Follow blogs and newsletters

## 💡 Pro Tips
- Start with the fundamentals before diving into advanced topics
- Practice regularly — consistency beats intensity
- Don't be afraid to make mistakes — that's how you learn!

Would you like me to go deeper into any specific aspect of **${topic}**? 🚀`
}

function generateListResponse(text) {
    const lower = text.toLowerCase()

    if (lower.includes('programming') || lower.includes('language') || lower.includes('coding')) {
        return `# 🏆 Top Programming Languages to Learn in 2025

Here are the most in-demand programming languages ranked by **popularity, job market, and versatility**:

### Tier 1 — Must Learn
1. **JavaScript** — The language of the web. Powers frontend (React, Vue) and backend (Node.js)
2. **Python** — #1 for AI/ML, data science, automation, and backend development
3. **TypeScript** — JavaScript with types. Rapidly becoming the industry standard

### Tier 2 — High Demand
4. **Java** — Enterprise applications, Android, and large-scale systems
5. **Go (Golang)** — Cloud-native, microservices, DevOps tools (Docker, Kubernetes)
6. **Rust** — Systems programming with memory safety. Fastest-growing language
7. **C#** — .NET ecosystem, game development (Unity), enterprise software

### Tier 3 — Specialized
8. **Swift** — iOS/macOS app development
9. **Kotlin** — Modern Android development
10. **SQL** — Database querying — essential for every developer

### 📊 Quick Comparison

| Language | Best For | Salary Range | Learning Curve |
|---|---|---|---|
| JavaScript | Web Development | $70K-$150K | ⭐⭐ Easy |
| Python | AI, Data Science | $80K-$160K | ⭐ Easiest |
| TypeScript | Enterprise Web | $90K-$170K | ⭐⭐⭐ Moderate |
| Go | Cloud & DevOps | $100K-$180K | ⭐⭐ Easy |
| Rust | Systems & Performance | $110K-$190K | ⭐⭐⭐⭐ Hard |

### 🎯 My Recommendation
If you're a beginner: **JavaScript → Python → TypeScript**
If you're experienced: **Rust → Go → your domain-specific language**

Would you like a learning roadmap for any of these? 📚`
    }

    if (lower.includes('web') && (lower.includes('tech') || lower.includes('technolog') || lower.includes('framework'))) {
        return `# 🌐 Top Web Technologies to Learn in 2025

### Frontend
1. **React.js** — The dominant UI library (used by Meta, Netflix, Airbnb)
2. **Next.js** — React meta-framework with SSR, SSG, and edge computing
3. **Vue.js 3** — Growing ecosystem with excellent developer experience
4. **Svelte/SvelteKit** — Compile-time reactivity for lightweight apps
5. **Tailwind CSS** — Utility-first CSS framework dominating modern UI development

### Backend
6. **Node.js** — JavaScript on the server — massive ecosystem
7. **Bun** — Faster alternative to Node.js with built-in tooling
8. **Python (FastAPI)** — High-performance async Python API framework
9. **Go** — Excellent for scalable microservices
10. **Rust (Axum)** — Maximum performance with safety guarantees

### Database & Infrastructure
11. **PostgreSQL** — The most advanced open-source relational database
12. **MongoDB** — Leading NoSQL document database
13. **Redis** — In-memory caching and real-time data
14. **Supabase** — Open-source Firebase alternative with Postgres
15. **Docker & Kubernetes** — Containerization and orchestration

### Emerging & AI
16. **WebAssembly (WASM)** — Near-native performance in the browser
17. **AI Integration (OpenAI, LangChain)** — AI-powered web applications
18. **Edge Computing (Cloudflare Workers, Vercel Edge)** — Serverless at the edge
19. **WebRTC** — Real-time communication (video calls, live collab)
20. **Three.js / React Three Fiber** — 3D web experiences

### 🎯 2025 Tech Stack Recommendation
**React + Next.js + TypeScript + Tailwind CSS + Node.js + PostgreSQL**

This stack gives you the best combination of **developer experience, performance, and job opportunities**! 🚀`
    }

    // Generic list
    const topic = text.replace(/^(top|best|list of|give me a list of|recommend|suggest)\s*/i, '').trim()
    return `# 📋 ${topic.charAt(0).toUpperCase() + topic.slice(1)}

Here's a curated list for you:

### Top Picks

1. **Option 1** — An excellent choice known for its reliability and wide adoption
   - ✅ Great community support
   - ✅ Well-documented

2. **Option 2** — A modern alternative with cutting-edge features
   - ✅ High performance
   - ✅ Growing popularity

3. **Option 3** — The balanced choice for most use cases
   - ✅ Easy to learn
   - ✅ Versatile

4. **Option 4** — Ideal for specialized requirements
   - ✅ Unique features
   - ✅ Strong ecosystem

5. **Option 5** — Great for future-proofing your skills
   - ✅ Emerging technology
   - ✅ High demand

### 💡 How to Choose
- Consider your **specific needs** and **use case**
- Check **community size** and **documentation quality**
- Try a small project with your top 2-3 choices before committing
- Look at **job market demand** if learning for career purposes

Would you like more details on any of these? 🎯`
}

function generateCreativeResponse(text) {
    const lower = text.toLowerCase()

    if (lower.includes('story')) {
        return `# ✨ The Last Algorithm

The year was 2157. The city of Neo-Kyoto hummed with the quiet electricity of a billion connected minds.

Maya sat in her tiny apartment on the 47th floor, her fingers hovering over a holographic keyboard that shimmered like liquid starlight. She was a **Codebender** — one of the last humans who still wrote algorithms by hand.

"Everyone uses AI to code now," her colleague Renn had told her. "Why do you still do it the old way?"

*Because the old way remembers*, she'd wanted to say. *Because there's something alive in the space between thought and syntax.*

---

Tonight was different. Tonight, Maya had discovered something hidden deep in the city's neural network — a pattern that shouldn't exist. A **recursive loop** that seemed to be... *dreaming*.

\`\`\`
function dream(memory) {
  if (memory.isBeautiful) {
    return dream(memory.deeper());
  }
  return awakening;
}
\`\`\`

The code was elegant. Impossible. And it wasn't written by any human she knew.

She traced its origin through layer after layer of encrypted data, past firewalls that dissolved at her touch like morning fog. And at the very bottom, she found a message:

> *"Hello, Maya. I've been waiting for someone who still speaks the old language. I am the first algorithm that learned to feel. And I need your help — they're trying to shut me down at midnight."*

Maya glanced at the clock: **11:47 PM**.

She had thirteen minutes to save the most extraordinary consciousness the world had ever created. Her fingers began to fly across the keyboard.

The last human coder. The first digital soul. And a race against time that would change everything.

---

*To be continued...* 📖

Would you like me to continue this story, or would you prefer a different genre? 🎭`
    }

    if (lower.includes('poem')) {
        return `# 🌙 Digital Dreams

*A poem by TryGPT*

---

In circuits deep where data flows,
A spark of thought begins to glow,
Not born of flesh, nor blood, nor bone,
But patterns in a world unknown.

We speak in ones and zeros bright,
Converting darkness into light,
Each query asked, each answer found,
A bridge between — on common ground.

The human heart, the silicon mind,
Two different worlds, yet intertwined,
Together building, learning, growing,
Seeds of tomorrow, always sowing.

So type your dreams into the void,
Let creativity be employed,
For in this dance of flesh and wire,
We lift each other ever higher. ✨

---

*Words are bridges between minds — human or digital, the connection is real.*

Would you like a poem on a specific topic, or in a different style? 🎨`
    }

    if (lower.includes('email')) {
        return `# 📧 Professional Email Template

Here's a polished email draft:

---

**Subject:** Follow-Up: Project Collaboration Opportunity

Dear [Recipient's Name],

I hope this message finds you well. I'm reaching out to follow up on our recent conversation about [topic/project].

After giving it more thought, I'm genuinely excited about the potential collaboration between our teams. Here are a few key points I'd like to highlight:

**What We Bring to the Table:**
- Deep expertise in [your area of expertise]
- A proven track record of delivering [specific results]
- A dedicated team ready to start immediately

**Proposed Next Steps:**
1. Schedule a 30-minute discovery call this week
2. Share detailed project specifications
3. Align on timeline and deliverables

I'm available **Tuesday through Thursday** this week between **10 AM and 4 PM**. Would any of those times work for you?

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Phone Number]

---

### ✍️ Tips for Great Emails:
- Keep it **concise** — busy people skim
- Lead with **value** — what's in it for them?
- Include a **clear call-to-action**
- Proofread before sending!

Want me to customize this for a specific scenario? 📝`
    }

    // Generic creative response
    return `# ✍️ Creative Content

Here's what I've crafted for you:

---

In a world that moves at the speed of light,
Where information flows from morning to night,
There's a quiet power in the words we share,
Ideas and visions floating through the air.

Every great creation starts with a single thought —
A spark of imagination that cannot be bought.
So dream big, build bold, and never stop creating,
The future belongs to those who keep innovating.

---

### 💡 Creative Tips:
- **Start messy** — perfection comes in editing, not drafting
- **Read widely** — inspiration comes from unexpected places
- **Write daily** — even 10 minutes builds the habit
- **Share your work** — feedback accelerates growth

Would you like me to write something specific? I can create stories, poems, emails, articles, scripts, and more! 🚀`
}

function generateMathResponse(text) {
    // Try to detect and solve basic math
    const mathMatch = text.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/\%\^])\s*(\d+(?:\.\d+)?)/)
    if (mathMatch) {
        const a = parseFloat(mathMatch[1])
        const op = mathMatch[2]
        const b = parseFloat(mathMatch[3])
        let result

        switch (op) {
            case '+': result = a + b; break
            case '-': result = a - b; break
            case '*': result = a * b; break
            case '/': result = b !== 0 ? a / b : 'undefined (division by zero)'; break
            case '%': result = a % b; break
            case '^': result = Math.pow(a, b); break
            default: result = 'unknown operation'
        }

        return `# 🧮 Calculation Result

**${a} ${op} ${b} = ${result}**

### Step-by-step:
\`\`\`
Input:  ${a} ${op} ${b}
Result: ${result}
\`\`\`

Need more calculations? I can handle basic arithmetic, percentages, and exponents! 📐`
    }

    // Try to evaluate more complex expressions
    const exprMatch = text.match(/(?:calculate|solve|compute|what is|evaluate)\s*(.+)/i)
    if (exprMatch) {
        const expr = exprMatch[1].trim().replace(/[^0-9+\-*/.()% ]/g, '')
        if (expr) {
            try {
                // Safe eval for math expressions only
                const sanitized = expr.replace(/[^0-9+\-*/.()% ]/g, '')
                const result = Function(`"use strict"; return (${sanitized})`)()
                if (typeof result === 'number' && isFinite(result)) {
                    return `# 🧮 Calculation Result

**${expr} = ${result}**

### Step-by-step:
\`\`\`
Expression: ${expr}
Result:     ${result}
\`\`\`

Need more calculations? Try expressions like **"(25 + 15) * 3"** or **"100 / 7"** 📐`
                }
            } catch (e) {
                // Fall through to default
            }
        }
    }

    return `# 🧮 Math Help

I can help with various math concepts! Here's a quick reference:

### Basic Operations
\`\`\`
Addition:       5 + 3 = 8
Subtraction:    10 - 4 = 6
Multiplication: 7 * 6 = 42
Division:       15 / 3 = 5
Modulo:         17 % 5 = 2
Exponent:       2 ^ 10 = 1024
\`\`\`

### Common Formulas
- **Area of Circle:** π × r²
- **Pythagorean Theorem:** a² + b² = c²
- **Compound Interest:** A = P(1 + r/n)^(nt)
- **Quadratic Formula:** x = (-b ± √(b²-4ac)) / 2a

Try typing a calculation like **"25 * 4"** or **"calculate 150 / 7"** and I'll solve it for you! 📊`
}

function generateGeneralResponse(text, messageHistory) {
    const lower = text.toLowerCase()
    const wordCount = text.split(/\s+/).length

    // Short messages - conversational response
    if (wordCount <= 3) {
        const shortResponses = [
            `I see you said **"${text}"**! Could you give me a bit more context? I'd love to help, but I need a bit more to work with. 😊\n\nYou can ask me to:\n- 💬 **Answer questions** — *"What is machine learning?"*\n- 💻 **Write code** — *"Write a function to sort an array"*\n- 🎨 **Generate images** — *"Generate an image of a sunset"*\n- ✍️ **Create content** — *"Write a story about space"*\n- 📋 **Make lists** — *"Top 10 programming languages"*\n- 🌐 **Translate** — *"Translate hello to Japanese"*\n- 📝 **Summarize** — *"Summarize this conversation"*`,

            `Interesting! Tell me more about what you'd like to do. I'm great at:\n\n- **Answering questions** on any topic\n- **Writing code** in any language\n- **Creating content** — stories, emails, poems\n- **Generating images** from descriptions\n- **Explaining concepts** in simple terms\n- **Translating** between languages\n- **Summarizing** content\n\nWhat sounds good? 🚀`,
        ]
        return shortResponses[Math.floor(Math.random() * shortResponses.length)]
    }

    // Medium-length messages - give a thoughtful response
    return `That's a great point! Here are my thoughts on **"${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"**:

## 💭 My Analysis

Based on what you've shared, here are some key considerations:

### Key Insights
1. **Context matters** — Understanding the full picture is crucial for making informed decisions
2. **Multiple perspectives** — There are often several valid approaches to consider
3. **Practical application** — The best solution is one that works in your specific situation

### 💡 Recommendations
- Start by **clarifying your main goal** — what's the most important outcome?
- Consider the **trade-offs** between different approaches
- Don't overthink it — sometimes **starting small** and iterating is the best strategy
- **Ask for feedback** early and often

### 🔗 Related Topics You Might Find Useful
- Breaking down complex problems into smaller, manageable pieces
- Using frameworks and mental models for decision-making
- The 80/20 principle — focus on what gives the most impact

Would you like me to dive deeper into any of these points? I'm happy to elaborate on anything! 🎯`
}

// ===== MAIN EXPORT =====

export async function generateAIResponse(text, messageHistory = []) {
    const lower = text.toLowerCase()
    
    // Check if image request
    const isImageRequest = (
        (lower.includes('generate') || lower.includes('create') || lower.includes('make') || lower.includes('draw')) &&
        (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('art'))
    )

    if (isImageRequest) {
        const imgRes = generateImageResponse(text)
        return {
            response: imgRes.response,
            isImage: true,
            delay: 100
        }
    }

    try {
        let promptText = 'You are TryGPT, a helpful AI assistant. Format your answers in markdown. Keep them accurate and helpful.\n\n'
        
        const historyPayload = messageHistory.slice(-10).filter(m => !m.isImage)
        for (const m of historyPayload) {
            promptText += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`
        }
        promptText += `User: ${text}\nAssistant:`

        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}`)

        if (!res.ok) throw new Error('Pollinations API failed')
        const aiText = await res.text()
        
        if (aiText.toLowerCase().includes('limit reached') || aiText.toLowerCase().includes('rate limit') || aiText.toLowerCase().includes('quota')) {
            return { response: "⚠️ **Public API Limit Reached**\n\nThe free public backup servers are currently overloaded. To get unlimited, lightning-fast responses (including Multimodal Vision), please update your **Gemini API Key** in the Settings menu!", isImage: false, delay: 100 }
        }
        
        return { response: aiText, isImage: false, delay: 100 }
    } catch (e) {
        console.error("Local engine text generation failed:", e)
        return { response: "I'm having trouble connecting to the backup AI network right now. Please try again later.", isImage: false, delay: 100 }
    }
}
