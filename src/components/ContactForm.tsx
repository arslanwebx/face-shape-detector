"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactForm() {
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const subject = String(values.get("subject") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    if (!name || !email || !subject || message.length < 20) {
      setError("Complete every field and write at least 20 characters in the message.");
      return;
    }
    setError("");
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label>Subject<input name="subject" required /></label>
      <label>Message<textarea name="message" rows={7} minLength={20} required /></label>
      <p className="form-note">This form opens your email application. It does not send or store the message on this website. Do not include a face photo or sensitive information.</p>
      {error && <p className="error-message" role="alert">{error}</p>}
      <button className="button" type="submit">Open email application</button>
      <p>Or email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> directly.</p>
    </form>
  );
}
