import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Mail, Building, CheckCircle2 } from "lucide-react";

export default function ClientInquirySystem({
  details: propDetails,
  setDetails: propSetDetails
}: {
  details?: string;
  setDetails?: (val: string) => void;
} = {}) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [localDetails, setLocalDetails] = useState("");

  const details = propDetails !== undefined ? propDetails : localDetails;
  const setDetails = propSetDetails !== undefined ? propSetDetails : setLocalDetails;

  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !details) return;

    setIsSending(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          company,
          details,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to transmit message. Please try again.");
      }

      // Reset Form & Show success
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setCompany("");
      setDetails("");

      setTimeout(() => {
        setIsSubmitted(false);
      }, 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="w-full space-y-6" id="client-leads-container">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="p-8 text-center space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="text-lg font-bold text-white">Message Transmitted!</h4>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                Daniel Santos has received your message and will get back to you within 24 hours.
              </p>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-500 flex items-center justify-center gap-2">
              <span>Connection Secure</span> • <span>Instant Sync Active</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="client-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="text-left"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block">
                    Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      disabled={isSending}
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-black/60 focus:ring-1 focus:ring-brand-primary border border-white/[0.05] text-white text-sm transition-all duration-200 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      required
                      disabled={isSending}
                      placeholder="alex@simpletics.co"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-black/60 focus:ring-1 focus:ring-brand-primary border border-white/[0.05] text-white text-sm transition-all duration-200 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Company field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      disabled={isSending}
                      placeholder="Simpletics, Evolve... (Optional)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-black/60 focus:ring-1 focus:ring-brand-primary border border-white/[0.05] text-white text-sm transition-all duration-200 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Message/Brief details input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 block">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Let's build something together! Send your proposal details here..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={isSending}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] focus:bg-black/60 focus:ring-1 focus:ring-brand-primary border border-white/[0.05] text-white text-sm transition-all duration-200 outline-none resize-none leading-relaxed disabled:opacity-50"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-500 font-mono bg-rose-950/10 border border-rose-500/20 p-3 rounded-xl">
                  Error: {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-xl font-mono uppercase text-xs tracking-widest font-bold bg-white text-black hover:bg-brand-primary hover:text-white hover:shadow-[0_0_25px_rgba(0,223,162,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={13} className={isSending ? "animate-pulse" : ""} />
                {isSending ? "Transmitting..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
