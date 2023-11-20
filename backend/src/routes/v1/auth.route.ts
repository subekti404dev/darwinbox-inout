import express, { Request, Response } from "express";
import md5 from 'md5';
const router = express.Router();

router.post("/verify", async (req: Request, res: Response) => {
 try {
  if (!process.env.PASSWORD) throw new Error("pass not setted")
  if (req.body.password !== process.env.PASSWORD) throw new Error("wrong pass")
  res.json({
    success: true,
    data: {
      token: md5(process.env.PASSWORD),
    },
  });
 } catch (error) {
  res.status(400).json({
    success: false,
    message: "wrong password"
  });
 }
});

export default router;
