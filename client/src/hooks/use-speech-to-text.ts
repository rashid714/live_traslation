import { useCallback, useEffect, useRef, useState } from "react";

type LangCode = "en" | "zh" | "es" | "ar" | "ur";

const LANG_MAP: Record<LangCode, string> = {
  en: "en-US",
  zh: "zh-CN",
  es: "es-ES",
  ar: "ar-SA",
  ur: "ur-PK",
};

export interface SpeechEntry {
  id: string;
  text: string;
  timestamp: string; // mm:ss
}

interface UseSpeechToTextOptions {
  language?: LangCode;
}

export function useSpeechToText({ language = "en" }: UseSpeechToTextOptions = {}) {
  const RecognitionRef = useRef<any | null>(null);
  const [supported, setSupported] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [entries, setEntries] = useState<SpeechEntry[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const langRef = useRef(language);

  useEffect(() => {
    langRef.current = language;
  }, [language]);

  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    setSupported(true);
    RecognitionRef.current = new SR();
    RecognitionRef.current.continuous = true;
    RecognitionRef.current.interimResults = true;
    RecognitionRef.current.lang = LANG_MAP[langRef.current];

    RecognitionRef.current.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
          const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
          const secs = (elapsed % 60).toString().padStart(2, "0");
          setEntries((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              text: transcript.trim(),
              timestamp: `${mins}:${secs}`,
            },
          ]);
          setInterimText("");
        } else {
          interim += transcript;
        }
      }
      if (interim) setInterimText(interim.trim());
    };

    RecognitionRef.current.onerror = (_e: any) => {
      // stop gracefully on error (e.g., permission denied)
      setIsRecording(false);
    };

    return () => {
      try {
        RecognitionRef.current?.stop?.();
      } catch {}
      RecognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!supported || !RecognitionRef.current) return;
    try {
      setEntries([]);
      setInterimText("");
      RecognitionRef.current.lang = LANG_MAP[langRef.current];
      RecognitionRef.current.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
    } catch {}
  }, [supported]);

  const stop = useCallback(() => {
    if (!RecognitionRef.current) return;
    try {
      RecognitionRef.current.stop();
    } catch {}
    setIsRecording(false);
    setInterimText("");
  }, []);

  return { supported, isRecording, interimText, entries, start, stop };
}
