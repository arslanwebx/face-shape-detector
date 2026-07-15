interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 20_000;
const MAX_TRACKED_IPS = 1_000;
const DELIVERY_TIMEOUT_MS = 10_000;
const DEFAULT_TO_EMAIL = "contact@faceshapedetector.online";
const attempts = new Map<string, { count: number; resetAt: number }>();

function json(message: string, status = 200) {
  return Response.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );
}

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }

  if (!attempts.has(ip) && attempts.size >= MAX_TRACKED_IPS) {
    const oldestKey = attempts.keys().next().value;
    if (oldestKey) attempts.delete(oldestKey);
  }

  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

async function readJsonBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_BODY");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body)) as Record<string, unknown>;
}

export async function onRequestPost({ request, env }: PagesContext) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return json("The message is too large.", 413);
  if (rateLimited(clientIp(request))) {
    return json("Too many messages were submitted. Please wait 15 minutes or use the email link.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
      return json("The message is too large.", 413);
    }
    return json("The form data was invalid.", 400);
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();

  if (company) return json("The submission was rejected.", 400);
  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    subject.length < 3 ||
    subject.length > 160 ||
    message.length < 20 ||
    message.length > 5000
  ) {
    return json("Check the form fields and try again.", 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
    return json("Message delivery is temporarily unavailable. Please use the direct email link.", 503);
  }

  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL],
        reply_to: email,
        subject: `[VisageMetric] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    });

    if (!delivery.ok) {
      console.error("Contact delivery failed with provider status", delivery.status);
      return json("Your message could not be delivered. Please try again or use the direct email link.", 502);
    }

    return json("Message sent.");
  } catch (error) {
    console.error(
      "Contact delivery request failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return json("Your message could not be delivered. Please use the direct email link.", 502);
  }
}
