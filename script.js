//set up 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');  //canvas context

canvas.width = 1800;
canvas.height = 800;

c.fillRect(0, 0, canvas.width, canvas.height); //fillRect(x: number, y: number, w: number, h: number): pinta


// ------------- CLASSES ------------//

const gravedad = 0.99999;

//clase Sprite 
class Sprite {
    constructor({ position, imagenSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesTranscurridos = 0;
        this.framesHold = 5;
        this.offset = offset;
    }
    pintar() {
        c.drawImage(
            this.imagen,
            this.framesCurrent * (this.imagen.width / this.framesMax),
            0,
            this.imagen.width / this.framesMax,
            this.imagen.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.imagen.width / this.framesMax) * this.scale,
            this.imagen.height * this.scale
        )
    }

    update() {
        this.pintar();
        this.framesTranscurridos++;

        if (this.framesTranscurridos % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }

        }
    }
}
class Luchador extends Sprite {
    constructor({ position, velocidad, height, width, color, hp, imagenSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites }) {
        super({ position, imagenSrc, scale, framesMax, offset });
        this.position = position;
        this.velocidad = velocidad;
        this.width = width;
        this.height = height;
        this.UltimaTeclaHorizontal;
        this.UltimaTeclaVertical;
        this.ataqueHitbox = {
            position: {
                x: this.position.x - this.width / 2,
                y: this.position.y
            },
            width: 250,
            height: 30
        }
        this.empuje = false;
        this.color = color;
        this.isAttacking;
        this.hp = hp;
        this.siendoEmpujado = false;
        this.habilidadUsada = false;

        this.framesCurrent = 0;
        this.framesTranscurridos = 0;
        this.framesHold = 5;
        this.imagen.src = imagenSrc;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].imagen = new Image();
            sprites[sprite].imagen.src = sprites[sprite].imagenSrc;

        }
        this.tieneSalto = true;
    }

    update() {
        this.pintar();
        this.framesTranscurridos++;

        if (this.framesTranscurridos % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }

        // si el jugador está en el suelo, para de bajar (velocidad.y=0), si no, le afecta la gravedad (+0.7/cada animate)
        if (this.position.y + this.height + this.velocidad.y >= canvas.height - 75) {
            this.velocidad.y = 0;
        } else {
            this.velocidad.y += gravedad;
        }
        this.position.y += this.velocidad.y; // Actualiza la posición y
        this.position.x += this.velocidad.x; // Actualiza la posición x

        // Actualiza la posición de la hitbox junto con la posición del jugador
        this.ataqueHitbox.position.x = this.position.x - 100; //(width hitbox = 250, width daga = 50, sale 100 a cada lado)
        this.ataqueHitbox.position.y = this.position.y;
    }

    ataque() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 350);
    }

}

//clase fireball
class Fireball {
    constructor({ position, velocidad, height, width, color, imagenSrc }) {
        this.position = position;
        this.velocidad = velocidad;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isAttacking = false; // Indica si la fireball está en vuelo
        this.fireballDisparada = false;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
    }

