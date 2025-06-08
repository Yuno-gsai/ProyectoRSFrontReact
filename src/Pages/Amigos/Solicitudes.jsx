import { useEffect, useState } from "react";
import { useAuth } from "../../Auths/Useauth";
import { useAmigosHandle } from "../../Handles/AmigosHandle";
import { useAuthHandlers } from "../../Handles/UserauthHandlers";
import "/css/Amigos/AmigosRender.css"

export const Solicitudes = () => {
  const { user } = useAuth();
  const { getSolicitudes, updateSolicitud, deleteSolicitud, AgregarAmigo } = useAmigosHandle();
  const { getUser } = useAuthHandlers();

  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError(null);
      try {
        const [solicitudesData, usuariosData] = await Promise.all([
          getSolicitudes(),
          getUser(),
        ]);

        if (!Array.isArray(solicitudesData) || !Array.isArray(usuariosData)) {
          throw new Error("Datos inválidos");
        }

        // Filtrar solicitudes pendientes para el usuario actual
        const solicitudesFiltradas = solicitudesData.filter(
          (sol) => sol.solicitado_id === user.id && sol.estado === "pendiente"
        );

        setUsuarios(usuariosData);

        // Agregar info del solicitante a cada solicitud
        const solicitudesConInfo = solicitudesFiltradas.map((sol) => {
          const solicitanteInfo = usuariosData.find(u => u.id === sol.solicitante_id);
          return {
            ...sol,
            solicitante_nombre_usuario: solicitanteInfo?.nombre_usuario || "Usuario desconocido",
            solicitante_foto_perfil: solicitanteInfo?.foto_perfil || null,
            solicitante_biografia: solicitanteInfo?.biografia || "",
          };
        });

        setSolicitudes(solicitudesConInfo);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudieron cargar las solicitudes.");
        setSolicitudes([]);
        setUsuarios([]);
      } finally {
        setCargando(false);
      }
    };

    if (user?.id) {
      cargarDatos();
    }
  }, [user?.id]);

  // Manejar aceptación de solicitud y agregar amistad
  const handleAceptar = async (idSolicitud) => {
    try {
      await updateSolicitud(idSolicitud, "aceptada");

      // Buscar la solicitud para obtener IDs
      const solicitud = solicitudes.find(s => s.id === idSolicitud);
      if (!solicitud) {
        console.warn("Solicitud no encontrada localmente");
        // Opcional: podrías refrescar datos aquí
      } else {
        const dataAmistad = {
          usuario1_id: solicitud.solicitante_id,
          usuario2_id: solicitud.solicitado_id,
        };
        await AgregarAmigo(dataAmistad);
      }

      // Remover solicitud aceptada del estado
      setSolicitudes(prev => prev.filter(s => s.id !== idSolicitud));
    } catch (error) {
      console.error("Error aceptando solicitud o agregando amistad:", error);
      alert("Error al aceptar la solicitud.");
    }
  };

  // Manejar rechazo de solicitud
  const handleRechazar = async (idSolicitud) => {
    try {
      await deleteSolicitud(idSolicitud);
      setSolicitudes(prev => prev.filter(s => s.id !== idSolicitud));
    } catch (error) {
      console.error("Error rechazando solicitud:", error);
      alert("Error al rechazar la solicitud.");
    }
  };

  if (cargando) {
    return <p>Cargando solicitudes...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (solicitudes.length === 0) {
    return <p>No tienes solicitudes de amistad pendientes.</p>;
  }

  return (
    <div className="amigos-lista">
      <h2 className="amigos-titulo">Solicitudes de Amistad</h2>
      {solicitudes.map((solicitud) => (
        <div key={solicitud.id} className="amigo-casual-card">
          <img
            src={
              solicitud.solicitante_foto_perfil
                ? `${solicitud.solicitante_foto_perfil}`
                : "https://via.placeholder.com/50"
            }
            alt={solicitud.solicitante_nombre_usuario}
            className="amigo-foto-casual"
          />
          <div className="amigo-info">
            <span className="amigo-nombre-casual">{solicitud.solicitante_nombre_usuario}</span>
            <p className="amigo-descripcion">{solicitud.solicitante_biografia}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-aceptar"
              onClick={() => handleAceptar(solicitud.id)}
              title="Aceptar solicitud"
            >
              Aceptar
            </button>
            <button
              className="btn-rechazar"
              onClick={() => handleRechazar(solicitud.id)}
              title="Rechazar solicitud"
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
