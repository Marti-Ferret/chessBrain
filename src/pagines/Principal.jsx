import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';


const Principal = () => {
    const location = useLocation();
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const apiKeyParam = queryParams.get('apiKey');
        if (apiKeyParam) {
            setApiKey(apiKeyParam);
        }
    }, [location.search]);

    return (
        <div className="w-full h-screen bg-cover bg-center z-10 flex flex-row" style={{ backgroundImage: `url("/imatges/chess.jpg")` }}>
            <div className='w-1/2 flex justify-end pt-44 pr-10'>
                <h1 className='text-white text-9xl font-lancelot tracking-wide' style={{ textShadow: '4px 5px 2px black' }}>
                    CHESSBRAIN
                </h1>

            </div>

            <div className='flex flex-col w-1/2 pl-10 h-1/2 pt-72'>
                <div className=' w-2/3 flex flex-col items-center'>
                    <h2 className='text-white text-5xl text-center font-lancelot font-semibold' style={{ textShadow: '1px 2px 1px black' }}>
                        ¡Bienvenido a la plataforma de retos de ajedrez!
                    </h2>
                    <p className='text-3xl text-white mt-10 text-center font-lancelot' style={{ textShadow: '1px 2px 2px black' }}>
                        Explora una manera innovadora y emocionante de perfeccionar tus habilidades ajedrecísticas y enfrentarte a desafíos intelectuales.
                        Nuestra plataforma, guiada por GPT-4, es el entorno ideal para aquellos que buscan mejorar y disfrutar del ajedrez.
                    </p>
                    <Link to={`/joc?apiKey=${encodeURIComponent(apiKey)}`}>
                        <button className='mt-10 bg-white text-black text-3xl font-lancelot font-semibold px-10 py-2 rounded-lg border-2 border-black' style={{ boxShadow: '0px 2px 4px black' }}>
                            Empezar
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Principal;