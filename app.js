const canvas = document.getElementById('canvas');
const searchBtn = document.getElementById('search');
const input = document.getElementById('count');

const ctx = canvas.getContext('2d');

const squareSize = 10;
const canvasSize = 600;

var centroids = [];
var ceils = [];

class Ceil {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.d = null;
        this.centroid = null;
    }
}


function generateCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


canvas.addEventListener('click', function(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    ctx.fillStyle = 'black';
    ctx.fillRect(x - squareSize / 2, y - squareSize / 2, squareSize, squareSize);

    ceils.push(new Ceil(x, y));
});


function generateCentroids() {
    for (let i = 0; i < input.value; i++) {
        let x = Math.floor(Math.random() * (canvasSize - squareSize));
        let y = Math.floor(Math.random() * (canvasSize - squareSize));

        centroids.push(new Ceil(x, y));
    }
}


function searchDistance(ceil1, ceil2) {
    return Math.sqrt(Math.pow(ceil1.x - ceil2.x, 2) + Math.pow(ceil1.y - ceil2.y, 2));
}


function getRandomColor() {
    return Math.floor(Math.random() * 256);
}


function setColorOfCeils() {
    for (let centroid of centroids) {
        ctx.fillStyle = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
        for (let ceil of ceils) {
            if (ceil.centroid == centroid) {
                ctx.fillRect(ceil.x, ceil.y, squareSize, squareSize);
            }
        }
    }
}


function viewCentroids() {
    ctx.fillStyle = 'red';
    for (let centroid of centroids) {
        ctx.fillRect(centroid.x, centroid.y, squareSize + 5, squareSize + 5);
    }
}


searchBtn.onclick = function() {
    generateCentroids();

    let j = 0;

    while (j != 1000) {
        for (let ceil of ceils) {
            for (let centroid of centroids) {
                let tempDistance = searchDistance(ceil, centroid);
                if (ceil.centroid === null || ceil.d > tempDistance) {
                    ceil.centroid = centroid;
                    ceil.d = tempDistance;
                }
            }
        }

        for (let centroid of centroids) {
            let averageX = 0;
            let averageY = 0;
            let count = 0

            for (let ceil of ceils) {
                if (ceil.centroid == centroid) {
                    averageX += ceil.x;
                    averageY += ceil.y;
                    count++;
                }
            }

            averageX /= count;
            averageY /= count;

            centroid.x = averageX;
            centroid.y = averageY;
        }

        j++;
    }

    viewCentroids()
    setColorOfCeils()
}


generateCanvas();