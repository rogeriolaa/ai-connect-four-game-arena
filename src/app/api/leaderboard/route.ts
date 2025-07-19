import { db } from "@/lib/db";
import { leaderboard } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scores = await db
      .select()
      .from(leaderboard)
      .orderBy(leaderboard.score);
    return NextResponse.json(scores);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { playerName, score } = await request.json();

    if (!playerName || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await db
      .insert(leaderboard)
      .values({
        playerName,
        score,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add score" }, { status: 500 });
  }
}
