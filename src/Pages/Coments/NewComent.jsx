import React, { useState } from "react";
import { useComentariosHandlers } from "../../Handles/ComentariosHandlers";
import "/css/Comentarios/NewComent.css";

export const NewComent = ({ publicationId, userId, onNuevoComentario }) => {
  const [contenido, setContenido] = useState("");
  const { handleCreateComentario } = useComentariosHandlers();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contenido.trim()) return; // Evitar comentarios vacíos

    try {
      // Crear un nuevo comentario
      await handleCreateComentario({
        publicacion_id: publicationId,
        usuario_id: userId,
        contenido: contenido.trim(),
      });

      setContenido(""); // Limpiar el campo de texto

      if (onNuevoComentario) onNuevoComentario(); // Llamar a la función de callback para cancelar la edición
    } catch (error) {
      console.error("Error al crear comentario:", error);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    setContenido(""); // Limpiar el campo de texto
    if (onNuevoComentario) onNuevoComentario(); // Llamar para cancelar la edición
  };

  return (
    <form onSubmit={handleSubmit} className="nuevo-comentario-form">
      <textarea
        placeholder="Escribe un comentario..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={3}
        required
        className="comentario-textarea"
      />
      <div className="comentarios-actions">
        <button type="submit" className="btn-enviar-comentario">
          Comentar
        </button>
        <button
          type="button"
          className="btn-cancelar-comentario"
          onClick={handleCancel} // Llama a la función de cancelar
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
