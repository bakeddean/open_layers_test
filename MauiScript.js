var map;

function init(){

    // create a vector layer for drawing
    var vector = new OpenLayers.Layer.Vector('Vector Layer', {
        styleMap: new OpenLayers.StyleMap({
            temporary: OpenLayers.Util.applyDefaults({
                pointRadius: 5,//16
            }, OpenLayers.Feature.Vector.style.temporary),
            'default': OpenLayers.Util.applyDefaults({
                pointRadius: 16,
                strokeWidth: 3,
            }, OpenLayers.Feature.Vector.style['default']),
            select: OpenLayers.Util.applyDefaults({
                pointRadius: 16,
                strokeWidth: 3
            }, OpenLayers.Feature.Vector.style.select)
        })
    });

    // OpenLayers' EditingToolbar internally creates a Navigation control, we
    // want a TouchNavigation control here so we create our own editing toolbar
    var toolbar = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar'
    });
    toolbar.addControls([
        // this control is just there to be able to deactivate the drawing
        // tools
        new OpenLayers.Control({
            displayClass: 'olControlNavigation'
        }),
        new OpenLayers.Control.ModifyFeature(vector, {
            vertexRenderIntent: 'temporary',
            displayClass: 'olControlModifyFeature'
        }),
        new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point, {
            displayClass: 'olControlDrawFeaturePoint'
        }),
        new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path, {
            displayClass: 'olControlDrawFeaturePath'
        }),
        new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon, {
            displayClass: 'olControlDrawFeaturePolygon'
        })
    ]);

    //map = new OpenLayers.Map('map');
    map = new OpenLayers.Map({
        div: "map",
        allOverlays: true,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom(),
            toolbar
        ]
    });

    var graphic = new OpenLayers.Layer.Image(
        'Maui Zone',
        'data/Mauimap.png',
        //new OpenLayers.Bounds(-180, -88.759, 180, 88.759),
        //new OpenLayers.Bounds(164, -48, 180, -34),  // Roughly taken from maui map
        //                     l    b    r    t
        new OpenLayers.Bounds(165, -48, 179.5, -33.5),  // Roughly taken from maui map
        new OpenLayers.Size(480, 632),  // Map image dimensions
        {numZoomLevels: 3}
    );
    graphic.opacity = 0.75;

    graphic.events.on({
        loadstart: function() {
            OpenLayers.Console.log("loadstart");
        },
        loadend: function() {
            OpenLayers.Console.log("loadend");
        }
    });

    /*var osm = new OpenLayers.Layer.OSM(
        "Global Imagery",
        null,
        {   
            //maxExtent: [164, -48, 180, -34],
            //maxExtent: [165, -48, 179.5, -33.5],
            maxExtent: [165, -48, 179.5, -33.5],
            numZoomLevels: 5
        }
    );
    osm.opacity = 0.5;*/

    var jpl_wms = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://demo.opengeo.org/geoserver/wms",
            {layers: "bluemarble"},
            //{maxExtent: [-160, -88.759, 160, 88.759], numZoomLevels: 3}
            {
                maxExtent: [165, -48, 179.5, -33.5],
                numZoomLevels: 5
            }
        );
        jpl_wms.opacity = 0.5;

        map.addLayers([graphic, jpl_wms, vector]);
        //map.addLayers([graphic, osm]);
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.zoomToMaxExtent();

        var point1 = new OpenLayers.Geometry.Point(170, -40);
        var point2 = new OpenLayers.Geometry.Point(171, -41);
        var point3 = new OpenLayers.Geometry.Point(172, -40);
        //var point4 = new OpenLayers.Geometry.Point(171, -41);
        var linearRing = new OpenLayers.Geometry.MultiPoint([point1, point2, point3]);
        //var geometry = new OpenLayers.Geometry.Polygon([linearRing]);
        //var polygonFeature = new OpenLayers.Feature.Vector(geometry, null, null);
        var polygonFeature = new OpenLayers.Feature.Vector(linearRing, null, null);
        //var polygonFeature = new OpenLayers.Feature.Vector(geometry, null, siteStyle);
        vector.addFeatures([polygonFeature]);
}