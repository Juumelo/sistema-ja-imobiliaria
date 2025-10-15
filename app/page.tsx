import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, Search, Home, MapPin, Bed, Bath, Maximize } from "lucide-react"
import LogoHorizontal from "@/components/icons/logoHoriontal"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .eq("featured", true)
    .limit(6)

  const { data: recentProperties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="bg-[url('/teste.jpg')] bg-cover bg-center bg-no-repeat max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Encontre o Imóvel dos Seus Sonhos</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Milhares de imóveis para venda e aluguel. Encontre a casa perfeita para você e sua família.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/imoveis?type=sale">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Comprar Imóvel
                </Button>
              </Link>
              <Link href="/imoveis?type=rent">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Home className="mr-2 h-5 w-5" />
                  Alugar Imóvel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Imóveis em Destaque</h2>
              <p className="text-muted-foreground">Confira nossas melhores ofertas</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
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
          </div>
        </section>
      )}

      {/* Recent Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between bh">
            <div>
              <h2 className="text-3xl font-bold mb-2">Imóveis Recentes</h2>
              <p className="text-muted-foreground">Últimas propriedades adicionadas</p>
            </div>
            <Link href="/imoveis">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>
          {recentProperties && recentProperties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentProperties.map((property) => (
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
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum imóvel disponível no momento</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Quer Anunciar Seu Imóvel?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Anuncie gratuitamente e alcance milhares de potenciais compradores e locatários
          </p>
          <Link href="/anunciar">
            <Button size="lg" variant="secondary">
              Anunciar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 JA Imobiliária. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
