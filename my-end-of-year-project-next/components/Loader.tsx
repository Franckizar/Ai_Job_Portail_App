'use client';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[var(--color-bg-primary)] bg-opacity-80 z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto w-20 h-20 bg-[var(--color-lamaSkyDark)] rounded-full flex items-center justify-center mb-4"
        >
          <motion.div
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-lamaPurpleDark)]"
            >
              <path d="M12 2v4" />
              <path d="m16.2 7.8 2.9-2.9" />
              <path d="M18 12h4" />
              <path d="m16.2 16.2 2.9 2.9" />
              <path d="M12 18v4" />
              <path d="m7.8 16.2-2.9 2.9" />
              <path d="M6 12H2" />
              <path d="m7.8 7.8-2.9-2.9" />
            </svg>
          </motion.div>
        </motion.div>
        <p className="text-[var(--color-text-primary)] font-medium">Loading Opportunities...</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Connecting you to the best jobs in Cameroon
        </p>
      </div>
    </div>
  );
}