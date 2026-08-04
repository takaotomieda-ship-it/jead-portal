import nodemailer from "nodemailer";

const TO_EMAIL = "info@everlink-el.jp";

type RegisterPayload = {
  company: string;
  name: string;
  position: string;
  industry: string;
  email: string;
  message?: string;
  requestType: "registration" | "interview";
};

function isValidPayload(data: unknown): data is RegisterPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.company === "string" &&
    d.company.trim().length > 0 &&
    typeof d.name === "string" &&
    d.name.trim().length > 0 &&
    typeof d.position === "string" &&
    d.position.trim().length > 0 &&
    typeof d.industry === "string" &&
    d.industry.trim().length > 0 &&
    typeof d.email === "string" &&
    /.+@.+\..+/.test(d.email) &&
    (d.requestType === "registration" || d.requestType === "interview")
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { company, name, position, industry, email, message, requestType } =
    payload;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "465");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error("SMTP environment variables are not configured");
    return Response.json({ error: "server_not_configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject =
    requestType === "interview"
      ? `【JEAD】経営者面談のご希望（${company}）`
      : `【JEAD】研究登録（${company}）`;

  const textBody = [
    `会社名：${company}`,
    `お名前：${name}`,
    `ご役職：${position}`,
    `業種：${industry}`,
    `メールアドレス：${email}`,
    "",
    `ご希望内容：${
      requestType === "interview"
        ? "経営者面談（Executive Interview）"
        : "研究登録（Research Registration）"
    }`,
    "",
    "メッセージ：",
    message?.trim() || "（なし）",
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"JEAD Research Portal" <${smtpUser}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text: textBody,
    });
  } catch (err) {
    console.error("Failed to send registration email", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
