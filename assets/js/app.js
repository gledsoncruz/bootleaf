var map, bairrosSearch = [], educacaoSearch = [], saudeSearch = [];

$(document).ready(function() {
  getViewport();
  /* Hack to refresh tabs after append */
  $("#poi-tabs a[href='#saude']").tab("show");
  $("#poi-tabs a[href='#educacao']").tab("show");
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

function sidebarClick(lat, lng, id, layer) {
  /* If sidebar takes up entire screen, hide it and go to the map */
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

/* Basemap Layers */
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

var googleRoadMap = new L.Google('ROADMAP');
var googleSatellite = new L.Google('SATELLITE');

//***********************************************

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

$.getJSON("data/bairros.geojson", function (data) {
  bairros.addData(data);
});

//***********************************************

/* Overlay Layers */

var subwayLines = L.geoJson(null, {
  style: function (feature) {
    if (feature.properties.route_id === "1" || feature.properties.route_id === "2" || feature.properties.route_id === "3") {
      return {
        color: "#ff3135",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "4" || feature.properties.route_id === "5" || feature.properties.route_id === "6") {
      return {
        color: "#009b2e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "7") {
      return {
        color: "#ce06cb",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "A" || feature.properties.route_id === "C" || feature.properties.route_id === "E" || feature.properties.route_id === "SI" || feature.properties.route_id === "H") {
      return {
        color: "#fd9a00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "Air") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "B" || feature.properties.route_id === "D" || feature.properties.route_id === "F" || feature.properties.route_id === "M") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "G") {
      return {
        color: "#9ace00",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "FS" || feature.properties.route_id === "GS") {
      return {
        color: "#6e6e6e",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "J" || feature.properties.route_id === "Z") {
      return {
        color: "#976900",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "L") {
      return {
        color: "#969696",
        weight: 3,
        opacity: 1
      };
    }
    if (feature.properties.route_id === "N" || feature.properties.route_id === "Q" || feature.properties.route_id === "R") {
      return {
        color: "#ffff00",
        weight: 3,
        opacity: 1
      };
    }
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      if (document.body.clientWidth <= 767) {
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.Line);
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
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        subwayLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/subways.geojson", function (data) {
  subwayLines.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
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
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nome</th><td>" + feature.properties.nome + "</td></tr>" + "<tr><th>Tel/Ramal</th><td>" + feature.properties.ramal + "</td></tr>" + "<tr><th>Tipo Ensino</th><td>" + feature.properties.ensino + "</td></tr><table>";

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
        //address: layer.feature.properties.ramal,
        //ensino: layer.feature.properties.ensino,
        source: "Educacao",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/educacao.geojson", function (data) {
  educacao.addData(data);
  map.addLayer(educacaoLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove saude to markerClusters layer */
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
$.getJSON("data/saude.geojson", function (data) {
  saude.addData(data);
});

map = L.map("map", {
  zoom: 10,
  center: [-22.511447, -44.108906],
  layers: [mapquestOSM, markerClusters, bairros],
  zoomControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === educacaoLayer) {
    markerClusters.addLayer(educacao);
  }
  if (e.layer === saudeLayer) {
    markerClusters.addLayer(saude);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === educacaoLayer) {
    markerClusters.removeLayer(educacao);
  }
  if (e.layer === saudeLayer) {
    markerClusters.removeLayer(saude);
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
  "Street Map": mapquestOSM,
  "Google Satelite": googleSatellite,
  "Google RoadMap": googleRoadMap
};

var groupedOverlays = {
  "Pontos de Interesse": {
    "<img src='assets/img/school.png' width='24' height='28'>&nbsp;Educacao Municipal": educacaoLayer,
    "<img src='assets/img/hospital-building.png' width='24' height='28'>&nbsp;Saude Municipal": saudeLayer
  },
  "Camadas": {
    "Bairros" : bairros//,
    //"Subway Lines": subwayLines
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

var sidebar = L.control.sidebar("sidebar", {
  closeButton: true,
  position: "left"
}).on("shown", function () {
  getViewport();
}).on("hidden", function () {
  getViewport();
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  /* Fit map to bairros bounds */
  map.fitBounds(bairros.getBounds());
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

  var educacaoBH = new Bloodhound({
    name: "Educacao",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: educacaoSearch,
    limit: 10
  });
  var educacaoList = new List("educacao", {valueNames: ["educacao-nome"]}).sort("educacao-nome", {order:"asc"});

  var saudeBH = new Bloodhound({
    name: "Saude",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: saudeSearch,
    limit: 10
  });
  var saudeList = new List("saude", {valueNames: ["saude-descricao"]}).sort("saude-descricao", {order:"asc"});

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  bairrosBH.initialize();
  educacaoBH.initialize();
  saudeBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
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
    name: "Educacao",
    displayKey: "name",
    source: educacaoBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/school.png' width='24' height='28'>&nbsp;Educacao</h4>"
      //suggestion: Handlebars.compile(["{{nome}}<br>&nbsp;<small>{{ensino}}</small>"].join(""))
    }
  }, {
    name: "Saude",
    displayKey: "name",
    source: saudeBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/hospital-building.png' width='24' height='28'>&nbsp;Saude</h4>"
      //suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {

    if (datum.source === "Bairros") {
      map.fitBounds(datum.bounds);
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
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
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
