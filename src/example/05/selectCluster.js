// import Map from 'ol/Map.js';
// import View from 'ol/View.js';
// import TileLayer from 'ol/layer/Tile.js';
// import OSM from 'ol/source/OSM.js';
// import 'ol/ol.css';
// import '../../style.css';
// import geojson from './geojson.js'


// document.querySelectorimport 
// ('#app').innerHTML = `
//   <div class="main-container">
//     <div id="map"></div>
//   </div>
// `

// // Addfeatures to the cluster
// function addFeatures(nb) {
//   var ext = map.getView().calculateExtent(map.getSize());
//   var features=[];
//   for (var i=0; i<nb; ++i) {
//     features[i] = new ol.Feature(new ol.geom.Point([ext[0]+(ext[2]-ext[0])*Math.random(), ext[1]+(ext[3]-ext[1])*Math.random()]));
//     features[i].set('id',i);
//     features[i].set('type', Math.floor(Math.random()*4))
//   }
//   clusterSource.getSource().clear();
//   clusterSource.getSource().addFeatures(features);
// }

// const map = new Map({
//   layers: [
//     new TileLayer({
//       source: new OSM(),
//     }),
//   ],
//   target: 'map',
//   view: new View({
//     center: [126.915278, 37.554944],
//     minZoom: 2,
//     maxZoom: 20,
//     zoom: 10,
//     projection: 'EPSG:4326',
//   }),
// });

// const clusterSource = new Cluster({
//   distance: parseInt('40', 10),
//   minDistance: parseInt('20', 10),
//   source: vectorSource,
// });

// const clusterLayer = new AnimatedCluster({
//   type: 'cluster',
//   title: LAYER_TITLE[3],
//   source: clusterSource,
//   animationDuration: 400,
//   style: (f) => clusterStyle(f, clusterSource.getFeatures().length),
// });

// function clusterStyle(feature, maxFeatureCount) {
//   const size = feature.get('features').length;
//   const style = new Style({
//     image: new CircleStyle({
//       radius: size === 1 ? 8 : size >= 50 ? 35 : size >= 40 ? 32 : size >= 30 ? 29 : size >= 20 ? 25 : size >= 10 ? 20 : 15,
//       stroke: new Stroke({
//         color: '#fff',
//       }),
//       fill: new Fill({
//         color: [40, 57, 52, Math.min(0.9, 0.4 + size / maxFeatureCount)],
//       }),
//     }),
//     text: new Text({
//       font: 'bold 12px roboto',
//       text: size !== 1 ? size.toString() : '',
//       fill: new Fill({
//         color: '#fff',
//       }),
//     }),
//   });
//   return style;
// }

// const selectCluster = new SelectCluster({
//   pointRadius: 20,
//   animate: true,
//   featureStyle: () => {
//     let fill = 'rgba(218, 243, 102,0.7)';
//     let stroke = 'rgba(12,12,12,1)';

//     const img = new CircleStyle({
//       radius: 10,
//       stroke: new Stroke({
//         color: stroke,
//         width: 2,
//       }),
//       fill: new Fill({
//         color: fill,
//       }),
//     });
//     const linkStyle = new Style({
//       image: img,
//       stroke: new Stroke({
//         color: '#fff',
//         width: 2
//       }),
//     });

//     return [linkStyle];
//   },
//   style: (f) => {
//     const cluster = f.get('features');
//     if (cluster && cluster.length > 1) {
//       return clusterStyle(f, clusterSource.getFeatures().length);
//     } else {
//       return [
//         selectPointStyle
//       ];
//     }
//   },
// });

// selectCluster.getFeatures().on(['add'], function (e) {
//   const features = e.element.get('features');
//   if (features && features.length == 1 && e.target.getArray().length > 0) {

//     const feature = features[0];
//     setAnalysisInfoPopup({
//       id: 'feature-info',
//       title: '생활서비스 시설',
//       data: {
//         data: feature.getProperties(),
//         psy_nm: lifeServiceFacility,
//         type: 'service'
//       }
//     });
//   }

// });

// selectCluster.getFeatures().on(['remove'], function () {
//     setAnalysisInfoPopup({
//       id: '',
//       title: '',
//       data: {}
//     });
// })

// map?.addLayer(clusterLayer);
// addFeatures(2000)
// map?.addInteraction(selectCluster);