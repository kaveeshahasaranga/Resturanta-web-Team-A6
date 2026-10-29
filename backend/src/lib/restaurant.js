export const defaultRestaurantSettings = Object.freeze({
  name: 'FUCHSIUS Culinary Hearth',
  address: '44 Ironwood Pavilion, Galle Fort, Southern Province, Sri Lanka',
  email: 'reservations@fuchsius.com',
  phone: '+94 (91) 458 8900',
  mapUrl: null,
});

export function restaurantContactInfo(settings = defaultRestaurantSettings) {
  const { name, address, email, phone } = settings;
  return { name, address, email, phone };
}

export function restaurantLocation(settings = defaultRestaurantSettings) {
  const mapUrl = settings.mapUrl || new URL('https://www.google.com/maps/search/');
  if (mapUrl instanceof URL) {
    mapUrl.searchParams.set('api', '1');
    mapUrl.searchParams.set('query', settings.address);
  }

  return {
    name: settings.name,
    address: settings.address,
    mapUrl: mapUrl.toString(),
  };
}
