import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mockOpportunities } from '../data/mockData';
import { mockClientProfile } from '../data/clientProfileData';

/**
 * Enterprise Document Export Service
 * Provides client-side PDF and Excel/CSV document generation for Reports & Analytics
 */

export const exportService = {
  /**
   * Generates a professional PDF dossier for a SINGLE SPECIFIC PROJECT ONLY.
   * File name: [Project_Name]_Details.pdf
   */
  exportSingleProjectPDF: (project) => {
    const proj = project || mockClientProfile.pastProjects[0];
    if (!proj) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;

    // 1. Top Colored Accent Bar
    doc.setFillColor(30, 58, 138); // Navy Blue (#1E3A8A)
    doc.rect(0, 0, pageWidth, 6, 'F');

    // 2. Organization Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 58, 138);
    doc.text('INFRASTRUCTURE OPPORTUNITY TRACKER', margin, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Client Profile • Individual Project Specification Dossier', margin, 22);

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    doc.setFontSize(8);
    doc.text(`Generated: ${dateStr}`, pageWidth - margin, 17, { align: 'right' });
    doc.text(`Ref ID: ${proj.contractRef || proj.id || 'PRJ-SPEC'}`, pageWidth - margin, 22, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, 26, pageWidth - margin, 26);

    // 3. Project Title & Badges
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // Charcoal #0F172A
    const splitTitle = doc.splitTextToSize(proj.name || 'Untitled Project', pageWidth - margin * 2);
    doc.text(splitTitle, margin, 34);
    let currentY = 34 + splitTitle.length * 6;

    // Badge pills
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    // Status pill
    const isCompleted = proj.status === 'Completed';
    doc.setFillColor(isCompleted ? 220 : 254, isCompleted ? 252 : 243, isCompleted ? 231 : 199);
    doc.roundedRect(margin, currentY, 32, 6.5, 1.5, 1.5, 'F');
    doc.setTextColor(isCompleted ? 22 : 146, isCompleted ? 101 : 64, isCompleted ? 52 : 14);
    doc.text(`Status: ${proj.status || 'Active'}`, margin + 3, currentY + 4.5);

    // Sector pill
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin + 36, currentY, 45, 6.5, 1.5, 1.5, 'F');
    doc.setTextColor(37, 99, 235);
    doc.text(`Sector: ${proj.sector || 'Infrastructure'}`, margin + 39, currentY + 4.5);

    // Country pill
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin + 85, currentY, 36, 6.5, 1.5, 1.5, 'F');
    doc.setTextColor(71, 85, 105);
    doc.text(`Country: ${proj.country || 'N/A'}`, margin + 88, currentY + 4.5);

    currentY += 12;

    // 4. Quick Facts Grid (4 cards across)
    const facts = [
      { label: 'CONTRACT VALUE', val: proj.value || 'N/A', color: [29, 78, 216] },
      { label: 'CLIENT / AGENCY', val: proj.client || 'N/A', color: [15, 23, 42] },
      { label: 'EXECUTION TIMELINE', val: proj.duration || `${proj.year}`, color: [15, 23, 42] },
      { label: 'LOCATION / CORRIDORS', val: proj.location || proj.country || 'N/A', color: [15, 23, 42] }
    ];

    const cardW = (pageWidth - margin * 2 - 9) / 4;
    const cardH = 17;

    facts.forEach((f, idx) => {
      const cx = margin + idx * (cardW + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx, currentY, cardW, cardH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(f.label, cx + 2.5, currentY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(f.color[0], f.color[1], f.color[2]);
      const valLines = doc.splitTextToSize(f.val, cardW - 5);
      doc.text(valLines, cx + 2.5, currentY + 11);
    });

    currentY += cardH + 7;

    // 5. Sections Rendering Helper
    const addSection = (title, textContent, itemsList = null) => {
      if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138);
      doc.text(title, margin, currentY);
      currentY += 4.5;

      if (textContent) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(textContent, pageWidth - margin * 2);
        doc.text(lines, margin, currentY);
        currentY += lines.length * 3.8 + 4;
      }

      if (Array.isArray(itemsList) && itemsList.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        itemsList.forEach((item) => {
          if (currentY > pageHeight - 25) {
            doc.addPage();
            currentY = 20;
          }
          const bulletText = `•  ${item}`;
          const itemLines = doc.splitTextToSize(bulletText, pageWidth - margin * 2 - 4);
          doc.text(itemLines, margin + 2, currentY);
          currentY += itemLines.length * 3.8 + 1.8;
        });
        currentY += 3;
      }
    };

    if (proj.overview) {
      addSection('1. Project Overview & Background', proj.overview);
    }

    if (proj.scope) {
      addSection('2. Scope of Work & Engineering Details', proj.scope);
    }

    if (proj.objectives && proj.objectives.length > 0) {
      addSection('3. Key Project Objectives', null, proj.objectives);
    }

    if (proj.keyActivities && proj.keyActivities.length > 0) {
      addSection('4. Key Activities & Execution Phases', null, proj.keyActivities);
    }

    if (proj.outcomes && proj.outcomes.length > 0) {
      addSection('5. Key Outcomes & Delivered Impact', null, proj.outcomes);
    }

    // 6. Administrative Details & Safeguards Table
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }

    const metaRows = [];
    if (proj.projectLead) metaRows.push(['Project Lead', proj.projectLead]);
    if (proj.teamSize) metaRows.push(['Team Deployment', proj.teamSize]);
    if (proj.contractRef) metaRows.push(['Contract Reference ID', proj.contractRef]);
    if (proj.standards) metaRows.push(['Standards & Safeguards', proj.standards]);

    if (metaRows.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Administrative Specification', 'Details']],
        body: metaRows,
        margin: { left: margin, right: margin, bottom: 20 },
        theme: 'grid',
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [51, 65, 85]
        },
        columnStyles: {
          0: { cellWidth: 48, fontStyle: 'bold' },
          1: { cellWidth: pageWidth - margin * 2 - 48 }
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = data.pageNumber;

          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.4);
          doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(148, 163, 184);
          doc.text(`Project Dossier: ${proj.name} • Strictly Confidential`, margin, pageHeight - 7);
          doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
        }
      });
    }

    const cleanName = (proj.name || 'Project_Details').replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`${cleanName}_Details.pdf`);
  },

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
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = data.pageNumber;

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Infrastructure Opportunity Tracker • Confidential Enterprise Report', margin, pageHeight - 7);
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
