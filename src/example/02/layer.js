import 'ol/ol.css';
import '../../style.css';
import './style.css';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource, TileWMS } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

/*
OpenLayers를 사용한 레이어 컨트롤 예제

기능:
1. 3개의 레이어 관리 (기본지도, WMS, 벡터레이어)
2. 각 레이어별 기능
   - ON/OFF 토글
   - Z-Index 조절 (위/아래 이동)
   - 레이어 삭제

Ui:
1. 레이어 ON/OFF: 토글 버튼 클릭
2. 레이어 순서 변경: 위/아래 화살표 버튼 클릭
3. 레이어 삭제: X 버튼 클릭

*/

// HTML 구조 정의
document.getElementById('app').innerHTML = `
  <div class="main-container">
    <div class="control-panel">
      <div class="layer-controls">
        <h3>레이어 컨트롤</h3>
        <div class="layer-list">
          <div class="layer-item" id="osm-item">
            <span>기본지도</span>
            <div class="layer-buttons">
              <button id="toggle-osm" class="toggle-btn active">ON</button>
              <button id="up-osm" class="arrow-btn">↑</button>
              <button id="down-osm" class="arrow-btn">↓</button>
              <button id="delete-osm" class="delete-btn">×</button>
            </div>
          </div>
          <div class="layer-item" id="wms-item">
            <span>WMS 레이어</span>
            <div class="layer-buttons">
              <button id="toggle-wms" class="toggle-btn">OFF</button>
              <button id="up-wms" class="arrow-btn">↑</button>
              <button id="down-wms" class="arrow-btn">↓</button>
              <button id="delete-wms" class="delete-btn">×</button>
            </div>
          </div>
          <div class="layer-item" id="vector-item">
            <span>벡터 레이어</span>
            <div class="layer-buttons">
              <button id="toggle-vector" class="toggle-btn">OFF</button>
              <button id="up-vector" class="arrow-btn">↑</button>
              <button id="down-vector" class="arrow-btn">↓</button>
              <button id="delete-vector" class="delete-btn">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
`;

const osmLayer = new TileLayer({
  source: new OSM(),
  visible: true,
  title: 'OSM'
});

const wmsLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://ows.terrestris.de/osm/service',
    params: {
      'LAYERS': 'OSM-WMS',
      'FORMAT': 'image/png'
    }
  }),
  visible: false,
  title: 'Terrestris OSM'
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: 'https://openlayers.org/data/vector/ecoregions.json',
    format: new GeoJSON()
  }),
  visible: false,
  title: 'Vector Layer'
});

const map = new Map({
  target: 'map',
  layers: [osmLayer, wmsLayer, vectorLayer],
  view: new View({
    center: fromLonLat([126.9779, 37.5665]), 
    zoom: 7
  })
});

// 실습 1
function toggleLayer(layer, button) {}

// 실습 2
function moveLayer(layer, direction) {}

// 실습 3
function deleteLayer(layer, itemId) {}

const layerSetup = [
  { id: 'osm', layer: osmLayer, itemId: 'osm-item' },
  { id: 'wms', layer: wmsLayer, itemId: 'wms-item' },
  { id: 'vector', layer: vectorLayer, itemId: 'vector-item' }
];

osmLayer.setZIndex(1);
wmsLayer.setZIndex(2);
vectorLayer.setZIndex(3);

layerSetup.forEach(({ id, layer, itemId }) => {
  const toggleBtn = document.getElementById(`toggle-${id}`);
  const upBtn = document.getElementById(`up-${id}`);
  const downBtn = document.getElementById(`down-${id}`);
  const deleteBtn = document.getElementById(`delete-${id}`);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleLayer(layer, toggleBtn));
  }
  
  if (upBtn) {
    upBtn.addEventListener('click', () => moveLayer(layer, 'up'));
  }
  
  if (downBtn) {
    downBtn.addEventListener('click', () => moveLayer(layer, 'down'));
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => deleteLayer(layer, itemId));
  }

  if (toggleBtn && layer.getVisible()) {
    toggleBtn.textContent = 'ON';
    toggleBtn.classList.add('active');
  } else if (toggleBtn) {
    toggleBtn.textContent = 'OFF';
    toggleBtn.classList.remove('active');
  }
}); 