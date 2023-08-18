import express from "express";
import { json } from "body-parser";
import cors from "cors";
import axios from "axios";
import {
  Event,
  EventCommentCreated,
  EventCommentUpdated,
  EventPostCreated,
  Posts,
} from "./types";

const app = express();
app.use(json());
app.use(cors());

const posts: Posts = {};

const handleEvent = ({ type, data }: Event) => {
  switch (type) {
    case "PostCreated":
      const { id, title } = data as EventPostCreated;

      posts[id] = { id: id, title, comments: posts?.[id]?.comments ?? [] };
      break;
    case "CommentCreated": {
      const { postId, ...comment } = data as EventCommentCreated;

      posts[postId].comments.push(comment);
      break;
    }
    case "CommentUpdated": {
      const {
        postId,
        id: commentId,
        ...eventComment
      } = data as EventCommentUpdated;

      const localComment = posts[postId].comments.find(
        (comment) => comment.id === commentId
      );

      if (localComment) {
        localComment.content = eventComment.content;
        localComment.status = eventComment.status;
      }

      break;
    }
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Received Event", { type, data });

  handleEvent({ type, data });

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const { data: events } = await axios.get<Event[]>(
    "http://localhost:4005/events"
  );

  events.forEach((event) => {
    console.log("Processing event: ", event.type);
    handleEvent(event);
  });
});
