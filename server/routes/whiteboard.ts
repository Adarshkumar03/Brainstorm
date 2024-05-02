import express from "express";
import { v4 as uuidv4 } from "uuid";

interface SessionData {
  sessionId: string;
  canvasName: string;
  canvasData: any;
}

const router = express.Router();
const sessions: SessionData[] = [];

router.get("/all", (req: express.Request, res: express.Response) => {
  const simplifiedSessions = sessions.map((session) => ({
    sessionId: session.sessionId,
    canvasName: session.canvasName,
  }));
  res.json(simplifiedSessions);
});

router.get("/new", (req: express.Request, res: express.Response) => {
  const sessionId = uuidv4();
  sessions.push({
    sessionId: sessionId,
    canvasName: "Untitled Whiteboard",
    canvasData: {},
  });
  res.json({ sessionId });
});

router.get("/:sessionId", (req: express.Request, res: express.Response) => {
  const sessionId = req.params.sessionId;
  const sessionData = sessions.find(
    (session) => session.sessionId === sessionId
  );

  if (!sessionData) {
    res.status(404).send("Session not found");
    return;
  }

  res.json({
    sessionId: sessionData.sessionId,
    canvasData: sessionData.canvasData,
    canvasName: sessionData.canvasName,
  });
});

router.post(
  "/:sessionId/save",
  async (req: express.Request, res: express.Response) => {
    const sessionId = req.params.sessionId;
    const { canvasData, canvasName } = req.body;

    const session = sessions.find((session) => session.sessionId === sessionId);
    if (!session) {
      res.status(404).send("Session not found");
      return;
    }

    session.canvasData = canvasData;
    session.canvasName = canvasName;

    res.status(200).json({ message: "Canvas data saved successfully" });
  }
);

export default router;
