/*************************************/
/*		Styling for polygons		 */
/*************************************/

var fireStyle = {
	"color": "#ff7880",
	"weight": 1,
	"opacity": 0.65,
	"fillOpacity": 0.4
};

var quickClayStyle = {
	"color": "#804a2d",
	"weight": 1,
	"opacity": 0.65,
	"fillOpacity": 0.4
};

var levels = {
	quickClayLevels: [
		"#444444",
		"#111111",
		"#987654"
	]
};

var hoverStyle = {
	"opacity": 1,
	"fillOpacity": 0.8
};

var floodStyle;
var geoJson;
var fireType = "Fire";
var floodType = "Flood";
var quickClayType = "Quick Clay";
var historicType = "Historic";
var markerType = "Marker";

/*************************************/
/**  Read GeoJSON and create layers **/
/*************************************/

// Map layer
var mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap contributors</a>";
var mapquestLink = "<a href='http://www.mapquest.com//'>MapQuest</a>";
var mapquestPic = "<img src='http://developer.mapquest.com/content/osm/mq_logo.png'>";
var mapLayer = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png", {
		attribution: "&copy; " + mapLink + ". Tiles courtesy of "+mapquestLink + " " + mapquestPic,
		subdomains: ["otile1", "otile2", "otile3", "otile4"]
});

// Image layer
var images = L.geoJson(markers, {
	filter: function (feature, layer) {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});

// Fire layer
var fire = L.geoJson(fireareas, {
	style: fireStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});


// Flood layer
var flood = null;

// Dam break layer
var damBreak = null;

// Quick clay layer
var quickClay = L.geoJson(quickClayAreas, {

	style: quickClayStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});


// Historical layer
var history = null;


/// Create the map, center it on Trondheim and set zoom to 15 before adding layers
var map = L.map("map", {
	center: [63.43387, 10.41384],
	zoom: 14,
	layers: [mapLayer, images, fire, quickClay]
});

// Can only have one basemap active at any time, but we only have one so let's comment it out
// to get a cleaner interface
var baseMaps = {
	 "Normal": mapLayer
};

// Can have multiple overlays and switch between them, let's add one for every category
var overlayMaps = {
	"Images": images,
	"Fire": fire,
	"Quick clay": quickClay
};

// Add layer switching controls to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Functions
function onEachFeature(feature, layer) {
	var popupContent = "";
	var img = "";

	if (feature.properties && feature.properties.title) {
		popupContent += feature.properties.title + "<br>";
	}
	if (feature.properties && feature.properties.popupContent) {
		popupContent += feature.properties.popupContent;
	}
	if (feature.properties && feature.properties.source) {
		popupContent += "<a href=" + feature.properties.source + ">Source</a>";
	}
	if (feature.properties && feature.properties.img) {
		var fileType = ".png";
		var fullImage = feature.properties.img + fileType;
		var smallImage = feature.properties.img + "_small" + fileType;
		popupContent += "<br><a href='img/" + fullImage + "' target='_blank'><img src='img/" + smallImage + "'/></a>"; 
	}

	if (feature.properties.type === quickClayType) {
		var levelColor = getDangerLevel(feature);
		layer.setStyle({
			color: levelColor
		});
		//if (feature.properties.level === "1") {
		//	console.log("level 1!");
		//	layer.setStyle({
		//		color: "#444444"
		//	});
		//}
	}
	layer.bindPopup(popupContent);
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});

}


/******************************************/
/**		Info box and hover effect		 **/
/******************************************/

// Used to highlight features. Style defines is highlight style
function highlightFeature(e) {
	var layer = e.target;
//	console.log(layer);
	if (layer.feature.properties.type !== markerType && layer.feature.properties.type !== historicType) {
		layer.setStyle({
			opacity: 1,
			fillOpacity: 0.6
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	info.update(e.target.feature.properties);
}

function resetHighlight(e) {
	geoJson = getStyle(e);
	if (geoJson === null) {
		info.update();
	} else {
		geoJson.resetStyle(e.target);
		info.update();
	}
	resetLevels(e);
}

function resetLevels(e) {
	if (e.target.feature.properties.type === quickClayType) {
		var levelColor = getDangerLevel(e.target.feature);
		e.target.setStyle({
			color: levelColor
		});
	}
}

function getDangerLevel(feature) {
	var level = parseInt(feature.properties.level);
	var type = feature.properties.type;

	if (type === quickClayType) {
		return levels.quickClayLevels[level];
	}
}

function getStyle(e) {
	var type = e.target.feature.properties.type;
	if (type === fireType) {
		console.log("Fire it is!");
		geoJson = L.geoJson(fireareas, {
			style: fireStyle,
			onEachFeature: onEachFeature
		});
		return geoJson;
	} else if (type === quickClayType) {
		console.log("Quickclay it is!");
		geoJson = L.geoJson(quickClayAreas, { 
			style: quickClayStyle,
			onEachFeature: onEachFeature
		});
		return geoJson;
	} else if (type === markerType || type === historicType) {
		onEachFeature: onEachFeature;
		return null;
	}
}

// Info box when hovering
var info = L.control({position: "bottomright"});

info.onAdd = function (map) {
	this._div = L.DomUtil.create("div", "info"); // create a div with class info   
	this.update();
	return this._div;
};

info.update = function (properties) {
	var p = (properties ? properties.type : "");
	if (p === markerType || p === historicType) {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.title : "");
	} else {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.type  + " risk area" : "");
	}
};
info.addTo(map);
