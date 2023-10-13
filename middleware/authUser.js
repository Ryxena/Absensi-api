import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const verifyUser = async (req, res, next) => {
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
    req.userSession = user.id
    req.role = user.role
    next()
}