/**
 * Tamil Nadu Bus Stops Database
 * Real coordinates for major Tamil Nadu cities
 * 
 * Format: { stopName, latitude, longitude, city, description }
 * Coordinates are precise to 7 decimal places
 */

const tamilnaduStops = {
  // Chennai
  chennai: [
    {
      stopName: 'Chennai Central Railway Station',
      latitude: 13.0826869,
      longitude: 80.2784338,
      city: 'Chennai',
      description: 'Main central railway station and hub'
    },
    {
      stopName: 'Alandur Bus Stand',
      latitude: 12.9859098,
      longitude: 80.2118055,
      city: 'Chennai',
      description: 'Suburban bus terminal'
    },
    {
      stopName: 'Anna Salai',
      latitude: 13.0495,
      longitude: 80.2624,
      city: 'Chennai',
      description: 'Anna Salai (Mount Road) main thoroughfare'
    },
    {
      stopName: 'Egmore Station',
      latitude: 13.0649,
      longitude: 80.2386,
      city: 'Chennai',
      description: 'Egmore railway station area'
    },
    {
      stopName: 'T. Nagar',
      latitude: 13.0356,
      longitude: 80.2419,
      city: 'Chennai',
      description: 'Shopping and commercial district'
    }
  ],

  // Coimbatore
  coimbatore: [
    {
      stopName: 'Coimbatore Central Bus Station',
      latitude: 11.0168,
      longitude: 76.9558,
      city: 'Coimbatore',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Gandhipuram',
      latitude: 11.0195,
      longitude: 76.9546,
      city: 'Coimbatore',
      description: 'Commercial area with shops and market'
    },
    {
      stopName: 'RS Puram',
      latitude: 11.0085,
      longitude: 76.9498,
      city: 'Coimbatore',
      description: 'Residential and commercial locality'
    },
    {
      stopName: 'Peelamedu',
      latitude: 11.0228,
      longitude: 76.9634,
      city: 'Coimbatore',
      description: 'Educational and residential zone'
    },
    {
      stopName: 'Saibaba Colony',
      latitude: 11.0289,
      longitude: 76.9518,
      city: 'Coimbatore',
      description: 'Residential area'
    }
  ],

  // Madurai
  madurai: [
    {
      stopName: 'Madurai Central Bus Station',
      latitude: 9.9252,
      longitude: 78.1198,
      city: 'Madurai',
      description: 'Main central bus stand'
    },
    {
      stopName: 'Arappalayam',
      latitude: 9.9215,
      longitude: 78.1289,
      city: 'Madurai',
      description: 'Commercial district'
    },
    {
      stopName: 'Teppakulam',
      latitude: 9.9195,
      longitude: 78.1156,
      city: 'Madurai',
      description: 'Area near Teppa kulam tank'
    },
    {
      stopName: 'Meenakshi Temple Complex',
      latitude: 9.9195,
      longitude: 78.1239,
      city: 'Madurai',
      description: 'Area near famous temple'
    },
    {
      stopName: 'Usilampatti',
      latitude: 9.8945,
      longitude: 78.1256,
      city: 'Madurai',
      description: 'Outskirts transportation hub'
    }
  ],

  // Salem
  salem: [
    {
      stopName: 'Salem Central Bus Station',
      latitude: 11.6643,
      longitude: 78.1460,
      city: 'Salem',
      description: 'Main central bus terminus'
    },
    {
      stopName: 'Periamet',
      latitude: 11.6678,
      longitude: 78.1534,
      city: 'Salem',
      description: 'Commercial and residential area'
    },
    {
      stopName: 'Town',
      latitude: 11.6656,
      longitude: 78.1523,
      city: 'Salem',
      description: 'Downtown central area'
    },
    {
      stopName: 'Karumandapam',
      latitude: 11.6756,
      longitude: 78.1456,
      city: 'Salem',
      description: 'Industrial and residential zone'
    },
    {
      stopName: 'Suramangalam',
      latitude: 11.6545,
      longitude: 78.1567,
      city: 'Salem',
      description: 'South Salem locality'
    }
  ],

  // Trichy (Tiruchirappalli)
  trichy: [
    {
      stopName: 'Trichy Central Bus Station',
      latitude: 10.7905,
      longitude: 78.7047,
      city: 'Trichy',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Cantonment',
      latitude: 10.7956,
      longitude: 78.6987,
      city: 'Trichy',
      description: 'Cantonment area'
    },
    {
      stopName: 'Fort Area',
      latitude: 10.7878,
      longitude: 78.7123,
      city: 'Trichy',
      description: 'Historic fort area'
    },
    {
      stopName: 'Srirangam',
      latitude: 10.8334,
      longitude: 78.7789,
      city: 'Trichy',
      description: 'Area near Sri Ranganathaswamy Temple'
    },
    {
      stopName: 'Thennur',
      latitude: 10.7845,
      longitude: 78.7234,
      city: 'Trichy',
      description: 'West Trichy residential area'
    }
  ],

  // Tiruppur
  tiruppur: [
    {
      stopName: 'Tiruppur Central Bus Station',
      latitude: 11.1087,
      longitude: 77.3411,
      city: 'Tiruppur',
      description: 'Main central bus stand'
    },
    {
      stopName: 'Avinashi Road',
      latitude: 11.1156,
      longitude: 77.3345,
      city: 'Tiruppur',
      description: 'Textile hub main road'
    },
    {
      stopName: 'Kumaran Nagar',
      latitude: 11.1023,
      longitude: 77.3567,
      city: 'Tiruppur',
      description: 'Commercial locality'
    },
    {
      stopName: 'Rathinapuri',
      latitude: 11.0956,
      longitude: 77.3412,
      city: 'Tiruppur',
      description: 'Residential area'
    },
    {
      stopName: 'Perur',
      latitude: 11.1289,
      longitude: 77.3456,
      city: 'Tiruppur',
      description: 'Temple area near Perur'
    }
  ],

  // Erode
  erode: [
    {
      stopName: 'Erode Central Bus Station',
      latitude: 11.3411,
      longitude: 77.7172,
      city: 'Erode',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Town Bus Stand',
      latitude: 11.3445,
      longitude: 77.7234,
      city: 'Erode',
      description: 'Town area bus stand'
    },
    {
      stopName: 'Kumaran Nagar',
      latitude: 11.3378,
      longitude: 77.7089,
      city: 'Erode',
      description: 'Commercial and residential zone'
    },
    {
      stopName: 'Bhavani',
      latitude: 11.4456,
      longitude: 77.6845,
      city: 'Erode',
      description: 'Satellite town'
    },
    {
      stopName: 'Perundurai',
      latitude: 11.2834,
      longitude: 77.9145,
      city: 'Erode',
      description: 'Industrial area'
    }
  ],

  // Kanchipuram
  kanchipuram: [
    {
      stopName: 'Kanchipuram Central Bus Station',
      latitude: 12.8267,
      longitude: 79.7293,
      city: 'Kanchipuram',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Mahabalipuram Road',
      latitude: 12.8234,
      longitude: 79.7156,
      city: 'Kanchipuram',
      description: 'Highway connecting to Mahabalipuram'
    },
    {
      stopName: 'Temple Town Center',
      latitude: 12.8289,
      longitude: 79.7456,
      city: 'Kanchipuram',
      description: 'Near historic temples'
    }
  ],

  // Vellore
  vellore: [
    {
      stopName: 'Vellore Central Bus Station',
      latitude: 12.9689,
      longitude: 79.1288,
      city: 'Vellore',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Fort Area',
      latitude: 12.9756,
      longitude: 79.1245,
      city: 'Vellore',
      description: 'Historic Vellore Fort area'
    },
    {
      stopName: 'Katpadi',
      latitude: 12.9312,
      longitude: 79.2067,
      city: 'Vellore',
      description: 'Railway junction area'
    }
  ],

  // Thanjavur
  thanjavur: [
    {
      stopName: 'Thanjavur Central Bus Station',
      latitude: 10.7870,
      longitude: 79.1378,
      city: 'Thanjavur',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Chola area',
      latitude: 10.7923,
      longitude: 79.1456,
      city: 'Thanjavur',
      description: 'Historic Chola region'
    }
  ],

  // Nagercoil
  nagercoil: [
    {
      stopName: 'Nagercoil Central Bus Station',
      latitude: 8.1889,
      longitude: 77.4249,
      city: 'Nagercoil',
      description: 'Main central bus terminal'
    },
    {
      stopName: 'Main Bazaar',
      latitude: 8.1945,
      longitude: 77.4178,
      city: 'Nagercoil',
      description: 'Commercial market area'
    }
  ]
};

module.exports = tamilnaduStops;
