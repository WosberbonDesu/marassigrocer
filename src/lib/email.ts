import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "placeholder");

interface RfqEmailPayload {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  buyerType: string;
  containerEstimate?: string;
  targetPrice?: string;
  notes?: string;
  items: { productName: string; quantity: number }[];
}

export async function sendRfqNotification(rfq: RfqEmailPayload) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@marassigrocer.com";

  const itemsHtml =
    rfq.items.length > 0
      ? `<table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead><tr style="background:#f5f5f5">
            <th style="text-align:left;padding:8px;border:1px solid #e5e5e5">Product</th>
            <th style="text-align:center;padding:8px;border:1px solid #e5e5e5">Qty</th>
          </tr></thead>
          <tbody>
            ${rfq.items.map((i) => `<tr><td style="padding:8px;border:1px solid #e5e5e5">${i.productName}</td><td style="text-align:center;padding:8px;border:1px solid #e5e5e5">${i.quantity}</td></tr>`).join("")}
          </tbody>
        </table>`
      : "<p style='color:#888'>No specific products listed</p>";

  await getResend().emails.send({
    from: "Marassi Grocer <noreply@marassigrocer.com>",
    to: adminEmail,
    subject: `New RFQ from ${rfq.name} — ${rfq.company ?? rfq.country}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a1507;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:#c9a84c;margin:0;font-size:20px">New RFQ Submission</h1>
          <p style="color:#888;margin:4px 0 0;font-size:13px">ID: ${rfq.id}</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e5e5;border-top:none">
          <h2 style="font-size:16px;margin:0 0 16px">Contact Details</h2>
          <table style="width:100%;font-size:14px">
            <tr><td style="padding:4px 0;color:#666;width:140px">Name</td><td><strong>${rfq.name}</strong></td></tr>
            <tr><td style="padding:4px 0;color:#666">Company</td><td>${rfq.company ?? "—"}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Email</td><td><a href="mailto:${rfq.email}">${rfq.email}</a></td></tr>
            <tr><td style="padding:4px 0;color:#666">Phone</td><td>${rfq.phone ?? "—"}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Country</td><td>${rfq.country}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Buyer Type</td><td>${rfq.buyerType}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Container</td><td>${rfq.containerEstimate ?? "—"}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Target Price</td><td>${rfq.targetPrice ?? "—"}</td></tr>
          </table>
          ${rfq.notes ? `<div style="margin-top:16px;padding:12px;background:#fafafa;border-radius:6px;font-size:13px"><strong>Notes:</strong><br/>${rfq.notes}</div>` : ""}
          <h2 style="font-size:16px;margin:24px 0 8px">Products</h2>
          ${itemsHtml}
          <div style="margin-top:24px;text-align:center">
            <a href="${process.env.NEXTAUTH_URL}/admin/rfq/${rfq.id}" style="display:inline-block;background:#c9a84c;color:#1a1507;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">View in Admin Panel</a>
          </div>
        </div>
      </div>
    `,
  });
}

interface CustomerApplicationPayload {
  id: string;
  email: string;
  name: string;
  company: string;
  country: string;
}

export async function sendCustomerApplicationNotification(customer: CustomerApplicationPayload) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@marassigrocer.com";
  await getResend().emails.send({
    from: "Marassi Grocer <noreply@marassigrocer.com>",
    to: adminEmail,
    subject: `New account application — ${customer.company}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <h2 style="color:#1a1507">New customer application</h2>
        <p>A new buyer has applied for an account.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 8px;color:#888">Name</td><td style="padding:6px 8px;font-weight:600">${customer.name}</td></tr>
          <tr><td style="padding:6px 8px;color:#888">Company</td><td style="padding:6px 8px;font-weight:600">${customer.company}</td></tr>
          <tr><td style="padding:6px 8px;color:#888">Country</td><td style="padding:6px 8px;font-weight:600">${customer.country}</td></tr>
          <tr><td style="padding:6px 8px;color:#888">Email</td><td style="padding:6px 8px;font-weight:600">${customer.email}</td></tr>
        </table>
        <div style="margin-top:24px;text-align:center">
          <a href="${process.env.NEXTAUTH_URL}/admin/customers/${customer.id}" style="display:inline-block;background:#c9a84c;color:#1a1507;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Review Application</a>
        </div>
      </div>
    `,
  });
}

interface CustomerDecisionPayload {
  email: string;
  name: string;
  approved: boolean;
  reason?: string;
}

export async function sendCustomerDecisionNotification(payload: CustomerDecisionPayload) {
  const subject = payload.approved
    ? "Your Marassi account has been approved"
    : "Your Marassi application update";
  const body = payload.approved
    ? `<p>Hello ${payload.name},</p>
       <p>Good news — your account has been approved. You can now sign in to view our full catalog with pricing.</p>
       <div style="margin-top:20px;text-align:center">
         <a href="${process.env.NEXTAUTH_URL}/account/login" style="display:inline-block;background:#c9a84c;color:#1a1507;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Sign In</a>
       </div>
       <p style="margin-top:24px">If you need anything, just reply to this email.</p>`
    : `<p>Hello ${payload.name},</p>
       <p>Thank you for your interest. After review, we're not able to approve your account at this time.</p>
       ${payload.reason ? `<p><strong>Reason:</strong> ${payload.reason}</p>` : ""}
       <p>If you believe this is in error, reply to this email and our sales team will be in touch.</p>`;

  await getResend().emails.send({
    from: "Marassi Grocer <noreply@marassigrocer.com>",
    to: payload.email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        ${body}
      </div>
    `,
  });
}
