import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, MapPin, Bed, Bath, Maximize, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { ContactForm } from "@/components/contact-form"
import LogoHorizontal from "@/components/icons/logoHoriontal"

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single()

  if (!property) {
    notFound()
  }

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
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/imoveis">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Imóveis
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {property.images && property.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {property.images.slice(1, 4).map((image:string, index: number) => (
                      <div key={index} className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${property.title} ${index + 2}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Details */}
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
                    <Badge variant={property.property_type === "sale" ? "default" : "secondary"} className="text-sm">
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

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ContactForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 JA Imobiliária. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
