import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Mail, Phone } from "lucide-react"
import { ApproveSubmissionButton } from "@/components/admin/approve-submission-button"

export default async function AdminSubmissionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: submissions } = await supabase
    .from("property_submissions")
    .select("*")
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
          <h1 className="ml-4 text-xl font-semibold">Anúncios de Usuários</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!submissions || submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Nenhum anúncio recebido ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{submission.title}</CardTitle>
                      <CardDescription>{submission.location}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        submission.status === "pending"
                          ? "secondary"
                          : submission.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {submission.status === "pending"
                        ? "Pendente"
                        : submission.status === "approved"
                          ? "Aprovado"
                          : "Rejeitado"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Descrição:</p>
                    <p className="text-sm">{submission.description}</p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo:</p>
                      <p className="text-sm font-medium">{submission.property_type === "sale" ? "Venda" : "Aluguel"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preço:</p>
                      <p className="text-sm font-medium">
                        R$ {submission.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    {submission.bedrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground">Quartos:</p>
                        <p className="text-sm font-medium">{submission.bedrooms}</p>
                      </div>
                    )}
                    {submission.bathrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground">Banheiros:</p>
                        <p className="text-sm font-medium">{submission.bathrooms}</p>
                      </div>
                    )}
                    {submission.area_sqm && (
                      <div>
                        <p className="text-sm text-muted-foreground">Área:</p>
                        <p className="text-sm font-medium">{submission.area_sqm} m²</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Informações do Proprietário:</p>
                    <div className="space-y-2">
                      <p className="text-sm">{submission.owner_name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${submission.owner_email}`} className="hover:underline">
                          {submission.owner_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${submission.owner_phone}`} className="hover:underline">
                          {submission.owner_phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {submission.status === "pending" && <ApproveSubmissionButton submission={submission} />}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
