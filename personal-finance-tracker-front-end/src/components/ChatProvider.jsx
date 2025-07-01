import { FloatingChat } from "./FloatingChat";

export function ChatProvider({ children }) {
  return (
    <>
      {children}
      <FloatingChat />
    </>
  );
}
