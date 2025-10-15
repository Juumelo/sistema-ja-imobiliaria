import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, FileText, MessageSquare } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).maybeSingle()

  if (!adminUser) {
    redirect("/admin/login")
  }

  // Get statistics
  const { count: propertiesCount } = await supabase.from("properties").select("*", { count: "exact", head: true })

  const { count: leadsCount } = await supabase.from("property_leads").select("*", { count: "exact", head: true })

  const { count: submissionsCount } = await supabase
    .from("property_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Painel Administrativo</h1>
          <form action={handleSignOut}>
            <Button variant="outline" type="submit">
              Sair
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Bem-vindo, {adminUser.full_name || adminUser.email}</h2>
          <p className="text-muted-foreground">Gerencie seus imóveis e leads</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propertiesCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Recebidos</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionsCount || 0}</div>
              {submissionsCount && submissionsCount > 0 ? (
                <Badge variant="secondary" className="mt-2">
                  Requer atenção
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Gerenciar Imóveis</CardTitle>
              <CardDescription>Adicione, edite ou remova imóveis do catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/properties">
                <Button className="w-full">
                  <Building2 className="mr-2 h-4 w-4" />
                  Ver Imóveis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Leads de Contato</CardTitle>
              <CardDescription>Visualize mensagens de clientes interessados</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/leads">
                <Button className="w-full bg-transparent" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ver Leads
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Anúncios de Usuários</CardTitle>
              <CardDescription>Revise e aprove imóveis enviados por usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/submissions">
                <Button className="w-full bg-transparent" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Anúncios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
