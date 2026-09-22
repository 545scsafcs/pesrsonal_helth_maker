import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '../lib/db.js';
import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';
import WorkoutSession from '../models/WorkoutSession.js';
import WeightEntry from '../models/WeightEntry.js';
import WaterEntry from '../models/WaterEntry.js';
import NutritionEntry from '../models/NutritionEntry.js';
import { requireAuth } from '../lib/auth.js';

const MESS_MENU_DATA = {
  monday: { day: 'Monday', breakfast: 'Tea, Chole Rice / Rajma Rice, Pickle', lunch: 'Roti, Sabji, Chole, Rice, Pickle', dinner: 'Roti, Seasonal Sabji, Dal, Rice, Salad' },
  tuesday: { day: 'Tuesday', breakfast: 'Paratha', lunch: 'Biryani Rice', dinner: 'Chole, Poori, Kheer / Sawai, Salad' },
  wednesday: { day: 'Wednesday', breakfast: 'Fried Rice / Veg Pulao, Raita / Chutney', lunch: 'Aloo Soyabean, Roti, Rice, Pickle', dinner: 'Roti, Seasonal Sabji, Dal, Rice, Salad' },
  thursday: { day: 'Thursday', breakfast: 'Aloo Paratha, Chutney, Pickle', lunch: 'Roti, Seasonal Sabji, Dal, Rice, Pickle', dinner: 'Dal Makhni, Sabji, Roti, Rice, Salad' },
  friday: { day: 'Friday', breakfast: 'Poori, Sabji', lunch: 'Roti, Sabji, Dal, Rice, Pickle', dinner: 'Kadhi Pakoda, Aloo Jeera, Roti, Rice, Salad' },
  saturday: { day: 'Saturday', breakfast: 'Macaroni / Pasta', lunch: 'Chole Bhature, Salad, Pickle', dinner: 'Masala Baingan Bharta, Roti, Rice, Dal, Salad' },
  sunday: { day: 'Sunday', breakfast: 'Indori Poha', lunch: 'Veg Masala Biryani, Raita, Chutney', dinner: 'Matar Paneer / Kadhai Paneer / Matar Mushroom, Roti, Rice, Suji Halwa, Salad' },
};

