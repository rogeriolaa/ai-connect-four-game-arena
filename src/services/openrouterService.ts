import { getValidMoves } from "@/game/connectFour";
import { Board, Player, PlayerType } from "@/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getBoardString = (board: Board): string => {
  return board.map((row) => row.join(", ")).join("\n");
};

export const getOpenRouterAIMove = async (
  model: string,
  board: Board,
  player: Player,
  apiKey: string,
  // Add a callback to log messages to the UI
  addToLog: (message: string, player?: PlayerType) => void
): Promise<number> => {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) {
    throw new Error("No valid moves available.");
  }
  const boardString = getBoardString(board);

  const systemPrompt = `You are a world-class Connect Four player. Your goal is to win the game. The board is represented as a 6x7 grid. 0=Empty, 1=Player1, 2=Player2. You are ${
    player.name
  } and your piece is ${player.id}.
The current board state is:
${boardString}
Analyze the board and make the most strategic move. You must choose one of the available columns. The available columns are: [${validMoves.join(
    ", "
  )}].
Return your move as a JSON object with a single key "column". For example: {"column": 3}`;

  const userPrompt = `Based on the system instructions, what is your next move? You must only output a valid JSON object. The available columns are [${validMoves.join(
    ", "
  )}].`;

  const maxRetries = 3;
  let delay = 2000; // 2 seconds initial delay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ai-board-game-arena.web.app", // Recommended by OpenRouter
            "X-Title": "AI Board Game Arena", // Recommended by OpenRouter
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 50,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
          throw new Error("AI response was empty.");
        }

        const parsed = JSON.parse(content);

        if (
          typeof parsed.column === "number" &&
          validMoves.includes(parsed.column)
        ) {
          return parsed.column;
        } else {
          console.warn(
            `AI returned invalid column ${
              parsed.column
            }. Valid moves are [${validMoves.join(
              ", "
            )}]. Falling back to random for this turn.`
          );
          addToLog(
            `${player.name} returned an invalid move. Picking a random one.`,
            player.id
          );
          return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
      }

      // Handle rate limiting specifically
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || "Rate limit exceeded.";
        console.warn(
          `OpenRouter Rate Limit (Attempt ${attempt}/${maxRetries}): ${errorMessage}`
        );
        if (attempt < maxRetries) {
          addToLog(
            `Rate limit hit. Retrying in ${delay / 1000}s...`,
            player.id
          );
          await sleep(delay);
          delay *= 2; // Exponential backoff
        }
        continue; // Move to the next attempt
      }

      // Handle other server/client errors
      const errorData = await response
        .json()
        .catch(() => ({ error: { message: "Unknown API error" } }));
      throw new Error(
        `OpenRouter API error (${response.status}): ${errorData.error?.message}`
      );
    } catch (e) {
      console.error(`Error on attempt ${attempt} for OpenRouter:`, e);
      if (attempt >= maxRetries) {
        // If this was the last attempt, break the loop and fall back
        break;
      }
      // For network errors or other exceptions, wait before retrying
      if (e instanceof Error && !e.message.includes("API error")) {
        // Don't wait again if it was a non-429 API error
        await sleep(delay);
        delay *= 2;
      }
    }
  }

  // Fallback: if all retries fail, pick a random valid move
  addToLog(
    `API for ${player.name} failed after all retries. Making a random move.`,
    player.id
  );
  console.error(
    "Failed to get move from OpenRouter after all retries. Falling back to random move."
  );
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};
