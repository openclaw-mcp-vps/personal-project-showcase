"use client";

import { useState } from "react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
      };
      Setup: (config: {
        eventHandler: (event: { event: string; data: { order_id?: number; email?: string } }) => void;
      }) => void;
    };
  }
}

type CheckoutButtonProps = {
  checkoutUrl: string;
  className?: string;
};

async function unlockAccess(orderId: number, email?: string) {
  await fetch("/api/access/grant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ orderId, email })
  });
}

export function CheckoutButton({ checkoutUrl, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const openCheckout = async () => {
    if (!checkoutUrl) {
      return;
    }

    setLoading(true);

    if (!window.LemonSqueezy) {
      const script = document.createElement("script");
      script.src = "https://app.lemonsqueezy.com/js/lemon.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    window.LemonSqueezy?.Setup({
      eventHandler: async (event) => {
        if (event.event === "Checkout.Success") {
          await unlockAccess(event.data.order_id ?? Date.now(), event.data.email);
          window.location.assign("/dashboard");
        }
      }
    });

    window.LemonSqueezy?.Url.Open(checkoutUrl);
    setLoading(false);
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={openCheckout}
      disabled={loading || !checkoutUrl}
      className={className}
    >
      {loading ? "Opening checkout..." : "Unlock Pro for $7/month"}
    </motion.button>
  );
}
