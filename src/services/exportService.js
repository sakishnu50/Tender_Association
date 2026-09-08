import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mockOpportunities } from '../data/mockData';

/**
 * Enterprise Document Export Service
 * Provides client-side PDF and Excel/CSV document generation for Reports & Analytics
 */

export const exportService = {
  /**
   * Generates a professional multi-page PDF Tender Report with metrics and opportunity table.
   * File name: Tender_Report_[TODAY'S DATE].pdf
   */
  exportToPDF: (opportunities = mockOpportunities, customFilename = null) => {
    // Determine target date format: YYYY-MM-DD for filename
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10);
    const filename = customFilename || `Tender_Report_${isoDate}.pdf`;

    // Initialize A4 Portrait Document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;

    // Derived Metrics
    const oppList = Array.isArray(opportunities) && opportunities.length > 0 ? opportunities : mockOpportunities;
    const totalCount = oppList.length;
    const highMatchCount = oppList.filter((o) => (o.aiScore || 0) >= 8.5).length;
    const urgentCount = oppList.filter((o) => o.status === 'High Priority' || (o.aiScore || 0) >= 9.0).length;
    const pursuedCount = oppList.filter((o) => o.status === 'Pursued').length;
    const avgScore = (oppList.reduce((acc, o) => acc + (o.aiScore || 0), 0) / (totalCount || 1)).toFixed(1);

    // --- 1. Document Branding Header ---
    // Top Color Accent Bar
    doc.setFillColor(30, 58, 138); // Primary Navy Blue (#1E3A8A)
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Title Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('INFRASTRUCTURE OPPORTUNITY TRACKER', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate muted (#64748B)
    doc.text('Executive Intelligence & Pipeline Summary Report', margin, 24);

    // Metadata Right-Aligned Block
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    doc.text(`Generated: ${dateStr} at ${timeStr}`, pageWidth - margin, 18, { align: 'right' });
    doc.text(`Total Tenders Tracked: ${totalCount}`, pageWidth - margin, 23, { align: 'right' });
    doc.text(`Report File: Tender_Report_${isoDate}.pdf`, pageWidth - margin, 28, { align: 'right' });

    // Top Divider Line
    doc.setDrawColor(226, 232, 240); // Subtle Border (#E2E8F0)
    doc.setLineWidth(0.5);
    doc.line(margin, 31, pageWidth - margin, 31);

    // --- 2. Executive KPI Metrics Cards ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // Charcoal (#1E293B)
    doc.text('1. Executive KPI Summary', margin, 38);

    const kpis = [
      { label: 'Total Tracked', val: `${totalCount}`, color: [37, 99, 235] },      // Blue
      { label: 'High Match (8.5+)', val: `${highMatchCount}`, color: [16, 185, 129] }, // Green
      { label: 'Urgent Action', val: `${urgentCount}`, color: [239, 68, 68] },    // Red
      { label: 'Pursued Tenders', val: `${pursuedCount}`, color: [2, 132, 199] },   // Sky Blue
      { label: 'Avg AI Score', val: `${avgScore} / 10`, color: [124, 58, 237] }    // Purple
    ];

    const cardWidth = (pageWidth - margin * 2 - (kpis.length - 1) * 3) / kpis.length;
    const cardHeight = 18;
    const cardY = 42;

    kpis.forEach((kpi, idx) => {
      const cardX = margin + idx * (cardWidth + 3);

      // Card Background Box
      doc.setFillColor(248, 250, 252); // Off-white/slate-50
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

      // Top colored border indicator
      doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
      doc.rect(cardX, cardY, cardWidth, 1.2, 'F');

      // Metric Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
      doc.text(kpi.val, cardX + cardWidth / 2, cardY + 8, { align: 'center' });

      // Metric Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.label, cardX + cardWidth / 2, cardY + 14, { align: 'center' });
    });

    // --- 3. Opportunity Directory Table ---
    const tableStartY = 66;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('2. Opportunity Pipeline Directory', margin, tableStartY);

    const tableHeaders = [
      ['ID', 'Tender Name', 'Source Agency', 'Location', 'Value', 'AI Score', 'Deadline', 'Status']
    ];

    const tableRows = oppList.map((opp) => [
      opp.id || 'N/A',
      opp.name || opp.title || 'Untitled Project',
      opp.source || 'N/A',
      opp.location || 'N/A',
      opp.value || 'N/A',
      opp.aiScore != null ? `${opp.aiScore} / 10` : 'N/A',
      opp.deadline || 'N/A',
      opp.status || 'New'
    ]);

    autoTable(doc, {
      startY: tableStartY + 3,
      head: tableHeaders,
      body: tableRows,
      margin: { left: margin, right: margin, bottom: 20 },
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138], // Navy Blue header
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2.5
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [51, 65, 85],
        cellPadding: 2.2
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Light slate zebra striping
      },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' }, // ID
        1: { cellWidth: 46 },                   // Name
        2: { cellWidth: 26 },                   // Source
        3: { cellWidth: 26 },                   // Location
        4: { cellWidth: 20, halign: 'right' },  // Value
        5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }, // AI Score
        6: { cellWidth: 18, halign: 'center' }, // Deadline
        7: { cellWidth: 16, halign: 'center' }  // Status
      },
      didDrawPage: (data) => {
        // --- Header & Footer on every page ---
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = data.pageNumber;

        // Footer Line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        // Footer Left Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text('Infrastructure Opportunity Tracker • Confidential Enterprise Report', margin, pageHeight - 7);

        // Footer Right Text (Page Numbers)
        doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
      }
    });

    // Save PDF file
    doc.save(filename);
  },

  exportToExcel: (arg1, arg2) => {
    let oppList = mockOpportunities;
    let filename = `Tender_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    if (Array.isArray(arg1)) {
      oppList = arg1;
      if (typeof arg2 === 'string') filename = arg2;
    } else if (typeof arg1 === 'string') {
      filename = arg1;
      if (Array.isArray(arg2)) oppList = arg2;
    }

    const headers = ['ID', 'Name', 'Source', 'Sector', 'Location', 'Value', 'AI Score', 'Deadline', 'Status'];
    const rows = oppList.map((o) => [
      o.id || '',
      `"${(o.name || o.title || '').replace(/"/g, '""')}"`,
      `"${(o.source || '').replace(/"/g, '""')}"`,
      `"${(o.sector || 'Infrastructure').replace(/"/g, '""')}"`,
      `"${(o.location || '').replace(/"/g, '""')}"`,
      `"${(o.value || 'N/A').replace(/"/g, '""')}"`,
      o.aiScore != null ? o.aiScore : 'N/A',
      `"${(o.deadline || '').replace(/"/g, '""')}"`,
      `"${(o.status || 'New').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

