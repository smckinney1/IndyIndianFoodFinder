# Indian Food in Indy

## Table of Contents

* [About](#about)
* [Instructions](#instructions)
* [Code](#code)

## About

This project uses the Google Maps and Foursquare APIs to render data and locations for Indian restaurants around Indianapolis. The restaurants presented are all restaurants I have visited.

## Instructions

The project can be run from [GitHub Pages](https://smckinney1.github.io/MapsProject/).

If running the file locally, simply open the index.html file in your browser.

When running the app, type in a search query in the search box to filter map results. The filter uses "starts with" logic and not "contains" logic.

Running on smaller screens will cause the sidebar to disappear and be replaced with a search box at the top of the screen, and to display the list of all restaurants, users should click the hamburger icon to the left of the search box.

Clicking on a map marker will display an info window containing a photo from the restaurant using the FourSquare API as well as a few items of data from that API. It will also display the restaurant name and address.

If an error occurs loading FourSquare data for the restaurants, on app load a modal will appear showing which restaurants failed to load FourSquare data. In this situation the FourSquare data in the info windows will be replaced by static text indicating an error occurred loading FourSquare data.

The FourSquare icon in each info window is clickable and will bring the user to the restaurant's page on FourSquare.

## Code & Credits

- The favicon for this site was obtained from [freefavicon](https://www.freefavicon.com/).
- The map markers were obtained from the [Maps Icon Collection](https://mapicons.mapsmarker.com/markers/tourism/pin/).
- The map style object is from [Snazzy Maps](https://snazzymaps.com/style/128473/pink).
- I created the error modal by following and modifying the tutorial from Traversy Media's [YouTube](https://www.youtube.com/watch?v=6ophW7Ask_0) video.

Libraries used:
- jQuery
- Knockout.js