import { Plus, X } from "lucide-react";
import type { ReactNode } from "react";

import type { FaqFormState } from "@/hooks/use-faq-admin";

export function FaqForm({
  form,
  onChange,
  categories,
  editing,
  saving,
  feedback,
  onSubmit,
  onCancel,
}: {
  form: FaqFormState;
  onChange: (form: FaqFormState) => void;
  categories: string[];
  editing: boolean;
  saving: boolean;
  feedback: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-sm font-semibold text-foreground">
        {editing ? "Editar pergunta" : "Nova pergunta"}
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Alterações valem imediatamente para o chatbot público.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Pergunta">
          <input
            value={form.question}
            onChange={(e) => onChange({ ...form, question: e.target.value })}
            placeholder="Como faço para trocar um produto?"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        <Field label="Resposta">
          <textarea
            value={form.answer}
            onChange={(e) => onChange({ ...form, answer: e.target.value })}
            rows={5}
            placeholder="Use **negrito** para destacar trechos importantes."
            className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        <Field label="Categoria">
          <input
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            placeholder="conta"
            list="faq-categories"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          <datalist id="faq-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden />
            {editing ? "Salvar alterações" : "Cadastrar pergunta"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
              Cancelar
            </button>
          )}
        </div>
        {feedback && <p className="text-xs text-muted-foreground">{feedback}</p>}
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
