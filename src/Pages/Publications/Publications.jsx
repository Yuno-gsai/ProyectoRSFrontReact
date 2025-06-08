import React, { useEffect, useState } from "react";
import { usePublicationsHandlers } from "../../Handles/PublicationsHandlers";
import { useAuth } from "../../Auths/Useauth";
import { NewLike } from "../Likes/NewLike";
import { Comentarios } from "../Coments/Comentarios"; // Componente para mostrar los comentarios
import { NewComent } from "../Coments/NewComent"; // Componente para agregar nuevo comentario
import "/css/Publicaciones/Publications.css";

export const Publicacion = () => {
  const { handleGetUserPublications, deletePublication } = usePublicationsHandlers();
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentarioEnEdicion, setComentarioEnEdicion] = useState(null); // Estado para manejar si se está editando un comentario

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleGetUserPublications();

      const publicacionesOrdenadas = data.sort(
        (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
      );

      setPublicaciones(publicacionesOrdenadas);
      setLoading(false);
    };
    fetchData();
  }, [handleGetUserPublications]);

  // Función que muestra el formulario de comentario
  const onNuevoComentario = (publicationId) => {
    setComentarioEnEdicion(publicationId); // Establece la publicación en edición
  };

  // Función para cancelar el comentario
  const handleCancelComentario = () => {
    setComentarioEnEdicion(null); // Oculta el formulario de comentario
  };

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
    <div className="publicaciones-container">
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        publicaciones.map((pub, index) => (
          <div key={index} className="publicacion-card">
            <div className="publicacion-header">
              <p className="publicacion-fecha">
                Publicado el: {new Date(pub.creado_en).toLocaleString()}
              </p>
              <button
                className="btn-eliminar"
                type="button"
                aria-label="Eliminar publicación"
                onClick={() => deletePublication(pub.id)}
              >
                ×
              </button>
            </div>

            <p className="publicacion-contenido">{pub.contenido}</p>

            {pub.imagen && pub.imagen !== "Update Imagen" && (
              <img
                src={
                  pub.imagen
                    ? `${pub.imagen}`
                    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt="Imagen de publicación"
                className="publicacion-imagen"
              />
            )}

            <div className="acciones-publicacion">
              <NewLike
                publicationId={pub.id}
                userID={user.id}
                likesCount={pub.totalLikes}
                userHasLiked={pub.likes.some(
                  (like) => like.usuario_id === user.id
                )}
                likeId={pub.likes.find((like) => like.usuario_id === user.id)?.id}
              />
            <button 
              className="buttonClass"
              type="button"
              onClick={() => onNuevoComentario(pub.id)}
            >
              Comentar
            </button>
            </div>

            <div className="comentarios-section">
              <Comentarios comentarios={pub.comentarios} />

              {comentarioEnEdicion === pub.id && (
                <NewComent
                  publicationId={pub.id}
                  userId={user.id}
                  onNuevoComentario={handleCancelComentario} // Cancelar el comentario
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
