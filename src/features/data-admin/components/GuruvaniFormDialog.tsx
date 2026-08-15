import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import type { Guruvani, GuruvaniFormValues } from "@/features/guruvani/schemas/guruvani"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormState = {
  text_en: string
  text_ml: string
  sort_order: string
}

const EMPTY_FORM: FormState = {
  text_en: "",
  text_ml: "",
  sort_order: "",
}

function toFormState(entry: Guruvani): FormState {
  return {
    text_en: entry.text_en,
    text_ml: entry.text_ml,
    sort_order: entry.sort_order?.toString() ?? "",
  }
}

function toFormValues(form: FormState): GuruvaniFormValues {
  const sortOrder = form.sort_order.trim()
  return {
    text_en: form.text_en.trim(),
    text_ml: form.text_ml.trim(),
    sort_order: sortOrder === "" ? null : Number.parseInt(sortOrder, 10),
  }
}

type GuruvaniFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: Guruvani
  onSubmit: (values: GuruvaniFormValues) => Promise<unknown>
}

export function GuruvaniFormDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
}: GuruvaniFormDialogProps) {
  const isEdit = entry !== undefined
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(entry ? toFormState(entry) : EMPTY_FORM)
      setError(null)
      setIsSubmitting(false)
    }
  }, [open, entry])

  function set<TKey extends keyof FormState>(key: TKey, value: FormState[TKey]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (form.text_en.trim() === "" || form.text_ml.trim() === "") {
      setError("Both English and Malayalam text are required.")
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit(toFormValues(form))
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Guruvani" : "New Guruvani"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update Guruvani #${entry.id}.`
              : "Add a new Guruvani quote."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="guruvani-text-en">English</FieldLabel>
              <Textarea
                id="guruvani-text-en"
                value={form.text_en}
                onChange={(e) => set("text_en", e.target.value)}
                rows={4}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="guruvani-text-ml">Malayalam</FieldLabel>
              <Textarea
                id="guruvani-text-ml"
                value={form.text_ml}
                onChange={(e) => set("text_ml", e.target.value)}
                rows={4}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="guruvani-sort-order">Sort order</FieldLabel>
              <Input
                id="guruvani-sort-order"
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
                placeholder="Assigned automatically when left blank"
              />
            </Field>

            {error && <FieldError>{error}</FieldError>}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
