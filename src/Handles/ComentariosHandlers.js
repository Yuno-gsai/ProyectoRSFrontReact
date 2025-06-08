export const useComentariosHandlers = () => {
    const handleCreateComentario = async (data) => {
        try {
            const response = await fetch("https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    controller: "Coments",  // Nombre del controlador
                    method: "create",  // Método que ejecutará el controlador
                    data: data,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear comentario");
            }

            console.log("Comentario creado exitosamente");
        } catch (error) {
            console.error("Error al crear comentario:", error);
        }
    };
    const handleDeleteComentario = async (comentarioId) => {
        try {
            const response = await fetch(`https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    controller: "Coments",  // Nombre del controlador
                    method: "delete",  // Método que ejecutará el controlador
                    data: {
                        id: comentarioId,  // Enviar el ID para eliminar el comentario
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Error al eliminar comentario");
            }

            console.log("Comentario eliminado exitosamente");
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
        }
    };

    return { handleCreateComentario, handleDeleteComentario };
}
