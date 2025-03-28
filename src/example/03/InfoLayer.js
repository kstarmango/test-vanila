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
    }),
    markerLayer
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



const layerSetup = [
  { id: 'osm', layer: osmLayer, itemId: 'osm-item' },
  { id: 'wms', layer: wmsLayer, itemId: 'wms-item' },
  { id: 'vector', layer: vectorLayer, itemId: 'vector-item' }
];

osmLayer.setZIndex(1);
wmsLayer.setZIndex(2);
vectorLayer.setZIndex(3);

const markerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <path fill="#e53935" d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
`;

const markerSource = new VectorSource();
const markerLayer = new VectorLayer({
  source: markerSource,
  style: markerStyle
});

map.addLayer(markerLayer);