    pintar() {
        if (this.isAttacking) {
            c.drawImage(this.imagen, this.position.x, this.position.y, this.width, this.height);
        } else {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    update() {
        if (this.isAttacking) {
            this.position.x += this.velocidad.x;
            this.pintar();
        }
    }

    disparar(x, y) {
        // Inicia el disparo de la fireball desde la posición x, y
        this.position.x = x;
        this.position.y = y;
        this.isAttacking = true;
    }
    resetFireballDisparada() {
        this.fireballDisparada = false;
        console.log("fireballDisparada = ", this.fireballDisparada);
    }
}

const daga = new Luchador({
    position: {
        x: 0,
        y: 0
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 150,
    width: 50,
    color: 'red',
    hp: 6,
    imagenSrc: "./img/dagaQuieto2.png",
    framesMax: 7,
    scale: 3.2,
    offset: {
        x: 240,
        y: 0
    },
    sprites: {
        quieto: {
            imagenSrc: "./img/dagaQuieto2.png",
            framesMax: 7,
        },
        quietoInv: {
            imagenSrc: "./img/dagaQuietoIzq.png",
            framesMax: 10,
        },
        ataque1: {
            imagenSrc: "./img/dagaAtaque1.png",
            framesMax: 7,
        },
    }
});
daga.pintar();

const mago = new Luchador({
    position: {
        x: 1750,
        y: 0
    },
    velocidad: {
        x: 0,
        y: 0
    },
    height: 150,
    width: 50,
    color: 'blue',
    hp: 2,
    imagenSrc: "./img/MagoQuietoIzq.png",
    framesMax: 8,
    scale: 3.2,
    offset: {
        x: 380,
        y: 177
    },
    sprites: {
        quieto: {
            imagenSrc: "./img/MagoQuietoIzq.png",
            framesMax: 10,
        },
        quietoInv: {
            imagenSrc: "./img/MagoQuieto.png",
            framesMax: 10,
        },
    }
});
mago.pintar();

const fireball = new Fireball({
    position: {
        x: mago.position.x,
        y: mago.position.y + mago.height,
    },
    velocidad: {
        x: -6,
        y: 0,
    },
    height: 10,
    width: 30,
    color: 'yellow',
    imagenSrc: "./img/fireball.png",

});
fireball.pintar();
const fireballs = [];

const fondo = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imagenSrc: "./img/fondo.gif"
});

const dagaVidas = new Sprite({
    position: {
        x: 50,
        y: 20,
    },
    imagenSrc: "./img/dagaVidas.png",
});

const magoVidas = new Sprite({
    position: {
        x: 1500,
        y: 20,
    },
    imagenSrc: "./img/mago2vidas.png",
});


var contadorr = 70;
function animate() { //esta funcion se esta llamando a si misma, es infinita hasta que acabe el juego
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height); //pinta el fondo negro
    fondo.update();
    daga.update();
    mago.update();
    dagaVidas.update();
    magoVidas.update();
    daga.velocidad.x = 0;
    mago.velocidad.x = 0;

    if (daga.position.x < mago.position.x) {
        if (daga.siendoEmpujado && !mago.habilidadUsada && daga.position.x > 0) {
            daga.velocidad.x = -19
        }
    }
    else {
        if (daga.siendoEmpujado && !mago.habilidadUsada && daga.position.x + daga.width < canvas.width) {
            daga.velocidad.x = 19
        }
    }
    // Movilidad de daga
    if (!daga.siendoEmpujado) {
        if (keys.d.presionada && daga.UltimaTeclaHorizontal === "d" && daga.position.x + daga.width < canvas.width) {
            daga.velocidad.x = 5;
        } else if (keys.a.presionada && daga.UltimaTeclaHorizontal === "a" && daga.position.x > 0) {
            daga.velocidad.x = -5;
        }
    }


    if (daga.position.y + daga.height + daga.velocidad.y >= canvas.height - 75 && keys.w.presionada == true && daga.UltimaTeclaVertical === "w") {
        daga.velocidad.y = -20;

    } else if (daga.velocidad.y > 0 && keys.s.presionada == true && daga.UltimaTeclaVertical === "s") {
        daga.velocidad.y = daga.velocidad.y = 20;
    }

    // Movilidad de MAGO
    if ((keys.ArrowRight.presionada && mago.UltimaTeclaHorizontal === "ArrowRight" && mago.position.x + mago.width < canvas.width)) {
        mago.velocidad.x = 4;
    } else if (keys.ArrowLeft.presionada && mago.UltimaTeclaHorizontal === "ArrowLeft" && mago.position.x > 0) {
        mago.velocidad.x = -4;
    }
    if (mago.velocidad.y == 0) {
        mago.tieneSalto = true;
        contadorr = 100;
    } else if (contadorr <= 0) {
        mago.tieneSalto = false;
    }
    if (mago.position.y > 0 && mago.tieneSalto && keys.ArrowUp.presionada == true && mago.UltimaTeclaVertical === "ArrowUp") {
        mago.velocidad.y = -11;
        contadorr--;
        console.log(contadorr);
    }

