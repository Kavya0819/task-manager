import { Router } from "express";
import prisma from "./prisma";
import { authMiddleware } from "./middleware";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  const userId = (req as any).user.userId;

  const task = await prisma.task.create({
    data: {
      title,
      status: "TODO",
      userId,
    },
  });

  // emit socket event
  req.app.get("io").emit("task:update");

  res.json(task);
});

router.get("/", authMiddleware, async (req, res) => {
  const userId = (req as any).user.userId;

  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  res.json(tasks);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  const userId = (req as any).user.userId;

  const task = await prisma.task.updateMany({
    where: { id, userId },
    data: { title, status },
  });

  // emit socket event
  req.app.get("io").emit("task:update");

  res.json({ message: "Task updated", task });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  await prisma.task.deleteMany({
    where: { id, userId },
  });

  // emit socket event
  req.app.get("io").emit("task:update");

  res.json({ message: "Task deleted" });
});

export default router;
