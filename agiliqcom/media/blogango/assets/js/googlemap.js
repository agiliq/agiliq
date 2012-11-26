
var map;
var center = new google.maps.LatLng(51.500152,-0.126236);

function initialize() {

  var roadAtlasStyles = []

  var mapOptions = {
    zoom: 13,
    center: center,
    panControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    mapTypeControlOptions: {
       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map']
    }
  };

  map = new google.maps.Map(document.getElementById("google-map"),
      mapOptions);
      
  var styledMapOptions = {
    name: "Map"
  };

  var usRoadMapType = new google.maps.StyledMapType(
      roadAtlasStyles, styledMapOptions);

  map.mapTypes.set('map', usRoadMapType);
  map.setMapTypeId('map');
  
    var image = 'assets/js/google_icon.png';
    var map_ = new google.maps.LatLng(51.500152,-0.126236);
    var Marker = new google.maps.Marker({
        position: map_,
        map: map,
        icon: image
    });

}
