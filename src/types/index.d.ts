export {};

declare global {
  interface Window {
    store: any; // 👈️ turn off type checking
  }
}