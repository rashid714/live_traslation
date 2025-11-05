import { storage } from "../server/storage";
import {
  insertSessionSchema,
  insertMessageSchema,
  insertTranscriptSchema,
  insertDiscussionSchema,
  insertNoteSchema,
} from "../shared/schema";

let SEEDED = false;

async function seedOnce() {
  if (SEEDED) return;
  SEEDED = true;
  try {
    // Create a mix of users (students, professionals, general)
    const u1 = await storage.createUser({ username: "sarah", password: "pass", name: "Sarah Chen", language: "en", role: "teacher" });
    const u2 = await storage.createUser({ username: "ahmed", password: "pass", name: "Ahmed Hassan", language: "ar", role: "professional" });
    const u3 = await storage.createUser({ username: "maria", password: "pass", name: "Maria Rodriguez", language: "es", role: "student" });
    const u4 = await storage.createUser({ username: "james", password: "pass", name: "James Wilson", language: "en", role: "user" });

    // Sessions: corporate meeting, classroom lecture, community sermon
    const corporate = await storage.createSession({
      title: "Q4 Product Strategy Meeting",
      description: "Roadmap and key initiatives",
      hostId: u1.id,
      category: "Meeting",
      status: "ended",
      isLive: false,
      startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      endTime: new Date(Date.now() - 1000 * 30).toISOString(),
      participantCount: 14,
      languages: ["EN", "ZH", "AR"],
      qrCode: null,
    });
    const classroom = await storage.createSession({
      title: "Machine Learning Fundamentals",
      description: "Lecture week 3",
      hostId: u2.id,
      category: "Classroom",
      status: "ended",
      isLive: false,
      startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      participantCount: 120,
      languages: ["EN", "ES"],
      qrCode: null,
    });
    const sermon = await storage.createSession({
      title: "Friday Sermon",
      description: "Community center sermon",
      hostId: u3.id,
      category: "Community",
      status: "ended",
      isLive: false,
      startTime: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
      endTime: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
      participantCount: 300,
      languages: ["UR", "EN", "AR"],
      qrCode: null,
    });

    // Minimal transcripts for each
    await storage.createTranscript({ sessionId: corporate.id, speakerId: u1.id, text: "Welcome to our Q4 strategy meeting.", language: "EN", timestamp: new Date().toISOString(), duration: null });
    await storage.createTranscript({ sessionId: corporate.id, speakerId: u2.id, text: "Customer feedback indicates strong demand in APAC.", language: "EN", timestamp: new Date().toISOString(), duration: null });

    await storage.createTranscript({ sessionId: classroom.id, speakerId: u2.id, text: "Today we discuss supervised learning.", language: "EN", timestamp: new Date().toISOString(), duration: null });

    await storage.createTranscript({ sessionId: sermon.id, speakerId: u3.id, text: "Reflections on patience and gratitude.", language: "UR", timestamp: new Date().toISOString(), duration: null });

    // Discussion examples
    await storage.createDiscussion({ sessionId: corporate.id, userId: u4.id, question: "How does this change the mobile timeline?", language: "EN", upvotes: 5, timestamp: new Date().toISOString(), isAnswered: false });
  } catch {
    // ignore seed errors
  }
}

