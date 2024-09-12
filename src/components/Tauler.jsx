import React from 'react';

const pieces2 = {
    torre_blanca: 'imatges/peces/torre_blanc.png',
    caballo_blanco: 'imatges/peces/cavall_blanc.png',
    alfil_blanco: 'imatges/peces/alfil_blanc.png',
    dama_blanca: 'imatges/peces/reina_blanc.png',
    rey_blanco: 'imatges/peces/rei_blanc.png',
    peon_blanco: 'imatges/peces/peo_blanc.png',
    torre_negra: 'imatges/peces/torre_negre.png',
    caballo_negro: 'imatges/peces/cavall_negre.png',
    alfil_negro: 'imatges/peces/alfil_negre.png',
    dama_negra: 'imatges/peces/reina_negre.png',
    rey_negro: 'imatges/peces/rei_negre.png',
    peon_negro: 'imatges/peces/peo_negre.png'
};



const getBoard = (initialPositions, selectedMove) => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    initialPositions.forEach(pos => {
        const [position, piece] = pos.split(':');
        const col = position.charCodeAt(0) - 'A'.charCodeAt(0);
        const row = 8 - parseInt(position[1], 10);
        board[row][col] = piece;
    });

    if (selectedMove) {
        const [piece, from, to] = selectedMove.split(':');
        const fromCol = from.charCodeAt(0) - 'A'.charCodeAt(0);
        const fromRow = 8 - parseInt(from[1], 10);
        const toCol = to.charCodeAt(0) - 'A'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1], 10);

        board[fromRow][fromCol] = null;
        board[toRow][toCol] = piece;
    }

    return board;
};

const Tauler = ({ initialPositions, selectedMove }) => {
    const board = getBoard(initialPositions, selectedMove);

    return (
        <div className="grid grid-cols-[20px_repeat(8,_70px)_20px] grid-rows-[20px_repeat(8,_70px)_20px] w-[690px] h-[690px]">
            {Array.from({ length: 8 }, (_, i) => (
                <div key={`col-${i}`} className="flex items-center justify-center font-bold text-white" style={{ gridColumn: i + 2, gridRow: 1 }}>
                    {String.fromCharCode(65 + i)}
                </div>
            ))}
            {Array.from({ length: 8 }, (_, i) => (
                <div key={`row-${i}`} className="flex items-center justify-center font-bold text-white" style={{ gridColumn: 1, gridRow: i + 2 }}>
                    {8 - i}
                </div>
            ))}
            <div className="col-start-2 col-end-10 row-start-2 row-end-10 grid grid-cols-8 grid-rows-8">
                {board.flat().map((piece, index) => {
                    const row = Math.floor(index / 8);
                    const col = index % 8;
                    const isBlack = (row + col) % 2 === 1;
                    return (
                        <div key={index} className={`w-[75px] h-[75px] flex items-center justify-center ${isBlack ? 'bg-gray-500' : 'bg-white'}`}>
                            {piece ? <img src={pieces2[piece]} alt={piece} className="w-12 h-12" /> : ''}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tauler;