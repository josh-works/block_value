# README

BlockValue is a crowd-sourced parking/street/building/greenway identifier for cities:

![Label your city!](https://cl.ly/0b280s0S2d0L/BlockValue.jpg)

How much parking does your city have? How many buildings? What's the ratio of parking:building?

All of these are important questions, but it helps to *see* it, so, with BlockValue, you can paint, store your data, and share with neighbors.



### Technology

#### Rails

This is a single-pager, served up and managed with a Rails app.

Data is stored in a Postgres server, to the tune of tens of thousands of data points per few-minute-session on the map.

#### Google Maps

Google maps is the opaque layer beneath the transparent canvas.

I convert the x/y canvas brushstrokes to lat/long, store them in a DB, and then when the map moves or page is loaded, I retrieve all data from the server, convert the lat/long to canvas x/y, and repaint the canvas.

It was a challenge to get data encoded/decoded for the server, and to scale the porportion of the brush strokes based on the zoom level.

#### HTML5 Canvas

The canvas is very delicate, but fascinating. It's transparent, and when I want to move the map around, I reset the z-index on the canvas to force it "below" the google maps layer. Then, when the user toggles back to drawing mode, I reset the z-index to bring it above, and reload the data based on the new x/y data for the map.

The challenging pieces were:

- managing the canvas size. It can't be set in the CSS, or all the brush strokes get distorted
- managing brush stroke width. I have to store the "size" of the brush stroke in the DB and allow me to repaint an appropriately sized path, and it needs to scale up and down in size based on the map zoom level.

#### JavaScript/jQuery

This is allll JavaScript and jQuery. Nothing too complex, but certainly was a learning experience.

#### AJAX

Right now everything is "brute forced" with pulling data from the server. On page load/reload/map-move, I pull all the data in my server and load it up. This quickly turns into tens of thousands of data points.

There's huge performance optimization opportunities here. I'll get to them.

#### Postgres

Storing the data is easy, but caching it, delivering just the right data, protecting against malicious users, getting the average of a given area, etc, is trickier.

More on this later.



### Misc resources I've used throughout the build process

- [my project propsal](https://github.com/turingschool/ruby-submissions/blob/master/1701-b/4module/capstone_projects/project_proposals/josh.md)
- I'm modeling this after [Levels'](https://twitter.com/levelsio) [hoodmaps.com](https://hoodmaps.com/) [(his blogpost)](https://levels.io/hoodmaps/)
