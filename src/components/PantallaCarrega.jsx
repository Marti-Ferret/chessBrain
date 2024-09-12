import React from 'react';

const PantallaCarrega = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="text-center">
                <div className="loader mb-4"></div>
                <h2 className="text-white text-4xl font-bold">Cargando...</h2>
            </div>
        </div>
    );
};

export default PantallaCarrega;
