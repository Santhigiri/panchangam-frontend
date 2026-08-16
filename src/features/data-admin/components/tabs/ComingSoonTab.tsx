export default function ComingSoonTab({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
      {label} data is coming soon.
    </div>
  )
}
