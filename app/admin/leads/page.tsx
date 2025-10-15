import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default async function AdminLeadsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: leads } = await supabase
    .from("property_leads")
    .select("*, properties(title)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Leads de Contato</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!leads || leads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Nenhum lead recebido ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{lead.name}</CardTitle>
                      <CardDescription>Interessado em: {lead.properties?.title || "Imóvel removido"}</CardDescription>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm">{lead.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
