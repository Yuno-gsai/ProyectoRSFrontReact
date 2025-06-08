import { useAuth } from "../../Auths/Useauth";
import { useAuthHandlers } from "../../Handles/UserauthHandlers";
import { useEffect, useState } from "react";
import "/css/Amigos/AmigosRender.css";
import { useAmigosHandle } from "../../Handles/AmigosHandle";

export const AmigosSugeridos = () => {
  const { getUser } = useAuthHandlers();
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [amigos, setAmigos] = useState([]); // <-- Estado para guardar amigos actuales
  const { createSolicitud, getSolicitudes, deleteSolicitud, getAmigos } = useAmigosHandle();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 1) Obtener usuarios
        const usuariosData = await getUser();
        if (!Array.isArray(usuariosData)) {
          console.error("Datos de usuarios no válidos:", usuariosData);
          setUsuarios([]);
        } else {
          // 2) Obtener amigos para excluirlos de sugeridos
          let amigosData = [];
          try {
            amigosData = await getAmigos();
            setAmigos(Array.isArray(amigosData) ? amigosData : []);
          } catch (amigosError) {
            console.error("Error cargando amigos:", amigosError);
            setAmigos([]);
          }

          // Crear set con IDs de amigos para filtrar rápido
          const amigosIds = new Set(
            amigosData.map((a) => {
              // Asumiendo que la amistad tiene usuario1_id y usuario2_id, y queremos el ID del amigo, no el usuario actual
              if (a.usuario1_id === user?.id) return a.usuario2_id;
              else return a.usuario1_id;
            })
          );

          const ahora = new Date();
          const hace7Dias = new Date();
          hace7Dias.setDate(ahora.getDate() - 7);

          // 3) Filtrar usuarios para sugeridos
          const filtrados = usuariosData.filter(
            (u) =>
              u &&
              u.id &&
              u.id !== user?.id && // No el usuario actual
              !amigosIds.has(u.id) && // No amigos actuales
              u.creado_en &&
              new Date(u.creado_en) >= hace7Dias
          );

          setUsuarios(filtrados);
        }

        // 4) Obtener solicitudes pendientes actuales
        try {
          const solicitudesData = await getSolicitudes();
          if (Array.isArray(solicitudesData)) {
            const pendientes = solicitudesData.filter(
              (s) => s && s.solicitante_id === user?.id && s.estado === "pendiente"
            );
            setSolicitudes(pendientes);
          } else {
            console.error("Datos de solicitudes no válidos:", solicitudesData);
            setSolicitudes([]);
          }
        } catch (solicitudError) {
          console.error("Error cargando solicitudes:", solicitudError);
          setSolicitudes([]);
        }
      } catch (error) {
        console.error("Error cargando datos de usuarios:", error);
        setUsuarios([]);
        setSolicitudes([]);
        setAmigos([]);
      }
    };

    fetchDatos();
  }, [getUser, getSolicitudes, getAmigos, user]);

  // El resto del código sigue igual
  const handleAgregarAmigo = async (userId) => {
    if (!user?.id) {
      console.error("Usuario no autenticado");
      return;
    }

    const data = {
      solicitante_id: user.id,
      solicitado_id: userId,
      estado: "pendiente",
    };

    try {
      const nuevaSolicitud = await createSolicitud(data);
      if(nuevaSolicitud && nuevaSolicitud.id){
        setSolicitudes((prev) => [...prev, nuevaSolicitud]);
      }
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
    }
  };

  const handleCancelarSolicitud = async (userId) => {
    if (!user?.id) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      const solicitud = solicitudes.find(
        (s) => s && s.solicitado_id === userId && s.solicitante_id === user.id
      );

      if (!solicitud || !solicitud.id) {
        console.error("Solicitud no encontrada o ID inválido");
        return;
      }

      await deleteSolicitud(solicitud.id);

      setSolicitudes((prev) => prev.filter((s) => s && s.id !== solicitud.id));
    } catch (error) {
      console.error("Error al cancelar la solicitud:", error);
    }
  };

  const solicitudPendiente = (userId) =>
    solicitudes.some((s) => s.solicitado_id === userId);

  return (
    <div className="amigos-lista">
      <h2 className="amigos-titulo">Amigos Sugeridos</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios sugeridos para mostrar.</p>
      ) : (
        usuarios.map((u) => (
          <div key={u.id} className="amigo-casual-card">
            <img
              src={
                u.foto_perfil
                  ? `${u.foto_perfil}`
                  : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2RkZGRkZCIgZD0iTTEyLDEyQzkuOCwxMiw4LDEwLjIsOCw4QzgsNS44LDkuOCw0LDEyLDRTMTYsNS44LDE2LDhDMTYsMTAuMiwxNC4yLDEyLDEyLDEyTTEyLDE0QzguNywxNCA0LDE1LjIsNCwxOFYyMEgyMFYxOEMyMCwxNS4zLDE1LjMsMTQsMTIsMTRaIiAvPjwvc3ZnPg=='
              }
              alt={u.nombre_usuario}
              className="amigo-foto-casual"
            />
            <div className="amigo-info">
              <span className="amigo-nombre-casual">{u.nombre_usuario}</span>
              <p className="amigo-descripcion">{u.biografia}</p>
            </div>
            {solicitudPendiente(u.id) ? (
              <button
                className="btn-pendiente"
                onClick={() => handleCancelarSolicitud(u.id)}
                title="Cancelar solicitud"
              >
                Pendiente
              </button>
            ) : (
              <button
                className="btn-agregar"
                onClick={() => handleAgregarAmigo(u.id)}
              >
                Agregar
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};
