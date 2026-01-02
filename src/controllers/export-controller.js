import puppeteer from 'puppeteer'

export async function exportPDF(req, res, next) {
  try {
    const { html, filename } = req.body

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.3in',
        right: '0.3in',
        bottom: '0.3in',
        left: '0.3in',
      },
    })

    await browser.close()

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      'Content-Length': pdf.length,
    })

    res.end(pdf)
  } catch (error) {
    next(error)
  }
}
