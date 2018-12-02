
      var map;
      var heatmap_vissible = true;
      var opacity = 0.75, gradient = 0;
      var socket = io();  
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 42.695252, lng: 23.328843},
          mapTypeId: 'roadmap'
        });
        map.data.setStyle(styleFeature);
        socket.emit('map-loaded')
        //map.data.addListener('mouseover', mouseInToRegion);
        //map.data.addListener('mouseout', mouseOutOfRegion);

      }
      
      function styleFeature(feature) {

        // delta represents where the value sits between the min and max
        var delta = feature.getProperty('weight');

        

        // determine whether to show this shape or not
        var f_opacity = opacity;
        if (feature.getProperty('weight') == null ||
            isNaN(feature.getProperty('weight')) || 
            feature.getProperty('weight') == "") {
          f_opacity = 0.1;
          delta = 0;
        }

         var outlineWeight = 0.5, zIndex = 1;
        // if (feature.getProperty('state') === 'hover') {
        //   outlineWeight = zIndex = 2;
        // }
        //console.log(color)
        return {
          strokeWeight: outlineWeight,
          strokeColor: '#fff',
          zIndex: zIndex,
          fillColor: 'hsl(' + ((1 - delta) *120 - gradient) + ',' + 100 + '%,' + 50 + '%)',
          fillOpacity: f_opacity,
          visible: heatmap_vissible
        };

      }
      function search(){
        socket.emit('request_analysis', "friendly neighbourhood")
      }
      function toggleHeatmap() {
        heatmap_vissible ^= 1;
        map.data.setStyle(styleFeature);
      }
      function changePolygon(id) {
        socket.emit('polygon-change', id)
        document.getElementById('load').style.visibility = "visible";
      }
      function changeGradient() {
        gradient = gradient == 120 ? 0 : 120;
        map.data.setStyle(styleFeature);
      }

      function changeOpacity() {
        opacity = opacity == 0.4 ? 0.75 : 0.4;
        map.data.setStyle(styleFeature);
      }
      socket.on('setGsonData', function (data) {
        map.data.forEach(function(feature) {
          feature.setProperty('weight', 0);
        })
       
        for(let el in data){
          //console.log(el);
          map.data.forEach(function(feature) {
            if(feature.getProperty('RegName') == el){
                //console.log('change');
                  feature.setProperty('weight', data[el])
            }
          })
        }
        console.log(document.getElementById('load'))
        document.getElementById('load').style.visibility = "hidden";
      })

      socket.on('intiPolygon', function (data){
        map.data.addGeoJson(data);
      })
