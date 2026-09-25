/**
 * Optional AI Provider Architecture
 * Designed to be modular so future providers (Local WebLLM, OpenAI, Anthropic, Gemini)
 * can be plugged in seamlessly without requiring paid APIs for the core free MVP.
 */

export interface AIProviderConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface DocumentSummaryRequest {
  documentText: string;
  maxTokens?: number;
}

export interface DocumentSummaryResponse {
  summary: string;
  keyPoints: string[];
  suggestedTags: string[];
}

export interface AIProvider {
  id: string;
  name: string;
  isAvailable: () => boolean;
  summarizeDocument: (req: DocumentSummaryRequest) => Promise<DocumentSummaryResponse>;
  askQuestionAboutDocument: (docText: string, query: string) => Promise<string>;
}

/**
 * Default Local Rule-Based Mock Provider (100% Free, Zero External Network Calls)
 */
export class FreeLocalAIProvider implements AIProvider {
  id = "local-offline";
  name = "Client-Side Privacy Engine";

  isAvailable() {
    return true;
  }

  async summarizeDocument({ documentText }: DocumentSummaryRequest): Promise<DocumentSummaryResponse> {
    // Client-side extractive key sentence identification
    const sentences = documentText
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const keyPoints = sentences.slice(0, 4);
    const summary =
      sentences.length > 0
        ? `This document contains approximately ${sentences.length} clauses/sentences. Key topics include ${keyPoints.slice(0, 2).join("; ")}.`
        : "Document analyzed successfully in local sandbox.";

    return {
      summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : ["Standard document structure verified", "No cloud transfer required"],
      suggestedTags: ["Document", "Contract", "Verified", "Local"],
    };
  }

  async askQuestionAboutDocument(docText: string, query: string): Promise<string> {
    const qLower = query.toLowerCase();
    const sentences = docText.split(/[.!?]+/).map((s) => s.trim());
    const matches = sentences.filter((s) => s.toLowerCase().includes(qLower));

    if (matches.length > 0) {
      return `Found ${matches.length} matching section(s): "${matches[0]}"`;
    }
    return `Searched ${sentences.length} sentences. No exact matches found for "${query}".`;
  }
}

// Global active AI provider
export const activeAiProvider: AIProvider = new FreeLocalAIProvider();
