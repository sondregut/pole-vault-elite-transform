// Excel Template Generator for Pole Vault Equipment
// Adapted from the Vault web-portal implementation

import * as XLSX from 'xlsx';
import { POLE_BRANDS, ParsedPole } from '@/types/vault';

// Standard pole data structure
export const EXCEL_HEADERS = [
  'Brand',
  'Length',
  'Weight (lbs)',
  'Flex',
  'Serial Number',
  'Notes'
];

// Sample data to show users both imperial and metric formats
export const SAMPLE_DATA = [
  {
    'Brand': 'UCS Spirit',
    'Length': '14\'6"',
    'Weight (lbs)': 170,
    'Flex': 14.2,
    'Serial Number': 'S12345',
    'Notes': 'Training pole - good condition'
  },
  {
    'Brand': 'ESSX',
    'Length': '4.57m',
    'Weight (lbs)': 180,
    'Flex': 15.5,
    'Serial Number': 'E67890',
    'Notes': 'Competition pole (metric length)'
  },
  {
    'Brand': 'Pacer Composite',
    'Length': '15\'0"',
    'Weight (lbs)': 185,
    'Flex': 16.0,
    'Serial Number': 'P11111',
    'Notes': 'Heavy training pole'
  }
];

// Download the existing Excel template file
export function downloadTemplate() {
  try {
    // Create a link element and trigger download of the existing template
    const link = document.createElement('a');
    link.href = '/pole-vault-equipment-template.xlsx';
    link.download = 'pole-vault-equipment-template.xlsx';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw new Error('Failed to download template file');
  }
}

// Parse uploaded Excel file (matches web-portal implementation)
export async function parseExcelFile(file: File): Promise<ParsedPole[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Use the first worksheet (usually 'My Poles')
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        console.log('📊 Parsing Excel file:', sheetName);

        // Custom parsing: Headers at C4:H4, data starts at row 5
        // Convert to array format for precise cell access
        const sheetData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          range: 'C4:H1000' // Focus on columns C-H starting from row 4
        });

        console.log('Raw sheet data (first 10 rows):', sheetData.slice(0, 10));

        // Headers should be in first row of our range (original row 4)
        const headers = sheetData[0] || [];
        console.log('Detected headers:', headers);

        // Data starts from second row of our range (original row 5)
        const dataRows = sheetData.slice(1);
        console.log(`Found ${dataRows.length} data rows`);

        // Parse each data row
        const validated: ParsedPole[] = dataRows
          .map((row: any[], index) => {
            // Skip completely empty rows
            const isEmpty = !row || row.every(cell => !cell || cell.toString().trim() === '');
            if (isEmpty) return null;

            console.log(`Processing row ${index + 5}:`, row);

            // Map columns: [Brand, Length, Weight, Flex, Serial, Notes]
            const [brand, length, weight, flex, serial, notes] = row;

            // Validate required fields
            const isValid = !!(brand && length && weight); // Flex is optional

            const poleData: ParsedPole = {
              rowNumber: index + 5, // Original Excel row number
              brand: (brand || '').toString().trim(),
              length: (length || '').toString().trim(),
              pounds: (weight || '').toString().trim(),
              flex: (flex || '').toString().trim(),
              serial: (serial || '').toString().trim(),
              notes: (notes || '').toString().trim(),
              isValid,
              errors: []
            };

            // Add validation errors
            if (!brand) poleData.errors.push('Brand is required');
            if (!length) poleData.errors.push('Length is required');
            if (!weight) poleData.errors.push('Weight is required');

            // Validate length format (imperial OR metric)
            if (length) {
              const lengthPattern = /^(\d{1,2}'(\d{1,2}"?)?|\d{1,2}\.\d{2}m?|\d\.\d{2}m?)$/;
              if (!lengthPattern.test(length.toString())) {
                poleData.errors.push(`Invalid length format: ${length}. Use 14'6" or 4.57m or 4.57`);
                poleData.isValid = false;
              }
            }

            // Validate weight
            const weightNum = parseFloat(weight?.toString() || '');
            if (weight && (isNaN(weightNum) || weightNum < 100 || weightNum > 300)) {
              poleData.errors.push(`Invalid weight: ${weight}. Must be 100-300 lbs`);
              poleData.isValid = false;
            }

            console.log(`Row ${index + 5} result:`, poleData);
            return poleData;
          })
          .filter(pole => pole !== null) as ParsedPole[];

        console.log(`✅ Successfully parsed ${validated.length} poles`);
        console.log('Valid poles:', validated.filter(p => p.isValid).length);
        console.log('Invalid poles:', validated.filter(p => !p.isValid).length);

        resolve(validated);
      } catch (error) {
        console.error('Parsing error:', error);
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

// Convert parsed data to Firestore format
export function convertToFirebaseFormat(parsedPoles: ParsedPole[]) {
  return parsedPoles.filter(pole => pole.isValid).map(pole => {
    // Build the pole object, only including fields that have values
    const poleDoc: any = {
      name: `${pole.brand} ${pole.length}`,
      brand: pole.brand,
      length: pole.length,
      pounds: pole.pounds
    };

    // Only add optional fields if they have actual values
    if (pole.flex && pole.flex.trim()) {
      poleDoc.flex = pole.flex;
    }

    if (pole.serial && pole.serial.trim()) {
      poleDoc.serial = pole.serial;
    }

    if (pole.notes && pole.notes.trim()) {
      poleDoc.notes = pole.notes;
    }

    return poleDoc;
  });
}