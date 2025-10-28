import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, location, propertyType, price, ownerName, ownerEmail, ownerPhone } = body

    // In a real application, integrate with an email service
    const emailContent = {
      to: process.env.ADMIN_EMAIL || "jullyanaglaucia@gmail.com",
      subject: `Novo Anúncio Submetido: ${title}`,
      html: `
        <h2>Novo Anúncio de Imóvel Recebido</h2>
        <p><strong>Título:</strong> ${title}</p>
        <p><strong>Localização:</strong> ${location}</p>
        <p><strong>Tipo:</strong> ${propertyType === "sale" ? "Venda" : "Aluguel"}</p>
        <p><strong>Preço:</strong> R$ ${price}</p>
        <hr />
        <h3>Dados do Proprietário</h3>
        <p><strong>Nome:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${ownerEmail}</p>
        <p><strong>Telefone:</strong> ${ownerPhone}</p>
        <p><em>Acesse o painel administrativo para revisar e aprovar este anúncio.</em></p>
      `,
    }

    console.log("[v0] Email que seria enviado:", emailContent)

    // Example with Resend (uncomment when you have an API key):
    // const { Resend } = await import('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'ImobiPrime <noreply@seudominio.com>',
    //   to: process.env.ADMIN_EMAIL || 'admin@imobiliaria.com',
    //   subject: emailContent.subject,
    //   html: emailContent.html,
    // })

    return NextResponse.json({ success: true, message: "Anúncio submetido com sucesso" })
  } catch (error) {
    console.error("Erro ao processar anúncio:", error)
    return NextResponse.json({ error: "Erro ao processar anúncio" }, { status: 500 })
  }
}
