export interface Posts {
  [postId: string]: {
    id: string;
    title: string;
    comments: {
      id: string;
      content: string;
      status: "pending" | "approved" | "rejected";
    }[];
  };
}

export interface Event {
  type: string;
  data: Record<string, unknown>;
}

export type EventPostCreated = {
  id: string
  title: string
}

export type EventCommentCreated = {
  id: string;
  postId: string;
  content: string;
  status: "pending" | "approved" | "rejected";
};


export type EventCommentUpdated = EventCommentCreated