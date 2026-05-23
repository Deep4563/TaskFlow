import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { signToken } from "@/lib/jwt";
import { validateRegisterInput } from "@/lib/validators";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { name, email, password } = body;

    // 2. Validate input
    const errors = validateRegisterInput({ name, email, password });
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // 3. Connect to database
    await connectDB();

    // 4. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // 6. Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // 7. Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 8. Return response (never return password)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}