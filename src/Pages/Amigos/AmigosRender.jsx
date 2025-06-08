import { useAmigosHandle } from "../../Handles/AmigosHandle";
import { useAuth } from "../../Auths/Useauth";
import { useEffect, useState } from "react";
import "/css/Amigos/AmigosRender.css";
import { AmigosSugeridos } from "./AmigosSujeridos";
import { BuscarAmigos } from "./BuscarAmigos";
import { useAuthHandlers } from "../../Handles/UserauthHandlers";
import { Solicitudes } from "./Solicitudes";

export const AmigosRender = () => {
  const { getAmigos, deleteAmigos } = useAmigosHandle(); // Función para traer amistades del usuario actual
  const { user } = useAuth(); // Usuario actual
  const [amigos, setAmigos] = useState([]); // Lista de amistades
  const [usuariosList, setUsuariosList] = useState([]); // Lista de todos los usuarios (para buscar la biografía del amigo)
  const [vista, setVista] = useState("amigos"); // "amigos" | "sugeridos" | "buscar"
  const { getUser } = useAuthHandlers(); // Función para traer todos los usuarios registrados

  // 1) Efecto para cargar, al inicio, la lista de todos los usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const allUsers = await getUser();
        if (Array.isArray(allUsers)) {
          setUsuariosList(allUsers);
        } else {
          console.error("Datos de usuarios no válidos:", allUsers);
          setUsuariosList([]);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setUsuariosList([]);
      }
    };
    
    // Solo cargar si no hay usuarios cargados previamente
    if (usuariosList.length === 0) {
      fetchUsuarios();
    }
  }, [getUser, usuariosList.length]);

  // 2) Efecto para cargar la lista de amigos del usuario actual, cuando 'vista' esté en "amigos"
  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const misAmigos = await getAmigos();
        if (Array.isArray(misAmigos)) {
          setAmigos(misAmigos);
        } else {
          console.error("Datos de amigos no válidos:", misAmigos);
          setAmigos([]);
        }
      } catch (error) {
        console.error("Error cargando amistades:", error);
        setAmigos([]);
      }
    };
    
    if (vista === "amigos") {
      fetchAmigos();
    }
  }, [getAmigos, vista]);

  // 3) Función que normaliza el objeto "amistad" para extraer sólo los datos del amigo (y no del usuario actual)
  const obtenerAmigo = (amistad) => {
    if (!user || !amistad) return null;

    try {
      // Si en la relación de amistad el usuario actual es usuario1, el amigo es usuario2
      if (amistad.usuario1_id === user.id) {
        return {
          id: amistad.usuario2_id,
          nombre: amistad.usuario2_nombre || 'Usuario sin nombre',
          foto: amistad.usuario2_foto,
          amistadId: amistad.amistad_id,
        };
      } else {
        // En caso contrario, el amigo es usuario1
        return {
          id: amistad.usuario1_id,
          nombre: amistad.usuario1_nombre || 'Usuario sin nombre',
          foto: amistad.usuario1_foto,
          amistadId: amistad.amistad_id,
        };
      }
    } catch (error) {
      console.error("Error procesando datos del amigo:", error);
      return null;
    }
  };

  // 4) Handler para eliminar a un amigo
  const handleEliminar = async (amistadId) => {
    if (!amistadId) {
      console.error("ID de amistad no válido");
      return;
    }
    
    if (!window.confirm("¿Seguro que quieres eliminar a este amigo?")) return;
    
    try {
      await deleteAmigos(amistadId);
      // Luego de eliminar, actualizamos la lista local sin hacer otra petición
      setAmigos(prevAmigos => 
        prevAmigos.filter(amigo => amigo.amistad_id !== amistadId)
      );
    } catch (error) {
      console.error("Error eliminando amistad:", error);
      alert("No se pudo eliminar al amigo. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="amigos-contenedor">
      <h2 className="amigos-titulo">Mis Amigos</h2>

      <div className="amigos-botones">
        <button
          className={vista === "amigos" ? "btn-activo" : ""}
          onClick={() => setVista("amigos")}
        >
          Amigos
        </button>
        <button
          className={vista === "sugeridos" ? "btn-activo" : ""}
          onClick={() => setVista("sugeridos")}
        >
          Sugeridos
        </button>
        <button
          className={vista === "buscar" ? "btn-activo" : ""}
          onClick={() => setVista("buscar")}
        >
          Buscar
        </button>
        <button
          className={vista === "solicitudes" ? "btn-activo" : ""}
          onClick={() => setVista("solicitudes")}
        >
          Solicitudes
        </button>
      </div>

      {/* Vista de "Sugeridos" */}
      {vista === "sugeridos" && (
        <div style={{ marginTop: 20, fontStyle: "italic", color: "#666" }}>
          <AmigosSugeridos />
        </div>
      )}

      {/* Vista de "Amigos" */}
      {vista === "amigos" && (
        <div className="amigos-lista">
          {amigos.length === 0 ? (
            <p>No tienes amigos para mostrar.</p>
          ) : (
            amigos.map((amistad) => {
              const amigo = obtenerAmigo(amistad);
              if (!amigo) return null;

              // 5) Buscamos en usuariosList el objeto del amigo para obtener su biografía
              const usuarioEncontrado = Array.isArray(usuariosList) 
                ? usuariosList.find(u => u && u.id === amigo.id)
                : null;

              // Si no se encontró (quizá aún no cargó la lista completa), mostramos un texto por defecto
              const descripcionMostrada = usuarioEncontrado && usuarioEncontrado.biografia 
                ? usuarioEncontrado.biografia 
                : "Sin descripción disponible";

              return (
                <div key={amigo.id} className="amigo-casual-card">
                  <img
                    src={
                      amigo.foto
                        ? `${amigo.foto}`
                        : ""
                    }
                    alt={amigo.nombre}
                    className="amigo-foto-casual"
                  />
                  <div>
                    <span className="amigo-nombre-casual">
                      {amigo.nombre}
                    </span>
                    <p className="amigo-descripcion">
                      {descripcionMostrada}
                    </p>
                  </div>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(amigo.amistadId)}
                  >
                    X
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Vista de "Buscar" */}
      {vista === "buscar" && (
        <div style={{ marginTop: 20, fontStyle: "italic", color: "#666" }}>
          <BuscarAmigos />
        </div>
      )}
      {/* Vista de "Solicitudes" */}
      {vista === "solicitudes" && (
        <div style={{ marginTop: 20, fontStyle: "italic", color: "#666" }}>
          <Solicitudes />
        </div>
      )}
    </div>
  );
};
