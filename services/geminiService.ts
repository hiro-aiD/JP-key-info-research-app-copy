
import { GoogleGenAI } from "@google/genai";
import type { SearchResult, Source } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

const parseGeminiResponse = (responseText: string): Omit<SearchResult, 'sources' | 'timestamp'> => {
  const keyPoints = responseText.split('### 要点')[1]?.split('### 詳細')[0]?.trim().split('\n').map(pt => pt.replace(/^- /, '')).filter(pt => pt) || [];
  const details = responseText.split('### 詳細')[1]?.split('### サマリー')[0]?.trim() || '詳細情報が見つかりませんでした。';
  const summary = responseText.split('### サマリー')[1]?.trim() || 'サマリーが見つかりませんでした。';
  
  return { keyPoints, details, summary };
};

export const fetchInformation = async (keyword: string): Promise<SearchResult> => {
  try {
    const prompt = `あなたは優秀なリサーチアシスタントです。以下のキーワードについて、ウェブ上の最新情報を調査し、指定されたフォーマットで日本語で回答してください。

キーワード: 「${keyword}」

フォーマット:
### 要点
- [主要なポイントを5〜7個、簡潔な箇条書きで記述]
- [ポイント2]
- ...

### 詳細
[要点を補足する詳細な情報や背景、文脈を段落形式で記述]

### サマリー
[全体を1〜2文で要約]
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const responseText = response.text;
    const parsedData = parseGeminiResponse(responseText);

    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = rawSources.map((s: any) => ({
      uri: s.web?.uri || '',
      title: s.web?.title || 'タイトル不明',
    })).filter(s => s.uri);

    // Remove duplicate sources
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
    
    return {
      ...parsedData,
      sources: uniqueSources,
      timestamp: new Date().toLocaleString('ja-JP'),
    };

  } catch (error) {
    console.error("Error fetching data from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
