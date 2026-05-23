import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { extractToken, verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract token from Authorization header
    const token = extractToken(
      request.headers.get("authorization")
    );

    // 2. Verify token
    const payload = verifyToken(token);

    // 3. Get user from database
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}