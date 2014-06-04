var map, bairrosSearch = [], educacaoSearch = [], saudeSearch = [], aldeiaSearch = [], crasSearch = [], pracasSearch = [];

/*
$(document).ready(function() {
  getViewport();
});

function getViewport() {
  if (sidebar.isVisible()) {
    map.setActiveArea({
      position: "absolute",
      top: "0px",
      left: $(".leaflet-sidebar").css("width"),
      right: "0px",
      height: $("#map").css("height")
    });
  } else {
    map.setActiveArea({
      position: "absolute",
      top: "0px",
      left: "0px",
      right: "0px",
      height: $("#map").css("height")
    });
  }
}
*/
/*
function sidebarClick(lat, lng, id, layer) {
  if (document.body.clientWidth <= 767) {
    sidebar.hide();
    getViewport();
  }
  map.setView([lat, lng], 17);
  if (!map.hasLayer(layer)) {
    map.addLayer(layer);
  }
  map._layers[id].fire("click");
}
*/
/* Basemap Layers */
/*
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);
*/
var googleRoadMap = new L.Google('ROADMAP');
var googleSatellite = new L.Google('SATELLITE');
var googleHybrid = new L.Google('HYBRID');

var bairrosWMS = new L.TileLayer.WMS("http://geo.epdvr.com.br/geoserver/wms", {
            layers: 'gis:bairros',
            format: 'image/png',
            transparent: true
        });

var limiteWMS = new L.TileLayer.WMS("http://geo.epdvr.com.br/geoserver/wms", {
            layers: 'nebulosa:limitevr_oficial',
            format: 'image/png',
            transparent: true
        });

var lotesWMS = new L.TileLayer.WMS("http://geo.epdvr.com.br/geoserver/wms", {
            layers: 'nebulosa:lotesvr',
            format: 'image/png',
            transparent: true,
            crs: L.CRS.EPSG4326
        });


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* BAIRROS */

var bairros = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "blue",
      fill: false,
      weight: 1,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    bairrosSearch.push({
      name: layer.feature.properties.nome,
      source: "Bairros",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });

  }
});

$.getJSON("data/bairros1.geojson", function (data) {
  bairros.addData(data);
});
//***********************************************


