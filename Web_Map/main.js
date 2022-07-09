window.onload = init;
function init(){
  proj4.defs("EPSG:32640","+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs");
  ol.proj.proj4.register(proj4); 
  // const proj_UTM40N = ol.proj.get('EPSG:32640');
  // proj_UTM40N.setWorldExtent([54.0, 0.0, 60.0, 84.0]);
  // proj_UTM40N.setExtent([166021.44, 0.00, 800000, 9329005.18]);
  // Controls
  const zoomToExtentControl = new ol.control.ZoomToExtent();
  /*const zoomLevelElement = document.getElementById('zoom-level');
  const zoomValueControl = new ol.control.Control({
    element: zoomLevelElement,
    className: 'zoom-level',
    render: function(e) {
      var zoomLevel = map.getView().getZoom().toFixed(2);
      document.getElementById('ZoomElement').innerHTML = zoomLevel;
    }
  });*/
  const attributionControl = new ol.control.Attribution({
    collapsible: true
  });

  const mousePositionControl_3857 = new ol.control.MousePosition({
    //coordinateFormat: ol.coordinate.createStringXY(0),
    coordinateFormat: function(coord) {
      return ol.coordinate.format(coord, 'X: {x} m, Y: {y} m', 0);
    },
    className: 'ol-mouse-position' //default
  });
  const mousePositionControl_4326 = new ol.control.MousePosition({
    coordinateFormat: function(coord) {
      return ol.coordinate.toStringHDMS(coord, 1);
    },
    projection: 'EPSG:4326',
    className: 'ol-custom-mouse-positionHDMS',
    //target: document.getElementById('mouse-position'),
    //undefinedHTML: '&nbsp;'
  });
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();
  const fullScreenControl = new ol.control.FullScreen();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsible: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()      
      })
    ],
    view: new ol.View({
      zoom: 8,
      minZoom: 8,
      rotation: 0.5,
      // projection:'EPSG:32640',
      // projection:'EPSG:4326'
    })
  });

  // Parameters
  extentMap = [3081957,-2562334,3559156,-2245167];

  // Map object
  const map = new ol.Map({
    view: new ol.View({
      extent: extentMap,
      //extent: ol.proj.transformExtent([55.408203953679255, 57.99200420598309, 56.29979683132314, 57.99200420598309], 'EPSG:4326', 'EPSG:32640')
      //center: ol.proj.fromLonLat([55.765946,58.080916]),
      center: [3272018, -2436727],
      zoom: 8,
      maxZoom: 17,
      minZoom: 5,
      rotation: 0.2,
      //projection: 'EPSG:4326',
      // projection:'EPSG:32640'
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'js-map',
    keyboardEventTarget: document,
    controls: ol.control.defaults({attribution: false}).extend([
      attributionControl,
      mousePositionControl_3857,
      mousePositionControl_4326,
      scaleLineControl,
      zoomToExtentControl,
      zoomSliderControl,
      fullScreenControl,
      overViewMapControl
    ])
  })
  //console.log(map.get('target'));
  //console.log(map.getKeys());

  // *********************************************
  // Overlay (demo)
  // *********************************************
 
 
  // const popupContainerElement = document.getElementById('popup-coordinates');
  // const popup = new ol.Overlay({
  //   element: popupContainerElement,
  //   className: 'popup-coordinates',
  //   //autoPan: true,
  //   positioning: 'top-right'
  // })
  //map.addOverlay(popup);

  function showZoom(e){
    return map.getView().getZoom().toFixed(1);
  }
  function showGeogrCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    //console.log(clickedCoordinate);
    const lonlatCoordinate = ol.proj.toLonLat(clickedCoordinate);
    const outCoordinate = ol.coordinate.toStringHDMS(lonlatCoordinate, 1);
    const pos = outCoordinate.indexOf("N") + 1;
    const latStr = outCoordinate.slice(0, pos);
    const lonStr = outCoordinate.slice(pos);
    const currentZoom = showZoom(e);
    //const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'Lat: ' + latStr + '<br>' + 'Lon: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }

  function showProjCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //console.log(outCoordinate);
    //const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //popupContainerElement.innerHTML = outCoordinate;
    const pos = outCoordinate.indexOf(",") + 1;
    const latStr = outCoordinate.slice(0, pos - 1);
    const lonStr = outCoordinate.slice(pos);
    
    //const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'X: ' + latStr + '<br>' + 'Y: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }

  map.on('click', function(e){
    document.addEventListener('keydown', function(event){
      var keyOn = event.key;
      console.log(keyOn);
      switch(keyOn) {
        case 'Control':
          //console.log(keyOn);
          showGeogrCoordinates(e);
          break;
        case 'Shift':
          //console.log(keyOn);
          showProjCoordinates(e);
          break;
        default:
          map.removeOverlay(popup);
          return;
      }
    })
    map.removeOverlay(popup);
    //document.removeEventListener('keydown', function);
    // Здесь нужно _**загасить**_ состояние 'click'..., для обеспечения правильной логики
  })
  
  // *********************************************
  // Interactions
  // *********************************************

  // DragPan interaction
  const dragPanInteraction = new ol.interaction.DragPan;
  map.addInteraction(dragPanInteraction);
  // DragRotate interaction
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })
  map.addInteraction(dragRotateInteraction);

  // *********************************************
  // Base Layers
  // *********************************************
