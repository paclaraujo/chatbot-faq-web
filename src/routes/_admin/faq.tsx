import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  ApiError,
  createFaq,
  deleteFaq,
  listFaqs,
  updateFaq,
  type Faq,
} from "@/lib/api";
import { clearSession, getToken } from "@/lib/auth-store";

export const Route = createFileRoute("/_admin/faq")({
  head: () => ({
    meta: [
      { title: "Base de conhecimento — Atlas FAQ" },
      {
        name: "description",
        content:
          "Cadastre, edite e remova as perguntas e respostas usadas pelo chatbot de FAQ, organizadas por categoria.",
      },
      { property: "og:title", content: "Base de conhecimento — Atlas FAQ" },
      {
        property: "og:description",
        content: "Gerencie as perguntas frequentes respondidas automaticamente pelo assistente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqAdmin,
});

type FormState = {
  question: string;
  answer: string;
  category: string;
};

const EMPTY: FormState = { question: "", answer: "", category: "" };

function FaqAdmin() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Faq[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleAuthError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate({ to: "/login", search: { redirect: "/faq" } });
        return true;
      }
      return false;
    },
    [navigate],
  );

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listFaqs(token);
      setEntries(data);
    } catch (err) {
      if (handleAuthError(err)) return;
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as perguntas.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter(
      (e) =>
        e.question.toLowerCase().includes(term) ||
        e.answer.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term),
    );
  }, [entries, filter]);

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.category))).sort(),
    [entries],
  );

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim(),
    };
    if (!payload.question || !payload.answer || !payload.category) return;

    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateFaq(token, editingId, payload);
        setFeedback("Pergunta atualizada.");
      } else {
        await createFaq(token, payload);
        setFeedback("Pergunta cadastrada na base.");
      }
      resetForm();
      await refresh();
    } catch (err) {
      if (handleAuthError(err)) return;
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar a pergunta.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(entry: Faq) {
    setEditingId(entry.id);
    setForm({ question: entry.question, answer: entry.answer, category: entry.category });
    setFeedback(null);
  }

  async function remove(entry: Faq) {
    const token = getToken();
    if (!token) return;
    if (!window.confirm(`Remover a pergunta "${entry.question}"?`)) return;

    setError(null);
    try {
      await deleteFaq(token, entry.id);
      if (editingId === entry.id) resetForm();
      setFeedback("Pergunta removida da base.");
      await refresh();
    } catch (err) {
      if (handleAuthError(err)) return;
      setError(err instanceof ApiError ? err.message : "Não foi possível remover a pergunta.");
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Base de conhecimento
            </h1>
            <p className="text-sm text-muted-foreground">
              Cadastre, edite e remova as perguntas respondidas automaticamente pelo chatbot.
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-foreground">
              {editingId ? "Editar pergunta" : "Nova pergunta"}
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Alterações valem imediatamente para o chatbot público.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <Field label="Pergunta">
                <input
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Como faço para trocar um produto?"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </Field>

              <Field label="Resposta">
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={5}
                  placeholder="Use **negrito** para destacar trechos importantes."
                  className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </Field>

              <Field label="Categoria">
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                  {editingId ? "Salvar alterações" : "Cadastrar pergunta"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
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

          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Perguntas cadastradas ({entries.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Alterações valem imediatamente para o chatbot público.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <Search className="size-4 text-muted-foreground" aria-hidden />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filtrar…"
                  className="w-40 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Carregando…</p>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma pergunta encontrada.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{entry.question}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {entry.answer}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                          {entry.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        aria-label={`Editar ${entry.question}`}
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(entry)}
                        aria-label={`Excluir ${entry.question}`}
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
