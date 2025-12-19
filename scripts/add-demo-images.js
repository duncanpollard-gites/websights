// Add Unsplash images to demo site configs
const mysql = require('mysql2/promise');

// Trade-specific Unsplash images (high quality, relevant photos)
const tradeImages = {
  plumber: {
    hero: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop'
  },
  electrician: {
    hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  },
  builder: {
    hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'
  },
  carpenter: {
    hero: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&h=600&fit=crop'
  },
  painter: {
    hero: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop'
  },
  roofer: {
    hero: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
  },
  landscaper: {
    hero: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop'
  },
  plasterer: {
    hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop'
  },
  tiler: {
    hero: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop'
  },
  locksmith: {
    hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&h=600&fit=crop'
  },
  handyman: {
    hero: 'https://images.unsplash.com/photo-1581147036324-c17ac41f0e88?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop'
  },
  cleaner: {
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop'
  },
  gardener: {
    hero: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1599629954294-14df9ec13f7e?w=800&h=600&fit=crop'
  },
  'pest-control': {
    hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop'
  },
  hvac: {
    hero: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&h=1080&fit=crop',
    about: 'https://images.unsplash.com/photo-1631545806609-e9a2f0f3d6da?w=800&h=600&fit=crop'
  }
};

async function main() {
  // Detect environment - check for MAMP socket
  const fs = require('fs');
  const isMamp = fs.existsSync('/Applications/MAMP/tmp/mysql/mysql.sock');

  const connectionConfig = isMamp ? {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tradevista',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  } : {
    host: '127.0.0.1',
    user: 'root',
    password: 'TradeVista2024',
    database: 'tradevista'
  };

  console.log(`Connecting via ${isMamp ? 'MAMP socket' : 'TCP'}...`);
  const connection = await mysql.createConnection(connectionConfig);

  try {
    for (const [slug, images] of Object.entries(tradeImages)) {
      // Get current config
      const [rows] = await connection.execute(
        'SELECT demo_site_config FROM trade_categories WHERE slug = ?',
        [slug]
      );

      if (rows.length && rows[0].demo_site_config) {
        // Parse existing config (handle both string and object)
        let config = rows[0].demo_site_config;
        if (typeof config === 'string') {
          config = JSON.parse(config);
        }

        // Add images
        config.images = images;

        // Update database
        await connection.execute(
          'UPDATE trade_categories SET demo_site_config = ? WHERE slug = ?',
          [JSON.stringify(config), slug]
        );

        console.log(`Added images for: ${slug}`);
      } else {
        console.log(`No config found for: ${slug}`);
      }
    }

    console.log('\nAll images added successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

main();
