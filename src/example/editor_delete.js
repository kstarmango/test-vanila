// OprenLayers 기본 스타일
import 'ol/ol.css';

// jQuery
import $ from "jquery";

import { Map, View, Collection } from 'ol';
import { Attribution, Zoom } from 'ol/control';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, Vector, TileWMS } from 'ol/source';
import { DragPan, MouseWheelZoom, Draw, Modify, Snap, Select } from 'ol/interaction';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import { GeoJSON, GML, WFS } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';
import { singleClick, altKeyOnly } from 'ol/events/condition.js';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4'
proj4.defs([
	[
		'EPSG:4326',
		'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
	],
	[
		'EPSG:3857',
		'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
	],
	[
		'EPSG:5173',
		'+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5174',
		'+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5175',
		'+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5176',
		'+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5177',
		'+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5178',
		'+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs'
	],
	[
		'EPSG:5179',
		'+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5180',
		'+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5181',
		'+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5182',
		'+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5183',
		'+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5184',
		'+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5185',
		'+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5186',
		'+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5187',
		'+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	],
	[
		'EPSG:5188',
		'+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
	]
]);

register(proj4);


// Map Object
const map = new Map({
  target: 'map',
  view: new View({
    center: [14139375.266574217, 4507391.386530381],
    zoom: 14,
    minZoom: 1,
    maxZoom: 18
  }),
  controls: [new Zoom()],
  interactions: [
    new DragPan(),
    new MouseWheelZoom()
  ],
  layers: [
    // new ol.layer.Tile({
    // 	source : new ol.source.OSM()
    // })
    new TileLayer({
      source: new OSM()
    })
  ]
});

// Draw Feature Vector Layer
let features = new Collection();
let featureOverlay = new VectorLayer({
  source: new Vector({ features: features }),
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new Stroke({
      color: 'rgba(55, 155, 55, 0.8)',
      width: 5
    }),
    image: new Circle({
      radius: 10,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  })
});
map.addLayer(featureOverlay);

// Building WMS Layer
let WMSSource = new TileWMS({
  url: 'http://127.0.0.1/geoserver/ows',
  params: {
    VERSION: '1.3.0',
    LAYERS: 'admin_sgg',
    WIDTH: 256,
    HEIGHT: 256,
    CRS: 'EPSG:3857',
    TILED: true
  }
});
let WMSLayer = new TileLayer({
  source: WMSSource,
  opacity: .5
});
map.addLayer(WMSLayer);

// Building Vector
let vectorSource = new Vector({
  format: new GeoJSON(),
  url: extent => {
    return 'http://127.0.0.1/geoserver/ows?' +
      'service=WFS' +
      '&version=1.1.0' +
      '&request=GetFeature' +
      '&typeName=admin_sgg' +
      '&srsName=EPSG:3857' +
      '&outputFormat=application/json' +
      '&bbox=' + extent.join(',') + ',EPSG:3857';
  },
  strategy: bboxStrategy
})
let vectorLayer = new VectorLayer({
  source: vectorSource,
  visible: true
});
map.addLayer(vectorLayer);

// Select Interaction 추가
let select = new Select({
  wrapX: false,
  type: 'MultiPolygon',
  condition: singleClick
});
map.addInteraction(select);

// Resoultion Changed Event
map.getView().on('change:resolution', e => {
  if (map.getView().getZoom() > 12) {
    vectorLayer.setVisible(true);
  } else {
    vectorLayer.setVisible(false);
  }
});

// transaction WFS-T 문서 생성
const formatWFS = new WFS();
const formatGML = new GML({
  featureNS: 'http://osgeo.kr',
  featureType: 'admin_sgg',
  srsName: 'EPSG:5174'
});

const transactWFS = (tType, features) => {
  let node = "";
  switch (tType) {
    case 'insert':
      node = formatWFS.writeTransaction(features, null, null, formatGML);
      break;
    case 'update':
      node = formatWFS.writeTransaction(null, features, null, formatGML);
      break;
    case 'delete':
      node = formatWFS.writeTransaction(null, null, features, formatGML);
      break;
  }

  const dataStr = new XMLSerializer().serializeToString(node);
  $.ajax({
    type: 'POST',
    service: 'WFS',
    url: 'http://127.0.0.1/geoserver/ows',
    dataType: 'xml',
    contentType: 'text/xml',
    processData: false,
    data: dataStr
  }).done(() => {
    reset()
  });
};

const reset = () => {
  features.clear();
  vectorSource.clear();
  WMSSource.updateParams({ '_t': Date.now() });
};

$('button[name=btnReset]').on('click', reset);

$('button[name=btnDelete]').on('click', e => {
  if (select.getFeatures().getArray().length > 0) {
    transactWFS('delete', select.getFeatures().getArray());
    select.getFeatures().clear();
  }
});