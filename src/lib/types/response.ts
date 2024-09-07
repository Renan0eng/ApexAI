export type WebhookResponse = {
  type: "message" | "message_create" | "qrcode" | "ready" | "disconnected";
} & {
  [key: string]: any;
};
