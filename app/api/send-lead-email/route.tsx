import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyTitle, name, email, phone, message } = body

    // In a real application, you would integrate with an email service like:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Postmark

    // For now, we'll just log the email content
    // The lead is already saved in the database via the contact form

    const emailContent = {
      to: process.env.ADMIN_EMAIL || "admin@imobiliaria.com",
      subject: `Novo Lead: ${propertyTitle}`,
      html: `
        <h2>Novo Lead Recebido</h2>
        <p><strong>Imóvel:</strong> ${propertyTitle}</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
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

    return NextResponse.json({ success: true, message: "Lead salvo com sucesso" })
  } catch (error) {
    console.error("Erro ao processar lead:", error)
    return NextResponse.json({ error: "Erro ao processar lead" }, { status: 500 })
  }
}
