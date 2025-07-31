const https = require('https');
const fs = require('fs');
const path = require('path');

// Medicine images to download from Unsplash
const medicineImages = [
  {
    name: 'paracetamol.png',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'ors.png',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'chloroquine.png',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'amoxicillin.png',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'vitamin-d3.png',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'iron-tablets.png',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'
  },
  {
    name: 'default-medicine.png',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format'
  }
];

const imagesDir = path.join(__dirname, '../assets/images/medicines');

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting download of medicine images...');
  
  for (const image of medicineImages) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Failed to download ${image.name}:`, error);
    }
  }
  
  console.log('Download completed!');
}

downloadAllImages(); 