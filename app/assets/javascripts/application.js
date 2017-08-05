// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//- require md5

// load gmaps

// globals

function initMap() {
  var golden = {lat: 39.754949, lng: -105.221217};
  map = new google.maps.Map(document.getElementById('google-map'), {
    zoom: 18,
    center: golden,
    mapTypeId: 'satellite'
  });
  google.maps.event.addListenerOnce(map, "projection_changed", function () {
    getAndLoadData()
  })

}

var allUserPaths = []

function getAndLoadData(){
  fetchUserPaths()
}

function fetchUserPaths() {
  $.getJSON({
    url: '/paths',
    success: function (data) {
      allUserPaths = data
      console.log("loaded " +data.length+ " userPaths");
      collectUserPoints()
    }
  })
}


var colors = document.querySelectorAll(".color-picker div")
var mouseDown = false
const canvas = document.querySelector('.map')
const ctx = canvas.getContext('2d')
const userId = md5(Math.random())

var lineCount = 0
var brushSize = 20
ctx.lineJoin = ctx.lineCap = 'round'

const colorKey = {
  'concrete': 'red',
  'setback': 'yellow',
  'building': 'green',
  'sidewalks': 'blue',
  '???': 'black'
}


ctx.fillRect(0,0,10,10)
var currentColor = "#fff00"
ctx.globalAlpha = 0.8;

// userPaths gets sent to server
userPaths = []

function drawShit() {
  if(!mouseDown) return;
  ctx.width = window.innerWidth
  ctx.height = window.innerHeight
  ctx.fillStyle = currentColor
  ctx.strokeStyle = currentColor
  ctx.lineWidth = brushSize
  var offsetX = event.offsetX
  var offsetY = event.offsetY

  var isDrawing, points = []
  points.push({x: offsetX, y: offsetY, category})
  ctx.clearRect(0,0, 5, 5)

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y)
  for (var i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }

  ctx.stroke();
  point = []
  point.x = offsetX
  point.y = offsetY
  var positionOnMap = point2LatLng(point, map)

  var category=$('.color-picker div.active').data('category')
  var lat = positionOnMap.lat()
  var lng = positionOnMap.lng()
  var time = Date.now()
  var sizeRatio = brushSize / map.zoom
  userPaths.push(
      {
        coords: [lat, lng],
        category: category,
        time: time,
        user_id: userId,
        size_ratio: sizeRatio,
        line_count: lineCount
      }
    )
}


// logging shit in my server
function sendToServer(){
  lineCount++
  console.log("sending " +userPaths.length+ " paths to server");
  $.ajax({
    url: '/paths',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    type: 'POST',
    data: JSON.stringify(userPaths)
  }).then(function () {
    userPaths = []
  })
}



function collectUserPoints() {
  for (var i = 0; i < allUserPaths.length; i++) {

    var curPosition = new google.maps.LatLng(allUserPaths[i].lat, allUserPaths[i].long)
    var newMark = latLng2Point(curPosition, map)
    drawUserPaths(newMark, allUserPaths[i].category, allUserPaths[i].size_ratio)
  }
}


const zoomSizeConversionLog = {
  21: 40,
  20: 35,
  19: 19,
  18: 15,
  17: 10,
  16: 4,
  15: 0.75,
  14: 0.75,
  13: 0.75,
  12: 0.75
}

function drawUserPaths(latLng, color, sizeRatio, event) {
  const canvas = document.querySelector('.map')
  const ctx = canvas.getContext('2d')
  // ctx.width = window.innerWidth
  // ctx.height = window.innerHeight
  // console.log("map height: ", $('.map').height());
  // console.log($("window innerHeight: ", window.innerHeight));

  ctx.fillStyle = colorKey[color]
  ctx.strokeStyle = colorKey[color]
  ctx.globalAlpha = 0.8;
  // ctx.lineWidth = zoomSizeConversionLog[map.zoom]
  ctx.lineWidth = sizeRatio * zoomSizeConversionLog[map.zoom]
  ctx.beginPath();
  ctx.moveTo(latLng.x, latLng.y)
  ctx.lineTo(latLng.x, latLng.y)
  ctx.stroke();

}

// convert position on map to coordinates
function latLng2Point(latLng, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}
// end convert position on map to coordinates

function moveBrush(offsetX, offsetY) {
  $('#brush').css('visibility', 'visible')
  $('#brush').css('left', offsetX+"px")
  $('#brush').css('top', offsetY+"px")
}

function hideBrush() {
  $('#brush').css('visibility', 'hidden')
}


function setColor(){
  var color = this.dataset.color
  currentColor = color
  $('#brush').css('background-color', color)
  $('.color-picker div').removeClass('active')
  this.classList.add('active')
  if($('#toggle-draw-move-map')[0].dataset.canvasActive === "true") {
    return
  }
  toggleDrawMove()
}

function setBrushSize() {
  brushSize = this.value
  $('#brush').css('width', this.value)
  $('#brush').css('height', this.value)
  var color = $('.brush-size').attr('background-color')
}

function toggleDrawMove() {
  var canvasActive = $('#toggle-draw-move-map')[0].dataset.canvasActive
  if(canvasActive === "true"){
    $('#toggle-draw-move-map')[0].dataset.canvasActive = "false"
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Draw on Map"
    $('#google-map').css('z-index', 12)
  }
  if(canvasActive === "false") {
    $('#toggle-draw-move-map')[0].dataset.canvasActive = "true"
    $('#google-map').css('z-index', 8)
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Move Map"
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  fetchUserPaths()
}

function undoDraw() {
  console.log("undoing stuff");
  data = {
        user_id: userId,
        line_count: lineCount
        }

  $.ajax({
    url: '/paths',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    type: 'DELETE',
    data: JSON.stringify(data),
    success:function(data){
      console.log("deleted data, line count: ", lineCount);
      fetchUserPaths()
    }
  })
}


$(function () {

  // <move w/shift key>
  var lastDownTarget, canvas;
  document.addEventListener('keydown', function(event) {
    if(lastDownTarget == canvas) {
        if (event.key == "Shift") {
          toggleDrawMove()
        }
    }
  }, false);

  document.addEventListener('keyup', function(event) {
    if(lastDownTarget == canvas) {
        if (event.key == "Shift") {
          toggleDrawMove()
        }
    }
  }, false);
  // </move w/shift key>

  colors.forEach(picker => picker.addEventListener('click', setColor))

  $(".map").on('mousedown', function() {
      mouseDown = true
  })

  $(".map").on('mouseup', function() {
      mouseDown = false
      sendToServer()
  })

  $(".map").on('mouseout', function() {
      mouseDown = false
  })
  $(".map").on('mousemove', drawShit)

  $(".paintbrush-settings input").on('change', setBrushSize)
  $(".paintbrush-settings input").on('mousemove', setBrushSize)
  $('#toggle-draw-move-map').on('click', toggleDrawMove)

  $('.map').on('mouseleave', function() {
    hideBrush()
  })
  $(".map").on('mousemove', function() {
    moveBrush(event.offsetX, event.offsetY)
  })

  $('.undo-draw').on('click', function() {
    undoDraw()
  })

  document.getElementsByClassName('.map').height = window.innerHeight
  document.getElementsByClassName('.map').width = window.innerWidth


})
