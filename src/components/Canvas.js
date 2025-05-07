import React, { useEffect, useRef } from 'react';
import './style.css';

const Canvas = () => {
    const canvasRef = useRef(null);
    const particlesArray = [];
    let hue = 0;

    const handleParticles = (ctx) => {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw(ctx);
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = particlesArray[i].color;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
            if (particlesArray[i].size <= 0.3) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    };

    const animate = (ctx) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        handleParticles(ctx);
        hue += 2;
        requestAnimationFrame(() => animate(ctx));
    };

    const Particle = function (mouse) {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ',100%, 50%)';
    };

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    };

    Particle.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const mouse = {
            x: undefined,
            y: undefined,
        };

        canvas.addEventListener('click', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
            for (let index = 0; index < 12; index++) {
                particlesArray.push(new Particle(mouse));
            }
        });

        canvas.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
            for (let index = 0; index < 3; index++) {
                particlesArray.push(new Particle(mouse));
            }
        });

        animate(ctx);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        return () => {
            canvas.removeEventListener('click', () => {});
            canvas.removeEventListener('mousemove', () => {});
            window.removeEventListener('resize', () => {});
        };
    });

    return <canvas id='canvas1' ref={canvasRef} />;
};

export default Canvas;