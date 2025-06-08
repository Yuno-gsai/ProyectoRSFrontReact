import React, { useEffect, useState } from "react";
import { usePublicationsHandlers } from "../../Handles/PublicationsHandlers";
import { useAuth } from "../../Auths/Useauth";
import { NewLike } from "../Likes/NewLike";
import { Comentarios } from "../Coments/Comentarios";
import { NewComent } from "../Coments/NewComent";
import "/css/Conten/Conten.css";

export const Conten = () => {
    const { handleGetFriendsPublications } = usePublicationsHandlers();
    const { user } = useAuth();
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comentarioEnEdicion, setComentarioEnEdicion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        const data = await handleGetFriendsPublications();
        const publicacionesOrdenadas = data.sort(
        (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
        );
        setPublicaciones(publicacionesOrdenadas);
        setLoading(false);
        };
        fetchData();
    }, [handleGetFriendsPublications]);

    const onNuevoComentario = (publicationId) => {
    setComentarioEnEdicion(publicationId);
    };

    const handleCancelComentario = () => {
    setComentarioEnEdicion(null);
    };

    if (loading) return <p>Cargando publicaciones de amigos...</p>;

    return (
        <div className="publicaciones-container">
        {publicaciones.length === 0 ? (
            <p>No hay publicaciones de tus amigos aún.</p>
        ) : (
            publicaciones.map((pub, index) => (
                <div key={index} className="publicacion-card">
                <div className="publicacion-header">
                    <div className="perfil-usuario">
                    <img
                    src={
                    pub.foto_perfil
                    ? `${pub.foto_perfil}`
                    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    }
                    alt={`${pub.nombre_usuario} perfil`}
                    className="perfil-foto"
                />
                <span className="perfil-nombre">{pub.nombre_usuario}</span>
                </div>
                <p className="publicacion-fecha">
                Publicado el: {new Date(pub.creado_en).toLocaleString()}
                </p>
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
                type="button"
                className="ComentButton"
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
                    onNuevoComentario={handleCancelComentario}
                />
                )}
            </div>
            </div>
        ))
        )}
    </div>
    );
};
