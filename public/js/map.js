mapboxgl.accessToken = mapToken ;
console.log(coordinates);
if(coordinates.length==0){
  coordinates=[77.5946,12.9716];
}


  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 9
  });

  const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<p>Exact Location provided after booking</p>"
    )
  )
  .addTo(map);