// Openstreet Map Standard (it was initial for 'map')
const osmStandard = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  title: 'OSMStand'        
})
//map.addLayer(osmStandard);

// Openstreet Map Humanitarian
const osmHumanitarian = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  }),
  visible: false,
  title: 'OSMHuman'
})
//map.addLayer(osmHumanitarian);

// Bing Maps Aerial (Satellite)
const bingMapsAerial = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: "Al3HzWPy0v1f81GdgIdZzN4ubQBDKkvOFuQ-M6svftP3bhZ8-bBAZWJ_aWqimTPw",
    imagerySet: 'Aerial' // Aerial, AerialWithLabels, Road, CanvasDark, CanvasGrey
  }),
  visible: false,
  title: 'BingMapsSAT'
})
//map.addLayer(bingMapsAerial);

// Bing Maps Aerial (with labels)
const bingMapsAerialLabels = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: "Al3HzWPy0v1f81GdgIdZzN4ubQBDKkvOFuQ-M6svftP3bhZ8-bBAZWJ_aWqimTPw",
    imagerySet: 'AerialWithLabels'
  }),
  visible: false,
  title: 'BingMapsSATLabels'
})
//map.addLayer(bingMapsAerialLabels);

// Bing Maps Road
const bingMapsRoad = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: "Al3HzWPy0v1f81GdgIdZzN4ubQBDKkvOFuQ-M6svftP3bhZ8-bBAZWJ_aWqimTPw",
    imagerySet: 'Road'
  }),
  visible: false,
  title: 'BingMapsRoad'
})
//map.addLayer(bingMapsRoad);

// Yandex Coordinates projection
var yaExtent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
ol.proj.proj4.register(proj4);
ol.proj.get('EPSG:3395').setExtent(yaExtent);

// Yandex Maps Standard Layer
const yandexMapsStandard = new ol.layer.Tile({
  source: new ol.source.XYZ({
    //url: 'http://vec0{1-4}.maps.yandex.net/tiles?l=map&lang=ru_RU&l=s&x={x}&y={y}&z={z}',
    url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&lang=ru_RU&v=2.26.0&x={x}&y={y}&z={z}',
    type: 'base',
    attributions: '© Yandex',
    projection: 'EPSG:3395',
    tileGrid: ol.tilegrid.createXYZ({
      extent: yaExtent
    }),
  }),
  visible: false,
  title: 'YandexStand'
})
//map.addLayer(yandexMapsStandard);

// Yandex Maps Satellite Layer
const yandexSAT = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
    attributions: '© Yandex',
    projection: 'EPSG:3395',
    tileGrid: ol.tilegrid.createXYZ({
      extent: yaExtent
    }),
  }),
  visible: false,
  title: 'YandexSAT'
})
//map.addLayer(yandexSAT);

// Stamen Terrain Layer
const stamenTerrain = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'terrain',
    attributions: '@ Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: 'StamenTerrain'
})
//map.addLayer(stamenTerrain);

