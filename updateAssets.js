const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, 'client', 'src', 'assets', 'assets.js');
let content = fs.readFileSync(assetsPath, 'utf8');

// Replace GreatStack with Abhinav Singh globally
content = content.replace(/GreatStack/g, 'Abhinav Singh');

// Create imports
let imports = '';
for(let i=1; i<=25; i++) {
    imports += `import comm_img_${i} from "./comm_img_${i}.jpg";\n`;
}

// Add imports after ai_image11
content = content.replace(/import ai_image11 from "\.\/ai_image11\.jpg";/, `import ai_image11 from "./ai_image11.jpg";\n${imports}`);

// Create the new dummyPublishedImages array
let newArray = 'export const dummyPublishedImages = [\n';
const usernames = ['Abhinav Singh', 'NeonVisions', 'ArtfulMind', 'CosmicBrush', 'PixelDreamer', 'DreamForge'];
for(let i=1; i<=25; i++) {
    newArray += `    {\n        "imageUrl": comm_img_${i},\n        "userName": "${usernames[i % usernames.length]}"\n    }${i === 25 ? '' : ','}\n`;
}
newArray += ']\n';

// Replace the old array
const startIdx = content.indexOf('export const dummyPublishedImages = [');
const endIdx = content.indexOf(']', startIdx) + 1;

content = content.substring(0, startIdx) + newArray + content.substring(endIdx);

fs.writeFileSync(assetsPath, content);
console.log('Successfully updated assets.js');
