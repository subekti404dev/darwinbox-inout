import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      use_password: !!process.env.PASSWORD,
    },
  });
});

export default router;
