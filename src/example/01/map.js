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
