import { PrismaClient, Role } from "@prisma/client";
import argon2 from "argon2";
const prisma = new PrismaClient();

export const getUsersAbsen = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        Absensi: {
          where: {
            status: true,
          },
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(403).json({msg : error})
  }
};
// try {
//     const users = await prisma.user.findMany({
//       select: Role === "Siswa" ? {
//         name: true,
//         email: true
//       } : {
//         uid: true,
//         id: true,
//         name: true
//       }
//     });
//     res.status(200).json(users)
//   } catch (error) {

//   }

export const getUsersById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        name: true,
        email: true,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, id } = req.body;
  if (!password == confPassword) return res.status(400).json({ msg: "Password tidak sama" });
  const hashPassword = await argon2.hash(password);
  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        id: id,
      },
    });
    res.status(201).json({ msg: "Berhasil Registrasi" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { email, password, confPassword, id } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (!password == confPassword) return res.status(400).json({ msg: "Password tidak sama" });
  try {
    const userUpdate = await prisma.user.update({
      where: {
        email: email
      },
      data: {
        email: email,
        password: hashPassword
      }, 
    });
    res.status(200).json({ msg: "Password telah di update" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const userAbsen = async (req, res) => {
  // test id 2261727032
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "User id is required" });
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const date = new Date();
  const offset = 7;
  const localTime = date.getTime() + offset * 60 * 60 * 1000;
  const waktuWIB = new Date(localTime);

  const cekAbsensi = await prisma.absensi.findFirst({
    where: {
      idRf: id,
      tanggal: {
        gte: new Date(
          waktuWIB.getFullYear(),
          waktuWIB.getMonth(),
          waktuWIB.getDate(),
        ),
        lt: new Date(
          waktuWIB.getFullYear(),
          waktuWIB.getMonth(),
          waktuWIB.getDate() + 1,
        ),
      },
    },
  });
  if (cekAbsensi) {
    return res.status(409).json({ error: `Kamu Telah Absen Hari ini pada tanggal`});
  }

  const startTime = new Date(
    waktuWIB.getFullYear(),
    waktuWIB.getMonth(),
    waktuWIB.getDate(),
    6,
    0,
    0
  );
  const endTime = new Date(
    waktuWIB.getFullYear(),
    waktuWIB.getMonth(),
    waktuWIB.getDate(),
    7,
    30,
    0
  );

  // if (date < startTime || date > endTime) {
  //   return res.status(403).json({
  //     error: `Melewati batas waktu absensi dari jam 6:00 AM - 7:30 AM. Sekarang jam ${waktuWIB.toISOString()}`,
  //   });
  // }

  const newAbsensi = await prisma.absensi.create({
    data: {
      tanggal: waktuWIB.toISOString(),
      status: "HADIR",
      user: {
        connect: { id }
      },
    },
  });
  res.status(201).json(newAbsensi);
};