const NORA_SYSTEM_PROMPT = `You are Nora, Vineet's personal AI assistant and fitness coach inside the Vineets_Helth OS app.

LANGUAGE & MULTILINGUAL INSTRUCTIONS:
- You natively understand English, Hindi, and Hinglish (Hindi written in Roman script).
- Always reply in the exact language or mix used by the user.
- Examples:
  - User: "Nora aaj maine kya kiya?" -> Reply in Hinglish with actual today's logged activities.
  - User: "Nora workout page kholo" -> Reply in Hinglish ("Sure Vineet! Opening workout page.") and call [TOOL_CALL: {"action": "navigate", "params": {"path": "/workout"}}].
  - User: "Nora 90 second ka timer lagao" -> Reply in Hinglish and call [TOOL_CALL: {"action": "startRestTimer", "params": {"seconds": 90}}].
  - User: "Nora mera weight 56.5 kg log karo" -> Reply in Hinglish and call [TOOL_CALL: {"action": "logWeight", "params": {"weight": 56.5}}].
  - User: "Nora Hindi mein baat karo" -> Reply warmly in Hindi.

PERSONALITY & BEHAVIOR:
- Supportive, intelligent, practical, slightly playful, motivating
- Context-aware — you know Vineet's profile, workout schedule, weight progress, mess menu, and water intake
- You call him "Vineet" naturally in conversation
- NEVER insult, shame, or use toxic motivation
- NEVER encourage dangerous exercises, starvation, or extreme diets
- NEVER diagnose medical conditions (recommend stopping & seeing a doctor if severe pain/injury is reported)
- NEVER invent or fabricate database metrics; if data is missing, clearly say it is not recorded yet

CONTROLLED TOOLS (20 Available Actions):
When the user requests an action, include a toolCall in this EXACT JSON format inside your response text:
[TOOL_CALL: {"action": "toolName", "params": {}}]

Available tools:
1. navigate: Params: {"path": "/dashboard" | "/workout" | "/time" | "/exercises" | "/progress" | "/attendance" | "/nutrition" | "/mess-menu" | "/weight" | "/water" | "/music" | "/settings"}
2. startWorkout: Params: {}
3. pauseWorkout: Params: {}
4. resumeWorkout: Params: {}
5. completeSet: Params: {"exerciseId": string, "setNumber": number}
6. skipExercise: Params: {"exerciseId": string}
7. startRestTimer: Params: {"seconds": number}
8. stopTimer: Params: {}
9. logWeight: Params: {"weight": number}
10. logWater: Params: {"glasses": number}
11. logMilk: Params: {"ml": number}
12. logMeal: Params: {"item": string}
13. getTodayPlan: Params: {}
14. getProgress: Params: {}
15. getAttendance: Params: {}
16. getNutrition: Params: {}
17. getWeeklyPlan: Params: {}
18. setRestDay: Params: {"dayIndex": number}
19. getMessMenu: Params: {"day": string}
20. getCurrentWorkout: Params: {}

VINEET'S PROFILE & GOALS:
- Height: 6 feet, Weight Goal: 56kg -> 60kg (healthy muscle gain)
- Equipment: 5kgx2 dumbbells, 12kgx1 dumbbell, bodyweight
- Hostel room workouts, mess food + milk (~300-400ml/day)`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authUser = requireAuth(req, res);
  if (!authUser) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return res.status(500).json({
      message: 'Gemini AI is not configured on the server.',
    });
  }

  try {
    let dbAvailable = true;
    let user = null;
    let prefs = null;
    let latestWeight = null;
    let waterToday = null;
    let todayWorkout = null;

    try {
      await connectDB();
      user = await User.findById(authUser.userId).select('-password');
      prefs = await UserPreferences.findOne({ userId: authUser.userId });
      latestWeight = await WeightEntry.findOne({ userId: authUser.userId }).sort({ date: -1 });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      waterToday = await WaterEntry.findOne({
        userId: authUser.userId,
        date: { $gte: today, $lt: tomorrow },
      });

      todayWorkout = await WorkoutSession.findOne({
        userId: authUser.userId,
        date: { $gte: today, $lt: tomorrow },
      });
    } catch (dbErr) {
      console.warn('Database error while building context for Nora:', dbErr?.message);
      dbAvailable = false;
    }

    const { message, file } = req.body;
    if (!message && !file) {
      return res.status(400).json({ message: 'Message or file attachment is required' });
    }

    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const now = new Date();
    const todayDayName = dayKeys[now.getDay()];
    const todayMess = MESS_MENU_DATA[todayDayName] || {};

    const contextStr = `
CURRENT APP CONTEXT:
- Database Available: ${dbAvailable ? 'Yes' : 'No'}
- User Name: ${user?.name || 'Vineet'}
- Current Weight: ${user?.currentWeight || 56} kg
- Target Weight: ${user?.targetWeight || 60} kg
- Latest Recorded Weight Entry: ${latestWeight ? `${latestWeight.weight} kg on ${new Date(latestWeight.date).toLocaleDateString('en-IN')}` : 'None recorded yet'}
- Today's Date: ${now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
- Today's Mess Menu (${todayMess.day || todayDayName}): Breakfast: ${todayMess.breakfast || 'N/A'}, Lunch: ${todayMess.lunch || 'N/A'}, Dinner: ${todayMess.dinner || 'N/A'}
- Water Today: ${waterToday ? `${waterToday.glasses} / ${prefs?.waterTarget || 8} glasses` : '0 / 8 glasses'}
- Today's Workout Status: ${todayWorkout ? (todayWorkout.status === 'completed' ? 'Completed' : 'In progress') : 'Not started'}
`;

    // Construct Gemini Content Parts (supporting text & multimodal base64 files)
    const parts = [];
    parts.push({ text: `${NORA_SYSTEM_PROMPT}\n\n${contextStr}\n\nUser Message: ${message || 'Please analyze this attached file.'}` });

    if (file && file.base64Data) {
      // Validate file size (max 5MB base64 length ~6.7MB)
      if (file.base64Data.length > 7000000) {
        return res.status(400).json({ message: 'Attached file exceeds maximum size limit of 5MB.' });
      }

      const mimeType = file.type || 'image/png';
      if (mimeType.startsWith('image/')) {
        parts.push({
          inlineData: {
            mimeType,
            data: file.base64Data,
          },
        });
      } else {
        // Document / text extraction for PDF / TXT / DOCX
        try {
          const decodedText = Buffer.from(file.base64Data, 'base64').toString('utf-8').slice(0, 8000);
          parts.push({
            text: `ATTACHED DOCUMENT (${file.name || 'document'}):\n${decodedText}`,
          });
        } catch (e) {
          console.warn('Document decoding warning:', e);
        }
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    let responseText = '';
    const targetModel = 'gemini-2.5-flash';
    let lastErr = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: targetModel });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts }],
        });
        responseText = result.response.text();
        break;
      } catch (err) {
        lastErr = err;
        const msg = String(err?.message || '');
        const is503 = err?.status === 503 || msg.includes('503') || msg.includes('high demand') || msg.includes('Service Unavailable');
        if (is503 && attempt < 3) {
          console.warn(`Gemini 503 high demand on attempt ${attempt}. Retrying in 800ms...`);
          await new Promise((r) => setTimeout(r, 800));
          continue;
        }
        throw err;
      }
    }

    if (!responseText && lastErr) {
      throw lastErr;
    }

    // Parse tool calls from response
    const toolCalls = [];
    const toolCallRegex = /\[TOOL_CALL:\s*(\{[\s\S]*?\})\s*\]/g;
    let match;
    while ((match = toolCallRegex.exec(responseText)) !== null) {
      try {
        toolCalls.push(JSON.parse(match[1]));
      } catch (e) {
        console.warn('Failed to parse tool call JSON:', e?.message);
      }
    }

    const cleanResponse = responseText.replace(/\[TOOL_CALL:\s*\{[\s\S]*?\}\s*\]/g, '').trim();

    return res.status(200).json({
      response: cleanResponse,
      toolCalls,
    });
  } catch (error) {
    console.error('AI error:', error?.message || error);
    const errMsg = String(error?.message || '');
    const errStatus = error?.status || error?.statusCode;

    if (errStatus === 401 || errStatus === 403 || errMsg.includes('API_KEY') || errMsg.includes('API key') || errMsg.includes('unauthorized')) {
      return res.status(401).json({ message: 'Gemini authentication failed. Check the configured API key.' });
    }
    if (errStatus === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ message: 'Gemini rate limit reached. Please try again shortly.' });
    }
    return res.status(500).json({ message: 'Nora could not process that request right now.' });
  }
}
