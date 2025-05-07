const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let hue = 0;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

const mouse = {
    x: undefined,
    y: undefined,
}
canvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let index = 0; index < 12; index++) {
        particlesArray.push(new Particle());        
    }
});

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let index = 0; index < 3; index++) {
        particlesArray.push(new Particle());        
    }
})

class Particle {
   constructor () {
     this.x = mouse.x;
     this.y = mouse.y;
     this.size = Math.random() * 15 + 1; 
     this.speedX = Math.random() * 3 - 1.5;
     this.speedY = Math.random() * 3 - 1.5;
     this.color = 'hsl(' + hue + ',100%, 50%)'
   }
   update () {
     this.x += this.speedX;
     this.y += this.speedY;
     // if (this.size > 0.2) this.size += 0.1;   // increasing particles  // comment out both to remain the original size
     if (this.size > 0.2) this.size -= 0.1;   // decreasing particles  // comment out both to remain the original size
   }
   draw () {
        ctx.fillStyle = this.color;   // to draw // ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0 , Math.PI * 2);
        ctx.fill();
   }
}

function handleParticles () {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for(let j = i; j < particlesArray.length; j++) { // to calculate distance between particles
           const dx = particlesArray[i].x - particlesArray[j].x; //pythagorean theorem
           const dy = particlesArray[i].y - particlesArray[j].y;
           const distance = Math.sqrt(dx * dx + dy * dy);
           if (distance < 150) {   // the distance line lenght between 2 particles
            ctx.beginPath();
            ctx.strokeStyle = particlesArray[i].color;
            // ctx.lineWidth = particlesArray[i].size / 10;
            ctx.lineWidth = 0.3;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath() ;
           }
        }
        // if (particlesArray[i].size > 27) {   // if gets bigger than that
        if (particlesArray[i].size <= 0.3) { 
            particlesArray.splice(i, 1);   // remove small particles
            i--;
        }
    }
}

function animate () {
    ctx.clearRect(0, 0, canvas. width, canvas.height);
    // ctx.fillStyle = 'rgb(0,0,0,0.09)'
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    hue +=2; // gradual hue change // hue++ or    hue += 5; // fast hue changes
    requestAnimationFrame(animate);  // calls a function once passed as argument
}
 
animate();

