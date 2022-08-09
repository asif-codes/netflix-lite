import type { NextApiHandler } from "next";
import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

interface ResData {
  done?: boolean;
  error?: any;
  data?: any;
  user?: null;
  msg?: string;
  findVideo?: {};
}

const stats: NextApiHandler<ResData> = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({});
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;

      if (videoId) {
        const userId = await verifyToken(token);
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExists = findVideo?.length > 0;

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;

          if (doesStatsExists) {
            // update it
            const response = await updateStats(
              token,
              favourited,
              userId,
              watched,
              videoId
            );
            res.send({
              data: response,
            });
          } else {
            // add it
            const response = await insertStats(
              token,
              favourited,
              userId,
              watched,
              videoId
            );
            res.send({
              data: response,
            });
          }
        } else if (req.method === "GET") {
          if (doesStatsExists) {
            res.send({ findVideo });
          } else {
            res.status(404);
            res.send({ user: null, msg: "Video not found" });
          }
        }
      } else {
        res.status(500).send({ msg: "videoId is required" });
      }
    }
  } catch (error: any) {
    console.error("Error occoured /stats", error);
    res.status(500).send({ done: false, error: error?.message });
  }
};

export default stats;
