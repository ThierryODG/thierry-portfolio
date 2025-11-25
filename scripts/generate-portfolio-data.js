import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONCEPTION_DIR = path.join(__dirname, '../../02-CONCEPTION');
const OUTPUT_FILE = path.join(__dirname, '../public/projects.json');

// Category detection based on filename patterns
const CATEGORY_PATTERNS = {
    'Affiche': /^(AF|A2F|affiche)/i,
    'Bannière': /^(BAN|banniere|banner)/i,
    'Carte de visite': /^(CV|carte|business.?card)/i,
    'Flyer': /^(FLY|flyer|depliant)/i,
    'Logo': /^(LOGO|logo)/i,
    'Kakemono': /^(KAK|kakemono)/i,
    'Catalogue': /^(CAT|catalogue)/i,
    'Maquette': /^(MAQ|maquette)/i,
};

// Image extensions to include
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function detectCategory(filename) {
    for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
        if (pattern.test(filename)) {
            return category;
        }
    }
    return 'Autre';
}

function isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
}

function scanDirectory(dirPath, projectName = '') {
    const items = {
        name: projectName || path.basename(dirPath),
        type: 'project',
        images: [],
        subfolders: [],
        logo: null,
    };

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(CONCEPTION_DIR, fullPath).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                const subfolder = scanDirectory(fullPath, entry.name);
                if (subfolder.images.length > 0 || subfolder.subfolders.length > 0) {
                    items.subfolders.push(subfolder);
                }
            } else if (entry.isFile() && isImageFile(entry.name)) {
                const category = detectCategory(entry.name);

                // Check if it's a logo
                if (category === 'Logo' || /logo/i.test(entry.name)) {
                    items.logo = `/${relativePath}`;
                }

                items.images.push({
                    filename: entry.name,
                    path: `/${relativePath}`,
                    category: category,
                    size: fs.statSync(fullPath).size,
                });
            }
        }
    } catch (error) {
        console.error(`Error scanning ${dirPath}:`, error.message);
    }

    return items;
}

function generatePortfolioData() {
    console.log('🔍 Scanning CONCEPTION directory...');

    if (!fs.existsSync(CONCEPTION_DIR)) {
        console.error(`❌ Directory not found: ${CONCEPTION_DIR}`);
        process.exit(1);
    }

    const projects = [];
    const entries = fs.readdirSync(CONCEPTION_DIR, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            console.log(`  📁 Processing: ${entry.name}`);
            const projectData = scanDirectory(path.join(CONCEPTION_DIR, entry.name), entry.name);

            // Only add projects that have images
            if (projectData.images.length > 0 || projectData.subfolders.length > 0) {
                projects.push(projectData);
            }
        }
    }

    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2), 'utf-8');

    console.log(`\n✅ Generated portfolio data: ${OUTPUT_FILE}`);
    console.log(`📊 Total projects: ${projects.length}`);

    const totalImages = projects.reduce((sum, p) => {
        const projectImages = p.images.length;
        const subfolderImages = p.subfolders.reduce((s, sf) => s + sf.images.length, 0);
        return sum + projectImages + subfolderImages;
    }, 0);

    console.log(`🖼️  Total images: ${totalImages}`);
}

// Run the script
generatePortfolioData();
