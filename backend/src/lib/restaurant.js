const contact = Object.freeze({
  name: 'FUCHSIUS Culinary Hearth',
  address: '44 Ironwood Pavilion, Galle Fort, Southern Province, Sri Lanka',
  email: 'reservations@fuchsius.com',
  phone: '+94 (91) 458 8900',
});

export function restaurantContactInfo() {
  return { ...contact };
}

export function restaurantLocation() {
  const mapUrl = new URL('https://www.google.com/maps/search/');
  mapUrl.searchParams.set('api', '1');
  mapUrl.searchParams.set('query', contact.address);

  return {
    name: contact.name,
    address: contact.address,
    mapUrl: mapUrl.toString(),
  };
}
