import { IMessageRole } from "@/types";
import { Message } from "ai";
/*
{
  id: '73e77cfb-ad69-4a33-9828-6ba6417e7603',
  createdAt: '2025-02-23T20:01:34.948Z',
  role: 'user',
  content: 'write ts quickSort',
  parts: [{type: "text", text: "write ts quickSort"}]
}
*/

export default function createBaseMessage(
  content: string,
  role: IMessageRole
): Message {
  const id = crypto.randomUUID();
  const createdAt = new Date();
  return {
    id,
    createdAt,
    role,
    content,
    parts: [{ type: "text", text: content }],
  };
}
