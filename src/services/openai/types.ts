export interface TriviaPrompt {
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface TriviaResponse {
  question: string;
  answer: string;
  options: string[];
  explanation: string;
}
