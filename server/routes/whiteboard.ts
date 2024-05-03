import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

interface SessionData {
  sessionId: string;
  canvasName: string;
  canvasData: any;
  userEmail: string;
}

interface User {
  email: string;
  name: string;
}

interface UserAuthInfo extends Request {
  user: User;
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

router.get("/new", (req: UserAuthInfo, res: express.Response) => {
  const sessionId = uuidv4();
  sessions.push({
    sessionId: sessionId,
    canvasName: "Untitled Whiteboard",
    canvasData: {},
    userEmail: req.user.email,
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

router.delete("/:sessionId", (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const sessionData = sessions.find(
    (session) => session.sessionId === sessionId
  );
  let index = sessions.indexOf(sessionData);
  if (index > -1) {
    sessions.splice(index, 1);
    res.status(200).json("Whiteboard delete Successfully"); 
  } else {
    res.status(500).send("Unable to delete");
  }
});

router.post(
  "/:sessionId/save",
  async (req: UserAuthInfo, res: express.Response) => {
    const sessionId = req.params.sessionId;
    const { canvasData, canvasName } = req.body;

    const session = sessions.find((session) => session.sessionId === sessionId);
    if (!session) {
      res.status(404).send("Session not found");
      return;
    }
    if (session.userEmail !== req.user.email) {
      res.status(403).send("Unauthorized: You cannot modify this session");
      return;
    }

    session.canvasData = canvasData;
    session.canvasName = canvasName;

    res.status(200).json({ message: "Canvas data saved successfully" });
  }
);

export default router;
