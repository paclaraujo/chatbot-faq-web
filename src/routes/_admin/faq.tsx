import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FaqForm } from "@/components/Faq/FaqForm";
import { FaqList } from "@/components/Faq/FaqList";
import { useFaqAdmin } from "@/hooks/useFaqAdmin";

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

function FaqAdmin() {
  const {
    entries,
    filtered,
    categories,
    form,
    setForm,
    editingId,
    filter,
    setFilter,
    feedback,
    error,
    loading,
    saving,
    onSubmit,
    startEdit,
    remove,
    resetForm,
  } = useFaqAdmin();

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

        {error && <ErrorBanner message={error} />}

        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <FaqForm
            form={form}
            onChange={setForm}
            categories={categories}
            editing={editingId !== null}
            saving={saving}
            feedback={feedback}
            onSubmit={onSubmit}
            onCancel={resetForm}
          />

          <FaqList
            entries={entries}
            filtered={filtered}
            filter={filter}
            onFilterChange={setFilter}
            loading={loading}
            onEdit={startEdit}
            onDelete={remove}
          />
        </div>
      </div>
    </AppShell>
  );
}
