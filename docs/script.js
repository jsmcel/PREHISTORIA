// Sistema de texto a voz
const synth = window.speechSynthesis;

function leerTexto(texto) {
    const textoLimpio = texto.replace(/<[^>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    synth.speak(utterance);
}

function hacerClicable(elemento) {
    elemento.style.cursor = 'pointer';
    elemento.addEventListener('click', () => {
        leerTexto(elemento.alt || elemento.textContent);
    });
}

let historia = {
    personaje: null,
    accion: null,
    celebracion: null,
    cuentoActual: '',
    fase: 0  // 0: inicio, 1: personaje, 2: acción, 3: celebración, 4: final
};

const RELACIONES_ACCION = {
    'cazar': {
        animal: 'mamut',
        instrumento: 'flecha',
        imgComida: crearImagenEnLinea('OTROS', 'comida.webp'),
        descripcion: `PARA CONSEGUIR ${crearImagenEnLinea('OTROS', 'comida.webp')}`
    },
    'cortar madera': {
        animal: 'bisonte',
        instrumento: 'hacha',
        imgFuego: crearImagenEnLinea('OTROS', 'fuego.png'),
        descripcion: `PARA HACER ${crearImagenEnLinea('OTROS', 'fuego.png')}`
    },
    'coser': {
        animal: 'caballo',
        instrumento: 'aguja',
        imgAbrigo: crearImagenEnLinea('OTROS', 'abrigo.png'),
        descripcion: `PARA HACER ${crearImagenEnLinea('OTROS', 'abrigo.png')}`
    },
    'hacer abalorios': {
        animal: 'conejo',
        instrumento: 'collar',
        imgCuello: crearImagenEnLinea('OTROS', 'cuello.jpg'),
        descripcion: `PARA EL ${crearImagenEnLinea('OTROS', 'cuello.jpg')}`
    },
    'pescar': {
        animal: 'ciervo',
        instrumento: 'anzuelo',
        imgPescado: crearImagenEnLinea('OTROS', 'pescado.webp'),
        descripcion: `PARA CONSEGUIR ${crearImagenEnLinea('OTROS', 'pescado.webp')}`
    },
    'raspar piel': {
        animal: 'bisonte',
        instrumento: 'raspador',
        imgPieles: crearImagenEnLinea('OTROS', 'pieles.jpg'),
        descripcion: `PARA PREPARAR ${crearImagenEnLinea('OTROS', 'pieles.jpg')}`
    }
};

function crearImagenEnLinea(carpeta, nombre, tamaño = '80px') {
    const img = `<img src="${carpeta}/${nombre}" alt="${nombre.split('.')[0]}" style="height: ${tamaño}; vertical-align: middle; margin: 0 10px;" class="imagen-clicable">`;
    return img;
}

function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}

function empezar() {
    console.log('Función empezar ejecutada');
    historia.fase = 1;
    mostrarPantalla('personajes');
}

function elegirPersonaje(personaje) {
    historia.personaje = personaje;
    
    // Si es niña, cambiar todas las imágenes de acciones a versión niña
    if (personaje === 'niña') {
        document.querySelector('[onclick="elegirAccion(\'cazar\')"] img').src = 'acciones/acciones niña/cazar niña.webp';
        document.querySelector('[onclick="elegirAccion(\'coser\')"] img').src = 'acciones/acciones niña/coser.webp';
        document.querySelector('[onclick="elegirAccion(\'cortar madera\')"] img').src = 'acciones/acciones niña/cortar madera.webp';
        document.querySelector('[onclick="elegirAccion(\'hacer abalorios\')"] img').src = 'acciones/acciones niña/hacer abalorios niña.webp';
        document.querySelector('[onclick="elegirAccion(\'pescar\')"] img').src = 'acciones/acciones niña/pescar niña (2).webp';
        document.querySelector('[onclick="elegirAccion(\'raspar piel\')"] img').src = 'acciones/acciones niña/raspar piel niña.webp';
    } else {
        // Si es niño, volver a las imágenes originales
        document.querySelector('[onclick="elegirAccion(\'cazar\')"] img').src = 'acciones/cazar.png';
        document.querySelector('[onclick="elegirAccion(\'coser\')"] img').src = 'acciones/coser.png';
        document.querySelector('[onclick="elegirAccion(\'cortar madera\')"] img').src = 'acciones/cortar madera.png';
        document.querySelector('[onclick="elegirAccion(\'hacer abalorios\')"] img').src = 'acciones/hacer abalorios niño.webp';
        document.querySelector('[onclick="elegirAccion(\'pescar\')"] img').src = 'acciones/pescar.png';
        document.querySelector('[onclick="elegirAccion(\'raspar piel\')"] img').src = 'acciones/raspar piel.png';
    }
    const imgPersonaje = crearImagenEnLinea('personajes', personaje === 'niña' ? 'niña.webp' : 'niño.png', '90px');
    const imgCuevas = crearImagenEnLinea('OTROS', 'CUEVAS.png');
    const imgTribu = crearImagenEnLinea('OTROS', 'tribu.webp');
    const imgPrehistoria = crearImagenEnLinea('OTROS', 'PREHISTORIA.png');
    const imgEdadPiedra = crearImagenEnLinea('OTROS', 'edad de piedra.webp');
    const imgErase = crearImagenEnLinea('OTROS', 'Érase una vez.png');
    const imgHumanos = crearImagenEnLinea('OTROS', 'personas.webp');
    
    historia.cuentoActual = `
        ${imgErase} EN LA ${imgPrehistoria}, EN LA ${imgEdadPiedra}, 
        CUANDO LAS ${imgHumanos} VIVÍAN EN ${imgCuevas}, 
        HABÍA ${personaje === 'niña' ? 'UNA' : 'UN'} ${imgPersonaje}
        QUE VIVÍA CON SU ${imgTribu}.
    `;
    mostrarHistoria();
}

function elegirAccion(accion) {
    historia.accion = accion;
    const relacion = RELACIONES_ACCION[accion];
    
    let rutaAccion = historia.personaje === 'niña' ? 'acciones/acciones niña/' : 'acciones/';
    let nombreArchivo;
    
    if (historia.personaje === 'niña') {
        switch(accion) {
            case 'cazar':
                nombreArchivo = 'cazar niña.webp';
                break;
            case 'cortar madera':
                nombreArchivo = 'cortar madera.webp';
                break;
            case 'coser':
                nombreArchivo = 'coser.webp';
                break;
            case 'hacer abalorios':
                nombreArchivo = 'hacer abalorios niña.webp';
                break;
            case 'pescar':
                nombreArchivo = 'pescar niña (2).webp';
                break;
            case 'raspar piel':
                nombreArchivo = 'raspar piel niña.webp';
                break;
        }
    } else {
        switch(accion) {
            case 'cazar':
                nombreArchivo = 'cazar.png';
                break;
            case 'cortar madera':
                nombreArchivo = 'cortar madera.png';
                break;
            case 'coser':
                nombreArchivo = 'coser.png';
                break;
            case 'hacer abalorios':
                nombreArchivo = 'hacer abalorios niño.webp';
                break;
            case 'pescar':
                nombreArchivo = 'pescar.png';
                break;
            case 'raspar piel':
                nombreArchivo = 'raspar piel.png';
                break;
        }
    }
    
    const imgAccion = crearImagenEnLinea(rutaAccion.slice(0, -1), nombreArchivo);
    const imgAnimal = crearImagenEnLinea('animales', `${relacion.animal}.png`);
    const imgInstrumento = crearImagenEnLinea('instrumento', `${relacion.instrumento}.png`);
    const imgHueso = crearImagenEnLinea('OTROS', 'hueso.jpeg');
    
    const textoAnterior = `<span style="color: #666666;">${historia.cuentoActual}</span>`;
    
    historia.cuentoActual = `
        ${textoAnterior}
        <br><br>
        UN DÍA, TENÍA QUE ${imgAccion} ${relacion.descripcion}. 
        UTILIZÓ ${imgInstrumento} 
        DE ${imgHueso} DE ${imgAnimal}.
    `;
    mostrarHistoria();
}

function elegirCelebracion(celebracion) {
    console.log('Celebración elegida:', celebracion);
    historia.celebracion = celebracion;
    
    let nombreArchivo;
    let textoInicial;
    
    const imgCelebrar = crearImagenEnLinea('OTROS', 'celebrar.png');
    const imgHambre = crearImagenEnLinea('OTROS', 'tener hambre.png');
    const imgCansado = crearImagenEnLinea('OTROS', 'cansado.png');
    const imgContento = crearImagenEnLinea('OTROS', 'contento.png');    
    
    switch(celebracion) {
        case 'bailar':
            nombreArchivo = 'bailar.webp';
            textoInicial = `PARA ${imgCelebrar}`;
            break;
        case 'comer':
            nombreArchivo = 'comer.webp';
            textoInicial = `COMO ${imgHambre}`;
            break;
        case 'dormir':
            nombreArchivo = 'dormir en la cueva.webp';
            textoInicial = `COMO ${imgCansado}`;
            break;
        case 'pintar':
            nombreArchivo = 'pintar.webp';
            textoInicial = `COMO ${imgContento}`;
            break;
    }
    
    const imgCelebracion = crearImagenEnLinea('celebración', nombreArchivo);
    const textoAnterior = `<span style="color: #666666;">${historia.cuentoActual}</span>`;
    const imgTribu = crearImagenEnLinea('OTROS', 'tribu.webp');
    
    historia.cuentoActual = `
        ${textoAnterior}
        <br><br>
        ${textoInicial}, DECIDIÓ ${imgCelebracion} CON TODA LA ${imgTribu}.
    `;
    mostrarHistoria();
}

function mostrarHistoria() {
    const historiaElement = document.getElementById('historia-progresiva');
    historiaElement.style.opacity = '0';
    
    setTimeout(() => {
        historiaElement.innerHTML = historia.cuentoActual;
        
        // Hacer clicables todas las imágenes
        historiaElement.querySelectorAll('.imagen-clicable').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                leerTexto(img.alt);
            });
        });

        // Hacer el texto clicable
        const nodos = historiaElement.childNodes;
        nodos.forEach(nodo => {
            if (nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim() !== '') {
                const palabras = nodo.textContent.trim().split(' ');
                const nuevoContenido = palabras
                    .map(palabra => palabra.trim() ? 
                        `<span class="palabra-clicable">${palabra}</span>` : 
                        palabra
                    )
                    .join(' ');
                const nuevoNodo = document.createElement('span');
                nuevoNodo.innerHTML = nuevoContenido;
                nodo.parentNode.replaceChild(nuevoNodo, nodo);
            }
        });

        // Añadir eventos de clic a las palabras
        historiaElement.querySelectorAll('.palabra-clicable').forEach(span => {
            hacerClicable(span);
        });

        historiaElement.style.opacity = '1';
    }, 300);
    
    mostrarPantalla('pantalla-historia');
}

function mostrarSiguienteEleccion() {
    historia.fase++;
    switch(historia.fase) {
        case 2:
            mostrarPantalla('acciones');
            break;
        case 3:
            mostrarPantalla('celebraciones');
            break;
        case 4:
            mostrarPantalla('final');
            break;
    }
}

function volverAEmpezar() {
    historia = {
        personaje: null,
        accion: null,
        celebracion: null,
        cuentoActual: '',
        fase: 0
    };
    mostrarPantalla('inicio');
}