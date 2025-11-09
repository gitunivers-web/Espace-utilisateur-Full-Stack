import fs from 'fs';
import path from 'path';

/**
 * Script pour fusionner les nouvelles traductions de types de prêts
 * dans les fichiers i18n existants
 */

const LOCALES_DIR = path.join(process.cwd(), 'client/src/i18n/locales');
const TRANSLATIONS_FILE = path.join(process.cwd(), 'scripts/loan-types-translations.json');

async function mergeTranslations() {
  try {
    console.log('📚 Fusion des traductions des types de prêts...\n');
    
    // Lire le fichier de traductions
    const newTranslations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));
    
    // Pour chaque langue
    for (const [lang, translations] of Object.entries(newTranslations)) {
      const localeFile = path.join(LOCALES_DIR, `${lang}.json`);
      
      console.log(`🌐 Traitement de ${lang}.json...`);
      
      // Lire le fichier existant
      const existing = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
      
      // Fusionner les nouvelles traductions
      existing.loanTypes = (translations as any).loanTypes;
      
      // Écrire le fichier mis à jour
      fs.writeFileSync(localeFile, JSON.stringify(existing, null, 2) + '\n', 'utf8');
      
      console.log(`✅ ${lang}.json mis à jour`);
    }
    
    console.log('\n✨ Toutes les traductions ont été fusionnées avec succès !');
    console.log('📝 Langues mises à jour : FR, EN, PT, ES, IT, HU, PL');
    
  } catch (error) {
    console.error('❌ Erreur lors de la fusion:', error);
    throw error;
  }
}

mergeTranslations();
