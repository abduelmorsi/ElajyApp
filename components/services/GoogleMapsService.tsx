// Simplified Google Maps Service - React-friendly with no DOM conflicts
// This provides map functionality without any direct DOM manipulation

export interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

export interface MapOptions {
  center: MapLocation;
  zoom: number;
  markers?: MapLocation[];
  showUserLocation?: boolean;
}

class GoogleMapsServiceClass {
  private initialized = false;

  async initialize(): Promise<void> {
    // Mock initialization - no DOM manipulation
    return new Promise((resolve) => {
      setTimeout(() => {
        this.initialized = true;
        resolve();
      }, 500);
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Return map data instead of manipulating DOM
  getMapData(options: MapOptions): Promise<{ 
    center: MapLocation; 
    markers: MapLocation[]; 
    ready: boolean 
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          center: options.center,
          markers: options.markers || [],
          ready: true
        });
      }, 800);
    });
  }

  async searchNearbyPharmacies(location: MapLocation, radius: number = 5000): Promise<MapLocation[]> {
    // Mock nearby pharmacies search
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPharmacies: MapLocation[] = [
          {
            lat: location.lat + 0.001,
            lng: location.lng + 0.001,
            name: 'صيدلية النيل الأزرق',
            address: 'الخرطوم - المقرن'
          },
          {
            lat: location.lat - 0.002,
            lng: location.lng + 0.002,
            name: 'صيدلية الصحة المتكاملة',
            address: 'أم درمان - الثورة'
          },
          {
            lat: location.lat + 0.003,
            lng: location.lng - 0.001,
            name: 'صيدلية الخرطوم المركزية',
            address: 'الخرطوم بحري - الدرجة الثالثة'
          }
        ];
        resolve(mockPharmacies);
      }, 600);
    });
  }

  async getCurrentLocation(): Promise<MapLocation> {
    // Mock user location - Khartoum coordinates
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: 'Your Location'
            });
          },
          () => {
            // Fallback to Khartoum coordinates
            resolve({
              lat: 15.5007,
              lng: 32.5599,
              name: 'Khartoum, Sudan'
            });
          }
        );
      } else {
        // Fallback to Khartoum coordinates
        resolve({
          lat: 15.5007,
          lng: 32.5599,
          name: 'Khartoum, Sudan'
        });
      }
    });
  }

  calculateDistance(location1: MapLocation, location2: MapLocation): number {
    // Simple distance calculation using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(location2.lat - location1.lat);
    const dLng = this.degToRad(location2.lng - location1.lng);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(location1.lat)) *
      Math.cos(this.degToRad(location2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getDirections(from: MapLocation, to: MapLocation): Promise<string> {
    // Mock directions - return simple instruction
    return new Promise((resolve) => {
      setTimeout(() => {
        const distance = this.calculateDistance(from, to).toFixed(1);
        resolve(`Directions to ${to.name || 'destination'}: ${distance} km away`);
      }, 300);
    });
  }

  // No longer manipulates DOM - safe cleanup
  destroy(): void {
    this.initialized = false;
  }

  // Helper method to get pharmacy info without popups
  getPharmacyInfo(location: MapLocation): {
    name: string;
    address: string;
    coordinates: string;
  } {
    return {
      name: location.name || 'Unknown Pharmacy',
      address: location.address || 'Address not available',
      coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    };
  }
}

// Export singleton instance
export const GoogleMapsService = new GoogleMapsServiceClass();

// Default Sudan locations for the pharmacy app
export const SudanLocations = {
  KHARTOUM: { lat: 15.5007, lng: 32.5599, name: 'Khartoum' },
  OMDURMAN: { lat: 15.6440, lng: 32.4772, name: 'Omdurman' },
  KHARTOUM_NORTH: { lat: 15.6393, lng: 32.5363, name: 'Khartoum North' },
  KASSALA: { lat: 15.4505, lng: 36.4000, name: 'Kassala' },
  PORT_SUDAN: { lat: 19.6157, lng: 37.2175, name: 'Port Sudan' }
};