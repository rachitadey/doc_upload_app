import jsPDF from "jspdf";
import 'jspdf-autotable';
import XLSX from 'sheetjs-style';

export const pdfConvert = (data, fileName) =>
{
    var doc = new jsPDF()
    doc.setFontSize(30)
    doc.text(15, 25, fileName) 
  // From HTML
  doc.autoTable({ html: '.table' })

  // From Javascript
  var finalY = doc.lastAutoTable.finalY || 10
  doc.autoTable({
    startY: finalY + 20,
    // head: [['ID', 'Name', 'Email', 'Country', 'IP-address']],
    body: data,
  })

  finalY = doc.lastAutoTable.finalY
  doc.autoTable({
    startY: finalY + 20,
    html: '.table',
    useCss: true,
  })
  return doc;
}


export const excelConvert = (data) =>{
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const ws = XLSX.utils.json_to_sheet(data);
  for (let i = 1; i < data.length+2; i++) {
    ws[`A${i}`].s = { alignment: {
      wrapText: true,
    },}
    ws[`B${i}`].s = { alignment: {
      wrapText: true,
    },
  }
  }
  XLSX.utils.sheet_add_aoa(ws, [["Field Name", "Value"]], { origin: "A1" });
  ws['!cols'] = [{wch: 18},{wch: 38}]
  ws['A1'].s ={font: {bold: true,
    color: {
      rgb: "ff73bf45"
    }}}
    ws['B1'].s ={font: {bold: true,
      color: {
        rgb: "ff73bf45"
      }}}
  
  const wb = { Sheets: { 'data': ws}, SheetNames: ['data']};
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
  const doc = new Blob([excelBuffer], {type: fileType});
  return doc;
}

const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};
export const exportToJson = (data, fileName) => {
  // e.preventDefault();
  downloadFile({
    data: JSON.stringify(data),
    fileName: `${fileName}.json`,
    fileType: "text/json",
  });
};