    else if (mago.velocidad.y > 0 && keys.ArrowDown.presionada == true && mago.UltimaTeclaVertical === "ArrowDown") {
        mago.velocidad.y = mago.velocidad.y = 22;
    }
    // UPDATE DE LAS Fireballs
    // Actualiza y muestra todas las fireballs
    for (let i = 0; i < fireballs.length; i++) {
        fireballs[i].update();
        if (fireballs[i].position.x < 0) {
            // Elimina las fireballs que han salido del lienzo
            fireballs.splice(i, 1);
            i--;
        }
    }
    // detectar colision
    if (daga.ataqueHitbox.position.x + daga.ataqueHitbox.width >= mago.position.x
        && daga.ataqueHitbox.position.x <= mago.position.x + mago.width
        && daga.ataqueHitbox.position.y + daga.ataqueHitbox.height >= mago.position.y
        && daga.ataqueHitbox.position.y <= mago.position.y + mago.height
        && daga.isAttacking) {

        daga.isAttacking = false;
        mago.hp -= 1;

        if (mago.hp == 1) {
            magoVidas.imagen.src = "./img/mago1vida.png";
            if (daga.position.x > canvas.width / 2) {
                mago.position.x = 0;
                mago.position.y = 0;
            } else {
                mago.position.x = canvas.width - mago.width;
                mago.position.y = 0;
            }
        }

        if (mago.hp <= 0) {
            window.location.href = 'finales/DagaGana.html';

        }
        console.log(mago.hp);
    }



    //colision fireball
    for (let i = 0; i < fireballs.length; i++) {
        const fireball = fireballs[i];

        if (
            fireball.position.x + fireball.width >= daga.position.x &&
            fireball.position.x <= daga.position.x + daga.width &&
            fireball.position.y + fireball.height >= daga.position.y &&
            fireball.position.y <= daga.position.y + daga.height &&
            fireball.isAttacking
        ) {
            daga.hp -= 1;
            console.log("daga hp = ", daga.hp);
            fireballs.splice(i, 1); // Elimina la fireball al impactar
            i--;

            if (daga.hp == 3) {
                dagaVidas.imagen.src = "./img/daga1vida.png";
                if (mago.position.x > canvas.width / 2) {
                    daga.position.x = 0;
                    daga.position.y = 0;
                } else {
                    daga.position.x = canvas.width - daga.width;
                    daga.position.y = 0;
                }
            }
            if (daga.hp <= 0) {
                window.location.href = 'finales/GanaMago.html';
            }
        }
    }
    //cambio de imagen para que siempre se esten mirando
    if (mago.position.x < daga.position.x) {
        mago.imagen = mago.sprites.quietoInv.imagen;
    } else {
        mago.imagen = mago.sprites.quieto.imagen;
    }

    if (!daga.isAttacking) {
        if (daga.position.x < mago.position.x) {
            daga.imagen = daga.sprites.quieto.imagen;
        } else {
            daga.imagen = daga.sprites.quietoInv.imagen;
        }
    }

}
// ----------------movilidad ---------------//
const keys = {
    a: {
        presionada: false
    },
    d: {
        presionada: false
    },
    w: {
        presionada: false
    },
    s: {
        presionada: false
    },
    l: {
        presionada: false
    },
    ArrowRight: {
        presionada: false
    },
    ArrowLeft: {
        presionada: false
    },
    ArrowUp: {
        presionada: false
    },
    ArrowDown: {
        presionada: false
    },
    k: {
        presionada: false
    },
    g: {
        presionada: false
    }
}


let ultimaVezDisparoFireball = 0;
let ultimoataque = 0;

