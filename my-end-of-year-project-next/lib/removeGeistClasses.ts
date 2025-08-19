// lib/removeGeistClasses.ts
export const removeGeistClasses = () => {
  if (typeof document !== 'undefined') {
    document.body.className = 'bg-background min-h-screen';
  }
};