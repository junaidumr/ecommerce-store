"use client";

interface OrderSuccessModalProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
}

export function OrderSuccessModal({
  open,
  orderId,
  onClose,
}: OrderSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl animate-slide-up"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg
            className="h-8 w-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-2xl font-medium text-zinc-900">
          Order confirmed
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Thank you for your purchase. A confirmation has been sent to your inbox.
        </p>
        <p className="mt-4 rounded-lg bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-700">
          Order #{orderId}
        </p>
        <button type="button" onClick={onClose} className="btn-primary mt-8 w-full">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
