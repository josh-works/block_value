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

// load gmaps

// globals

function initMap() {
  var golden = {lat: 39.748327, lng: -105.217697};
  map = new google.maps.Map(document.getElementById('google-map'), {
    zoom: 18,
    center: golden,
    mapTypeId: 'satellite'
  });
}



var colors = document.querySelectorAll(".color-picker div")
var mouseDown = false
const canvas = document.querySelector('.map')
const ctx = canvas.getContext('2d')

// var img = new Image()
// img.src = 'http://www.tricedesigns.com/wp-content/uploads/2012/01/brush2.png'
let brushSize = 20
ctx.lineJoin = ctx.lineCap = 'round'

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

ctx.fillRect(0,0,10,10)
ctx.fillStyle = "#ffff00"
ctx.strokeStyle = "#ffff00"


function drawShit() {
  if(!mouseDown) return;
  var offsetX = event.offsetX
  var offsetY = event.offsetY
  var golden = {lat: 39.748327, lng: -105.217697};
  // var map = new google.maps.Map(document.getElementById('google-map'), {
  //   zoom: 18,
  //   center: golden,
  //   mapTypeId: 'satellite'
  // });
  ctx.lineWidth = brushSize

  var isDrawing, points = []

  points.push({x: offsetX, y: offsetY})
  ctx.clearRect(0,0, 5, 5)

  // let x = offsetX
  // let y = offsetY
  ctx.globalAlpha = 0.3;

  // ctx.globalCompositeOperation = 'source-in'

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y)
  for (var i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }

  $('div.analytics h3').text(
    `
    x= ${offsetX}
    y= ${offsetY}
    `
  )
  point = []
  point.x = offsetX
  point.y = offsetY
  var positionOnMap = point2LatLng(point, map)
  var marker = new google.maps.Marker({
          position: positionOnMap,
          map: map,
        });


  ctx.stroke();
}

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
  ctx.fillStyle = color
  ctx.strokeStyle = color
  $('#brush').css('background-color', color)
  $('.color-picker div').removeClass('active')
  this.classList.add('active')
  toggleDrawMove()
}

function setBrushSize() {
  brushSize = this.value
  $('#brush').css('width', this.value)
  $('#brush').css('height', this.value)
}

function toggleDrawMove() {
  var canvasActive = $('#toggle-draw-move-map')[0].dataset.canvasActive
  if(canvasActive === "true"){
    $('#toggle-draw-move-map')[0].dataset.canvasActive = "false"
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Draw on Map"
    $('#google-map').css('z-index', 12)
  } else {
    $('#toggle-draw-move-map')[0].dataset.canvasActive = "true"
    $('#google-map').css('z-index', 8)
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Move Map"
  }
}

function saveDrawing() {
  // console.log("saving dat $$$");
  ctx.save()
}

function loadDrawing() {
  // console.log("loading that shit");
  ctx.restore()
}

$(function () {


  colors.forEach(picker => picker.addEventListener('click', setColor))

  $(".map").on('mousedown', function() {
      mouseDown = true
  })

  $(".map").on('mouseup', function() {
      mouseDown = false
  })

  $(".map").on('mouseout', function() {
      mouseDown = false
  })
  $(".map").on('mousemove', drawShit)

  $(".paintbrush-settings input").on('change', setBrushSize)
  $(".paintbrush-settings input").on('mousemove', setBrushSize)
  $('#toggle-draw-move-map').on('click', toggleDrawMove)
  $('.map').on('mouseleave', function() {
    saveDrawing()
    hideBrush()
  })
  $(".map").on('mousemove', function() {
    moveBrush(event.offsetX, event.offsetY)
  })


  // convert to pixles




})
