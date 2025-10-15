import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PropertyForm } from "@/components/admin/property-form"

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single()

  if (!property) {
    redirect("/admin/properties")
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/admin/properties">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Editar Imóvel</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl p-6">
        <PropertyForm property={property} />
      </main>
    </div>
  )
}
