// ЧОМУ window.print(), А НЕ jsPDF ЗА ЗАМОВЧУВАННЯМ:
// window.print() рендерить справжній HTML/CSS через рушій браузера —
// текст лишається чітким, вибірним (selectable) і коректно показує
// кирилицю та німецькі умлаути без проблем із вбудовуванням шрифтів.
// jsPDF без html2canvas не вміє макетувати flex/grid-розмітку, а з
// html2canvas перетворює сторінку на растрове зображення (гірша якість
// друку, більший розмір файлу, текст не копіюється).
//
// Єдиний мінус window.print(): у Telegram-вбудованому WebView на деяких
// пристроях (особливо старі версії iOS-клієнта Telegram) системний діалог
// друку може не відкритися. Тому даємо запасний варіант через
// jsPDF + html2canvas, який працює завжди, ціною трохи гіршої якості.

export function printResume() {
  window.print();
}

export async function downloadResumeAsImage(elementId, fileName = 'Lebenslauf.pdf') {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ]);

  const node = document.getElementById(elementId);
  if (!node) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}