// Stamen Watercolor Layer
const stamenWatercolor = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'watercolor',
    attributions: '@ Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: 'StamenWatercolor'
})
//map.addLayer(stamenWatercolor);

// Stamen Toner Layer
const stamenToner = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attributions: '@ Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: 'StamenToner'
})
//map.addLayer(stamenToner);


  // Local BaseMap Layer (GeoServer WMS Layer on 'top')
  const localWMSLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:"http://ssc.psu.ru:8080/geoserver/st2021/wms",
      //url:"http://ssc.psu.ru:8080/geoserver/common/wms",
      params:{
        LAYERS: 'st2021:grp5_just_OSM',
        FORMAT: 'image/png',
        TRANSPARENT: false
      },
      attributions: '<a href=http://ssc.psu.ru:8080/geoserver/common/>© Perm State University<a/>'
    }),
    visible: false,
    title: 'LocalWMS'
  })
  //map.addLayer(localWMSLayer);

  // Openstreet Map Vector Tile Layer
  const osmVectorTileLayer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      url: 'https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=FfQLTxHMU4i8EsRYDFPd',
      format: new ol.format.MVT(),
      projection: 'EPSG:32640',
      attributions: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }),
    visible: false,
    maxZoom: 15, //optional (limited by the data provider)
    title: 'OSMVectorTile', 
  
  })
  //const osmVectorTileStyle = 'https://api.maptiler.com/maps/6513dbde-7cfa-472d-b225-669a201c4a11/style.json?key=FfQLTxHMU4i8EsRYDFPd';
  //olms.applyStyle(osmVectorTileLayer, osmVectorTileStyle);
  const osmVectorTileStyles = 'https://api.maptiler.com/maps/6513dbde-7cfa-472d-b225-669a201c4a11/style.json?key=FfQLTxHMU4i8EsRYDFPd';
  fetch(osmVectorTileStyles).then(function(response) {
    response.json().then(function(glStyle) {
      console.log(glStyle);
      olms.applyStyle(osmVectorTileLayer, glStyle, 'c8d958ad-ff6d-4678-9730-893520ecf11a');
    });
  });

  // BaseMaps Layer Group
  const baseMapsLayerGroup = new ol.layer.Group({
    layers: [
      osmStandard, osmHumanitarian, bingMapsAerial, bingMapsAerialLabels, bingMapsRoad, 
      yandexMapsStandard, yandexSAT, stamenTerrain, stamenWatercolor, stamenToner, localWMSLayer, osmVectorTileLayer
    ]
  })
  map.addLayer(baseMapsLayerGroup);

  // Layer Switcher Logic for Basemaps Layers
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  // Initialize radio buttons (set the first one to checked)
  baseLayerElements[0].checked = true;
  // Switching
  for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change', function(){
      let baseLayerElementValue = this.value;
      baseMapsLayerGroup.getLayers().forEach(function(element, index, array){
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }

  // *********************************************
  // Thematic Layers
  // *********************************************
  // STYLES
  // SUBCATCHMENT STYLE
  var getStyle = function (feature, resolution) {
    if (feature.get('SubCatchme') =='Lower Mzingwane') {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 0, 0, 0.5] // semi-transparent red
            })
        });
    }

    if (feature.get('SubCatchme') =='Shashe') {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [124, 252, 0, 0.5] // semi-transparent red
            })
        });
    }
    if (feature.get('SubCatchme') =='Mwenezi') {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [75, 0, 130, 0.5] // semi-transparent red
            })
        });
    }
      
    // else if ...
    else {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 0, 255, 0.5] // semi-transparent yellow
            })
        });
    }
};
var getStyle2 = function (feature, resolution) {
  if (feature.get('MEAN_1')>=8) {
      return new ol.style.Style({
          fill: new ol.style.Fill({
              color: [255, 0, 0,0.4], // semi-transparent red
          }),
          stroke: new ol.style.Stroke({
            color:'Black'
          }),          
      });
  }

  if (feature.get('MEAN_1')<=3)  {
      return new ol.style.Style({
          fill: new ol.style.Fill({
              color: [0, 255, 0,0.4] // semi-transparent red
          }),
          stroke: new ol.style.Stroke({
            color:'Black'
          }),             
      });
  }
  // else if ...
  else {
      return new ol.style.Style({
          fill: new ol.style.Fill({
              color: [255, 255, 0,0.4] // semi-transparent yellow
          }),
          stroke: new ol.style.Stroke({
            color:'Black'
          }),
      });
  }
};

  const fillStyle = new ol.style.Fill({
    color: [9, 122, 41, 1]
  })
    // Style for lines
  const strokeStyle = new ol.style.Stroke({
    color: [255, 0, 0, 1],
    width: 1.2,
    lineCap: 'square',
    lineJoin: 'bevel',
    lineDash: [0, 0]
  }) 

    // Icon Marker Style

  const regularShape = new ol.style.Circle({
    fill: new ol.style.Fill({
      color: [255, 98, 240, 1]
    }),
    stroke: strokeStyle,
    points: 3,
    radius1: 10,
    radius2: 4,
    rotation: 0.5,
    angle: 0,
    scale: 0.5
  })  ;
  const sportMarkerStyle = new ol.style.Icon({
    src: './data/icons/sports.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 1,
    scale: 0.7,
    color: [255, 20, 147, 1]
    
  });
  // Icon Marker Style
  const tourismMarkerStyle = new ol.style.Icon({
    src: './data/icons/tourist.png',
    size: [100, 100],
    offset: [0, 0],
    opacity: 1,
    scale: 0.35,
    //color: [250, 98, 240, 1]
    
  })

  // Roads Layer
  const roadsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/roads.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0,1)',
        width: 2,
        })
    }),
      visible: false,
    title: 'Roads',
  })

  // Umzingwane Catchment Area Layer
  const umzingwaneGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/Umzingwane.geojson',
      format: new ol.format.GeoJSON(),
      projection:'EPSG:32735'
    }),
    visible: false,
    title: 'catchment',
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
      }),
      stroke: new ol.style.Stroke({
        color:'black',
        width: 3
      })
    })
  })

  // Points of Interest Layer

  const subcatchmentGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/subcatchment.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'subcatchment',
    // style: new ol.style.Style({
    //   fill: fillStyle
    // })
    style: function (feature, resolution) {
      return getStyle(feature, resolution);
    }
  });

  const wardsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/wards.geojson',
      format: new ol.format.GeoJSON(),
      projection:'EPSG:32735'
    }),
    visible: false,
    title: 'wards',
    // style: new ol.style.Style({
    //   fill: fillStyle
    // })
    style: function (feature, resolution) {
      return getStyle2(feature, resolution);
    }
  })
  const shopsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/Shops.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      image:new ol.style.Circle({
        fill: new ol.style.Fill({
          color: [199, 21, 133, 1]
        }),
        radius: 2.5,
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 1],
          width: 1
        }) 
      })   
    }),
    visible: false,
    title: 'shops'
  })

  // TileDebug Layer
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    opacity: 0.3,
    visible: false,
    title: 'TileDebugLayer'
  })

  //Graticule Layer
  const coordinateGrid = new ol.layer.Graticule({
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(255,120,0,0.9)',
      //color: 'rgba(0,0,240,0.5)',
      width: 2,
      lineDash: [0.1, 4],
    }),
    showLabels: true,
    targetSize: 120, //default 100
    wrapX: false,
    visible: false,
    title: 'Graticule'
  })

  // Static Image Layer (Perm Airport)
  const imageFragmentStatic1 = new ol.layer.Image ({
    source: new ol.source.ImageStatic ({
      url: './data/rasters/Airport.png',
      imageExtent: [6233894, 7949483, 6236671, 7951586],
      attributions: '© Yandex'
    }),
    visible: false,
    title: 'ImageStatic-1'
  })

  // Static Image Layer (observing location Perm-01)
  const imageFragmentStatic2 = new ol.layer.Image ({
    source: new ol.source.ImageStatic ({
      url: './data/rasters/soil_risk.tif',
      imageExtent: [3081957,-2562334,3559156,-2245167],
      attributions: '© Kartolabs'
    }),
    visible: false,
    title: 'hotspots'
  })

  // Thematic Layers Group
  const layerGroup = new ol.layer.Group({
    layers: [
      roadsGeoJSON, umzingwaneGeoJSON, wardsGeoJSON,subcatchmentGeoJSON,shopsGeoJSON, 
      tileDebugLayer, coordinateGrid, imageFragmentStatic1, imageFragmentStatic2
    ]
  })
  map.addLayer(layerGroup);

  // Layer Switcher Logic for Thematic Layers
  const layerElements = document.querySelectorAll('.sidebar > input[type=checkbox]')
  // Initialize checkboxes (set to unchecked)
  for (var layerElement of layerElements) {
    layerElement.checked = false;
  }
  // Switching
  for(let layerElement of layerElements){
    layerElement.addEventListener('change', function(){
      let layerElementValue = this.value;
      let aLayer;

      layerGroup.getLayers().forEach(function(element, index, array){
        if(layerElementValue === element.get('title')){
          aLayer = element;
        }
      })
      this.checked ? aLayer.setVisible(true) : aLayer.setVisible(false)
    })
  }

  // *********************************************
  // Vector Feature Popup window
  // *********************************************

  // Vector Feature Popup Information
  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement,
  })

  function showGeogrCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    //console.log(clickedCoordinate);
    const lonlatCoordinate = ol.proj.transform(clickedCoordinate, 'EPSG:32640', 'EPSG:4326');
    const outCoordinate = ol.coordinate.toStringHDMS(lonlatCoordinate, 1);
    const pos = outCoordinate.indexOf("N") + 1;
    const latStr = outCoordinate.slice(0, pos);
    const lonStr = outCoordinate.slice(pos);
    const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'Lat: ' + latStr + '<br>' + 'Lon: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }

  function showProjCoordinates(e){
    const clickedCoordinate = e.coordinate;
    map.addOverlay(popup);
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //console.log(outCoordinate);
    //const outCoordinate = ol.coordinate.toStringXY(clickedCoordinate, 0);
    //popupContainerElement.innerHTML = outCoordinate;
    const pos = outCoordinate.indexOf(",") + 1;
    const latStr = outCoordinate.slice(0, pos - 1);
    const lonStr = outCoordinate.slice(pos);
    const currentZoom = map.getView().getZoom().toFixed(2);
    const htmlText = 'X: ' + latStr + '<br>' + 'Y: ' + lonStr + '<br> zoom: ' + currentZoom;
    popupContainerElement.innerHTML = htmlText;
  }
  map.on('click', function(e){
    document.addEventListener('keydown', function(event){
      var keyOn = event.key;
      console.log(keyOn);
      switch(keyOn) {
        case 'Control':
          //console.log(keyOn);
          showGeogrCoordinates(e);
          break;
        case 'Shift':
          //console.log(keyOn);
          showProjCoordinates(e);
          break;
        default:
          map.removeOverlay(popup);
          return;
      }
    })
    map.removeOverlay(popup);
  })
  // const overlayContainerElement = document.querySelector('.overlay-container');
  // const overlayLayer = new ol.Overlay({
  //   element: overlayContainerElement
  // })
  // map.addOverlay(overlayLayer);

  // const overlayName = document.getElementById('local-provinceName');
  // const overlaydistrictName = document.getElementById('local-districtName');
  // const overlaywardNumber = document.getElementById('local-minValue');
  // const overlaywardArea = document.getElementById('local-maxValue');
  // const overlayminValue = document.getElementById('local-meanValue');
  // const overlaymaxValue = document.getElementById('local-wardNumber');
  // const overlaymeanValue = document.getElementById('local-wardArea');

  
  //map.on('click', function(e){
  // map.on('pointermove', function(e){
  //   overlayLayer.setPosition(undefined);
  //   map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
  //     let clickedCoordinate = e.coordinate;
    //   let provinceName = feature.get('PROVINCE');
    //   let districtName= feature.get('DISTRICT');
    //   let minValue = feature.get('MIN_1');
    //   let maxValue= feature.get('MAX_1');
    //   let meanValue = feature.get('MEAN_1');
    //   let wardNumber= feature.get('WARDNUMBER');
    //   let wardArea = feature.get('Area');
    
    //  if(clickedLocalForestryName && clickedLocalForestryArea != undefined){
    //     overlayLayer.setPosition(clickedCoordinate);
    //     overlayprovinceName.innerHTML = 'PROVINCE: ' + PROVINCE;
    //     overlaydistrictName.innerHTML = 'DISTRICT: ' + DISTRICT;
    //     overlaywardNumber.innerHTML = 'WARD: ' + WARDNUMBER;
    //     overlaywardArea.innerHTML = 'WARD AREA: ' + Area;
    //     overlayminValue.innerHTML = 'MIN SOILLOSS: ' + MIN_1 +'t/ha/yr';
    //     overlaymaxValue.innerHTML = 'MAX SOILLOSS: ' + MAX_1 +'t/ha/yr';
    //     overlaymeanValue.innerHTML = 'MEAN SOILLOSS: ' + MEAN_1 +'t/ha/yr';
    
    // },
    // {
    //   layerFilter: function(layerCandidate){
    //     return layerCandidate.get('title') === 'wards'
    //   }
  //   })
  // })
    const clickElementsubcatch = document.querySelector('.overlay-container-subcatchment');
    const clickoverlaysubcatch = new ol.Overlay({
      element: clickElementsubcatch
      })
      map.addOverlay(clickoverlaysubcatch);
  
    const overlaysubcatchName = document.getElementById('subcatchment-name-info');
    const overlaysubcatchArea = document.getElementById('subcatchment-area');
  
    map.on('click', function(e){
      clickoverlaysubcatch.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
          let clickedCoordinate = e.coordinate;
          let clickedsubcatchName = feature.get('SubCatchme')
          let clickedsubcatchArea = feature.get('Area')     
          clickoverlaysubcatch.setPosition(clickedCoordinate);
          overlaysubcatchName.innerHTML = 'Name: ' + clickedsubcatchName +' SubCatchment';
          overlaysubcatchArea.innerHTML = 'Area: ' + clickedsubcatchArea +'km²';
        },
        {
          layerFilter: function(layerCandidate){
            return layerCandidate.get('title') === 'subcatchment';
          }
        })
      })

    const clickElementcatchment = document.querySelector('.overlay-container-catchment');
    const clickoverlaycatchment = new ol.Overlay({
      element: clickElementcatchment
      })
      map.addOverlay(clickoverlaycatchment);
  
    const overlaycatchmentName = document.getElementById('catchment-name-info');
    const overlaycatchmentArea = document.getElementById('catchment-area');
  
    map.on('click', function(e){
      clickoverlaycatchment.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
          let clickedCoordinate = e.coordinate;
          let clickedcatchmentName = feature.get('Name')
          let clickedcatchmentArea = feature.get('Area')     
          clickoverlaycatchment.setPosition(clickedCoordinate);
          overlaycatchmentName.innerHTML = 'Name: ' + clickedcatchmentName;
          overlaycatchmentArea.innerHTML = 'Area: ' + clickedcatchmentArea +'km²';
        },
        {
          layerFilter: function(layerCandidate){
            return layerCandidate.get('title') === 'catchment';
          }
        })
      })

