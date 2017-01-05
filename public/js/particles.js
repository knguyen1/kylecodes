/**
 * Created by Khoa on 1/3/2017.
 */

"use strict";

//requestAnimationFrame
window.requestAnimationFrame(function() {
    //arghh... all these dang different browser standards
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(cb) {
            window.setTimeout(cb, 1000 / 60);
        };
});

/**
 * Vector Class
 **/

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.scale = function(v, s) {
    return v.clone().scale(s);
};

Vector.random = function() {
    return new Vector(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    );
};

Vector.prototype = {
    set: function(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function() {
        return Math.sqrt(this.lengthSq());
    },

    lengthSq: function() {
        return this.x * this.x + this.y * this.y;
    },

    normalize: function() {
        const m = Math.sqrt(this.lengthSq());
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    angleTo: function(v) {
        const dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    },

    distanceTo: function(v) {
        const dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function(v) {
        const dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    lerp: function(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    },

    clone: function() {
        return new Vector(this.x, this.y);
    },

    toString: function() {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};

/**
 * Particle class
 **/

function Particle(x, y, radius) {
    Vector.call(this, x, y);
    this.radius = radius;

    this._latest = new Vector();
    this._speed  = new Vector();
}

Particle.prototype = (function(o) {
    let s = new Vector(0, 0), p;
    for (p in o) s[p] = o[p];
    return s;
})({
    addSpeed: function(d) {
        this._speed.add(d);
    },

    //get a new coordinate based on the coordinates and speed of the particle
    update: function() {
        if (this._speed.length() > 12) this._speed.normalize().scale(12);

        this._latest.set(this);
        this.add(this._speed);
    }
});

//PAGE INITIALIZATIONS
(function() {
    //configurations
    const BACKGROUND_COLOUR = 'rgba(11, 51, 56, 1)';
    const PARTICLE_RADIUS = 1;
    const PARTICLE_NUM = 80;

    //variables
    let canvas, context, bufferCanvas, bufferContext, screenWidth, screenHeight,
        particles = [],
        gradient;

    /** EVENT LISTENERS **/
    function resize(e) {
        screenWidth = canvas.width = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;
        bufferCanvas.width = screenWidth;
        bufferCanvas.height = screenHeight;

        context = canvas.getContext('2d');
        bufferContext = bufferCanvas.getContext('2d');

        const cx = canvas.width * 0.50;
        const cy = canvas.height * 0.50;

        gradient = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    }

    /** FUNCTIONS **/
    function addParticle(num) {
        let i, p;
        for(i = 0; i < num; i++) {
            p = new Particle(
                Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
                Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
                PARTICLE_RADIUS
            );
            p.addSpeed(Vector.random());
            particles.push(p);
        }
    }

    function removeParticle(num) {
        if(particles.length < num)
            num = particles.length;

        for(let i = 0; i < num; i++)
            particles.pop();
    }

    /** INITIALIZE **/
    canvas = document.getElementById('particles');
    bufferCanvas = document.createElement('canvas');

    window.addEventListener('resize', resize, false);
    document.getElementById('moreDotsClick').addEventListener('click', function(){
        addParticle(10);
    }, false);
    resize(null);

    addParticle(PARTICLE_NUM);

    //start animation
    const loop = function() {
        let i, len, p;

        context.save();
        context.fillStyle = BACKGROUND_COLOUR;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.fillStyle = gradient;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        bufferContext.save();
        bufferContext.globalCompositeOperation = 'destination-out';
        bufferContext.globalAlpha = 0.35;
        bufferContext.fillRect(0, 0, screenWidth, screenHeight);
        bufferContext.restore();

        len = particles.length;
        bufferContext.save();
        bufferContext.fillStyle = bufferContext.strokeStyle = '#fff';
        bufferContext.lineCap = bufferContext.lineJoin = 'round';
        bufferContext.lineWidth = PARTICLE_RADIUS * 2;
        bufferContext.beginPath();

        for(i = 0; i < len; i++) {
            p = particles[i];

            //bounce off walls
            if(p.x + p._speed.x < 0 || p.x + p._speed.x > screenWidth)
                p._speed.x = -p._speed.x;

            if(p.y + p._speed.y < 0 || p.y + p._speed.y > screenHeight)
                p._speed.y = -p._speed.y;

            //get new coordinates to draw
            p.update();

            bufferContext.moveTo(p.x, p.y);
            bufferContext.lineTo(p._latest.x, p._latest.y);
        }

        bufferContext.stroke();
        bufferContext.beginPath();

        for (i = 0; i < len; i++) {
            p = particles[i];
            bufferContext.moveTo(p.x, p.y);
            bufferContext.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        }
        bufferContext.fill();
        bufferContext.restore();

        context.drawImage(bufferCanvas, 0, 0);
        requestAnimationFrame(loop);
    };
    loop();
})();