import { type NextRequest, NextResponse } from "next/server"

// URL da API de Envio do Resend
const RESEND_SEND_URL = "https://api.resend.com/emails"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyTitle, name, email, phone, message } = body

    // 1. Constrói o conteúdo do e-mail
    const htmlContent = `
        <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Lead Recebido</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f6f5f4;
      color: #333333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 30px;
    }

    .header {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .header img {
      width: 140px;
      margin-bottom: 10px;
    }

    h2 {
      color: #a8552b;
      font-size: 22px;
      text-align: center;
    }

    p {
      font-size: 15px;
      line-height: 1.6;
    }

    strong {
      color: #3a3a3a;
    }

    .highlight {
      background-color: #f9f4f1;
      border-left: 4px solid #a8552b;
      padding: 10px 15px;
      border-radius: 5px;
      margin: 10px 0;
    }

    .button {
      display: block;
      width: fit-content;
      margin: 25px auto;
      background-color: #a8552b;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      padding: 12px 24px;
      border-radius: 6px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #8e4624;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 30px;
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Logo-example.png" alt="Logo JA Imobiliária">
    </div>

    <h2>Novo Lead Recebido</h2>

    <div class="highlight">
      <p><strong>Imóvel:</strong> ${propertyTitle}</p>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
    </div>

    <p><strong>Mensagem:</strong></p>
    <p>${message}</p>

    <a href="#" class="button">Ver Lead Completo</a>

    <div class="footer">
      <p>© 2025 JA Imobiliária – Todos os direitos reservados.</p>
      <p>Belo Horizonte - MG</p>
    </div>
  </div>
</body>
    `

    const subject = `Novo Lead: ${propertyTitle}`
    const toEmail = process.env.ADMIN_EMAIL || "jullyanaglaucia@gmail.com"
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'

    // 2. Prepara o payload (o corpo JSON) para a API do Resend
    const resendBody = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      // Você pode adicionar mais campos aqui, como 'reply_to', 'text', etc.
    }

    // 3. FAZ A CHAMADA HTTP DIRETA usando fetch
    const response = await fetch(RESEND_SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Autenticação: Resend usa o header 'Authorization' com Bearer Token
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(resendBody),
    })

    // 4. Lida com a resposta da API do Resend
    if (!response.ok) {
      // Se a resposta da API de email NÃO for bem-sucedida (ex: 401, 403, 422, 500)
      const errorData = await response.json()
      console.error("Erro ao enviar e-mail via Resend:", errorData)
      // Lança um erro para cair no bloco catch
      throw new Error(`Falha no envio do e-mail (Status: ${response.status})`)
    }

    const result = await response.json()
    console.log("[v1] E-mail enviado com sucesso:", result)

    return NextResponse.json({ success: true, message: "Lead salvo e e-mail enviado com sucesso" })
  } catch (error) {
    console.error("Erro ao processar lead:", error)
    // Retorna um erro 500 para o cliente
    return NextResponse.json(
      { error: "Erro ao processar lead ou enviar e-mail" },
      { status: 500 }
    )
  }
};