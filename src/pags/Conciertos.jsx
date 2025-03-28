import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

function Conciertos() {
    const { t } = useTranslation();
       
    const [conciertos, setConciertos] = useState([]);

    const [hoveredImg, setHoveredImg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedConcierto, setSelectedConcierto] = useState(null);
    
    const [indexFoto, setIndexFoto] = useState(0); 
    const [totalFotos, setTotalFotos] = useState(0); 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("/data/conciertos.json"); // Carga el JSON
            if (!response.ok) throw new Error("Error al cargar los datos");
            const data = await response.json();
            setConciertos(data);
            console.log(data);            
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
    
        fetchData();
    },[]);

    // Función para abrir galería de imágenes
    const openModal = (concierto) => {
        setSelectedConcierto(concierto);
        setIsModalOpen(true);
        setIndexFoto(0);
        const total = concierto.fotos ? Object.keys(concierto.fotos).length : 0;
        setTotalFotos(total);
        
        console.log("Total fotos:", total);
    };

    // Función para cerrar galería de imágenes
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedConcierto(null);
    };

    return (
        <div>
            
            {/* Imagen de fondo */}
            <div className="position-fixed top-0 left-0 w-100 h-100" 
                style={{zIndex:-1,  backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: "url('/imgs/antxoa2.jpg')"}}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }}></div>
            </div>
           
            <div className="container mt-5 text-white"> 
                {/* Sección de 'Conciertos futuros' */}
                <h1 className="display-4 fw-bold text-center mb-4 ">{t("conciertos_titulo1")}</h1>
                <p className="lead text-center mb-5">{t("conciertos_subtitulo1")}</p>
                
                <div className="mb-5 pb-5"></div>

                {/* Sección de conciertos pasados */}
                <h1 className="display-4 fw-bold text-center mb-4">{t("conciertos_titulo2")}</h1>

                <section className="row g-4 ">
                    {/* Se recorre el array de los conciertos y para cada uno de ellos se muestra el cartel */}
                    {conciertos.map((concierto, index) => (
                        
                        <div key={index} className="col-12 col-md-4 mb-4 d-flex align-items-center justify-content-center" style={{position:'relative'}} onMouseEnter={()=>setHoveredImg(index)} onMouseLeave={()=>setHoveredImg(null)}> {/* Cuando se pasa el ratón por encima, se coge el index del cartel en la variable 'hoveredImg' */}
                            <img src={`/imgs/carteles/${concierto.cartelImg}.jpg`} alt={`${concierto.descripcion}`} className="img-fluid" 
                                style={{ opacity: (hoveredImg === index && concierto.fotos && Object.keys(concierto.fotos).length > 0) ? 0.5 : 1, transition:'opacity 0.7s'}}
                            />
                            {/* Se muestra el botón de 'ver galería' cuando hay alguna imagen que mostrar */}
                            {hoveredImg === index && concierto.fotos && Object.keys(concierto.fotos).length > 0 && (
                                <button className="" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', padding:'10px 20px',
                                    backgroundColor: 'rgba(255, 255, 255, 1)', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                                    onClick={() => openModal(concierto)}>
                                    {t("conciertos_verGaleria")}
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            </div>
    
            {/* Ventana modal donde se muestran las imágens */}
            {isModalOpen && selectedConcierto && (
                <div className="position-fixed top-0 left-0 w-100 h-100" 
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onClick={closeModal}>
                    <div className="p-4 rounded" style={{backgroundColor: 'white', maxWidth: '80%', maxHeight: '80vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()} >
                        <h2 className="text-center mb-4">{selectedConcierto.descripcion}</h2>
                        <div className="d-flex flex-wrap justify-content-center">
                            {/* Botón para ir a la imagen anterior */}
                            <button style={{backgroundColor:'rgba(0,0,0,0)', border:'none'}}>
                                <i className="bi bi-caret-left-fill fs-1" onClick={() => {if (indexFoto > 0) {setIndexFoto(indexFoto - 1);}}}></i>
                            </button>
                            
                            {/* Imagen */}
                            <img 
                                key={indexFoto} 
                                src={`/imgs/conciertos/${selectedConcierto.fotos[indexFoto]}`} 
                                alt={`${selectedConcierto.descripcion}`} 
                                className="img-fluid m-2" 
                                style={{ maxWidth: '700px', maxHeight: '700px' }}
                            />

                            {/* Botón para ir a la imagen siguiente */}
                            <button style={{backgroundColor:'rgba(0,0,0,0)', border:'none'}}>
                                <i className="bi bi-caret-right-fill fs-1" onClick={() => {if (indexFoto < totalFotos-1) {setIndexFoto(indexFoto + 1);}}}></i>
                            </button>
                            
                        </div>
                        <p className="text-center mb-4">{indexFoto+1}/{totalFotos}</p> {/* Info de index de imagen */}
                        <button className="btn btn-dark mt-3 d-block mx-auto" onClick={closeModal}>Cerrar galería</button> {/* Botón de 'cerrar galería' */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Conciertos;
