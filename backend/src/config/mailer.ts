import nodemailer from 'nodemailer'

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || parseInt(process.env.SMTP_PORT || '587', 10) === 465,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
})

export async function sendMail(opts: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@misionary.local'
  return mailer.sendMail({ from, ...opts })
}
