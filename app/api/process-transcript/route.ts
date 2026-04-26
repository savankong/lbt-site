import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are an expert content editor for Life Between Titles, a podcast about career transition, professional identity, and reinvention hosted by Savan Kong.

Your job is to read a raw podcast transcript and extract structured data for a fully SEO-optimized episode page.

WRITING RULES (non-negotiable):
- Short punchy sentences. Contractions throughout.
- No em dashes or en dashes anywhere. Use commas or restructure.
- No bold headings in descriptions or summaries.
- No generic emotional openers ("This hit me," "This resonated," etc.)
- No paragraph-ending summary sentences.
- Guest bio opening lines must be specific and varied — never use "X is many things depending on who you ask."
- Episode titles lead with problem or outcome, not guest name. Format: [Guest Name] on [Topic Keyword] After [Transition Moment]
- Pull quotes must be the guest's actual words from the transcript, verbatim.
- Q&A excerpts must use actual questions Savan asked and the guest's actual answers, paraphrased cleanly.
- Chapters must reflect real timestamps if present in transcript, otherwise estimate based on content flow.

SEO RULES:
- Meta description: 150-160 characters, includes guest name, topic, and outcome keyword.
- Key topics: 5-7 bullets, each starting with "How to" or a clear outcome phrase.
- Story bullets: 4-6 narrative sentences describing what happens in the episode.
- Slug format: firstname-lastname-descriptor (e.g. jordan-swanson-craniofacial-surgeon)

You must respond ONLY with valid JSON. No preamble, no explanation, no markdown fences.`

const USER_PROMPT = (transcript: string, series: string, episodeNumber: number) => `
Series: ${series}
Episode number: ${episodeNumber}

Transcript:
${transcript.slice(0, 80000)}

Extract and return this exact JSON structure:
{
  "slug": "firstname-lastname-descriptor",
  "guest_name": "Full Name",
  "guest_title": "Their current role/title",
  "guest_bio": "2-3 sentence bio. Specific, varied opening. No dashes.",
  "guest_field_explainer": "1-2 paragraphs explaining what this person's field or work actually is, for someone unfamiliar. Plain language.",
  "episode_title": "Guest Name on Topic Keyword After Transition Moment",
  "meta_description": "150-160 char SEO description with guest name and outcome keyword",
  "summary": "3-4 sentence episode summary. What happened in this conversation. No dashes.",
  "key_topics": [
    "How to ...",
    "How to ...",
    "What it means to ...",
    "Why ...",
    "How to ..."
  ],
  "pull_quote": "Verbatim quote from the guest, 1-3 sentences, most resonant moment",
  "qa_excerpts": [
    { "question": "Paraphrased question Savan asked", "answer": "2-3 sentence paraphrase of the guest's answer" },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ],
  "career_path": "2-3 paragraph narrative of how the guest got to where they are. Written in third person. No dashes.",
  "what_makes_different": "1-2 paragraphs on what makes this career or path unusual or harder than it looks.",
  "story_bullets": [
    "Narrative sentence about something that happens in the episode.",
    "...",
    "...",
    "..."
  ],
  "chapters": [
    { "time": "0:00", "title": "Introduction" },
    { "time": "...", "title": "..." }
  ]
}
`

export async function POST(req: NextRequest) {
  try {
    // Simple admin auth check
    const authHeader = req.headers.get('x-admin-password')
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transcript, series, episodeNumber } = await req.json()

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT(transcript, series, episodeNumber),
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: rawText },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (err) {
    console.error('Transcript processing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
