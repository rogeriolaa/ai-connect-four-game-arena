export const saveGameResult = async (playerName: string, score: number) => {
  try {
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName, score }),
    });

    if (!response.ok) {
      throw new Error("Failed to save game result");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving game result:", error);
    throw error;
  }
};
