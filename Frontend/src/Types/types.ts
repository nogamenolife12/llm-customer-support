export type Message = {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  createdAt: string;
};