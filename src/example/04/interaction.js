import 'ol/ol.css';
import './style.css';

import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { Polygon } from 'ol/geom';

// 벡터 소스 생성
const source = new VectorSource();

// 스타일 정의
const styles = {
  draw: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ff4081',
      width: 2
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: '#ff4081'
      }),
      fill: new Fill({
        color: '#ff4081'
      })
    })
  }),
  measure: feature => {
    const geometry = feature.getGeometry();
    let measurement;
    let label;

    if (geometry.getType() === 'Polygon') {
      measurement = getArea(geometry);
      label = measurement > 10000 
        ? `${Math.round(measurement / 1000000 * 100) / 100} km²`
        : `${Math.round(measurement * 100) / 100} m²`;
    } else {
      measurement = getLength(geometry);
      label = measurement > 1000 
        ? `${Math.round(measurement / 1000 * 100) / 100} km`
        : `${Math.round(measurement * 100) / 100} m`;
    }

    return new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ff4081',
        width: 2
      }),
      text: new Text({
        font: '14px Roboto',
        fill: new Fill({
          color: '#000000'
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 3
        }),
        text: label,
        textAlign: 'center',
        textBaseline: 'bottom',
        offsetY: -5
      })
    });
  }
};

// 벡터 레이어 생성
const vector = new VectorLayer({
  source: source,
  style: feature => styles.measure(feature)
});

// HTML 구조 생성
document.getElementById('app').innerHTML = `
  <div class="main-container">
    <div class="sidebar">
      <h3>측정 도구</h3>
      <div class="tool-container">
        <button id="line" class="active">거리 측정</button>
        <button id="polygon">면적 측정</button>
        <button id="clear">초기화</button>
        <div id="measurement" class="measurement">측정값: </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
`;

// 지도 생성
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vector
  ],
  view: new View({
    center: fromLonLat([126.9779, 37.5665]),
    zoom: 12
  })
});

// 현재 활성화된 상호작용들을 저장
let draw;
let modify;
let snap;
let listener;
let currentType = 'LineString';

// 모든 상호작용 제거 함수
function clearInteractions() {
  if (draw) {
    map.removeInteraction(draw);
    draw = null;
  }
  if (modify) {
    map.removeInteraction(modify);
    modify = null;
  }
  if (snap) {
    map.removeInteraction(snap);
    snap = null;
  }
  if (listener) {
    unByKey(listener);
    listener = null;
  }
}

// 초기화 함수
function clearAll() {
  clearInteractions();
  source.clear();
  document.getElementById('measurement').innerHTML = '측정값: ';
  addInteraction();
}

function addInteraction() {
  clearInteractions();

  modify = new Modify({ source: source });
  map.addInteraction(modify);

  draw = new Draw({
    source: source,
    type: currentType,
    style: styles.draw
  });
  map.addInteraction(draw);

  snap = new Snap({ source: source });
  map.addInteraction(snap);

  draw.on('drawstart', evt => {
    if (listener) {
      unByKey(listener);
    }

    listener = evt.feature.getGeometry().on('change', e => {
      const geom = e.target;
      let measurement;
      
      if (geom instanceof Polygon) {
        measurement = getArea(geom);
        measurement = measurement > 10000 
          ? `${Math.round(measurement / 1000000 * 100) / 100} km²`
          : `${Math.round(measurement * 100) / 100} m²`;
      } else {
        measurement = getLength(geom);
        measurement = measurement > 1000 
          ? `${Math.round(measurement / 1000 * 100) / 100} km`
          : `${Math.round(measurement * 100) / 100} m`;
      }
      
      document.getElementById('measurement').innerHTML = `측정값: ${measurement}`;
    });
  });

  draw.on('drawend', () => {
    if (listener) {
      unByKey(listener);
    }
  });
}

document.getElementById('line').addEventListener('click', () => {
  currentType = 'LineString';
  addInteraction();
  document.getElementById('line').classList.add('active');
  document.getElementById('polygon').classList.remove('active');
});

document.getElementById('polygon').addEventListener('click', () => {
  currentType = 'Polygon';
  addInteraction();
  document.getElementById('polygon').classList.add('active');
  document.getElementById('line').classList.remove('active');
});

document.getElementById('clear').addEventListener('click', clearAll);

// 초기 상호작용 추가
addInteraction();