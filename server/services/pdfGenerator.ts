import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface ContractData {
  contractNumber: string;
  borrower: {
    fullName: string;
    email: string;
    phone?: string;
  };
  application: {
    applicationType: string;
    amount: string;
    durationMonths: number;
    estimatedRate: string;
    estimatedMonthlyPayment: string;
    purpose?: string;
    monthlyIncome?: string;
    employmentStatus?: string;
    companyName?: string;
    siret?: string;
    companyRevenue?: string;
  };
  loanType: {
    name: string;
    description?: string;
  };
  generatedDate: Date;
}

export class PDFGenerator {
  private static readonly CONTRACTS_DIR = path.join(process.cwd(), 'contracts');
  
  static ensureContractsDirectory(): void {
    if (!fs.existsSync(this.CONTRACTS_DIR)) {
      fs.mkdirSync(this.CONTRACTS_DIR, { recursive: true });
    }
  }

  static async generateLoanContract(data: ContractData): Promise<string> {
    this.ensureContractsDirectory();
    
    const fileName = `${data.contractNumber}.pdf`;
    const filePath = path.join(this.CONTRACTS_DIR, fileName);
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        this.addHeader(doc, data);
        this.addContractInfo(doc, data);
        this.addBorrowerInfo(doc, data);
        this.addLoanDetails(doc, data);
        this.addTermsAndConditions(doc, data);
        this.addSignatureSection(doc, data);
        this.addFooter(doc);

        doc.end();

        stream.on('finish', () => {
          resolve(`/contracts/${fileName}`);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private static addHeader(doc: PDFKit.PDFDocument, data: ContractData): void {
    // Ensure we're using a standard font that PDFKit has built-in
    doc.font('Helvetica');
    
    doc
      .fontSize(24)
      .fillColor('#7C3AED')
      .text('LENDIA', { align: 'center' })
      .moveDown(0.3);
    
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text('Solutions de financement innovantes', { align: 'center' })
      .moveDown(0.5);
    
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#E5E7EB')
      .stroke()
      .moveDown(1);
    
    doc
      .fontSize(18)
      .fillColor('#111827')
      .text('CONTRAT DE PRÊT', { align: 'center' })
      .moveDown(0.5);
    
    doc
      .fontSize(12)
      .fillColor('#6B7280')
      .text(`Contrat N° ${data.contractNumber}`, { align: 'center' })
      .moveDown(0.3);
    
    doc
      .fontSize(10)
      .fillColor('#9CA3AF')
      .text(`Généré le ${this.formatDate(data.generatedDate)}`, { align: 'center' })
      .moveDown(2);
  }

  private static addContractInfo(doc: PDFKit.PDFDocument, data: ContractData): void {
    this.addSectionTitle(doc, 'INFORMATIONS DU CONTRAT');
    
    const y = doc.y;
    doc
      .fontSize(10)
      .fillColor('#374151');
    
    this.addInfoRow(doc, 'Numéro de contrat', data.contractNumber);
    this.addInfoRow(doc, 'Type de prêt', data.loanType.name);
    this.addInfoRow(doc, 'Type de demandeur', data.application.applicationType === 'particular' ? 'Particulier' : 'Professionnel');
    this.addInfoRow(doc, 'Date de génération', this.formatDate(data.generatedDate));
    
    doc.moveDown(1.5);
  }

  private static addBorrowerInfo(doc: PDFKit.PDFDocument, data: ContractData): void {
    this.addSectionTitle(doc, 'INFORMATIONS DE L\'EMPRUNTEUR');
    
    this.addInfoRow(doc, 'Nom complet', data.borrower.fullName);
    this.addInfoRow(doc, 'Email', data.borrower.email);
    if (data.borrower.phone) {
      this.addInfoRow(doc, 'Téléphone', data.borrower.phone);
    }
    
    if (data.application.applicationType === 'professional') {
      if (data.application.companyName) {
        this.addInfoRow(doc, 'Entreprise', data.application.companyName);
      }
      if (data.application.siret) {
        this.addInfoRow(doc, 'SIRET', data.application.siret);
      }
      if (data.application.companyRevenue) {
        this.addInfoRow(doc, 'Chiffre d\'affaires', `${this.formatCurrency(data.application.companyRevenue)}`);
      }
    } else {
      if (data.application.monthlyIncome) {
        this.addInfoRow(doc, 'Revenus mensuels', `${this.formatCurrency(data.application.monthlyIncome)}`);
      }
      if (data.application.employmentStatus) {
        this.addInfoRow(doc, 'Statut professionnel', data.application.employmentStatus);
      }
    }
    
    doc.moveDown(1.5);
  }

  private static addLoanDetails(doc: PDFKit.PDFDocument, data: ContractData): void {
    this.addSectionTitle(doc, 'DÉTAILS DU PRÊT');
    
    this.addInfoRow(doc, 'Montant du prêt', this.formatCurrency(data.application.amount), true);
    this.addInfoRow(doc, 'Durée', `${data.application.durationMonths} mois`);
    this.addInfoRow(doc, 'Taux d\'intérêt annuel', `${data.application.estimatedRate}%`, true);
    this.addInfoRow(doc, 'Mensualité estimée', this.formatCurrency(data.application.estimatedMonthlyPayment), true);
    
    if (data.application.purpose) {
      doc.moveDown(0.5);
      this.addInfoRow(doc, 'Objet du prêt', data.application.purpose);
    }
    
    const totalAmount = parseFloat(data.application.estimatedMonthlyPayment) * data.application.durationMonths;
    const interestAmount = totalAmount - parseFloat(data.application.amount);
    
    doc.moveDown(0.5);
    this.addInfoRow(doc, 'Montant total à rembourser', this.formatCurrency(totalAmount.toFixed(2)), true);
    this.addInfoRow(doc, 'Dont intérêts', this.formatCurrency(interestAmount.toFixed(2)));
    
    doc.moveDown(1.5);
  }

  private static addTermsAndConditions(doc: PDFKit.PDFDocument, data: ContractData): void {
    this.addSectionTitle(doc, 'CONDITIONS GÉNÉRALES');
    
    const terms = [
      {
        title: 'Article 1 - Objet du contrat',
        content: `Le présent contrat a pour objet l'octroi d'un prêt d'un montant de ${this.formatCurrency(data.application.amount)} par LENDIA à l'emprunteur désigné ci-dessus, pour une durée de ${data.application.durationMonths} mois.`
      },
      {
        title: 'Article 2 - Modalités de remboursement',
        content: `L'emprunteur s'engage à rembourser le prêt par mensualités de ${this.formatCurrency(data.application.estimatedMonthlyPayment)}, incluant le capital et les intérêts au taux annuel de ${data.application.estimatedRate}%.`
      },
      {
        title: 'Article 3 - Déblocage des fonds',
        content: `Les fonds seront débloqués après signature du présent contrat, vérification des documents et validation par LENDIA. Le délai de déblocage est généralement de 48 heures ouvrées.`
      },
      {
        title: 'Article 4 - Remboursement anticipé',
        content: `L'emprunteur peut procéder au remboursement anticipé total ou partiel du prêt à tout moment, sans frais ni pénalités.`
      },
      {
        title: 'Article 5 - Défaut de paiement',
        content: `En cas de défaut de paiement, des intérêts de retard au taux légal seront appliqués. Après deux mensualités impayées, LENDIA pourra exiger le remboursement immédiat du capital restant dû.`
      },
      {
        title: 'Article 6 - Protection des données',
        content: `Les données personnelles collectées sont traitées conformément au RGPD et à la politique de confidentialité de LENDIA.`
      }
    ];
    
    doc.fontSize(9).fillColor('#374151');
    
    terms.forEach((term, index) => {
      if (doc.y > 650) {
        doc.addPage();
      }
      
      doc
        .fontSize(10)
        .fillColor('#111827')
        .text(term.title, { continued: false })
        .moveDown(0.3);
      
      doc
        .fontSize(9)
        .fillColor('#4B5563')
        .text(term.content, { align: 'justify' })
        .moveDown(0.8);
    });
    
    doc.moveDown(1);
  }

  private static addSignatureSection(doc: PDFKit.PDFDocument, data: ContractData): void {
    if (doc.y > 600) {
      doc.addPage();
    }
    
    this.addSectionTitle(doc, 'SIGNATURES');
    
    doc
      .fontSize(9)
      .fillColor('#6B7280')
      .text('En signant ce contrat, les parties reconnaissent avoir pris connaissance et accepter l\'ensemble des conditions énoncées ci-dessus.', { align: 'justify' })
      .moveDown(2);
    
    const signatureY = doc.y;
    const leftX = 70;
    const rightX = 320;
    
    doc
      .fontSize(10)
      .fillColor('#111827')
      .text('L\'emprunteur', leftX, signatureY, { width: 200 })
      .moveDown(0.3);
    
    doc
      .fontSize(9)
      .fillColor('#6B7280')
      .text(data.borrower.fullName, leftX, doc.y, { width: 200 })
      .moveDown(2.5);
    
    doc
      .moveTo(leftX, doc.y)
      .lineTo(leftX + 150, doc.y)
      .strokeColor('#D1D5DB')
      .stroke();
    
    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text('Signature', leftX, doc.y + 5, { width: 150 });
    
    doc
      .fontSize(10)
      .fillColor('#111827')
      .text('Pour LENDIA', rightX, signatureY, { width: 200 })
      .moveDown(0.3);
    
    doc
      .fontSize(9)
      .fillColor('#6B7280')
      .text('Service de Gestion', rightX, doc.y, { width: 200 })
      .moveDown(2.5);
    
    doc
      .moveTo(rightX, doc.y)
      .lineTo(rightX + 150, doc.y)
      .strokeColor('#D1D5DB')
      .stroke();
    
    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text('Signature', rightX, doc.y + 5, { width: 150 });
  }

  private static addFooter(doc: PDFKit.PDFDocument): void {
    const pages = doc.bufferedPageRange();
    
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      doc
        .fontSize(8)
        .fillColor('#9CA3AF')
        .text(
          `LENDIA - Solutions de financement | contact@lendia.com | Page ${i + 1}/${pages.count}`,
          50,
          doc.page.height - 40,
          { align: 'center', width: doc.page.width - 100 }
        );
    }
  }

  private static addSectionTitle(doc: PDFKit.PDFDocument, title: string): void {
    doc
      .fontSize(12)
      .fillColor('#7C3AED')
      .text(title, { underline: false })
      .moveDown(0.5);
    
    doc
      .moveTo(50, doc.y)
      .lineTo(250, doc.y)
      .strokeColor('#E5E7EB')
      .lineWidth(1)
      .stroke()
      .moveDown(0.8);
  }

  private static addInfoRow(doc: PDFKit.PDFDocument, label: string, value: string, bold: boolean = false): void {
    const y = doc.y;
    
    doc
      .fontSize(9)
      .fillColor('#6B7280')
      .text(label, 50, y, { width: 200, continued: false });
    
    doc
      .fontSize(bold ? 10 : 9)
      .fillColor(bold ? '#111827' : '#374151')
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(value, 260, y, { width: 285 })
      .font('Helvetica');
    
    doc.moveDown(0.6);
  }

  private static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  private static formatCurrency(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(num);
  }
}
