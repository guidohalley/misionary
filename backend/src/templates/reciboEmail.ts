export function buildReciboEmail(params: {
  emisorNombre: string
  emisorEmail?: string
  receptorNombre: string
  receptorEmail?: string
  montoFormateado: string
  concepto: string
  fechaFormateada: string
  clienteNombre?: string
  clienteEmail?: string
}) {
  const {
    emisorNombre,
    emisorEmail,
    receptorNombre,
    receptorEmail,
    montoFormateado,
    concepto,
    fechaFormateada,
    clienteNombre,
    clienteEmail,
  } = params

  // Plantilla HTML con estilos inline para mejor compatibilidad
  const clienteRow = clienteNombre
    ? `<p style="margin-bottom: 8px; color: #262626;"><span style=\"font-weight: 600;\">Cliente:</span> ${escapeHtml(clienteNombre)}${clienteEmail ? ` (${escapeHtml(clienteEmail)})` : ''}</p>`
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Recibo de Pago</title>
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background: linear-gradient(45deg, #F2F2F2 0%, #9FC087 100%); padding: 24px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif;">
  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 24px;">
    <div style="margin-bottom: 16px;">
      <table style="margin: 0 auto;">
        <tr>
          <td style="vertical-align: middle; padding-right: 12px;">
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FwYV8xIiBkYXRhLW5hbWU9IkNhcGEgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZTNmYzc0OwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICMyNjI2MjY7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik04MDQuODIsODg5LjU0bC0uODQuODQtLjAzLS4wM2MuMzEtLjI4LjU5LS41Ni44Ny0uODFaIi8+CiAgPGc+CiAgICA8cGF0aCBkPSJNMjc1LjEyLDE5MC40OGMtLjg0LjgxLTEuNjgsMS42My0yLjUsMi40N2wyLjQ3LTIuNS4wMy4wM1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTkxNy41OCwyNjMuODNjMC01NS45My00NS40Ny0xMDEuNC0xMDEuNC0xMDEuNGgtNDcxLjAyYy0yNy4xMSwwLTUxLjgxLDEwLjcxLTcwLjAzLDI4LjA2LS44NC44MS0xLjY4LDEuNjMtMi41LDIuNDdsLTgxLjUsODEuNDcuMDMuMDNjLTE3Ljc3LDE4LjI4LTI4Ljc0LDQzLjIzLTI4Ljc0LDcwLjY4djQ3MS4wMmMwLDU1LjkzLDQ1LjUsMTAxLjQzLDEwMS40MywxMDEuNDNoNDcxLjAyYzI2LjY5LDAsNTAuOTctMTAuMzQsNjkuMDgtMjcuMjIuMzEtLjI4LjU5LS41Ni44Ny0uODFsMy40NS0zLjQ1LDgwLjU1LTgwLjQzLS4wNi0uMDZjMTcuODMtMTguMjgsMjguODItNDMuMjYsMjguODItNzAuNzZ2LTQ3MS4wMlpNOTAzLjU2LDczNC44NWMwLDQxLjMtMjguNzYsNzYtNjcuMzQsODUuMDktNC41NywxLjA5LTkuMzEsMS43OS0xNC4xMywyLjEzLTEuOTYuMTQtMy45My4yLTUuOTIuMmgtNDcxLjAyYy00OC4xOSwwLTg3LjQxLTM5LjIyLTg3LjQxLTg3LjQxdi00NzEuMDJjMC0xLjk5LjA2LTMuOTUuMi01LjkyLjM0LTQuODIsMS4wNC05LjU2LDIuMTMtMTQuMTMsOS4wOC0zOC41OCw0My43OS02Ny4zNCw4NS4wOS02Ny4zNGg0NzEuMDJjNDguMTksMCw4Ny4zOSwzOS4xOSw4Ny4zOSw4Ny4zOXY0NzEuMDJaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05MDMuNTYsMjYzLjgzdjQ3MS4wMmMwLDQxLjMtMjguNzYsNzYtNjcuMzQsODUuMDktNC41NywxLjA5LTkuMzEsMS43OS0xNC4xMywyLjEzLTEuOTYuMTQtMy45My4yLTUuOTIuMmgtNDcxLjAyYy00OC4xOSwwLTg3LjQxLTM5LjIyLTg3LjQxLTg3LjQxdi00NzEuMDJjMC0xLjk5LjA2LTMuOTUuMi01LjkyLjM0LTQuODIsMS4wNC05LjU2LDIuMTMtMTQuMTMsOS4wOC0zOC41OCw0My43OS02Ny4zNCw4NS4wOS02Ny4zNGg0NzEuMDJjNDguMTksMCw4Ny4zOSwzOS4xOSw4Ny4zOSw4Ny4zOVoiLz4KICA8L2c+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik03OTAuNTYsNTQyLjAxYy0uMjMtMTAuOSw5LjE3LTE5Ljk5LDIwLjUzLTE5Ljc2LDExLjQtLjIzLDIxLjAzLDguODYsMjAuOCwxOS43Ni4yMywxMC45LTkuNCwyMC4wMy0yMC44LDE5LjgtMTEuMzYuMjMtMjAuNzYtOC45My0yMC41My0xOS44Wk03OTksNTMwLjE1Yy0zLjMxLDMuMjQtNC45Nyw3LjItNC45NywxMS44NnMxLjY2LDguNTUsNC45NywxMS43NWMzLjI3LDMuMiw3LjMyLDQuODEsMTIuMDksNC44MXM4Ljk0LTEuNjIsMTIuMjktNC44MWMzLjM1LTMuMiw1LjA1LTcuMDksNS4wNS0xMS43NXMtMS42Ni04LjYzLTUuMDEtMTEuODZjLTMuMzUtMy4yLTcuNDctNC44MS0xMi4zMi00Ljgxcy04LjgyLDEuNjItMTIuMDksNC44MVpNODAzLjc4LDU1MS42NHYtMTkuNDloOC4zMmM0LjEyLDAsNi43NCwyLjMxLDYuNzQsNS45NywwLDIuNjYtMS40Niw0LjY2LTMuNzcsNS4zOWw0Ljc0LDguMTNoLTMuODFsLTQuMjQtNy41OWgtNC43djcuNTloLTMuMjdaTTgwNy4wNSw1NDEuMTJoNC45N2MyLjE5LDAsMy40My0xLjE2LDMuNDMtM3MtMS4yMy0zLjA0LTMuNDMtMy4wNGgtNC45N3Y2LjA1WiIvPgogICAgPGc+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTM0My40Miw0NzUuMTJ2LTIxMS4xMWg1Mi4zOWw2My43NCwxMzcuNzQsNjMuNzQtMTM3Ljc0aDUyLjM5djIxMS4xMWgtNTEuMTV2LTExNC4xMWwtNDcuODgsMTAxLjY3aC0zNC4ybC00Ny44OC0xMDEuNjd2MTE0LjExaC01MS4xNFoiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjUyLjE1LDQwMS43NGMxMS45NywxOC42NiwzMS43MSwzMC4zMiw1Mi4yMywzMC4zMiw4LjU1LDAsMTUuNy0xLjU2LDIxLjYxLTQuNjYsNS43NS0yLjk1LDguNzEtNi44NCw4LjcxLTExLjY2LDAtMy44OS0xLjg2LTcuNDYtNS40NC0xMC40Mi0zLjU4LTIuOTUtNy40Ni01LjEzLTExLjM1LTYuNTMtNC4wNC0xLjQtMTAuNzMtMy41Ny0yMC4yMS02LjM3LTIuNjQtLjc4LTQuODItMS40LTYuMjItMS44Ny02LjUzLTIuMDItMTEuODItMy43My0xNi4wMS01LjEzLTQuMi0xLjQtOS4xNy0zLjExLTE0LjYxLTUuNDQtMTEuMTktNC41MS0xNy4yNi04LjU1LTI0Ljg3LTE1LjM5LTEwLjg4LTkuNDgtMTYuMDEtMjIuMDctMTYuNjQtNDAuNzMsMC0xMi40NCwzLjczLTIzLjYzLDExLjE5LTMzLjQyLDcuNDYtOS44LDE2Ljk0LTE3LjEsMjguNi0yMi4wOCwxMS41MS00Ljk3LDIzLjc5LTcuNDYsMzYuODQtNy40NiwzNC42NywwLDYyLjM0LDE1LjA4LDgzLjAyLDQ1LjA4bC0zNy43OCwyNy44M2MtMTMuMDYtMTguNjUtMjguMTQtMjcuOTgtNDUuMjQtMjcuOTgtMTQuNzcsMC0yNS4wMyw3LTI1LjAzLDE3LjEsMCwzLjg5LjkzLDcsMy44OSw5LjQ4LDIuOTUsMi42NCw0LjgyLDQuMzUsMTAuNDIsNi4zNyw1LjQ0LDIuMDIsNy45MywyLjgsMTUuNTUsNS4xMywzLjczLDEuMjQsNi44NCwyLjMzLDkuMTcsMy4xMSw5LjAyLDIuOTUsMTYuNDgsNS42LDIyLjM4LDcuNzcsNS45MSwyLjMzLDEyLjEzLDQuOTcsMTguNSw3LjkzLDYuMzcsMy4xMSwxMS41LDYuMjIsMTUuMzksOS4zMywxMi4xMyw5LjQ4LDIwLjgzLDIzLjAxLDIwLjA1LDQxLjk3LDAsMjEuMTQtMTAuNDIsMzguNTYtMjYuNDMsNDguNjYtMTYuMTcsMTAuMTEtMzYuMDcsMTUuNTUtNTYuNzQsMTUuNTUtMTkuNTksMC0zNy40Ny00LjItNTMuNDgtMTIuNzUtMTYuMTctOC4zOS0yOC4xNC0yMC4zNi0zNS45MS0zNS43NWwzOC40LTI3Ljk4WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zOTQuNTcsNzMzLjA0aC01MS4xNHYtMjExLjExaDQzLjUzbDEwNi4zNCwxMjguNzJ2LTEyOC43Mmg1MS4xNHYyMTEuMTFoLTQ0LjMxbC0xMDUuNTYtMTI3LjQ4djEyNy40OFoiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjQ2LjU2LDczMy4wNGgtNTAuOTl2LTIxMS4xMWgxMDYuNjRjMjAuMjEsMCwzNy4zMSw2LjM3LDUxLjMsMTkuMjgsMTMuODQsMTIuOSwyMC44MywyOS4zOCwyMC44Myw0OS4yOCwwLDE0Ljc3LTMuNzMsMjcuNjctMTEuMTksMzguODYtNy42MiwxMS4xOS0xNy43MiwxOS40My0zMC4zMSwyNC44N2w0NC4xNSw3OC45N2gtNTUuMTlsLTM5Ljk1LTcyLjkxaC0zNS4yOXY3Mi43NlpNNjQ2LjU2LDU2NS40NnY1MS4zaDQ0LjYyYzE4LjgxLDAsMzAuNzgtMTAuODgsMzAuNzgtMjYuMjcsMC0xNC40Ni0xMS45Ny0yNS4wMy0zMC43OC0yNS4wM2gtNDQuNjJaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=" alt="@misionary.ok" style="height: 48px" />
          </td>
          <td style="vertical-align: middle;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #262626;">Recibo de Pago</h1>
          </td>
        </tr>
      </table>
    </div>
    <p style="margin-bottom: 8px; color: #262626;"><span style="font-weight: 600;">Emisor:</span> ${escapeHtml(emisorNombre)}${emisorEmail ? ` (${escapeHtml(emisorEmail)})` : ''}</p>
  <p style="margin-bottom: 8px; color: #262626;"><span style="font-weight: 600;">Receptor:</span> ${escapeHtml(receptorNombre)}${receptorEmail ? ` (${escapeHtml(receptorEmail)})` : ''}</p>
  ${clienteRow}
    <p style="margin-bottom: 8px; color: #262626;"><span style="font-weight: 600;">Monto:</span> ${escapeHtml(montoFormateado)}</p>
    <p style="margin-bottom: 8px; color: #262626;"><span style="font-weight: 600;">Concepto:</span> ${escapeHtml(concepto)}</p>
    <p style="margin-bottom: 8px; color: #262626;"><span style="font-weight: 600;">Fecha y Hora:</span> ${escapeHtml(fechaFormateada)}</p>
  </div>
</body>
</html>`
}

function escapeHtml(str?: string) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
