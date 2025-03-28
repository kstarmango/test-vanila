import 'ol/ol.css';
import '../../style.css';
import './style.css';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource, TileWMS } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { toStringHDMS } from 'ol/coordinate';
import { transform } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { ScaleLine, ZoomSlider } from 'ol/control';

/**
 * 서울 관광지 지도 예제
 * 
 * 기능:
 * 1. 관광지 목록 표시
 *    - 이미지와 이름으로 구성된 카드 형태
 *    - 호버 효과와 선택 상태 표시
 * 
 * 2. 지도 기능
 *    - OpenStreetMap 기본 지도 표시
 *    - 선택한 위치에 마커 표시
 *    - 위치 선택 시 자동 줌 및 애니메이션
 * 
 * UI 구성:
 * 1. 좌측 사이드바
 *    - 관광지 목록 (이미지 카드)
 *    - 스크롤 가능한 목록
 * 
 * 2. 우측 지도
 *    - 전체 화면에 맞춰진 지도
 *    - 마커로 선택된 위치 표시
 * 
 * 사용 방법:
 * - 사이드바의 관광지 카드 클릭
 * - 해당 위치로 지도 자동 이동
 * - 위치에 마커 자동 생성
 */

const places = [
  {
    id: 1,
    name: '경복궁',
    image: 'https://picsum.photos/300/200?random=1', 
    coordinates: [126.9770, 37.5796]
  },
  {
    id: 2,
    name: '남산타워',
    image: 'https://picsum.photos/300/200?random=2',
    coordinates: [126.9882, 37.5511]
  },
  {
    id: 3,
    name: '롯데타워',
    image: 'https://picsum.photos/300/200?random=3',
    coordinates: [127.1026, 37.5126]
  }
];

document.getElementById('app').innerHTML = `
  <div class="main-container">
    <div class="sidebar">
      <h3>서울 관광지</h3>
      <div class="place-list">
        ${places.map(place => `
          <div class="place-item" data-id="${place.id}">
            <img src="${place.image}" alt="${place.name}">
            <p>${place.name}</p>
          </div>
        `).join('')}
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
  layers: [
    new TileLayer({
      source: new OSM()
    })  
  ],
  view: new View({
    center: fromLonLat([126.9779, 37.5665]),
    zoom: 12,
    minZoom: 7,
    maxZoom: 19
  }),
  controls: [
    new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140
    }),
    new ZoomSlider()
  ]
});

function toggleLayer(layer, button) {
  button.textContent = visible ? 'ON' : 'OFF';
  button.classList.toggle('active', visible);
  
  const visible = !layer.getVisible();
  layer.setVisible(visible);

  map.render();
}

function moveLayer(layer, direction) {
  const layers = map.getLayers().getArray();
  const currentZIndex = layer.getZIndex();
  
  if (direction === 'up' && currentZIndex < 3) {
    const targetLayer = layers.find(l => l.getZIndex() === currentZIndex + 1);
    if (targetLayer) {
      targetLayer.setZIndex(currentZIndex);
      layer.setZIndex(currentZIndex + 1);
    }
  } else if (direction === 'down' && currentZIndex > 1) {
    const targetLayer = layers.find(l => l.getZIndex() === currentZIndex - 1);
    if (targetLayer) {
      targetLayer.setZIndex(currentZIndex);
      layer.setZIndex(currentZIndex - 1);
    }
  }
  map.render();
}

function deleteLayer(layer, itemId) {
  map.removeLayer(layer);
  document.getElementById(itemId).remove();
}

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

function getWMSFeatureInfo(evt) {
  const viewResolution = map.getView().getResolution();
  const url = wmsLayer.getSource().getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:3857',
    {
      'INFO_FORMAT': 'application/json',
      'FEATURE_COUNT': 1
    }
  );

  if (url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayFeatureInfo(data.features[0], evt.coordinate);
      })
      .catch(() => {
        displayFeatureInfo(null, evt.coordinate);
      });
  }
}

function getVectorFeatureInfo(evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    return feature;
  });

  if (feature) {
    displayFeatureInfo(feature, evt.coordinate);
  }
}

function displayFeatureInfo(feature, coordinate) {
  const infoContent = document.getElementById('info-content');
  const hdms = toStringHDMS(transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
  
  let content = `<p>클릭 좌표: ${hdms}</p>`;

  if (feature) {
    if (feature.getProperties) {  // Vector Feature
      const properties = feature.getProperties();
      content += '<h4>벡터 레이어 정보:</h4>';
      Object.entries(properties).forEach(([key, value]) => {
        if (key !== 'geometry') {
          content += `<p>${key}: ${value}</p>`;
        }
      });
    } else {  // WMS Feature
      content += '<h4>WMS 레이어 정보:</h4>';
      Object.entries(feature.properties).forEach(([key, value]) => {
        content += `<p>${key}: ${value}</p>`;
      });
    }
  }

  infoContent.innerHTML = content;
}

map.on('singleclick', function(evt) {
  const infoContent = document.getElementById('info-content');
  infoContent.innerHTML = '정보를 불러오는 중...';

  if (wmsLayer.getVisible()) {
    getWMSFeatureInfo(evt);
  }
  
  if (vectorLayer.getVisible()) {
    getVectorFeatureInfo(evt);
  }
});

map.on('pointermove', function(evt) {
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

const markerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <path fill="#e53935" d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
`;

const markerStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    src: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
    scale: 0.8
  })
});

const markerSource = new VectorSource();
const markerLayer = new VectorLayer({
  source: markerSource,
  style: markerStyle
});

map.addLayer(markerLayer);

function addMarker(coordinates) {
  markerSource.clear();
  const marker = new Feature({
    geometry: new Point(fromLonLat(coordinates))
  });
  markerSource.addFeature(marker);
}

document.querySelectorAll('.place-item').forEach(item => {
  item.addEventListener('click', () => {
    const placeId = parseInt(item.dataset.id);
    const place = places.find(p => p.id === placeId);
    
    if (place) {
      document.querySelectorAll('.place-item').forEach(el => 
        el.classList.remove('selected')
      );
      
      item.classList.add('selected');

      map.getView().animate({
        center: fromLonLat(place.coordinates),
        zoom: 16,
        duration: 1000
      });
      
      addMarker(place.coordinates);
    }
  });
});

