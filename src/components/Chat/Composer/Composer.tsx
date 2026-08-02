import { SendHorizontal } from "lucide-react";
import type { RefObject } from "react";

export function Composer({
  value,
  onChange,
  onSend,
  typing,
  error,
  textareaRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  typing: boolean;
  error: string | null;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
      className="border-t border-border px-4 py-3"
    >
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:border-primary">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={1}
          maxLength={500}
          placeholder="Digite sua pergunta…"
          aria-label="Pergunta"
          className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={typing || value.trim().length === 0}
          aria-label="Enviar pergunta"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <SendHorizontal className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
