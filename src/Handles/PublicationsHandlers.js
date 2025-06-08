import { useAuth } from "../Auths/Useauth";

export const usePublicationsHandlers = () => {
  const { user } = useAuth();

  // Obtener publicaciones de usuario
  const handleGetUserPublications = async () => {
    try {
      const response = await fetch("https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          controller: "Publications",  // Nombre del controlador
          method: "all",  // Método que ejecutará el controlador
        }),
      });

      const data = await response.json();

      // Filtrar las publicaciones que corresponden al usuario actual
      const publicacionesDelUsuario = data.filter(pub => pub.usuario_id === user.id);
      return publicacionesDelUsuario;
    } catch (error) {
      console.error("Error al obtener publicaciones:", error.message);
      return [];
    }
  };

  // Crear nueva publicación
  const handleCreatePublication = async (publicationData) => {
    try {
      const response = await fetch("https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          controller: "Publications",  // Nombre del controlador
          method: "create",  // Método que ejecutará el controlador
          data: {
            usuario_id: user.id,
            contenido: publicationData.contenido,
            imagen: publicationData.imagen,
          }
        }),
      });
  
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          return data;
        } else {
          alert("Error al crear la publicación");
          return null;
        }
      } catch (error) {
        console.error("Error en la respuesta JSON:", error);
        alert("Respuesta inválida del servidor.");
        return null;
      }
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Error al conectar con el servidor.");
      return null;
    }
  };

  // Obtener publicaciones de amigos
  const handleGetFriendsPublications = async () => {
    try {
      // Usar parámetros en la URL (query parameters) para la solicitud GET
      const response = await fetch(
        `https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net`,
        {
          method: "POST", // Usamos GET para obtener los datos
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            controller: "Publications",  // Nombre del controlador
            method: "amigos",  // Método que ejecutará el controlador
            data: {
              usuario_id: user.id,
            },
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener publicaciones de amigos:", error);
      return [];
    }
  };

  // Eliminar publicación
  const deletePublication = async (ID) => {
    try {
      const response = await fetch(
        `https://backenphp-fxayemg5hnbtewb5.canadacentral-01.azurewebsites.net`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            controller: "Publications",  // Nombre del controlador
            method: "delete",  // Método que ejecutará el controlador
            data: {
              id: ID,  // Enviar el ID para eliminar la publicación
            },
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      return null;
    }
  };

  return { handleGetUserPublications, handleCreatePublication, handleGetFriendsPublications, deletePublication };
};