async function parseJson<T>(req: any): Promise<T | null> {
  try {
    if (!req.body || typeof req.body === "string") {
      return req.body ? (JSON.parse(req.body) as T) : (null);
    }
    return req.body as T;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  await seedOnce();
  const url = req.url || "/api";
  const method = req.method || "GET";

  // Strip the "/api" prefix
  const path = url.replace(/^\/api\/?/, "/");

  try {
    // Sessions
    if (method === "GET" && path === "/sessions") {
      return res.json(await storage.getAllSessions());
    }
    if (method === "GET" && path === "/sessions/active") {
      return res.json(await storage.getActiveSessions());
    }
    if (method === "GET" && path.startsWith("/sessions/")) {
      const id = path.split("/")[2];
      const s = await storage.getSession(id);
      return s ? res.json(s) : res.status(404).json({ error: "Session not found" });
    }
    if (method === "POST" && path === "/sessions") {
      const data = await parseJson<any>(req);
      const parsed = insertSessionSchema.parse(data);
      const created = await storage.createSession(parsed);
      return res.json(created);
    }
    if (method === "PATCH" && path.startsWith("/sessions/")) {
      const id = path.split("/")[2];
      const updates = (await parseJson<any>(req)) || {};
      const updated = await storage.updateSession(id, updates);
      return updated ? res.json(updated) : res.status(404).json({ error: "Session not found" });
    }

    // Transcripts
    if (method === "GET" && path.startsWith("/transcripts/session/")) {
      const sessionId = path.split("/")[3];
      return res.json(await storage.getTranscriptsBySession(sessionId));
    }
    if (method === "POST" && path === "/transcripts") {
      const data = await parseJson<any>(req);
      const parsed = insertTranscriptSchema.parse(data);
      const created = await storage.createTranscript(parsed);
      return res.json(created);
    }

    // Conversations
    if (method === "GET" && path === "/conversations") {
      return res.json(await storage.getAllConversations());
    }
    if (method === "GET" && path.startsWith("/conversations/")) {
      const id = path.split("/")[2];
      const c = await storage.getConversation(id);
      return c ? res.json(c) : res.status(404).json({ error: "Conversation not found" });
    }
    if (method === "POST" && path === "/conversations") {
      const data = await parseJson<any>(req);
      const created = await storage.createConversation(data);
      return res.json(created);
    }

    // Messages
    if (method === "GET" && path.startsWith("/messages/conversation/")) {
      const conversationId = path.split("/")[3];
      return res.json(await storage.getMessagesByConversation(conversationId));
    }
    if (method === "POST" && path === "/messages") {
      const data = await parseJson<any>(req);
      const parsed = insertMessageSchema.parse(data);
      const created = await storage.createMessage(parsed);
      return res.json(created);
    }

    // Discussions (Q&A)
    if (method === "GET" && path.startsWith("/discussions/session/")) {
      const sessionId = path.split("/")[3];
      return res.json(await storage.getDiscussionsBySession(sessionId));
    }
    if (method === "POST" && path === "/discussions") {
      const data = await parseJson<any>(req);
      const parsed = insertDiscussionSchema.parse(data);
      const created = await storage.createDiscussion(parsed);
      return res.json(created);
    }
    if (method === "PATCH" && path.startsWith("/discussions/")) {
      const id = path.split("/")[2];
      const updates = (await parseJson<any>(req)) || {};
      const updated = await storage.updateDiscussion(id, updates);
      return updated ? res.json(updated) : res.status(404).json({ error: "Discussion not found" });
    }

    // Notes (optional endpoints)
    if (method === "GET" && path.startsWith("/notes/user/")) {
      const userId = path.split("/")[3];
      return res.json(await storage.getNotesByUser(userId));
    }
    if (method === "GET" && path.startsWith("/notes/")) {
      const id = path.split("/")[2];
      const n = await storage.getNote(id);
      return n ? res.json(n) : res.status(404).json({ error: "Note not found" });
    }
    if (method === "POST" && path === "/notes") {
      const data = await parseJson<any>(req);
      const parsed = insertNoteSchema.parse(data);
      const created = await storage.createNote(parsed);
      return res.json(created);
    }
    if (method === "PATCH" && path.startsWith("/notes/")) {
      const id = path.split("/")[2];
      const updates = (await parseJson<any>(req)) || {};
      const updated = await storage.updateNote(id, updates);
      return updated ? res.json(updated) : res.status(404).json({ error: "Note not found" });
    }
    if (method === "DELETE" && path.startsWith("/notes/")) {
      const id = path.split("/")[2];
      const ok = await storage.deleteNote(id);
      return ok ? res.json({ success: true }) : res.status(404).json({ error: "Note not found" });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || "Bad Request" });
  }
}
