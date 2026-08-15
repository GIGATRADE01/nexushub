import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NEXUSHUB_URL = 'https://nexushub.trade'

/* Quando nexushub.trade sara' verificato su Resend bastera' impostare EMAIL_FROM
   (es. "NexusHub <info@nexushub.trade>") e le email smetteranno di uscire dal
   dominio di prova di Resend. */
const FROM = Deno.env.get('EMAIL_FROM') || 'NexusHub <onboarding@resend.dev>'
const REPLY_TO = Deno.env.get('EMAIL_REPLY_TO') || 'info@nexushub.trade'

const header = `<div style="text-align:center;margin-bottom:28px">
  <div style="display:inline-block;width:52px;height:52px;background:linear-gradient(135deg,#c9a84c,#7a5e28);border-radius:12px;line-height:52px;font-size:24px;font-weight:900;color:#08080f">N</div>
  <h1 style="color:#c9a84c;font-size:22px;margin:12px 0 2px">NexusHub</h1>
  <p style="color:#8890aa;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin:0">Global B2B Distribution Platform</p>
</div>`

const footer = `<p style="color:#4a4e68;font-size:11px;text-align:center;border-top:1px solid #252838;padding-top:16px;margin-top:28px">NexusHub &middot; Turin, Italy &middot; European Distribution Hub<br><a href="${NEXUSHUB_URL}" style="color:#c9a84c">nexushub.trade</a></p>`

const wrap = (content: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#08080f;color:#ede9e3;padding:36px;border-radius:12px">${header}${content}${footer}</div>`

const btn = (text: string) =>
  `<div style="text-align:center;margin:28px 0"><a href="${NEXUSHUB_URL}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#c9a84c,#7a5e28);color:#08080f;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px">${text} &rarr;</a></div>`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const body = await req.json()
    const { type, email, company_name, role, reason, order_number, order_amount, items_count } = body

    let subject = ''
    let html = ''

    switch(type) {
      case 'approved':
        subject = '✅ Account Approved — Welcome to NexusHub!'
        html = wrap(`
          <div style="background:#27ae6015;border:1px solid #27ae6040;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">✅</div>
            <h2 style="color:#27ae60;margin:0 0 6px">Account Approved!</h2>
            <p style="color:#ede9e3;margin:0">Your ${role} account is now active.</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Your NexusHub account has been verified and activated. You can now ${role === 'brand' ? 'manage your European distributor network, upload your catalog, and track orders in real time' : 'browse premium brand catalogs, place orders, and track deliveries from our Turin hub'}.</p>
          ${btn('Access NexusHub')}`)
        break

      case 'rejected':
        subject = '❌ Application Update — NexusHub'
        html = wrap(`
          <div style="background:#c0392b15;border:1px solid #c0392b40;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">❌</div>
            <h2 style="color:#c0392b;margin:0 0 6px">Application Not Approved</h2>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">After reviewing your application, we were unable to approve your account at this time.</p>
          ${reason ? `<p style="color:#8890aa;font-size:14px"><strong style="color:#ede9e3">Reason:</strong> ${reason}</p>` : ''}
          <p style="color:#8890aa;font-size:14px">For more info contact: <a href="mailto:info@nexushub.trade" style="color:#c9a84c">info@nexushub.trade</a></p>`)
        break

      case 'pending':
        subject = '⏳ Registration Received — NexusHub'
        html = wrap(`
          <div style="background:#c9a84c15;border:1px solid #c9a84c40;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">⏳</div>
            <h2 style="color:#c9a84c;margin:0 0 6px">Registration Received!</h2>
            <p style="color:#ede9e3;margin:0">Your documents are under review.</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Thank you for registering as a <strong style="color:#ede9e3">${role}</strong> on NexusHub. Our team will review your documents within <strong style="color:#ede9e3">24-48 hours</strong>. You will receive an email notification as soon as your account is approved.</p>`)
        break

      case 'order_confirmed':
        subject = `✅ Order Confirmed — ${order_number}`
        html = wrap(`
          <div style="background:#27ae6015;border:1px solid #27ae6040;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">✅</div>
            <h2 style="color:#27ae60;margin:0 0 6px">Order Confirmed!</h2>
            <p style="color:#ede9e3;margin:0">${order_number}</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Your order <strong style="color:#ede9e3">${order_number}</strong> has been confirmed and is being prepared at our Turin Hub.</p>
          <div style="background:#151720;border-radius:10px;padding:16px;margin:16px 0">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#8890aa">Items</span><span style="color:#ede9e3;font-weight:600">${items_count} products</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#8890aa">Total</span><span style="color:#e2bc6a;font-weight:700">&euro;${order_amount}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:#8890aa">Estimated delivery</span><span style="color:#27ae60;font-weight:600">48h from Turin</span></div>
          </div>
          ${btn('Track Order')}`)
        break

      case 'order_preparing':
        subject = `📦 Order in Preparation — ${order_number}`
        html = wrap(`
          <div style="background:#3d8ef015;border:1px solid #3d8ef040;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">📦</div>
            <h2 style="color:#3d8ef0;margin:0 0 6px">Order in Preparation</h2>
            <p style="color:#ede9e3;margin:0">${order_number}</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Your order <strong style="color:#ede9e3">${order_number}</strong> is now being prepared at our Turin Hub. Our team is picking and packing your items for dispatch.</p>
          ${btn('Track Order')}`)
        break

      case 'order_shipped':
        subject = `🚚 Order Shipped — ${order_number}`
        html = wrap(`
          <div style="background:#8e44ad15;border:1px solid #8e44ad40;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">🚚</div>
            <h2 style="color:#8e44ad;margin:0 0 6px">Order Shipped!</h2>
            <p style="color:#ede9e3;margin:0">${order_number}</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Great news! Your order <strong style="color:#ede9e3">${order_number}</strong> has left our Turin Hub and is on its way to you. Expected delivery within <strong style="color:#ede9e3">48 hours</strong>.</p>
          ${btn('Track Order')}`)
        break

      case 'order_delivered':
        subject = `🎉 Order Delivered — ${order_number}`
        html = wrap(`
          <div style="background:#27ae6015;border:1px solid #27ae6040;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">🎉</div>
            <h2 style="color:#27ae60;margin:0 0 6px">Order Delivered!</h2>
            <p style="color:#ede9e3;margin:0">${order_number}</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Your order <strong style="color:#ede9e3">${order_number}</strong> has been successfully delivered. Thank you for choosing NexusHub!</p>
          ${btn('Place New Order')}`)
        break

      case 'payment_received':
        subject = `💶 Payment Received — ${order_number}`
        html = wrap(`
          <div style="background:#c9a84c15;border:1px solid #c9a84c40;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px">
            <div style="font-size:44px;margin-bottom:8px">💶</div>
            <h2 style="color:#c9a84c;margin:0 0 6px">Payment Received!</h2>
            <p style="color:#ede9e3;margin:0">&euro;${order_amount}</p>
          </div>
          <p style="color:#ede9e3;font-size:15px">Dear <strong style="color:#e2bc6a">${company_name}</strong>,</p>
          <p style="color:#8890aa;font-size:14px;line-height:1.7">Payment of <strong style="color:#e2bc6a">&euro;${order_amount}</strong> for order <strong style="color:#ede9e3">${order_number}</strong> has been received and processed via SEPA Instant.</p>
          ${btn('View Dashboard')}`)
        break
    }

    if (!subject || !html) {
      return new Response(JSON.stringify({ error: 'Unknown email type' }), { status: 400 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: FROM, reply_to: REPLY_TO, to: email, subject, html })
    })

    const data = await res.json()
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
})