/* ALDEIA DIGITAL LAYER */
var aldeiaLayer = L.geoJson(null);
var aldeia = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/wifi.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" +"<tr><th>Nome</th><td>" + feature.properties.name + "</td></tr><tr><th>Situacao</th><td>" + feature.properties.situacao + "</td></tr><table>";

      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.name);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });
      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
      $("#aldeia-table tbody").append('<tr><td class="aldeia-name"><a href="#" onclick="sidebarClick('+layer.feature.geometry.coordinates[1]+', '+layer.feature.geometry.coordinates[0]+', '+L.stamp(layer)+', aldeiaLayer); return false;">'+layer.feature.properties.name+'</a></td></tr>');
      aldeiaSearch.push({
        name: layer.feature.properties.name,
        source: "Aldeia",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

function aldeiaJSON(data){
  aldeia.addData(data);
  map.addLayer(aldeiaLayer);
}

/* EDUCACAO LAYER */
var educacaoLayer = L.geoJson(null);
var educacao = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/school.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.nome,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" +"<tr><th>Nome</th><td>" + feature.properties.nome + "</td></tr>" +"<tr><th>Tel/Ramal</th><td>" + feature.properties.ramal + "</td></tr>" +"<tr><th>Tipo Ensino</th><td>" + feature.properties.ensino + "</td></tr><table>";
      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.nome);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });
      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
      $("#educacao-table tbody").append('<tr><td class="educacao-nome"><a href="#" onclick="sidebarClick('+layer.feature.geometry.coordinates[1]+', '+layer.feature.geometry.coordinates[0]+', '+L.stamp(layer)+', educacaoLayer); return false;">'+layer.feature.properties.nome+'</a></td><td>'+layer.feature.properties.ramal+'</td><td>'+layer.feature.properties.ensino+'</td></tr>');
      educacaoSearch.push({
        name: layer.feature.properties.nome,
        source: "Educacao",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

function educacaoJSON(data){
  educacao.addData(data);
  map.addLayer(educacaoLayer);
}

/* SAUDE LAYER */

var saudeLayer = L.geoJson(null);
var saude = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/hospital-building.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.descricao,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nome</th><td>" + feature.properties.descricao + "</td></tr>" + "<tr><th>Tel/Ramal</th><td>" + feature.properties.tel_ramal + "</td></tr>" + "<table>";
      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.descricao);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });
      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
      $("#saude-table tbody").append('<tr><td class="saude-descricao"><a href="#" onclick="sidebarClick('+layer.feature.geometry.coordinates[1]+', '+layer.feature.geometry.coordinates[0]+', '+L.stamp(layer)+', saudeLayer); return false;">'+layer.feature.properties.descricao+'</a></td><td>'+layer.feature.properties.tel_ramal+'</td></tr>');
      saudeSearch.push({
        name: layer.feature.properties.descricao,
        //address: layer.feature.properties.tel_ramal,
        source: "Saude",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

function saudeJSON(data){
  saude.addData(data);
  map.addLayer(saudeLayer);
}

/* CRAS LAYER */

var crasLayer = L.geoJson(null);
var cras = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/mao.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.descricao,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nome</th><td>" + feature.properties.desc_cras + "</td></tr>" + "<tr><th>Tel/Ramal</th><td>" + feature.properties.tel_cras + "</td></tr>" + "<table>";
      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.desc_cras);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });
      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
      $("#cras-table tbody").append('<tr><td class="cras-desc_cras"><a href="#" onclick="sidebarClick('+layer.feature.geometry.coordinates[1]+', '+layer.feature.geometry.coordinates[0]+', '+L.stamp(layer)+', saudeLayer); return false;">'+layer.feature.properties.desc_cras+'</a></td><td>'+layer.feature.properties.tel_cras+'</td></tr>');
      crasSearch.push({
        name: layer.feature.properties.desc_cras,
        //address: layer.feature.properties.tel_ramal,
        source: "CRAS",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

function crasJSON(data){
  cras.addData(data);
  map.addLayer(crasLayer);
}


/* PRACAS LAYER */

var pracasLayer = L.geoJson(null);
var pracas = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/pracas.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.nome,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nome</th><td>" + feature.properties.nome + "</td></tr><table>";
      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.nome);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
          }
        });
      } else {
        layer.bindPopup(content, {
          maxWidth: "auto",
          closeButton: false
        });
      }
      $("#pracas-table tbody").append('<tr><td class="pracas-nome"><a href="#" onclick="sidebarClick('+layer.feature.geometry.coordinates[1]+', '+layer.feature.geometry.coordinates[0]+', '+L.stamp(layer)+', pracasLayer); return false;">'+layer.feature.properties.nome+'</a></td></tr>');
      pracasSearch.push({
        name: layer.feature.properties.nome,
        //address: layer.feature.properties.tel_ramal,
        source: "Pracas",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

function pracasJSON(data){
  pracas.addData(data);
  map.addLayer(pracasLayer);
}

/* CHAMADAS AJAX GEOSERVER */

$.when(
   $.ajax({
    url : "http://geo.epdvr.com.br/geoserver/nebulosa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nebulosa:educacao_municipal&srsName=EPSG:4326&outputFormat=json&format_options=callback:getJson1",
    dataType : 'jsonp',
    jsonpCallback: 'getJson1',
    success: educacaoJSON,
    cache: false
    //error: alert("ERRORRR EDUCACAO")
  }),
   $.ajax({
    url : "http://geo.epdvr.com.br/geoserver/nebulosa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nebulosa:aldeia_digital_oficial&srsName=EPSG:4326&outputFormat=json&format_options=callback:getJson2",
    dataType : 'jsonp',
    jsonpCallback: 'getJson2',
    success: aldeiaJSON,
    cache: false
    //error: alert("ERRORRR ALDEIA")
  }),
   $.ajax({
    url : "http://geo.epdvr.com.br/geoserver/nebulosa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nebulosa:saude_municipal&srsName=EPSG:4326&outputFormat=json&format_options=callback:getJson3",
    dataType : 'jsonp',
    jsonpCallback: 'getJson3',
    success: saudeJSON,
    cache: false
    //error: alert("ERRORRR SAUDE")
  }),
   $.ajax({
    url : "http://geo.epdvr.com.br/geoserver/nebulosa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nebulosa:cras&srsName=EPSG:4326&outputFormat=json&format_options=callback:getJson4",
    dataType : 'jsonp',
    jsonpCallback: 'getJson4',
    success: crasJSON,
    cache: false
    //error: alert("ERRORRR SAUDE")
  }),
   $.ajax({
    url : "http://geo.epdvr.com.br/geoserver/nebulosa/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nebulosa:vw_pracas&srsName=EPSG:4326&outputFormat=json&format_options=callback:getJson5",
    dataType : 'jsonp',
    jsonpCallback: 'getJson5',
    success: pracasJSON,
    cache: false
    //error: alert("ERRORRR SAUDE")
  })
   ).then(function( data, textStatus, jqXHR ) {
          console.log("AJAX OK") // Alerts 200
          //$.ajaxSetup({ cache: false });
        });


map = L.map("map", {
  zoom: 13,
  center: [-22.511447, -44.108906],
  layers: [googleRoadMap, markerClusters, lotesWMS],
  zoomControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === aldeiaLayer) {
    markerClusters.addLayer(aldeia);
  }
  if (e.layer === educacaoLayer) {
    markerClusters.addLayer(educacao);
  }
  if (e.layer === saudeLayer) {
    markerClusters.addLayer(saude);
  }
  if (e.layer === crasLayer) {
    markerClusters.addLayer(cras);
  }
  if (e.layer === pracasLayer) {
    markerClusters.addLayer(pracas);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === aldeiaLayer) {
    markerClusters.removeLayer(aldeia);
  }
  if (e.layer === educacaoLayer) {
    markerClusters.removeLayer(educacao);
  }
  if (e.layer === saudeLayer) {
    markerClusters.removeLayer(saude);
  }
  if (e.layer === crasLayer) {
    markerClusters.removeLayer(cras);
  }
  if (e.layer === pracasLayer) {
    markerClusters.removeLayer(pracas);
  }
});

/* Larger screens get expanded layer control */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

var baseLayers = {
    "Street Map" : googleRoadMap,
    "Satelite": googleSatellite,
    "Hybrid": googleHybrid
};

var groupedOverlays = {

  "Camadas": {
    "Limite Municipal": limiteWMS,
    "Bairros": bairrosWMS
    //"Lotes": lotesWMS
    //"Subway Lines": subwayLines
  },
  "Pontos de Interesse": {
    "<img src='assets/img/school.png' width='24' height='28'>&nbsp;Educacao Municipal": educacaoLayer,
    "<img src='assets/img/hospital-building.png' width='24' height='28'>&nbsp;Saude Municipal": saudeLayer,
    "<img src='assets/img/wifi.png' width='24' height='28'>&nbsp;Aldeia Digital": aldeiaLayer,
    "<img src='assets/img/mao.png' width='24' height='28'>&nbsp;CRAS": crasLayer,
    "<img src='assets/img/pracas.png' width='24' height='28'>&nbsp;Pracas": pracasLayer
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);
/*
var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).on("shown", function () {
  getViewport();
}).on("hidden", function () {
  getViewport();
}).addTo(map);
*/
/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});


