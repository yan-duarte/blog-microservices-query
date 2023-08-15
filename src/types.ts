export interface Posts {
  [postId: string]: {
    id: string;
    title: string;
    comments: {
      id: string;
      content: string;
    }[];
  };
}
