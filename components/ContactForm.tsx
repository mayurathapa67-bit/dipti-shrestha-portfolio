"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      subject: String(data.get("subject") || ""),
      message: String(data.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Thank you! Your message has been sent.");
        form.reset();
        router.refresh();
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="field"
            placeholder="Jane Developer"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          required
          className="field"
          placeholder="Documentation project enquiry"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="field resize-none"
          placeholder="Tell me about your product and documentation needs..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-accent w-full disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
        {status !== "loading" && <Icon name="arrow" />}
      </button>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg px-4 py-3 text-sm ${
            status === "success"
              ? "bg-teal/10 text-teal-dark"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </motion.p>
      )}
    </form>
  );
}
