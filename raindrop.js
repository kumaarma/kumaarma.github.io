(function (window, document) {
    var Vector2 = (function () {
      function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }
      return Vector2;
    })();

    Vector2.prototype.add = function (addend) {
      this.x += addend.x;
      this.y += addend.y;
    };

    var RainDrop = (function () {
      function RainDrop(parent) {
        this.size = 2;
        this.parent = parent;
        this.init();
      }
      return RainDrop;
    })();

    RainDrop.prototype.init = function () {
      this.life = 0;
      this.ttl = Math.random() * 500 + 300;
      this.position = new Vector2(Math.random() * window.innerWidth, 0);
      this.velocity = new Vector2(
        0.5 - Math.random() * 1,
        Math.random() * 1 + 0.2
      );
      this.terminalVelocity = 8;
    };

    RainDrop.prototype.update = function () {
      if (
        this.position.x > window.innerWidth ||
        this.position.x < -this.size ||
        this.life > this.ttl
      )
        this.init();
      if (this.position.y > this.parent.floor) {
        this.position.y = this.parent.floor - this.size;
        this.velocity.y *= -0.2 - Math.random() * 0.2;
      }
      this.life++;
      this.position.add(this.velocity);
      this.velocity.y += 0.1;
    };

    var Rain = (function () {
      function Rain(args) {
        this.props = args;
        this.rainDrops = [];
        this.init();
      }
      return Rain;
    })();

    Rain.prototype.init = function () {
      this.createCanvas();
      this.resize();
      this.loop();
    };

    Rain.prototype.resize = function () {
      var attr =
        "position: absolute; z-index: 0; top: 0; left: 0; height: 100vh; width: 100vw;";

      this.canvas.setAttribute("style", attr);

      this.dimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      this.canvas.width = this.dimensions.width;
      this.canvas.height = this.dimensions.height;
      this.floor = this.dimensions.height * 0.7;
    };

    Rain.prototype.createCanvas = function () {
      this.canvas = document.createElement("canvas");

      this.ctx = this.canvas.getContext("2d");

      document.body.appendChild(this.canvas);
    };

    Rain.prototype.draw = function () {
      this.ctx.fillStyle = this.props.backgroundColor;
      this.ctx.fillRect(0, 0, this.dimensions.width, this.floor);
      for (var i = 0, len = this.rainDrops.length; i < len; i++) {
        var rainDrop = this.rainDrops[i];
        rainDrop.update();
        this.ctx.fillStyle = this.props.rainColor;
        this.ctx.fillRect(
          rainDrop.position.x,
          rainDrop.position.y,
          rainDrop.size,
          rainDrop.size
        );
      }
      this.reflect();
    };

    Rain.prototype.reflect = function () {
      var grad = this.ctx.createLinearGradient(
        this.dimensions.width / 2,
        this.floor * 0.6,
        this.dimensions.width / 2,
        this.floor
      );
      grad.addColorStop(0, "rgba(20,30,40,1)");
      grad.addColorStop(1, "rgba(20,30,40,0)");
      this.ctx.save();
      this.ctx.scale(1, -1);
      this.ctx.translate(0, this.floor * -2);
      this.ctx.filter = "blur(2px) saturate(150%)";
      this.ctx.drawImage(
        this.canvas,
        0,
        0,
        this.dimensions.width,
        this.floor,
        0,
        0,
        this.dimensions.width,
        this.floor
      );
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.dimensions.width, this.floor);
      this.ctx.restore();
    };

    Rain.prototype.loop = function () {
      var timeout,
        self = this;
      if (self.rainDrops.length < self.props.rainDropCount) {
        timeout = window.setTimeout(function () {
          self.rainDrops.push(new RainDrop(self));
        }, Math.random() * 200);
      } else if (timeout) {
        timeout = null;
        window.clearTimeout(timeout);
      }
      self.draw();
      window.requestAnimationFrame(self.loop.bind(self));
    };

    window.onload = function () {
      var args = {
        rainDropCount: 500,
        rainColor: "rgba(150,180,255,0.8)",
        backgroundColor: "rgba(10,10,10,0.5)",
      };

      var rain = new Rain(args);

      window.onresize = function () {
        rain.resize();
      };
    };

    window.requestAnimationFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
  })(this, document);