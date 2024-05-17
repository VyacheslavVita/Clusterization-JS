const canvas = document.getElementById('canvas');
const searchBtn = document.getElementById('search');
const input = document.getElementById('count');

const ctx = canvas.getContext('2d');

const squareSize = 20;
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
        for (let ceil of ceils) {
            if (ceil.centroid === null) {
                centroids.push(new Ceil(ceil.x, ceil.y));
                ceil.centroid = centroids[centroids.length - 1];
                break;
            }
        }
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
                ctx.fillRect(ceil.x - squareSize / 2, ceil.y - squareSize / 2, squareSize, squareSize);
            }
        }
    }
}


searchBtn.onclick = function() {
    generateCentroids();

    const threshould = 0.001;

    while (true) {
        for (let ceil of ceils) {
            for (let centroid of centroids) {
                let tempDistance = searchDistance(ceil, centroid);
                if (ceil.centroid === null || ceil.d > tempDistance) {
                    ceil.centroid = centroid;
                    ceil.d = tempDistance;
                }
            }
        }

        let previousCentroids = centroids.map(centroid => ({ x: centroid.x, y: centroid.y }));

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

            for (let ceil of ceils) {
                if (ceil.centroid == centroid) {
                    ceil.d = searchDistance(ceil, centroid);
                }
            }
        }

        let centroidsStabilized = true;
        for (let i = 0; i < centroids.length; i++) {
            if (Math.abs(centroids[i].x - previousCentroids[i].x) > threshould || Math.abs(centroids[i].y - previousCentroids[i].y) > threshould) {
                centroidsStabilized = false;
                break;
            }
        }

        if (centroidsStabilized) { break; }
    }
    setColorOfCeils()
    console.log(centroids);
}


generateCanvas();