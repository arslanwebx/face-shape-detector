"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "handoff" | "error";

function validate(values: FormData) {
  const errors: FieldErrors = {};
  const name = String(values.get("name") ?? "").trim();
  const email = String(values.get("email") ?? "").trim();
  const subject = String(values.get("subject") ?? "").trim();
  const message = String(values.get("message") ?? "").trim();

  if (name.length < 2) errors.name = "Enter your name using at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (subject.length < 3) errors.subject = "Enter a subject using at least 3 characters.";
  if (message.length < 20) errors.message = "Write at least 20 characters so we can understand the issue.";

  return errors;
}

export default function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const subjectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get("subject");
    if (subject && subjectRef.current && !subjectRef.current.value) subjectRef.current.value = subject.slice(0, 160);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatusMessage("");

    if (Object.keys(nextErrors).length) {
      setStatus("error");
      setStatusMessage("Check the highlighted fields and try again.");
      return;
    }

    if (String(values.get("company") ?? "").trim()) {
      setStatus("error");
      setStatusMessage("The submission was rejected.");
      return;
    }

    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const subject = String(values.get("subject") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    setStatus("handoff");
    setStatusMessage("Your email app should open with this message. Review it and press Send there; nothing has been sent yet.");
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field = (name: FieldName) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" maxLength={100} required {...field("name")} />{errors.name && <span id="name-error" className="field-error">{errors.name}</span>}</label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required {...field("email")} />{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</label>
      </div>
      <label>Subject<input ref={subjectRef} name="subject" maxLength={160} required {...field("subject")} />{errors.subject && <span id="subject-error" className="field-error">{errors.subject}</span>}</label>
      <label>Message<textarea name="message" rows={7} minLength={20} maxLength={5000} required {...field("message")} />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</label>
      <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-note">Do not include a face photo, facial measurements, medical information, passwords, or other sensitive material.</p>
      {statusMessage && <p className={status === "error" ? "error-message" : "success-message"} role={status === "error" ? "alert" : "status"} aria-live="polite">{statusMessage}</p>}
      <button className="button" type="submit">Open email app</button>
      <p className="form-fallback">This form does not send data to the website. It prepares an email for you to review and send to <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p>
    </form>
  );
}
