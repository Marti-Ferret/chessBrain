import React from 'react';
import Tauler from '../components/Tauler';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PantallaCarrega from '../components/PantallaCarrega';

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 30;

const Joc = () => {
    const [initialPosition, setInitialPosition] = useState([]);
    const [bestMove, setBestMove] = useState([]);
    const [selectedMove, setSelectedMove] = useState('');
    const [otherMoves, setOtherMoves] = useState([]);
    const location = useLocation();
    const [apiKey, setApiKey] = useState('');


    const [option, setOption] = useState('Comprobar');
    const [result, setResult] = useState('');
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);

    const [loading, setLoading] = useState(true);

    const handleMoveSelection = (event) => {
        setSelectedMove(event.target.value);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const apiKeyParam = queryParams.get('apiKey');
        if (apiKeyParam) {
            setApiKey(apiKeyParam);
        }
    }, [location.search]);


    useEffect(() => {
        if (apiKey) {
            fetchData();
        }

    }, [apiKey]);

    async function fetchData() {
        setLoading(true);
        const openAi = createOpenAI({
            apiKey: apiKey,
            compatibility: "strict"
        });
        try {
            const model = openAi("gpt-4-turbo");
            const { text } = await generateText({
                model: model,
                system: `Eres un maestro de ajedrez con una buena comprensión de las tácticas y estrategias del juego. Tu tarea es generar un problema de ajedrez sencillo en el que el jugador deba encontrar el mejor movimiento posible. El problema debe cumplir con las siguientes características:
        
        - La posición debe ser de un juego simplificado, con pocas piezas en el tablero.
        - Debes seguir estrictamente las reglas del ajedrez tradicional.
        - La solución del problema debe incluir la posición inicial del tablero en notación algebraica y el mejor movimiento, especificando la pieza y su nueva posición.
        - Verifica la validez de cada posición y movimiento asegurándote de que sean posibles según las reglas del ajedrez.
        - Asegúrate de que el movimiento no deje piezas importantes desprotegidas y que no permita una respuesta inmediata y fuerte del oponente.
        
        Las reglas básicas del ajedrez son las siguientes:
        - El tablero de ajedrez tiene 8x8 casillas, alternando entre colores claros y oscuros.
        - Las piezas se mueven de la siguiente manera:
          - Peones: avanzan una casilla hacia adelante, dos casillas en su primer movimiento; capturan en diagonal.
          - Torres: se mueven en línea recta horizontal o verticalmente.
          - Caballos: se mueven en forma de "L", dos casillas en una dirección y una en perpendicular.
          - Alfiles: se mueven en diagonal.
          - Damas: se mueven en línea recta horizontal, vertical o diagonalmente.
          - Reyes: se mueven una casilla en cualquier dirección.
        - No se permite que una pieza salte sobre otra pieza, excepto el caballo.
        - La partida termina con jaque mate al rey contrario, tablas, o bajo ciertas condiciones específicas de la partida.
        - Me tienes que devolver tres arrays, no me devuelvas texto, ni texto incial, solo tres arrays.
    
        Aquí hay ejemplos de posiciones válidas y movimientos correctos:
        - Ejemplo de posición inicial:
          [
            "E1:rey_blanco", "E8:rey_negro", "H5:torre_blanca", "A7:peon_negro"
          ]
        - Ejemplo de movimiento correcto: ["torre_blanca:H5:H8"] (la torre captura un peón negro en H8)
        
        Asegúrate de que la posición inicial y el movimiento propuestos sean claros y precisos.`,
                prompt: `Necesito que me proporciones un problema de ajedrez sencillo en el que el jugador deba encontrar el mejor movimiento posible. 
        La posición inicial debe ser aleatoria y con pocas piezas en el tablero. 
        Por favor, presenta el problema en formato de texto, incluyendo la posición inicial y mejor movimiento.
        Debes incluir exactamente las posiciones de las piezas en el tablero de ajedrez utilizando los siguientes nombres para las piezas:
        - torre_blanca,
        - caballo_blanco,
        - alfil_blanco,
        - dama_blanca,
        - rey_blanco,
        - peon_blanco,
        - torre_negra,
        - caballo_negro,
        - alfil_negro,
        - dama_negra,
        - rey_negro,
        - peon_negro.
        Por ejemplo, E1:rey_blanco, H5:torre_blanca, etc.
        No puede haber más piezas en el tablero de las que hay exactamente en el ajedrez tradicional.
        Intenta que el tablero inicial no sea la posición inicial de las piezas.
        Devuélveme dos arrays:
        1. Un array con la posición inicial de las piezas en el tablero en el formato: ["E1:rey_blanco", "H5:torre_blanca", etc.].
        2. Un array con el mejor movimiento posible en el formato: ["pieza:posicion_inicial:posicion_final"], por ejemplo ["torre_blanca:H5:H8"].
        3. Un array con dos movimientos que no sean el mejor.
        Recuerda que el usuario siempre jugará con las piezas blancas y debes seguir estrictamente las reglas del ajedrez y verificar la validez de cada movimiento y posición.
    
        Asegúrate de que:
        - La posición inicial no sea la posición estándar de inicio.
        - No haya movimientos inválidos como una torre saltando sobre peones.
        - Cada movimiento siga las reglas tradicionales del ajedrez.
        - Ten en cuenta los movimientos de las piezas que te indique anteriormente.
        - La posición inicial y el mejor movimiento sean claros y precisos.
        - El movimiento no deje piezas importantes desprotegidas o permita una respuesta inmediata y fuerte del oponente.`,
            });
            const content = text.trim();

            const cleanedContent = content
                .replace(/\n/g, '')
                .replace(/\s+/g, ' ')
                .replace(/,\s*]/g, ']');

            const wrappedContent = `[${cleanedContent}]`;

            const parsedContent = JSON.parse(wrappedContent);
            const initialPosition = parsedContent[0];
            const bestMove = parsedContent[1];
            const otherMoves = parsedContent[2];

            const allMoves = bestMove.concat(otherMoves);
            for (let i = allMoves.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allMoves[i], allMoves[j]] = [allMoves[j], allMoves[i]];
            }

            setInitialPosition(initialPosition);
            setBestMove(bestMove);
            setOtherMoves(allMoves);
            setLoading(false);

        } catch (error) {
            console.error("Error en la llamada a OpenAI:", error);
            setLoading(false);
        }
    }

    const checkMove = () => {
        if (selectedMove === bestMove[0]) {
            setResult('Correcto');
            setIncorrectAttempts(0);
            setOption('Siguiente');

        } else {
            setResult('Incorrecto');
            setIncorrectAttempts(prev => prev + 1);
        }
    };
    const searchChallenge = () => {
        setOption('Comprobar');
        if (option === 'Siguiente') {
            fetchData();
        }

        setResult('');
        setSelectedMove('');
        setIncorrectAttempts(0);
    };


    return (
        <div className='w-full h-screen ' style={{ backgroundImage: `url(/imatges/gameBackground.jpg)`, backgroundSize: `cover` }}>
            {loading && <PantallaCarrega />}
            <div className='w-full flex justify-center'>
                <h1 className='text-white text-9xl font-lancelot tracking-wide mt-12' style={{ textShadow: '4px 5px 2px black' }}>CHESSBRAIN</h1>
            </div>
            <div className='w-full flex flex-row mt-20 h-3/6'>
                <div className='w-1/2 flex justify-end pr-20'>
                    <Tauler initialPositions={initialPosition} selectedMove={selectedMove} />
                </div>
                <div className='w-1/2 flex pl-20 '>
                    <div className='w-3/5 h-full flex flex-col items gap-8 '>
                        <h2 className='text-white text-5xl text-normal font-lancelot font-semibold pt-4' style={{ textShadow: '1px 2px 1px black' }}>¡Bienvenido a la plataforma de retos de ajedrez!</h2>
                        <div className='gap-6 flex flex-col'>
                            <div className="flex items-center" key="clear-board">
                                <input type="radio" id="move-clear" name="drone" value="" className="w-8 h-8 border-2 border-blue-500 rounded-full" onChange={handleMoveSelection} />
                                <label htmlFor="move-clear" className='text-white text-2xl text-normal font-serif font-semibold ml-2' style={{ textShadow: '1px 2px 1px black' }}>Limpiar Tablero</label>
                            </div>
                            {!loading && otherMoves.length > 0 && otherMoves.map((move, index) => {
                                let moveText;
                                if (Array.isArray(move)) {
                                    return move.map((singleMove, i) => {
                                        const parts = singleMove.split(':');
                                        const singleMoveText = parts[1] + ':' + parts[2];
                                        return (
                                            <div className="flex items-center" key={`${index}-${i}`}>
                                                <input type="radio" id={`move-${index}-${i}`} name="drone" value={move} className="w-8 h-8 border-2 border-blue-500 rounded-full" onChange={handleMoveSelection} />
                                                <label htmlFor={`move-${index}-${i}`} className='text-white text-2xl text-normal font-serif font-semibold ml-2' style={{ textShadow: '1px 2px 1px black' }}>{singleMoveText}</label>
                                            </div>

                                        );
                                    });
                                } else if (typeof move === 'string') {
                                    const parts = move.split(':');
                                    moveText = parts[1] + ':' + parts[2];
                                } else {
                                    console.error("El valor de 'move' no es una cadena ni un array:", move);
                                    return null;
                                }
                                return (
                                    <div className="flex items-center" key={index}>
                                        <input
                                            type="radio"
                                            id={`move-${index}`}
                                            name="drone"
                                            value={move}
                                            className="w-8 h-8 border-2 border-blue-500 rounded-full"
                                            onChange={handleMoveSelection}
                                        />
                                        <label
                                            htmlFor={`move-${index}`}
                                            className="text-white text-2xl text-normal font-serif font-semibold ml-2"
                                            style={{ textShadow: '1px 2px 1px black' }}
                                        >
                                            {moveText}
                                        </label>
                                    </div>
                                );
                            })}


                        </div>
                        <div className='flex flex-col items-center gap-16'>
                            <button className='bg-white text-black text-3xl font-lancelot font-semibold px-10 py-2 rounded-lg border-2 border-black' style={{ boxShadow: '0px 2px 4px black' }} onClick={option === 'Comprobar' ? checkMove : searchChallenge}>{option}</button>
                            <h2 className={`text-white text-6xl font-lancelot font-semibold ${result === 'Incorrecto' ? 'text-red-600 animate-shake' : ''}`} style={{ textShadow: '3px 2px 2px black' }} key={incorrectAttempts}>{result}</h2>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Joc;