/*
$('#searchbox').keyup(function () {
    console.log($('#searchbox').val().length);
   if ($('#searchbox').val().length > 7){
    console.log($('#searchbox').val());
    carregarLotes($('#searchbox').val());
    //refreshLotesBH();
   }
  });
*/

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {

  $("#loading").hide();

  var bairrosBH = new Bloodhound({
    name: "Bairros",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: bairrosSearch,
    limit: 10
  });

  var aldeiaBH = new Bloodhound({
    name: "Aldeia",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: aldeiaSearch,
    limit: 10
  });
  //var aldeiaList = new List("aldeia", {valueNames: ["aldeia-name"]}).sort("aldeia-name", {order:"asc"});

  var educacaoBH = new Bloodhound({
    name: "Educacao",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: educacaoSearch,
    limit: 10
  });
  //var educacaoList = new List("educacao", {valueNames: ["educacao-nome"]}).sort("educacao-nome", {order:"asc"});

  var saudeBH = new Bloodhound({
    name: "Saude",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: saudeSearch,
    limit: 10
  });
  //var saudeList = new List("saude", {valueNames: ["saude-descricao"]}).sort("saude-descricao", {order:"asc"});

  var crasBH = new Bloodhound({
    name: "CRAS",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: crasSearch,
    limit: 10
  });
  //var crasList = new List("cras", {valueNames: ["cras-desc_cras"]}).sort("cras-desc_cras", {order:"asc"});

   var pracasBH = new Bloodhound({
    name: "Pracas",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: pracasSearch,
    limit: 10
  });
  //var pracasList = new List("pracas", {valueNames: ["pracas-nome"]}).sort("pracas-nome", {order:"asc"});


  bairrosBH.initialize();
  aldeiaBH.initialize();
  educacaoBH.initialize();
  saudeBH.initialize();
  crasBH.initialize();
  pracasBH.initialize();

  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Bairros",
    displayKey: "name",
    source: bairrosBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Bairros</h4>"
    }
  }, {
    name: "Aldeia",
    displayKey: "name",
    source: aldeiaBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/wifi.png' width='24' height='28'>&nbsp;Aldeia Digital</h4>"
    }
  },{
    name: "Educacao",
    displayKey: "name",
    source: educacaoBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/school.png' width='24' height='28'>&nbsp;Educacao</h4>"
    }
  }, {
    name: "Saude",
    displayKey: "name",
    source: saudeBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/hospital-building.png' width='24' height='28'>&nbsp;Saude</h4>"
    }
  },{
    name: "CRAS",
    displayKey: "name",
    source: crasBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/mao.png' width='24' height='28'>&nbsp;CRAS</h4>"
    }
  },{
    name: "Pracas",
    displayKey: "name",
    source: pracasBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/pracas.png' width='24' height='28'>&nbsp;Pracas</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {

    if (datum.source === "Bairros") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Aldeia") {
      if (!map.hasLayer(aldeiaLayer)) {
        map.addLayer(aldeiaLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Educacao") {
      if (!map.hasLayer(educacaoLayer)) {
        map.addLayer(educacaoLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Saude") {
      if (!map.hasLayer(saudeLayer)) {
        map.addLayer(saudeLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "CRAS") {
      if (!map.hasLayer(crasLayer)) {
        map.addLayer(crasLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }

    if (datum.source === "Pracas") {
      if (!map.hasLayer(pracasLayer)) {
        map.addLayer(pracasLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }

    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");

});



/* Placeholder hack for IE */
if (navigator.appName == "Microsoft Internet Explorer") {
  $("input").each(function () {
    if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
      $(this).val($(this).attr("placeholder"));
      $(this).focus(function () {
        if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
      });
      $(this).blur(function () {
        if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
      });
    }
  });
}
