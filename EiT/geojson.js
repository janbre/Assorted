var markers = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
		"type": "Marker",
        "popupContent": "Innherredsveien 7",
		"img": "300"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          10.414255857467651,
          63.43381610012737
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "type": "Historic",
        "title": "Quick clay slide 2012",
        "popupContent": "Quick clay slide at Esp in 2012. 50m wide, 350m long. Over 40 people evacuated, but no loss of life.",
        "link": "http://www.nrk.no/trondelag/slik-ser-rasomradet-ut-fra-lufta-1.7936077"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          10.142097473144531,
          63.39152174400882
        ]
      }
    }
  ]
}

var fireareas = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "title": "Møllenberg",
		"type": "Fire",
        "popupContent": "Danger of fire. Lots of students"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              10.414609909057617,
              63.434334308715385
            ],
            [
              10.417442321777344,
              63.43546665782444
            ],
            [
              10.420660972595215,
              63.433509009133545
            ],
            [
              10.416755676269531,
              63.431954310463425
            ],
            [
              10.413451194763182,
              63.43306756006302
            ],
            [
              10.415081977844238,
              63.43393125840144
            ],
            [
              10.414566993713379,
              63.434238344869236
            ],
            [
              10.414609909057617,
              63.434334308715385
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
		"type": "Fire",
        "popupContent": "It's turtles all the way down"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              10.406584739685057,
              63.43272207343702
            ],
            [
              10.404353141784668,
              63.432165447332096
            ],
            [
              10.40456771850586,
              63.43151283743752
            ],
            [
              10.405726432800293,
              63.43072584691178
            ],
            [
              10.408601760864256,
              63.4299580304452
            ],
            [
              10.408859252929688,
              63.43066826139047
            ],
            [
              10.408558845520018,
              63.43151283743752
            ],
            [
              10.407872200012207,
              63.432549328561734
            ],
            [
              10.407657623291014,
              63.43262610419044
            ],
            [
              10.406584739685057,
              63.43272207343702
            ]
          ]
        ]
      }
    }
  ]
}

var quickClayAreas = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "title": "Bakklandet",
		"type": "Quick Clay",
        "popupContent": "Quick clay area"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              10.406327247619629,
              63.43235738858984
            ],
            [
              10.408258438110352,
              63.43206947622105
            ],
            [
              10.406928062438965,
              63.43049550413216
            ],
            [
              10.404481887817383,
              63.42911340856782
            ],
            [
              10.403280258178711,
              63.42824956498727
            ],
            [
              10.402207374572754,
              63.42821117133482
            ],
            [
              10.401949882507324,
              63.428364745635925
            ],
            [
              10.406026840209961,
              63.43231900044116
            ],
            [
              10.406327247619629,
              63.43235738858984
            ]
          ]
        ]
      }
    },
  ]
}
