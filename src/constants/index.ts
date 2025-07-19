import { Player, PlayerType } from "@/types";

export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;

export const PLAYER_1: Omit<Player, "model" | "status"> = {
  id: PlayerType.Player1,
  name: "Player 1",
  piece: "P1",
  color: "bg-red-500",
};

export const PLAYER_2: Omit<Player, "model" | "status"> = {
  id: PlayerType.Player2,
  name: "Player 2",
  piece: "P2",
  color: "bg-yellow-400",
};

export const OPENROUTER_MODELS: { value: string; name: string }[] = [
  { value: "anthropic/claude-sonnet-4", name: "Anthropic: Claude Sonnet 4" },
  {
    value: "google/gemini-2.5-flash",
    name: "Google: Gemini 2.5 Flash",
  },
  { value: "google/gemini-2.5-pro", name: "Google: Gemini 2.5 Pro" },
  { value: "moonshotai/kimi-k2", name: "Moonshot: Kimi K2" },
  { value: "x-ai/grok-4", name: "xAI: Grok 4" },
  { value: "openai/gpt-4.1", name: "OpenAI: GPT-4.1" },
  { value: "openai/gpt-4.1-mini", name: "OpenAI: GPT-4.1 Mini" },
  { value: "deepseek/deepseek-r1-0528", name: "DeepSeek: R1 0528" },
  { value: "deepseek/deepseek-chat", name: "DeepsDeepSeek: DeepSeek V3" },
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

export const CUSTOM_MODEL_ID = "custom-openrouter";

export const ALL_MODELS = [
  ...OPENROUTER_MODELS,
  { value: CUSTOM_MODEL_ID, name: "Custom OpenRouter Model..." },
];