const clickElementwards = document.querySelector('.overlay-container-wards');
    const clickoverlaywards = new ol.Overlay({
      element: clickElementwards
      })
      map.addOverlay(clickoverlaywards);
  
    const overlaywardProvince = document.getElementById('province-name-info');
    const overlaywardDistrict = document.getElementById('ward-district-info');
    const overlayWardNumber = document.getElementById('local-wardNumber');
    overlaywardArea = document.getElementById('local-ward-area');
    const overlaymeanValue = document.getElementById('local-Mean-Value');
  
    map.on('click', function(e){
      clickoverlaywards.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
          let clickedCoordinate = e.coordinate;
          let clickedwardProvince = feature.get('PROVINCE')
          let clickedwardDistrict = feature.get('DISTRICT')
          let clickedmeanValue = feature.get('MEAN_1');   
          let clickedwardNumber = feature.get('WARDNUMBER'); 
          let clickedWardArea = feature.get('Area');   
          clickoverlaywards.setPosition(clickedCoordinate);
          overlaywardProvince.innerHTML = 'PROVINCE: ' + clickedwardProvince;
          overlaywardDistrict.innerHTML = 'DISTRICT: ' + clickedwardDistrict;
          overlaymeanValue.innerHTML = 'MEAN SOILLOSS: ' + clickedmeanValue.toFixed(2) +'t/ha/yr';
          overlayWardNumber.innerHTML = 'WARD: ' + clickedwardNumber;
          overlaywardArea.innerHTML = 'WARD AREA: ' + clickedWardArea.toFixed(2)+'km²'; 

        },
        {
          layerFilter: function(layerCandidate){
            return layerCandidate.get('title') === 'wards';
          }
        })
      })            
  const clickElementShops = document.querySelector('.overlay-container-Shops');
  const clickoverlayShops = new ol.Overlay({
    element: clickElementShops
    })
    map.addOverlay(clickoverlayShops);

  const overlayshopName = document.getElementById('shop-name-info');
  const overlayShopType = document.getElementById('shop-type-info');

  map.on('click', function(e){
    clickoverlayShops.setPosition(undefined);
      map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
        let clickedCoordinate = e.coordinate;
        let cllickedShopName = feature.get('name')
        let cllickedShopType = feature.get('shop')     
        clickoverlayShops.setPosition(clickedCoordinate);
          overlayshopName.innerHTML = 'Наз.магазина: ' + cllickedShopName;
          overlayShopType.innerHTML = 'Тип.магазина: ' + cllickedShopType;
      },
      {
        layerFilter: function(layerCandidate){
          return layerCandidate.get('title') === 'shops';
        }
      })
    })

    const clickElementSport = document.querySelector('.overlay-container-sport');
    const clickoverlaySport = new ol.Overlay({
    element: clickElementSport
    })
    map.addOverlay(clickoverlaySport);
    const overlaysport = document.getElementById('sport-facility-info');
    map.on('click', function(e){
      clickoverlaySport.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
          let clickedCoordinate = e.coordinate;
          let clickedSport = feature.get('PROVINCE')    
          if(clickedSport != undefined){
            clickoverlaySport.setPosition(clickedCoordinate);
            overlaysport.innerHTML = clickedSport;
         }
        },
        {
          layerFilter: function(layerCandidate){
            return layerCandidate.get('title') === 'wards';
          }
        })
      });
  
    const selectInteractionV2 = new ol.interaction.Select();
    map.addInteraction(selectInteractionV2);
    selectInteractionV2.on('select', function(e){ 
      let selectedFeature = e.selected;   
      if(selectedFeature.length > 0 && selectedFeature[0].getGeometry().getType() === 'MultiPoint'){
        selectedFeature[0].setStyle(
          new ol.style.Style({
            image: new ol.style.Circle({
              fill: new ol.style.Fill({
                color: [255, 0, 0, 1]
              }),
              radius: 10,
              stroke: new ol.style.Stroke({
                color: [0, 0, 0, 1],
                width: 1
              })
            })
          })
        )
      };
      if(selectedFeature.lengt2h > 0 && selectedFeature[0].getGeometry().getType() === 'Polygon'){
        selectedFeature[0].setStyle(
          new ol.style.Style({
              fill: new ol.style.Fill({
                color: [255, 69, 0, 1]
              }),
              radius: 12,
              stroke: new ol.style.Stroke({
                color: [255, 69, 0, 1],
                width: 3
              })
          })
        )
      };
      if(selectedFeature.length > 0 && selectedFeature[0].getGeometry().getType() === 'MultiLineString'){
        selectedFeature[0].setStyle(
          new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: [255, 0, 255, 1],
                width: 3
              })
          })
        )
      };
    }) 

  // *********************************************
  // Additions
  // *********************************************

  // Real extent limits (for vector data, QGIS) Layer
  const extentLimitsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/vectors/real_extent.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(7, 252, 97, 0.8)',
        width: 5, 
        lineDash: [4, 1, 1, 2],
      })
    }),
    visible: true
  })
  map.addLayer(extentLimitsGeoJSON);
}