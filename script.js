import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
import {getFirestore, collection, addDoc, query, getDocs} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAELni69s5XfyhHtOqIoGufC7a8zSMakgA",
    authDomain: "proyecto-autenticar-3aacb.firebaseapp.com",
    projectId: "proyecto-autenticar-3aacb",
    storageBucket: "proyecto-autenticar-3aacb.appspot.com",
    messagingSenderId: "161793929606",
    appId: "1:161793929606:web:3d37a6ca582110646ebc07",
    measurementId: "G-7MVSPYQHYJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
///////////////////////////////////////////////////////////////////
const submitBtn = document.getElementById("submit");
const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const preguntas = [];
let nivel = 0;
let puntuacion = 0;


/////////////////////////////////////Función para conseguir preguntas de la api//////////////////////////////////
async function getQ() {
    try {
        let response = await fetch(
            "https://opentdb.com/api.php?amount=10&category=11&type=multiple"
        );
        let data = await response.json();
        let ronda = data.results;
        // console.log("esto es ronda", ronda)
        let questions = ronda.map(
            ({ correct_answer, incorrect_answers, question }) => {
                let algo = {
                    pregunta: question,
                    respuestas: [
                        correct_answer,
                        incorrect_answers[0],
                        incorrect_answers[1],
                        incorrect_answers[2],
                    ],
                };

                preguntas.push(algo);
            }
        );
        // console.log("esto es pregunta", preguntas)
    } catch {
        console.log("error");
    }
}

////////////////////////////////////////////////Función para imprimir preguntas///////////////////////////////////
function loadQuiz() {
    //   console.log(preguntas[0])

    //   console.log(preguntas);
    deselAnswer();

    let nivelPregunta = preguntas[nivel];

    questionEl.innerHTML = nivelPregunta.pregunta;
    a_text.innerHTML = nivelPregunta.respuestas[0];
    b_text.innerHTML = nivelPregunta.respuestas[1];
    c_text.innerHTML = nivelPregunta.respuestas[2];
    d_text.innerHTML = nivelPregunta.respuestas[3];
}


////////////////////////////////Función para deseleccionar el radio al cambiar////////////////////////////////
function deselAnswer() {
    answerEls.forEach(answerEls => (answerEls.checked = false));
}

///////////Función para el botón y cambiar a siguiente pregunta//////////////////////////////////////////
submitBtn.addEventListener("click", () => {
    let respuesta = document.getElementById("a");
    // console.log('estos es respuesta', respuesta)
    const nivelPregunta = preguntas[nivel];
    // console.log(nivelPregunta.respuestas[0])
    if (respuesta.checked) {
        puntuacion++;
    }
    nivel++;
    if (nivel < preguntas.length) {
        loadQuiz();
    } else {
        quiz.innerHTML = `
        <h2>You answered ${puntuacion}/${preguntas.length} questions correctly</h2>
        <button onclick="location.reload()">Reload</button>
        <input type="text" name="nombre" id="name" >
        <label for="nombre">Nombre</label>
        <input type="button" id="enviar" value="Send result"/>
        <div class="ct-chart ct-perfect-fourth"></div>`;
        grafica()
/////////////////////////Función para pasar datos a firestore//////////////////////////////////////////////////
        const enviar = document.getElementById("enviar");
        let nombre = document.getElementById("name");
        enviar.addEventListener("click", async e => {
            e.preventDefault();
            try {
                const docRef = await addDoc(collection(db, "users"), {
                    nombre: nombre.value,
                    puntuacion: puntuacion,
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            console.log(nombre.value);
        });
    }
});

////////////////////////Función para esperar a tener las preguntas antes de imprimirlas/////////////////////////
const imprimir = async () => {
    try {
        const api = await getQ();
        const load = await loadQuiz();
    } catch {
        console.log("error");
    }
};

imprimir();

/////////////////////////////////Sacamos array con los nombres de firebase////////////////////////////////////
let usuariosN = []
console.log("nombres", usuariosN)

const q = query(collection(db, "users"))
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  return usuariosN.push(doc.data().nombre);
});

//////////////////////////////Sacamos array con la puntuación de firebase//////////////////////////////////////
let usuariosP = []
console.log("puntuacion", usuariosP)

const u = query(collection(db, "users"))
const querySnapshot1 = await getDocs(u);
querySnapshot1.forEach((doc) => {
  return usuariosP.push(doc.data().puntuacion);
});

///////////////////////////////Gráfica//////////////////////////////////////////////////////////////////////////

function grafica (){
var grafica = {
  labels: usuariosN,
  series: [usuariosP] ///////series es un array de arrays y tiene que estar dentro de un array
}

var options = {
  width: 600,
  height: 600,
  axisY: {onlyInteger: true} 
}

new Chartist.Bar('.ct-chart', grafica, options);}

// if (document.getElementById("enviar")) {
    
// }



///////Función para obtener números aleatorios sin repetir que no hemos llegado a usar, pero tiempo al tiempo///////
// const rand = (max, min) => Math.floor(Math.random() * (max - min)) + min

// const random = () => {
//   let arrRandom = []
//   const recursive = () => {
//     const randomNumber = Math.floor(Math.random() * (4 - 0)) + 0
//     if (arrRandom.includes(randomNumber) == false){
//       arrRandom.push(randomNumber)
//       console.log(randomNumber)
//     } else {
//       console.log("pasa por la recursiva")
//       recursive()
//     }
//   }
//   for (let i = 0; i < 4; i++ ) {
//     recursive()
//   } return arrRandom
// }

// fetch('https://opentdb.com/api.php?amount=10')
//   .then(res=>res.json())
//   .then(json=>console.log(json))
