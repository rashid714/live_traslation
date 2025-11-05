import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  insertSessionSchema,
  insertMessageSchema,
  insertTranscriptSchema,
  insertDiscussionSchema,
  insertNoteSchema,
  insertConversationSchema,
  type InsertSession,
  type InsertMessage,
  type InsertTranscript,
  type InsertDiscussion,
  type InsertNote,
  type InsertConversation,
} from "@shared/schema";

// Simple translation simulation (replace with real API in production)
const simulateTranslation = (text: string, fromLang: string, toLang: string): string => {
  if (fromLang === toLang) return text;
  
  // Guideline-compliant translation marker without emojis
  return `[${toLang.toUpperCase()} translation from ${fromLang.toUpperCase()}]: ${text}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  const clients = new Map<string, WebSocket>();
  
  wss.on("connection", (ws: WebSocket) => {
    const clientId = Math.random().toString(36).substring(7);
    clients.set(clientId, ws);
    
    ws.on("message", (data: string) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast to all other clients
        clients.forEach((client, id) => {
          if (id !== clientId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    
    ws.on("close", () => {
      clients.delete(clientId);
    });
  });

  // Session routes
  app.get("/api/sessions", async (_req, res) => {
    const sessions = await storage.getAllSessions();
    res.json(sessions);
  });

  app.get("/api/sessions/active", async (_req, res) => {
    const sessions = await storage.getActiveSessions();
    res.json(sessions);
  });

  app.get("/api/sessions/:id", async (req, res) => {
    const session = await storage.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data", details: error });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    const updates = req.body;
    const session = await storage.updateSession(req.params.id, updates);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    // Broadcast session update
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "session_update", data: session }));
      }
    });
    
    res.json(session);
  });

  // Transcript routes
  app.get("/api/transcripts/session/:sessionId", async (req, res) => {
    const transcripts = await storage.getTranscriptsBySession(req.params.sessionId);
    res.json(transcripts);
  });

  app.post("/api/transcripts", async (req, res) => {
    try {
      const transcriptData = insertTranscriptSchema.parse(req.body);
      const transcript = await storage.createTranscript(transcriptData);
      
      // Broadcast new transcript
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "new_transcript", data: transcript }));
        }
      });
      
      res.json(transcript);
    } catch (error) {
      res.status(400).json({ error: "Invalid transcript data", details: error });
    }
  });

  // Conversation routes
  app.get("/api/conversations", async (_req, res) => {
    const conversations = await storage.getAllConversations();
    res.json(conversations);
  });

  app.get("/api/conversations/:id", async (req, res) => {
    const conversation = await storage.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data", details: error });
    }
  });

  // Message routes
  app.get("/api/messages/conversation/:conversationId", async (req, res) => {
    const messages = await storage.getMessagesByConversation(req.params.conversationId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Simulate translation if needed
      const translatedText = messageData.originalLanguage !== 'en' 
        ? simulateTranslation(message.text, messageData.originalLanguage, 'en')
        : message.text;
      
      // Broadcast new message with translation
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ 
            type: "new_message", 
            data: { ...message, translatedText } 
          }));
        }
      });
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data", details: error });
    }
  });

  // Discussion/Q&A routes
  app.get("/api/discussions/session/:sessionId", async (req, res) => {
    const discussions = await storage.getDiscussionsBySession(req.params.sessionId);
    res.json(discussions);
  });

  app.post("/api/discussions", async (req, res) => {
    try {
      const discussionData = insertDiscussionSchema.parse(req.body);
      const discussion = await storage.createDiscussion(discussionData);
      
      // Broadcast new question
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "new_question", data: discussion }));
        }
      });
      
      res.json(discussion);
    } catch (error) {
      res.status(400).json({ error: "Invalid discussion data", details: error });
    }
  });

  app.patch("/api/discussions/:id", async (req, res) => {
    const updates = req.body;
    const discussion = await storage.updateDiscussion(req.params.id, updates);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    res.json(discussion);
  });

  // Note routes
  app.get("/api/notes/user/:userId", async (req, res) => {
    const notes = await storage.getNotesByUser(req.params.userId);
    res.json(notes);
  });

  app.get("/api/notes/:id", async (req, res) => {
    const note = await storage.getNote(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data", details: error });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const updates = req.body;
    const note = await storage.updateNote(req.params.id, updates);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const deleted = await storage.deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true });
  });

  // User routes
  app.get("/api/users", async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  return httpServer;
}
