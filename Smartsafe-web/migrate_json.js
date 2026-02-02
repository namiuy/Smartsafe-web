
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

let modifiedCount = 0;

walkDir(CONTENT_DIR, (filePath) => {
    if (path.basename(filePath) === 'product.json') {
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            const data = JSON.parse(content);
            let modified = false;

            // Check for legacy CTA Primary
            if (data.cta && data.cta.primary) {
                if (!data.purchase) {
                    data.purchase = {
                        label: data.cta.primary.label || "Comprar en Nami",
                        url: data.cta.primary.url || ""
                    };
                }
                delete data.cta.primary;
                modified = true;
            }

            // Check for legacy CTA Secondary
            if (data.cta && data.cta.secondary) {
                if (data.cta.secondary.label && data.cta.secondary.label !== "Consultar disponibilidad") {
                    data.cta.secondaryLabel = data.cta.secondary.label;
                }
                delete data.cta.secondary;
                modified = true;
            }

            // Clean up empty CTA object or just with whatsappText
            if (data.cta) {
                // If cta has no keys left, delete it
                if (Object.keys(data.cta).length === 0) {
                    delete data.cta;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Updated: ${filePath}`);
                modifiedCount++;
            }
        } catch (e) {
            console.error(`Error parsing ${filePath}:`, e);
        }
    }
});

console.log(`Total files updated: ${modifiedCount}`);
