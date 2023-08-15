import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { Posts } from "./types";

const app = express();
app.use(json());
app.use(cors());

const posts: Posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Received Event", { type, data });

  switch (type) {
    case "PostCreated":
      const { id, title } = data;

      posts[id] = { id: id, title, comments: posts?.[id]?.comments ?? [] };
      break;
    case "CommentCreated":
      const { id: commentId, content, postId } = data;

      posts[postId].comments.push({ id: commentId, content });
      break;
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
