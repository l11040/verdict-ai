export interface TokenUsage {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export interface TokenUsageMetadata {
  usage_metadata?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  response_metadata?: {
    token_usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}
