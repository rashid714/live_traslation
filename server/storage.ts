import {
  type User,
  type InsertUser,
  type Session,
  type InsertSession,
  type Transcript,
  type InsertTranscript,
  type Message,
  type InsertMessage,
  type Conversation,
  type InsertConversation,
  type Discussion,
  type InsertDiscussion,
  type Note,
  type InsertNote,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Session operations
  getSession(id: string): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  getActiveSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;

  // Transcript operations
  getTranscriptsBySession(sessionId: string): Promise<Transcript[]>;
  createTranscript(transcript: InsertTranscript): Promise<Transcript>;
  getTranscript(id: string): Promise<Transcript | undefined>;

  // Message operations
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: string): Promise<Message | undefined>;

  // Conversation operations
  getConversation(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  getUserConversations(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;

  // Discussion operations
  getDiscussionsBySession(sessionId: string): Promise<Discussion[]>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  updateDiscussion(id: string, updates: Partial<Discussion>): Promise<Discussion | undefined>;

  // Note operations
  getNotesByUser(userId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private transcripts: Map<string, Transcript>;
  private messages: Map<string, Message>;
  private conversations: Map<string, Conversation>;
  private discussions: Map<string, Discussion>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.transcripts = new Map();
    this.messages = new Map();
    this.conversations = new Map();
    this.discussions = new Map();
    this.notes = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name,
      avatar: insertUser.avatar || null,
      language: insertUser.language || 'en',
      role: insertUser.role || 'user',
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Session operations
  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async getActiveSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter((s) => s.isLive);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      id,
      title: insertSession.title,
      description: insertSession.description || null,
      hostId: insertSession.hostId,
      category: insertSession.category,
      status: insertSession.status || 'scheduled',
      isLive: insertSession.isLive || false,
      startTime: insertSession.startTime,
      endTime: insertSession.endTime || null,
      participantCount: insertSession.participantCount || 0,
      languages: insertSession.languages || null,
      qrCode: insertSession.qrCode || null,
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  // Transcript operations
  async getTranscriptsBySession(sessionId: string): Promise<Transcript[]> {
    return Array.from(this.transcripts.values())
      .filter((t) => t.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createTranscript(insertTranscript: InsertTranscript): Promise<Transcript> {
    const id = randomUUID();
    const transcript: Transcript = {
      id,
      sessionId: insertTranscript.sessionId,
      speakerId: insertTranscript.speakerId,
      text: insertTranscript.text,
      language: insertTranscript.language,
      timestamp: insertTranscript.timestamp,
      duration: insertTranscript.duration || null,
    };
    this.transcripts.set(id, transcript);
    return transcript;
  }

  async getTranscript(id: string): Promise<Transcript | undefined> {
    return this.transcripts.get(id);
  }

  // Message operations
  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      conversationId: insertMessage.conversationId,
      senderId: insertMessage.senderId,
      text: insertMessage.text,
      originalLanguage: insertMessage.originalLanguage,
      isVoiceMessage: insertMessage.isVoiceMessage || false,
      timestamp: insertMessage.timestamp,
    };
    this.messages.set(id, message);

    // Update conversation's last message
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessage = message.text;
      conversation.lastMessageTime = message.timestamp;
      this.conversations.set(conversation.id, conversation);
    }

    return message;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  // Conversation operations
  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter((c) => c.participants?.includes(userId))
      .sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      id,
      name: insertConversation.name || null,
      isGroup: insertConversation.isGroup || false,
      participants: insertConversation.participants || null,
      lastMessage: insertConversation.lastMessage || null,
      lastMessageTime: insertConversation.lastMessageTime || null,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    const updated = { ...conversation, ...updates };
    this.conversations.set(id, updated);
    return updated;
  }

  // Discussion operations
  async getDiscussionsBySession(sessionId: string): Promise<Discussion[]> {
    return Array.from(this.discussions.values())
      .filter((d) => d.sessionId === sessionId)
      .sort((a, b) => b.upvotes - a.upvotes);
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = randomUUID();
    const discussion: Discussion = {
      id,
      sessionId: insertDiscussion.sessionId,
      userId: insertDiscussion.userId,
      question: insertDiscussion.question,
      language: insertDiscussion.language,
      upvotes: insertDiscussion.upvotes || 0,
      timestamp: insertDiscussion.timestamp,
      isAnswered: insertDiscussion.isAnswered || false,
    };
    this.discussions.set(id, discussion);
    return discussion;
  }

  async updateDiscussion(id: string, updates: Partial<Discussion>): Promise<Discussion | undefined> {
    const discussion = this.discussions.get(id);
    if (!discussion) return undefined;
    const updated = { ...discussion, ...updates };
    this.discussions.set(id, updated);
    return updated;
  }

  // Note operations
  async getNotesByUser(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      id,
      userId: insertNote.userId,
      title: insertNote.title,
      content: insertNote.content,
      format: insertNote.format || 'notes',
      duration: insertNote.duration || null,
      timestamp: insertNote.timestamp,
      sessionId: insertNote.sessionId || null,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    const updated = { ...note, ...updates };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }
}

export const storage = new MemStorage();
