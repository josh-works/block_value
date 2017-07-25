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

function initMap() {
  var golden = {lat: 39.748327, lng: -105.217697};
  var map = new google.maps.Map(document.getElementById('google-map'), {
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
let brushSize = 10
ctx.lineJoin = ctx.lineCap = 'round'

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

ctx.fillRect(0,0,10,10)
ctx.fillStyle = "#ffff00"
ctx.strokeStyle = "#ffff00"


function drawShit() {
  if(!mouseDown) return;
  ctx.lineWidth = brushSize

  var isDrawing, points = []

  points.push({x: event.offsetX, y: event.offsetY})
  ctx.clearRect(0,0, 5, 5)

  // let x = event.offsetX
  // let y = event.offsetY
  ctx.globalAlpha = 0.3;

  // ctx.globalCompositeOperation = 'source-in'

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y)
  for (var i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }

  $('div.analytics h3').text(
    `
    x= ${event.offsetX}
    y= ${event.offsetY}
    `
  )
  ctx.stroke();
    // send this shit to server eventually
  moveBrush(event.offsetX, event.offsetY)
}


function setColor(){
  var color = this.dataset.color
  ctx.fillStyle = color
  ctx.strokeStyle = color
  $('#brush').css('background-color', color)
  $('.color-picker div').removeClass('active')
  this.classList.add('active')
}

function setBrushSize() {
  brushSize = this.value
  $('#brush').css('width', this.value)
  $('#brush').css('height', this.value)
}

function moveBrush(x, y) {
  $('#brush').css('left', x)
  $('#brush').css('top', y)
}

function toggleDrawMove() {
  if(this.dataset.canvasActive === "true"){
    this.dataset.canvasActive = "false"
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Draw on Map"


    $('#google-map').css('z-index', 12)
  } else {
    this.dataset.canvasActive = "true"
    $('#google-map').css('z-index', 8)
    var text = $('#toggle-draw-move-map > span')
    text[0].innerText = "Move Map"

  }
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

  // $(".map").on('mousemove', moveBrush)

})
