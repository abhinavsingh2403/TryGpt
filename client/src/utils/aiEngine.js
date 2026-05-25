const imageVerbs = ['generate', 'create', 'make', 'draw']
const imageNouns = ['image', 'picture', 'photo', 'art']

const clean = (text) => String(text || '').trim()

function generateImageResponse(prompt) {
    const cleanPrompt = clean(prompt).replace(/generate|create|make|draw|an image of|a picture of/gi, '').trim() || 'beautiful scenery'
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`

    return {
        response: imageUrl,
        prompt: cleanPrompt,
        isImage: true,
    }
}

function jobFollowUpEmail(prompt) {
    const isPostInterview = /interview|meeting|spoke|conversation/i.test(prompt)

    if (isPostInterview) {
        return `Subject: Thank You for Your Time\n\nDear [Hiring Manager's Name],\n\nThank you for taking the time to speak with me about the [Job Title] role at [Company Name]. I enjoyed learning more about the team, the responsibilities of the position, and the impact this role can make.\n\nOur conversation strengthened my interest in the opportunity. I believe my experience in [relevant skill or area] and my ability to [relevant achievement or strength] would allow me to contribute meaningfully to your team.\n\nPlease let me know if I can provide any additional information. I appreciate your time and consideration, and I look forward to hearing about the next steps.\n\nBest regards,\n[Your Name]`
    }

    return `Subject: Following Up on My Application for [Job Title]\n\nDear [Hiring Manager's Name],\n\nI hope you are doing well. I recently applied for the [Job Title] position at [Company Name] and wanted to follow up on my application.\n\nI am very interested in this opportunity because it aligns closely with my experience in [relevant skill or field] and my interest in contributing to [company/team goal]. I would be grateful for the chance to discuss how my background and enthusiasm can support your team.\n\nPlease let me know if there is any additional information I can provide. Thank you for your time and consideration.\n\nBest regards,\n[Your Name]`
}

function codeStarter(prompt) {
    const wantsExpress = /express|node|api|backend/i.test(prompt)
    if (!wantsExpress) {
        return `Here is a clean starting point you can adapt:\n\n\`\`\`javascript\nfunction main() {\n  console.log('Hello from TryGPT fallback mode');\n}\n\nmain();\n\`\`\`\n\nThis local response was generated because the live AI service is temporarily unavailable.`
    }

    return `Here is a production-friendly Express starter:\n\n\`\`\`javascript\nimport express from 'express';\nimport helmet from 'helmet';\nimport cors from 'cors';\n\nconst app = express();\nconst PORT = process.env.PORT || 5000;\n\napp.use(helmet());\napp.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));\napp.use(express.json({ limit: '1mb' }));\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok', uptime: process.uptime() });\n});\n\napp.get('/api/example', (req, res) => {\n  res.json({ message: 'API is working' });\n});\n\napp.use((req, res) => {\n  res.status(404).json({ message: 'Route not found' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});\n\`\`\`\n\nRecommended next steps: add environment validation, request logging, integration tests, and database connection handling.`
}

function generalFallback(prompt) {
    return `I can still help while the live AI service is temporarily unavailable.\n\nYou asked: "${prompt}"\n\nHere is a practical way to move forward:\n\n- Clarify the goal in one sentence.\n- List the constraints or context that matter.\n- Draft the first version quickly.\n- Review it for accuracy, tone, and missing details.\n\nIf this is for writing, share the audience and desired tone. If it is for code, share the framework, inputs, expected output, and the error you are seeing.`
}

export async function generateAIResponse(text, options = {}) {
    const prompt = clean(text)
    const lower = prompt.toLowerCase()

    const isImageRequest = imageVerbs.some((verb) => lower.includes(verb)) && imageNouns.some((noun) => lower.includes(noun))
    if (isImageRequest) {
        const imgRes = generateImageResponse(prompt)
        return {
            response: imgRes.response,
            prompt: imgRes.prompt,
            isImage: true,
            delay: 100,
        }
    }

    const isQuotaFallback = /quota|rate limit|too many|429|free tier/i.test(options.reason || '')
    let response

    if (/email|mail|follow.?up|application/i.test(lower)) {
        response = jobFollowUpEmail(prompt)
    } else if (/code|express|api|server|javascript|node/i.test(lower)) {
        response = codeStarter(prompt)
    } else {
        response = generalFallback(prompt)
    }

    if (isQuotaFallback) {
        response = `Live AI is temporarily rate-limited, so I prepared a polished local draft instead.\n\n${response}`
    }

    return {
        response,
        isImage: false,
        delay: 120,
    }
}