var contador = 3;

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "d":
        case "D":
            keys.d.presionada = true;
            daga.UltimaTeclaHorizontal = "d";
            break;
        case "a":
        case "A":
            keys.a.presionada = true;
            daga.UltimaTeclaHorizontal = "a";
            break;
        case "w":
        case "W":

            keys.w.presionada = true;
            daga.UltimaTeclaVertical = "w";
            break;
        case "s":
        case "S":
            keys.s.presionada = true;
            daga.UltimaTeclaVertical = "s";
            break;
        case "g":
        case "G":
            var tiempoActual2 = Date.now(); // Obtiene el tiempo actual
            if (tiempoActual2 - ultimoataque >= 800) {
                ultimoataque = tiempoActual2;  // Actualiza el tiempo del último disparo

                keys.g.presionada = true;
                daga.ataque();
                daga.isAttacking = true;
                daga.imagen = daga.sprites.ataque1.imagen;
                daga.framesMax = daga.sprites.ataque1.framesMax;

                setTimeout(function () {
                    daga.isAttacking = false;
                    daga.framesMax = daga.sprites.quieto.framesMax;
                    daga.imagen = (daga.position.x < mago.position.x) ? daga.sprites.quietoInv.imagen : daga.sprites.quieto.imagen;
                }, 350); // Cambié 350 a 400 para que coincida con el tiempo del ataque
            }
            break;

        case "l":
        case "L":
            var tiempoActual = Date.now(); // Obtiene el tiempo actual
            if (mago.position.x >= daga.position.x) {
                if (tiempoActual - ultimaVezDisparoFireball >= 700) {
                    ultimaVezDisparoFireball = tiempoActual;  // Actualiza el tiempo del último disparo
                    console.log("disparo");
                    keys.l.presionada = true;
                    fireball.fireballDisparada = true; // Establece fireballDisparada en true
                    console.log('l');
                    const nuevaFireball = new Fireball({
                        position: {
                            x: mago.position.x + mago.width,
                            y: mago.position.y + mago.height / 2,
                        },
                        velocidad: {
                            x: -18,
                            y: 0,
                        },
                        height: 40,
                        width: 40,
                        color: 'yellow',
                        imagenSrc: "./img/fireball.png",

                    });
                    nuevaFireball.disparar(mago.position.x + mago.width, mago.position.y + mago.height / 2);
                    fireballs.push(nuevaFireball);

                }
            } else {
                if (tiempoActual - ultimaVezDisparoFireball >= 800) {
                    ultimaVezDisparoFireball = tiempoActual;  // Actualiza el tiempo del último disparo
                    console.log("disparo");
                    keys.l.presionada = true;
                    fireball.fireballDisparada = true; // Establece fireballDisparada en true
                    console.log('l');
                    const nuevaFireball = new Fireball({
                        position: {
                            x: mago.position.x + mago.width,
                            y: mago.position.y + mago.height / 2,
                        },
                        velocidad: {
                            x: 18,
                            y: 0,
                        },
                        height: 40,
                        width: 40,
                        color: 'yellow',
                        imagenSrc: "./img/fireball.png",

                    });
                    nuevaFireball.disparar(mago.position.x + mago.width, mago.position.y + mago.height / 2);
                    fireballs.push(nuevaFireball);

                }
            }
            break;

        case "ArrowRight":
            keys.ArrowRight.presionada = true;
            mago.UltimaTeclaHorizontal = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.presionada = true;
            mago.UltimaTeclaHorizontal = "ArrowLeft";
            break;
        case "ArrowUp":
            keys.ArrowUp.presionada = true;
            mago.UltimaTeclaVertical = "ArrowUp";
            break;
        case "ArrowDown":
            keys.ArrowDown.presionada = true;
            mago.UltimaTeclaVertical = "ArrowDown";
            break;

        case "k":
        case "K":
            if (contador > 1) {
                if (!keys.k.presionada) {
                    keys.k.presionada = true;
                    contador--;
                    daga.siendoEmpujado = true;
                    setTimeout(function () {
                        daga.siendoEmpujado = false;
                    }, 500);
                    console.log('contador :>> ', contador);
                }
            }
    }
})

window.addEventListener('keyup', function (event) {
    switch (event.key) {
        case "d":
        case "D":
            keys.d.presionada = false;
            break;
        case "a":
        case "A":
            keys.a.presionada = false;
            break;
        case "w":
        case "W":
            keys.w.presionada = false;
            break;
        case "s":
        case "S":
            keys.s.presionada = false;
            break;
        case "l":
        case "L":
            keys.l.presionada = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.presionada = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.presionada = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.presionada = false;
            break;
        case "ArrowDown":
            keys.ArrowDown.presionada = false;
            break;
        case "k":
        case "K":
            keys.k.presionada = false;
            break;
        case "g":
        case "G":
            keys.g.presionada = false;
            break;
    }
})

function cambiarPosiciones(jugador1, jugador2) {
    var tempX = daga.position.x;
    var tempY = daga.position.y;
    daga.position.x = mago.position.x;
    daga.position.y = mago.position.y;
    mago.position.x = tempX;
    mago.position.y = tempY;
}

setTimeout(function () {
    cambiarPosiciones(daga, mago);
    console.log('cambio');
}, (Math.floor(Math.random() * 14000) + 1)
);

animate();

function DagaGanaFinal() {
    window.location.href = '../juego.html';
}
function MagoGanaFinal() {
    window.location.href = '../juego.html';
}

function explicacion() {
    window.location.href = '../zzJuego/juego.html';

}
