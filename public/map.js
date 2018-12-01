
      // This example requires the Visualization library. Include the libraries=visualization
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

      var map, heatmap;
      var socket = io();  
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 42.695252, lng: 23.328843},
          mapTypeId: 'roadmap'
        });
      }
      
      function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }
      function changeHeatmap(id) {
        socket.emit('heatmap-change', id)
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
