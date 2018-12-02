
      var map, heatmap;
      var socket = io();  
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 42.695252, lng: 23.328843},
          mapTypeId: 'roadmap'
        });
        map.data.setStyle(styleFeature);
        //map.data.addListener('mouseover', mouseInToRegion);
        //map.data.addListener('mouseout', mouseOutOfRegion);

      }
      
      function styleFeature(feature) {

        // delta represents where the value sits between the min and max
        var delta = feature.getProperty('weight');

        

        // determine whether to show this shape or not
        var showRun = 0.75;
        if (feature.getProperty('weight') == null ||
            isNaN(feature.getProperty('weight')) || 
            feature.getProperty('weight') == "") {
          showRun = 0.1;
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
          fillColor: 'hsl(' + (delta * 180 + 180) + ',' + 100 + '%,' + 50 + '%)',
          fillOpacity: showRun,
          //visible: showRow
        };

      }

      function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }
      function changeHeatmap(id) {
        socket.emit('heatmap-change', id)
      }
      function changePolygon(id) {
        socket.emit('polygon-change', id)
      }
      function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

      function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
      }

      function changeOpacity() {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
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
      })

      socket.on('intiPolygon', function (data){
        map.data.addGeoJson(data);
      })

      socket.on('setData', function (data) {
        let result = []
        data.map((elem)=>{result.push({location: new google.maps.LatLng(elem.lat,elem.lng), weight: elem.weight})})
        if(heatmap)
          heatmap.setMap(null)
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: result,
          map: map,
          radius: 25  
        });
      })
