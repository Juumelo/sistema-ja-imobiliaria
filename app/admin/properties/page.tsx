import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil } from "lucide-react"
import { DeletePropertyButton } from "@/components/admin/delete-property-button"

export default async function AdminPropertiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: properties } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Gerenciar Imóveis</h1>
          </div>
          <Link href="/admin/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Imóvel
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!properties || properties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum imóvel cadastrado ainda</p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Imóvel
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Sem imagem</p>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{property.location}</CardDescription>
                    </div>
                    <Badge variant={property.property_type === "sale" ? "default" : "secondary"}>
                      {property.property_type === "sale" ? "Venda" : "Aluguel"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">
                    R$ {property.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/admin/properties/${property.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <DeletePropertyButton propertyId={property.id} />
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
