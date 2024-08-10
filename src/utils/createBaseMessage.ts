import { IBaseMessage, IMessageRole, MessageService } from "../types";

export default function createBaseMessage(
  content: string,
  role: IMessageRole,
  service?: MessageService
): IBaseMessage {
  const now = Date.now();
  return {
    content,
    role,
    id: `${now}`,
    createdAt: now,
    updatedAt: now,
    service: service || "simpler",
  };
}
