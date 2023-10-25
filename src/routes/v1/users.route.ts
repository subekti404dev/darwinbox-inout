import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Urip",
      },
      {
        id: 2,
        name: "Subekti",
      },
    ],
  });
});

export default router;
