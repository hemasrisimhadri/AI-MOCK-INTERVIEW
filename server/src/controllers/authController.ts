import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const usersFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "users.json",
);

const getUsers = (): User[] => {
  const data = fs.readFileSync(usersFilePath, "utf-8");

  return JSON.parse(data);
};

const saveUsers = (users: User[]) => {
  fs.writeFileSync(
    usersFilePath,
    JSON.stringify(users, null, 2),
  );
};

export const signup = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const users = getUsers();

    const existingUser = users.find(
      (user) => user.email === email,
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    saveUsers(users);

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const users = getUsers();

    const user = users.find(
      (user) => user.email === email,
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "JWT secret is not configured",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};