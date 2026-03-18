import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import app from './firebase';

const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });

const compactList = (items, mapFn, max = 6) => {
  return items
    .slice(0, max)
    .map(mapFn)
    .join('\n');
};

export const generateProgressInsight = async ({
  language,
  profile,
  metrics,
  tasks,
  goals,
  trackedApps
}) => {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const topPending = compactList(
    pendingTasks,
    (task, index) => `${index + 1}. ${task.title} [${task.priority}]`
  );
  const topGoals = compactList(
    goals,
    (goal, index) => `${index + 1}. ${goal.title}: ${goal.current}/${goal.target}`
  );
  const topApps = compactList(
    trackedApps,
    (appItem, index) =>
      `${index + 1}. ${appItem.name}: ${Math.round((appItem.totalSeconds || 0) / 60)} min total`
  );

  const lang = language || 'en';
  const prompt = `
You are an AI performance coach for the Upcore app.
Return only plain text.
Language: ${lang}.

User profile:
- Name: ${profile?.name || 'User'}
- Mission: ${profile?.mission || 'Not set'}

Productivity metrics:
- Completion rate: ${metrics?.completionRate || 0}%
- Completed tasks: ${metrics?.completedTasks || 0}
- Total tasks: ${metrics?.totalTasks || 0}
- Goals completed: ${metrics?.goalsCompleted || 0}
- Streak: ${metrics?.streak || 0} days
- Productivity score: ${metrics?.productivityScore || 0}/100

Pending tasks:
${topPending || 'No pending tasks'}

Goals:
${topGoals || 'No goals'}

App usage:
${topApps || 'No tracked apps'}

Write 4 short blocks:
1) What user does well
2) What to improve
3) 3 concrete actions for next 24 hours
4) One motivational sentence
Keep it practical and specific.
`.trim();

  const response = await model.generateContent(prompt);
  return response?.response?.text?.() || '';
};

export const generateAiChatReply = async ({
  language,
  profile,
  metrics,
  conversation,
  userMessage
}) => {
  const lang = language || 'en';
  const history = (conversation || [])
    .slice(-8)
    .map((entry) => `${entry.role === 'assistant' ? 'Coach' : 'User'}: ${entry.text}`)
    .join('\n');

  const prompt = `
You are Upcore AI coach.
Language: ${lang}.
User name: ${profile?.name || 'User'}.
Mission: ${profile?.mission || 'not set'}.
Streak: ${metrics?.streak || 0}.
Completion rate: ${metrics?.completionRate || 0}%.
Productivity score: ${metrics?.productivityScore || 0}.

Conversation history:
${history || 'No history'}

Current user message: ${userMessage}

Reply with:
- short friendly coaching answer,
- one concrete next step,
- optional warning if user is overloading.
Max 120 words.
`.trim();

  const response = await model.generateContent(prompt);
  return response?.response?.text?.() || '';
};
