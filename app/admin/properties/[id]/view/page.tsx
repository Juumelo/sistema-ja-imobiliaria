// app/admin/properties/[id]/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Badge, Bath, Bed, Building2, MapPin, Maximize } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import PropertyGallery from "../../../../../components/images/propertyGallery"

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
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
          <h1 className="ml-4 text-xl font-semibold">Visualizar Imóvel</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyGallery property={property} />

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <Badge className="text-sm">
                      {property.property_type === "sale" ? "Venda" : "Aluguel"}
                    </Badge>
                  </div>
                  <p className="text-4xl font-bold text-primary">
                    R$ {property.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-6 py-4 border-y">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Quartos</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Banheiros</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Área</p>
                        <p className="font-semibold">{property.area_sqm}m²</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
