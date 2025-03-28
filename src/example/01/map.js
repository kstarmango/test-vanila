import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import 'ol/ol.css';
import '../../style.css';

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <div id="map1"></div>
    <div id="map2"></div>
  </div>
`
const sharedView = new View({
  center: [126.915278, 37.554944],
  minZoom: 2,
  maxZoom: 20,
  zoom: 10,
  projection: 'EPSG:4326',
});

const map1 = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map1',
  view: sharedView,
});

const map2 = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map2',
  view: sharedView,
});
