import React from 'react';
import { useState, useEffect } from 'react';

const Clau = () => {

    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setApiKey(event.target.value);
    };

    const validateApiKey = async () => {
        try {
            const response = await fetch('https://api.openai.com/v1/engines', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (response.ok) {
                setError('');
                window.location.href = `/principal?apiKey=${encodeURIComponent(apiKey)}`;
            } else {
                setError('Clave de OpenAI no válida. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            setError('Error al validar la clave. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center ' style={{ backgroundImage: `url(/imatges/gameBackground.jpg)`, backgroundSize: `cover` }}>
            <input
                type="text"
                className='w-1/4 h-12 text-center font-lancelot rounded-lg border-black font-semibold '
                style={{ boxShadow: '0px 2px 4px black' }}
                placeholder='Introduce la clave de OpenAI'
                value={apiKey}
                onChange={handleInputChange}
            />

            {error && <p className='text-red-500 mt-2'>{error}</p>}
            <button
                className='mt-10 bg-white text-black text-3xl font-lancelot font-semibold px-10 py-2 rounded-lg border-2 border-black'
                style={{ boxShadow: '0px 2px 4px black' }}
                onClick={validateApiKey}
            >
                Empezar
            </button>
        </div>
    );
};

export default Clau;
