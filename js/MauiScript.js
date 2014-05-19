var map;

function init(){

    var geographic = new OpenLayers.Projection("EPSG:4326");    
    var mercator = new OpenLayers.Projection("EPSG:900913");

    var currentFeature = null;

    //-------------------------------------------------------------------------
    // Create a vector layer for drawing.
    //-------------------------------------------------------------------------
    var vectorLayer = new OpenLayers.Layer.Vector('Vector Layer', {
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

    //-------------------------------------------------------------------------
    // OpenLayers' EditingToolbar internally creates a Navigation control, we
    // want a TouchNavigation control here so we create our own editing toolbar
    //-------------------------------------------------------------------------
    var toolbar = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar'
    });
    /*toolbar.addControls([

        // This control is just there to be able to deactivate the drawing tools
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
    ]);*/

    //-------------------------------------------------------------------------
    // Create the base Map object.
    //-------------------------------------------------------------------------
    map = new OpenLayers.Map({
        div: "map",
        //projection: 'EPSG:900913',  // Google projection
        //units: 'degrees',
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
        {numZoomLevels: 5}
    );
    graphic.opacity = 0.5;

    graphic.events.on({
        loadstart: function() {
            //OpenLayers.Console.log("loadstart");
            console.log("Graphic loadstart");
        },
        loadend: function() {
            //OpenLayers.Console.log("loadend");
            console.log("Graphic loadend");
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

    var wms = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        //"http://labs.metacarta.com/wms/vmap0",
        //{layers: "bluemarble"},
        {layers: 'basic'},  // Params
        //{maxExtent: [-160, -88.759, 160, 88.759], numZoomLevels: 3}
        // Options
        {
            maxExtent: [165, -48, 179.5, -33.5],
            numZoomLevels: 10
        }
    );
    wms.opacity = 0.75;

    //var geographic = new OpenLayers.Projection("EPSG:4326");

    var osm_layer = new OpenLayers.Layer.OSM('OpenStreetMap Layer');

    var wms_layer_labels = new OpenLayers.Layer.WMS(
         'Location Labels',
         'http://vmap0.tiles.osgeo.org/wms/vmap0',
         {layers: 'ground_01',
         transparent: true},
         {visibility: true, opacity:0.5}
       );

    var google_map_layer = new OpenLayers.Layer.Google(
         'Google Map Layer',
         {}
    );

    //-------------------------------------------------------------------------
    // Add the layers to the map and set the view.
    //-------------------------------------------------------------------------
    map.addLayers([osm_layer, graphic, vectorLayer]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    //-------------------------------------------------------------------------
    // Feature added callback function. Append the vector co-ordinates to
    // the text area.   
    //-------------------------------------------------------------------------
    function captureLocationDetails(poly){
        //var polyDetailsString = "Top:" + poly.geometry.bounds.top + " Right: " + poly.geometry.bounds.right + " Bottom: " + poly.geometry.bounds.bottom + " Left: " + poly.geometry.bounds.left;
        //console.log(polyDetailsString);
        var vertices = poly.geometry.getVertices();
        var textArea = $('#info-inner');
        for(var i = 0; i < vertices.length; i++){
            var geoVertex = vertices[i].transform(mercator, geographic);
            textArea.append(geoVertex.x + "    ");
            textArea.append(geoVertex.y + "&#13;&#10;");


            //textArea.append(vertices[i].x + "    ");
            //textArea.append(vertices[i].y + "&#13;&#10;");
        }
        textArea.append("----------------------------------&#13;&#10;");
    }

    //-------------------------------------------------------------------------
    // Feature added callback function. Append the vector co-ordinates to
    // the text area.   
    //-------------------------------------------------------------------------
    function captureCircleDetails(featureVector){

        // OSM/Google etc units are meters, so convert to degrees
        var center = featureVector.geometry.getCentroid().transform(mercator, geographic);

        // Radius is already in meters
        var radius = Math.abs(featureVector.geometry.bounds.getWidth()/2);

        // Get the radius in meters
        /*var radiusMeters = OpenLayers.Util.distVincenty(
            new OpenLayers.LonLat([center.x, center.y]),
            new OpenLayers.LonLat([center.x, poly.geometry.bounds.top])
        );
        radiusMeters *= 1000;*/

        //var centerLatLon = new OpenLayers.LonLat([center.x, center.y]);

        var textArea = $('#info-inner');
        var newLine = "&#13;&#10;";
        
        textArea.append("Center" + newLine);
        textArea.append(center.x + "    ");
        textArea.append(center.y + newLine);

        //textArea.append("Radius: " + radiusMeters + newLine);
        textArea.append("Radius: " + radius + " (m)" + newLine);
        textArea.append("----------------------------------" + newLine);

        currentFeature = featureVector;

        console.log(multipolygonToJSON(featureVector));
    }

    //-------------------------------------------------------------------------
    // Convert a multipolygon to a GeoJSON string, with a custom type of
    // CLCircularRegion for use with iOS.
    //-------------------------------------------------------------------------
    function multipolygonToJSON(featureVector){
        // OSM/Google etc units are meters, so convert to degrees
        var center = featureVector.geometry.getCentroid().transform(mercator, geographic);
        var radius = Math.abs(featureVector.geometry.bounds.getWidth()/2);

        //debugger;
        var jsonString = '{"type":"Feature",';
        jsonString += '"id":"' + featureVector.id + '",'
        jsonString += '"properties":{},';
        jsonString += '"geometry":';
        jsonString += '{"type":"CLCircularRegion",';
        jsonString += '"coordinates":[' + center.x + ',' + center.y + '],';
        jsonString += '"radius":' + radius + '}';

        return jsonString;
    }

    function haversine(){
        var R = 6371; // km
        var dLat = (lat2-lat1).toRad();
        var dLon = (lon2-lon1).toRad(); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    /*var drawBoxControl = new OpenLayers.Control.DrawFeature(vector,
        OpenLayers.Handler.RegularPolygon, {
            handlerOptions: {
                sides: 4,
                irregular: true
            },
            displayClass: 'olControlDrawFeaturePolygon'
    });*/

    //-------------------------------------------------------------------------
    // Set up controls to add to  the toolbar.
    //-------------------------------------------------------------------------

    // Polygon
    var drawBoxControl = new OpenLayers.Control.DrawFeature(vectorLayer,
        OpenLayers.Handler.Polygon, 
        {displayClass: 'olControlDrawFeaturePolygon'}
    );

    // Circle
    var drawCircleControl = new OpenLayers.Control.DrawFeature(vectorLayer,
        OpenLayers.Handler.RegularPolygon,
        {displayClass: 'olControlDrawFeaturePoint', handlerOptions: {sides: 30}}
    );

    var modifyControl = new OpenLayers.Control.ModifyFeature(vectorLayer, {
            vertexRenderIntent: 'temporary',
            displayClass: 'olControlModifyFeature'
    });

    // Navigation  control for the purpose of deselection
    var navControl = new OpenLayers.Control({
            displayClass: 'olControlNavigation'
    });

    // Set the call backs
    drawBoxControl.featureAdded = captureLocationDetails;
    drawCircleControl.featureAdded = captureCircleDetails;

    // Add all the controls to the toolbar
    toolbar.addControls([drawBoxControl, drawCircleControl, modifyControl, navControl]);

    if(!map.getCenter()){
        //map.zoomToMaxExtent();
        //var mapCenter = new OpenLayers.Geometry.Point(-41, -174);

        //var mapCenter = new OpenLayers.LonLat(174, -41);
        var mapCenter = new OpenLayers.LonLat(174.7788705825716, -41.28755554304306);   // Frank Kitts park
        //var jim = OpenLayers.Layer.SphericalMercator.forwardMercator(mapCenter);
        //var bob = mapCenter.clone().transform(geographic, mercator);
        map.setCenter(mapCenter.transform(geographic, mercator), 18);
        //map.setCenter([19456298.101936, -5054855.1001368975], 18);
    }

    //-------------------------------------------------------------------------
    // Convert the Vector layer features into GeoJSON.
    //-------------------------------------------------------------------------
    function serializeFeatures(){
        // Iterate through vector layer getting multipolygons(?)
        // create feature collection
        // send to server 
    }
    $('#feature-serialize').click(serializeFeatures);

    //-------------------------------------------------------------------------
    // Test using async http request to get data.
    //-------------------------------------------------------------------------
    function loadXMLDoc(){
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            // Ready state 4 means the request is done
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                $('#info-inner').html(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET","xmlhttp_info.txt",true);
        xmlhttp.send();
    }

    //-------------------------------------------------------------------------
    // Test using JQuery ajax to get data.
    //-------------------------------------------------------------------------
    function loadXMLDoc2(){
        $.get('xmlhttp_info.txt', function(data) {
            $('#info-inner').html(data);
        });
    }
    $('#loadXMLDoc').click(loadXMLDoc2);

    //-------------------------------------------------------------------------
    // Delete all the features on the map.
    //-------------------------------------------------------------------------
    function deleteAllFeatures(){
        if(window.confirm("Delete all features?")){
            vectorLayer.destroyFeatures();
            $('#info-inner').html("");
        }
    }
    $('#feature-delete-all').click(deleteAllFeatures);

    //-------------------------------------------------------------------------
    // Delete the current feature.
    //-------------------------------------------------------------------------
    function deleteCurrentFeature(){
        if(window.confirm("Delete feature?")){
            vectorLayer.destroyFeatures(currentFeature);

            // Need to remove this from the side panel
            //$('#info-inner').html("");
        }
    }
    $('#feature-delete').click(deleteCurrentFeature);
    
    // Temporary code to add a circle to the map
    /*
    var point1 = new OpenLayers.Geometry.Point(170, -38);
    var point2 = new OpenLayers.Geometry.Point(171, -41);
    var point3 = new OpenLayers.Geometry.Point(172, -40);

    var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(point1, 1, 30);   // 1 = 1 degree (radius) so 2 degress circumference
    var feature = new OpenLayers.Feature.Vector(circle);
    vector.addFeatures([feature]);*/
}