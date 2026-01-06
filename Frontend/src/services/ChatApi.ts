// const API_BASE = "https://llm-customer-support.onrender.com";
const LOCAL_API_BASE = "http://localhost:3000";

export async function fetchConversation(conversationID: string) {
  const res = await fetch(`${LOCAL_API_BASE}/chat/${conversationID}`);

  if (!res.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return res.json();
}

export async function sendChatMessage(
  message: string,
  conversationID?: string
) {
  const res = await fetch(`${LOCAL_API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationID }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}
