const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // follow redirect
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', (err) => {
                    fs.unlink(dest, () => reject(err));
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function main() {
    console.log('Downloading 25 images...');
    const outDir = path.join(__dirname, 'client', 'src', 'assets');
    
    for (let i = 1; i <= 25; i++) {
        const url = `https://picsum.photos/seed/trygptimg${i}/512/512`;
        const dest = path.join(outDir, `comm_img_${i}.jpg`);
        try {
            await download(url, dest);
            console.log(`Downloaded ${i}/25`);
        } catch (e) {
            console.error(`Failed to download ${i}:`, e);
        }
    }
    console.log('Done!');
}

main();
