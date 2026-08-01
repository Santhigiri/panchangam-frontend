import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import { SettingCard } from "./SettingCard"
import type { AppSetting, NakshatraStepDaysValue } from "@/api/schemas/appSettings"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useUpdateAppSetting } from "@/hooks/useAppSettings"

const SETTING_KEY = "nakshatra_transition_step_days"
const DEFAULT_VALUE: NakshatraStepDaysValue = { default: 0.01, overrides: {} }

type OverrideRow = { year: string; step: string }
type FormState = { defaultStep: string; rows: Array<OverrideRow> }

function toFormState(value: NakshatraStepDaysValue): FormState {
  return {
    defaultStep: String(value.default),
    rows: Object.entries(value.overrides)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, step]) => ({ year, step: String(step) })),
  }
}

function formsEqual(a: FormState, b: FormState) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function NakshatraStepDaysCard({ setting }: { setting?: AppSetting }) {
  const value = (setting?.value ?? DEFAULT_VALUE) as NakshatraStepDaysValue
  const initialForm = toFormState(value)
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState<string | null>(null)
  const updateMutation = useUpdateAppSetting()

  // Re-sync only when this setting's own row actually changes (our save, or
  // another admin's), not on every incidental refetch of the list.
  useEffect(() => {
    setForm(toFormState(value))
    setError(null)
  }, [setting?.updated_at])

  const isDirty = !formsEqual(form, initialForm)

  function handleReset() {
    setForm(initialForm)
    setError(null)
  }

  function addRow() {
    setForm((f) => ({ ...f, rows: [...f.rows, { year: "", step: "" }] }))
  }

  function removeRow(index: number) {
    setForm((f) => ({ ...f, rows: f.rows.filter((_, i) => i !== index) }))
  }

  function updateRow(index: number, patch: Partial<OverrideRow>) {
    setForm((f) => ({
      ...f,
      rows: f.rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }))
  }

  async function handleSave() {
    setError(null)
    const defaultStep = Number.parseFloat(form.defaultStep)
    if (Number.isNaN(defaultStep)) {
      setError("Default step must be a number.")
      return
    }
    const overrides: Record<string, number> = {}
    for (const row of form.rows) {
      const year = row.year.trim()
      if (year === "") continue
      if (!/^\d{4}$/.test(year)) {
        setError(`"${row.year}" is not a valid 4-digit year.`)
        return
      }
      const step = Number.parseFloat(row.step)
      if (Number.isNaN(step)) {
        setError(`The override step for ${year} must be a number.`)
        return
      }
      overrides[year] = step
    }
    try {
      await updateMutation.mutateAsync({
        key: SETTING_KEY,
        value: { default: defaultStep, overrides },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save setting.")
    }
  }

  return (
    <SettingCard
      title="Nakshatra transition step size"
      description="Skyfield search step (days) used to find Nakshatra transitions, with optional per-year overrides (e.g. a year that needs a coarser step). Fragile, correctness-critical — change with caution."
      isDirty={isDirty}
      isSaving={updateMutation.isPending}
      error={error}
      updatedAt={setting?.updated_at}
      updatedBy={setting?.updated_by}
      onSave={handleSave}
      onReset={handleReset}
    >
      <Field>
        <FieldLabel htmlFor="nakshatra-step-default">Default step (days)</FieldLabel>
        <Input
          id="nakshatra-step-default"
          type="number"
          min={0}
          max={1}
          step="any"
          value={form.defaultStep}
          onChange={(e) => setForm((f) => ({ ...f, defaultStep: e.target.value }))}
          className="max-w-40"
        />
      </Field>

      <Field>
        <FieldLabel>Per-year overrides</FieldLabel>
        <div className="flex flex-col gap-2">
          {form.rows.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Year, e.g. 2028"
                value={row.year}
                onChange={(e) => updateRow(index, { year: e.target.value })}
                className="w-32"
              />
              <Input
                type="number"
                step="any"
                min={0}
                max={1}
                placeholder="Step (days)"
                value={row.step}
                onChange={(e) => updateRow(index, { step: e.target.value })}
                className="w-32"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove override"
                onClick={() => removeRow(index)}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="self-start">
            <Plus />
            Add override
          </Button>
        </div>
      </Field>
    </SettingCard>
  )
}
