import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, MapPin, Bed, Bath, Maximize, ArrowLeft } from "lucide-react"
import { PropertyFilters } from "@/components/property-filters"
import LogoHorizontal from "@/components/icons/logoHoriontal"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("properties").select("*").eq("status", "available")

  if (params.type) {
    query = query.eq("property_type", params.type)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,location.ilike.%${params.search}%`)
  }

  const { data: properties } = await query.order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
<LogoHorizontal 
            fill1="#664C3F"
            fill2="#9A7F71"
            className="h-6 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/imoveis" className="text-sm font-medium hover:text-primary transition-colors">
              Imóveis
            </Link>
            <Link href="/anunciar" className="text-sm font-medium hover:text-primary transition-colors">
              Anunciar Imóvel
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Área Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Todos os Imóveis</h1>
            <p className="text-muted-foreground">
              {properties?.length || 0} {properties?.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
            </p>
          </div>
        </div>

        <PropertyFilters />

        {!properties || properties.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum imóvel encontrado</p>
              <Link href="/imoveis">
                <Button variant="outline">Limpar Filtros</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {properties.map((property) => (
              <Link key={property.id} href={`/imoveis/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video w-full overflow-hidden bg-muted relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {property.property_type === "sale" ? "Venda" : "Aluguel"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.area_sqm && (
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          <span>{property.area_sqm}m²</span>
                        </div>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      R$ {property.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-background py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 JA Imobiliaria. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
