// TODO: 
//// Institution layer: 22B, Frelsesarmeen, Vår Frue kirke, Kirkens Bymisjon, Omsorgskafeen, Sorgenfri
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
	"fillOpacity": 0.3
};

var floodStyle = {
	"color": "#0000ff",
	"weight": 1,
	"opacity": 1,
	"fillOpacity": 0.3
};

var levels = {
	quickClayLevels: [
		"#00FF66",
		"#FFFF66",
		"#FFCC00",
		"#FF9900",
		"#FF0000"
	]
};

var hoverStyle = {
	"opacity": 1,
	"fillOpacity": 0.8
};

var geoJson;
var fireType = "Fire";
var floodType = "FlomAreal";
var quickClayType = "KvikkleireFaresone";
var historicType = "Historic";
var markerType = "Marker";

/*************************************/
/**  Read GeoJSON and create layers **/
/*************************************/

var mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap contributors</a>";
var mapquestLink = "<a href='http://www.mapquest.com//'>MapQuest</a>";
var mapquestPic = "<img src='http://developer.mapquest.com/content/osm/mq_logo.png'>";
var mapLayer = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png", {
		attribution: "&copy; " + mapLink + ". Tiles courtesy of "+mapquestLink + " " + mapquestPic,
		subdomains: ["otile1", "otile2", "otile3", "otile4"]
});

var historicLayer = L.geoJson(historic, {
	filter: function (feature, layer) {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});

var fireLayer = L.geoJson(fireareas, {
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

var floodLayer = L.geoJson(floodareas, {
	style: floodStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});

var damBreakLayer = null;

var quickClayLayer = L.geoJson(quickClayAreas, {
	style: quickClayStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});


var imageLayer = null;


/// Create the map, center it on Trondheim and set zoom to 15 before adding layers
var map = L.map("map", {
	center: [63.43387, 10.41384],
	zoom: 13,
	layers: [mapLayer, historicLayer, fireLayer, quickClayLayer, floodLayer]
});

// Can only have one basemap active at any time, but we only have one so let's comment it out
// to get a cleaner interface
var baseMaps = {
	 "Normal": mapLayer
};

// Can have multiple overlays and switch between them, let's add one for every category
var overlayMaps = {
	"Historic": historicLayer,
	"Fire": fireLayer,
	"Quick clay": quickClayLayer,
	"500-year Flood": floodLayer
};

// Add layer switching controls to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Functions
function onEachFeature(feature, layer) {
	var popUpContent = "";
	var img = "";
	switch (feature.properties.objType) {
		case quickClayType:
			var levelColor = getDangerLevel(feature);
			layer.setStyle({
				color: levelColor
			});
			break;
		case fireType:
			popupContent = getFirePopup(feature);
			break;
		case floodType:
			popupContent = getFloodPopup(feature);
			break;
		case historicType:
			popupContent = getHistoryPopup(feature);
			layer.bindPopup(popupContent);
			break;
		default:
			popupContent = "Unknown feature type";
	}
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

function getHistoryPopup(feature) {
	var popupContent = "";
	popupContent = "<h3>" + feature.properties.title + "</h3>";
	popupContent += "<p>" + feature.properties.popupContent  + "</p>";
	if (feature.properties.img) {
		var fileType = ".jpg";
		var fullImage = feature.properties.img + fileType;
		var smallImage = feature.properties.img + "_small" + fileType;
		popupContent += "<br><a href='img/" + fullImage + "' target='_blank'><img src='img/" + smallImage + "'/></a>";
	}
	if (feature.properties.source) {
		popupContent += "<a href='" + feature.properties.source + "'>Source</a>";
	}
	return popupContent;
}


function getQuickClayPopup(feature) {
	var popupContent = "";

	popupContent = "<a href='http://gis3.nve.no/nvedatanedlast/Default.aspx'>Source</a>";
	return popupContent;
}

function getFirePopup(feature) {
	var popupContent = "";
	return "FIRE!";
}

function getFloodPopup(feature) {
	var popupContent = "";
	return "FLOOD!";
}


/******************************************/
/**		Info box and hover effect		 **/
/******************************************/

// Used to highlight features. Style defines is highlight style
function highlightFeature(e) {
	var layer = e.target;
//	console.log(layer);
	if (layer.feature.properties.objType !== markerType && layer.feature.properties.objType !== historicType) {
		layer.setStyle({
			opacity: 1,
			fillOpacity: 0.6
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}
	if (layer.feature.properties.ORIG_FID) {
		console.log(layer.feature.properties.ORIG_FID);
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
	if (e.target.feature.properties.objType === quickClayType) {
		var levelColor = getDangerLevel(e.target.feature);
		e.target.setStyle({
			color: levelColor
		});
	}
}

function getDangerLevel(feature) {
	var level = feature.properties.risikoKl;
	var type = feature.properties.objType;

	if (type === quickClayType) {
		return levels.quickClayLevels[level - 1];
	}
}

function getStyle(e) {
	switch (e.target.feature.properties.objType) {
		case quickClayType:
			geoJson = L.geoJson(quickClayAreas, {
				style: quickClayStyle,
				onEachFeature: onEachFeature
			});
			break;
		case fireType:
			geoJson = L.geoJson(fireareas, {
				style: fireStyle,
				onEachFeature: onEachFeature
			});
			break;
		case floodType:
			geoJson = L.geoJson(floodareas, {
				style: floodStyle,
				onEachFeature: onEachFeature
			});
			break;
		default:
			onEachFeature: onEachFeature;
			geoJson = null;
	}
	return geoJson;
}

// Info box when hovering
var info = L.control({position: "bottomright"});

info.onAdd = function (map) {
	this._div = L.DomUtil.create("div", "info"); // create a div with class info
	this.update();
	return this._div;
};

info.update = function (properties) {
	var p = (properties ? properties.objType : "");
	if (p === markerType || p === historicType) {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.title : "");
	}else if (p === quickClayType) {
		info.updateQuickClay(properties);
	} else if (p === floodType) {
		this._div.innerHTML = "<h4>Information</h4>";
	} else {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.objType  + " risk area" : "");
	}
};

info.updateQuickClay = function (properties) {
	this._div.innerHTML = "<h4>Quick clay area</h4><h4>" + (properties ? properties.skrdOmrNvn : "") + "</h4>";
	this._div.innerHTML += "<p>Risk rating: " + (properties ? properties.risikoKl : "") + "</p>";
	this._div.innerHTML += "<p><i>Risk = (probability + consequence)</i></p>";
};

info.addTo(map);
