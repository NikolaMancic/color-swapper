// get elements

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var output = document.getElementById('output');
var oldColor = document.getElementById('oldColor');
var newColor = document.getElementById('newColor');

var redSlider = document.getElementById('redSlider');
var greenSlider = document.getElementById('greenSlider');
var blueSlider = document.getElementById('blueSlider');
var alphaSlider = document.getElementById('alphaSlider');

var button = document.getElementById('submit');

var image = new Image();

var imageData;
var uniqueColors;
var oldColorValue;
var newColorValue;

var Color = function(r, g, b, a) {
    'use strict';

    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
};

Color.prototype.toString = function() {
    'use strict';

    // map alpha from 0-255 to 0-1
    var alpha = 1 / 255 * this.alpha;

    return 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + alpha + ')';
};

function findColor(array, color) {
    'use strict';

    var len = array.length;

    for(var i = 0; i < len; i++) {
        if(array[i].red == color.red &&
            array[i].green == color.green &&
            array[i].blue == color.blue &&
            array[i].alpha == color.alpha) {
            return i;
        }
    }

    return -1;
}

function scanColors(allElements) {
    'use strict';

    // clear old array
    var uniqueElements = [];

    var len = allElements.length;

    for(var i = 0; i < len; i += 4) {
        var red = allElements[i];
        var green = allElements[i + 1];
        var blue = allElements[i + 2];
        var alpha = allElements[i + 3];

        var color = new Color(red, green, blue, alpha);

        if(findColor(uniqueElements, color) == -1) {
            uniqueElements.push(color);
        }
    }

    return uniqueElements;
}

function replaceColor(array, oldColor, newColor) {
    'use strict';

    var len = array.length;

    for(var i = 0; i < len; i += 4) {
        var red = array[i];
        var green = array[i + 1];
        var blue = array[i + 2];
        var alpha = array[i + 3];

        if(red == oldColor.red && green == oldColor.green &&
            blue == oldColor.blue && alpha == oldColor.alpha) {
            array[i] = newColor.red;
            array[i + 1] = newColor.green;
            array[i + 2] = newColor.blue;
            array[i + 3] = newColor.alpha;
        }
    }
}

function printColors(colors, output) {
    'use strict';

    // clear output div
    output.innerHTML = '';

    var len = colors.length;

    for(var i = 0; i < len; i++) {
        var tile = document.createElement('div');
        tile.id = i.toString();
        tile.className = 'colorTile';
        tile.style.backgroundColor = colors[i].toString();

        // set the div's content to a carriage return
        // forces the browser to display the div with no visible content
        tile.innerHTML = '\u0013';

        tile.addEventListener('click', function() {
            onColorSelect(this.id);
        }, false);

        output.appendChild(tile);
    }
}

function onSliderChange() {
    'use strict';

    var red = redSlider.value;
    var green = greenSlider.value;
    var blue = blueSlider.value;
    var alpha = alphaSlider.value;

    newColorValue = new Color(red, green, blue, alpha);
    newColor.style.backgroundColor = newColorValue.toString();
}

function onColorSelect(id) {
    'use strict';

    oldColorValue = uniqueColors[id];
    oldColor.style.background = oldColorValue.toString();
}

button.addEventListener('click', function(e) {
    'use strict';

    e.preventDefault();
    replaceColor(imageData.data, oldColorValue, newColorValue);

    // refresh
    ctx.putImageData(imageData, 0, 0);
    uniqueColors = scanColors(imageData.data, uniqueColors);
    printColors(uniqueColors, output);
}, false);

image.addEventListener('load', function() {
    'use strict';

    // draw image and get pixels
    ctx.drawImage(image, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    uniqueColors = scanColors(imageData.data);
    printColors(uniqueColors, output);

    // call event manually to set color preview
    onSliderChange();
    onColorSelect(0);
});

image.src = 'ship.png';
