import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  const match = await argon2.verify(user.password, password);
  if (!match) return res.status(401).json({ msg: "wrong password" });
  req.session.userSession = user.id
  res.status(200).json({ message: "Login successful", user: req.session.userSession });
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: err });
    res.status(200).json({ msg: "Logout berhasil" });
  });
};

export const Me = async (req, res) => {
  if (!req.session.userSession) {
    return res.status(400).json({ msg: "Mohon Login Akun" });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.session.userSession
    },
  });
  if(!user) return res.status(400).json({msg: "User not found"})
  res.status(200).json({user: req.session.userSession})
};
